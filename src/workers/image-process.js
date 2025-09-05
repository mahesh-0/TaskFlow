import * as Comlink from "comlink";

const workerApi = {
  async processImageChunk(chunk, filterType) {
    const result = new Uint8ClampedArray(chunk.length);
    
    switch (filterType) {
      case 'grayscale':
        for (let i = 0; i < chunk.length; i += 4) {
          const avg = (chunk[i] + chunk[i + 1] + chunk[i + 2]) / 3;
          result[i] = result[i + 1] = result[i + 2] = avg;
          result[i + 3] = chunk[i + 3];
        }
        break;
        
      case 'sepia':
        for (let i = 0; i < chunk.length; i += 4) {
          const r = chunk[i];
          const g = chunk[i + 1];
          const b = chunk[i + 2];
          
          result[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          result[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          result[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
          result[i + 3] = chunk[i + 3];
        }
        break;
        
      case 'invert':
        for (let i = 0; i < chunk.length; i += 4) {
          result[i] = 255 - chunk[i];
          result[i + 1] = 255 - chunk[i + 1];
          result[i + 2] = 255 - chunk[i + 2];
          result[i + 3] = chunk[i + 3]; 
        }
        break;
        
      case 'enhance':
        for (let i = 0; i < chunk.length; i += 4) {
          const factor = 1.5; 
          result[i] = Math.min(255, Math.max(0, (chunk[i] - 128) * factor + 128));
          result[i + 1] = Math.min(255, Math.max(0, (chunk[i + 1] - 128) * factor + 128));
          result[i + 2] = Math.min(255, Math.max(0, (chunk[i + 2] - 128) * factor + 128));
          result[i + 3] = chunk[i + 3]; 
        }
        break;
        
      default:
        for (let i = 0; i < chunk.length; i += 4) {
          const avg = (chunk[i] + chunk[i + 1] + chunk[i + 2]) / 3;
          result[i] = result[i + 1] = result[i + 2] = avg;
          result[i + 3] = chunk[i + 3];
        }
    }
    
    return result;
  }
};

Comlink.expose(workerApi);
