class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    
    this.sampleRate = 44100;
    this.time = 0;
    this.beatTime = 0;
    this.beatDuration = 0.5; 
    
    this.chordProgression = [
      [261.63, 329.63, 392.00],
      [293.66, 369.99, 440.00],
      [329.63, 415.30, 493.88],
      [349.23, 440.00, 523.25],
      [392.00, 493.88, 587.33], 
      [440.00, 523.25, 659.25], 
      [493.88, 587.33, 739.99], 
    ];
    
    this.currentChord = 0;
    this.chordChangeTime = 0;
    this.chordDuration = 2.0;
    
    this.envelope = {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.7,
      release: 0.5
    };
    
    this.reverbBuffer = new Array(4410).fill(0);
    this.reverbIndex = 0;
    this.reverbGain = 0.3;
    
    this.filterFreq = 2000;
    this.filterQ = 1;
    this.filterBuffer = [0, 0, 0, 0];
    
    this.port.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === 'updateVolume') {
        this.volume = data;
      } else if (type === 'updateFilter') {
        this.filterFreq = data;
      }
    };
  }
  
  lowPassFilter(input, cutoff, resonance) {
    const c = 1.0 / Math.tan(Math.PI * cutoff / this.sampleRate);
    const a1 = 1.0 / (1.0 + resonance * c + c * c);
    const a2 = 2 * a1;
    const a3 = a1;
    const b1 = 2.0 * (1.0 - c * c) * a1;
    const b2 = (1.0 - resonance * c + c * c) * a1;
    
    const output = a1 * input + a2 * this.filterBuffer[0] + a3 * this.filterBuffer[1] - 
                   b1 * this.filterBuffer[2] - b2 * this.filterBuffer[3];
    
    this.filterBuffer[3] = this.filterBuffer[2];
    this.filterBuffer[2] = this.filterBuffer[1];
    this.filterBuffer[1] = this.filterBuffer[0];
    this.filterBuffer[0] = input;
    
    return output;
  }
  
  getEnvelope(time, noteStartTime) {
    const elapsed = time - noteStartTime;
    
    if (elapsed < this.envelope.attack) {
      return elapsed / this.envelope.attack;
    } else if (elapsed < this.envelope.attack + this.envelope.decay) {
      const decayProgress = (elapsed - this.envelope.attack) / this.envelope.decay;
      return 1.0 - (1.0 - this.envelope.sustain) * decayProgress;
    } else {
      return this.envelope.sustain;
    }
  }
  
  generateSoftTone(frequency, time, envelope) {
    let sample = Math.sin(2 * Math.PI * frequency * time) * 0.3;
    
    sample += Math.sin(2 * Math.PI * frequency * 2 * time) * 0.1;
    sample += Math.sin(2 * Math.PI * frequency * 3 * time) * 0.05;
    
    sample *= envelope;
    
    sample = Math.tanh(sample * 0.8) * 0.6;
    
    return sample;
  }
  
  addReverb(sample) {
    this.reverbBuffer[this.reverbIndex] = sample;
    const reverbSample = this.reverbBuffer[this.reverbIndex] * this.reverbGain;
    this.reverbIndex = (this.reverbIndex + 1) % this.reverbBuffer.length;
    return sample + reverbSample;
  }
  
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const outputChannel = output[0];
    
    for (let i = 0; i < outputChannel.length; i++) {
      this.time += 1 / this.sampleRate;
      this.beatTime += 1 / this.sampleRate;
      
      if (this.time - this.chordChangeTime > this.chordDuration) {
        this.currentChord = (this.currentChord + 1) % this.chordProgression.length;
        this.chordChangeTime = this.time;
      }
      
      let sample = 0;
      const currentChordFreqs = this.chordProgression[this.currentChord];
      
      for (let j = 0; j < currentChordFreqs.length; j++) {
        const frequency = currentChordFreqs[j];
        const envelope = this.getEnvelope(this.time, this.chordChangeTime);
        const tone = this.generateSoftTone(frequency, this.time, envelope);
        sample += tone * 0.3;
      }
      
      const arpeggioFreq = currentChordFreqs[Math.floor(this.beatTime * 2) % currentChordFreqs.length];
      const arpeggioEnvelope = Math.sin(this.beatTime * Math.PI * 2) * 0.5 + 0.5;
      const arpeggio = this.generateSoftTone(arpeggioFreq * 2, this.time, arpeggioEnvelope * 0.2);
      sample += arpeggio;
      
      sample = this.addReverb(sample);
      
      sample = this.lowPassFilter(sample, this.filterFreq, this.filterQ);
      
      sample = Math.tanh(sample * 0.7) * 0.8;
      
      outputChannel[i] = sample;
    }
    
    return true;
  }
}

registerProcessor('demo-processor', AudioProcessor);

