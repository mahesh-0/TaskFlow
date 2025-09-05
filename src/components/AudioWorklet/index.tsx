"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, Music, VolumeX, Volume1 } from "lucide-react";

export default function AudioWorklet() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<"worklet" | "main" | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [filterFreq, setFilterFreq] = useState(2000);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startWorkletAudio = async () => {
    stopAudio();
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    try {
      await ctx.audioWorklet.addModule(
        new URL("../../workers/audio-processor.js", import.meta.url)
      );

      const gainNode = ctx.createGain();
      gainNode.gain.value = isMuted ? 0 : volume;
      gainNodeRef.current = gainNode;

      const node = new (window as any).AudioWorkletNode(ctx, "demo-processor");
      workletNodeRef.current = node;

      node.connect(gainNode);
      gainNode.connect(ctx.destination);

      node.port.postMessage({ type: "updateVolume", data: volume });
      node.port.postMessage({ type: "updateFilter", data: filterFreq });

      setMode("worklet");
      setIsPlaying(true);
    } catch (error) {
      console.error("Failed to start audio worklet:", error);
      alert(
        "Failed to start audio worklet. Please check the console for details."
      );
    }
  };

  const stopAudio = () => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    oscillatorRef.current = null;
    workletNodeRef.current = null;
    gainNodeRef.current = null;
    setIsPlaying(false);
    setMode(null);
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
    if (workletNodeRef.current) {
      workletNodeRef.current.port.postMessage({
        type: "updateVolume",
        data: volume,
      });
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (workletNodeRef.current) {
      workletNodeRef.current.port.postMessage({
        type: "updateFilter",
        data: filterFreq,
      });
    }
  }, [filterFreq]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Audio Worklet
          </h1>
        </div>

        <Card className="bg-white shadow-lg mb-8">
          <CardContent className="flex justify-center gap-6">
            <Button
              onClick={startWorkletAudio}
              disabled={isPlaying}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
            >
              Play Music (Worklet)
            </Button>
            <Button
              onClick={stopAudio}
              disabled={!isPlaying}
              variant="outline"
              className="px-6 py-3"
            >
              Stop
            </Button>
          </CardContent>
        </Card>

        {/* Audio Controls */}
        {isPlaying && (
          <Card className="bg-white shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Volume2 className="w-6 h-6 text-blue-500" />
                Audio Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Volume Control */}
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 min-w-[60px]">
                  Volume:
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-sm text-gray-600 min-w-[40px]">
                  {Math.round(volume * 100)}%
                </span>
                <Button
                  onClick={toggleMute}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume1 className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Filter Control (only for worklet mode) */}
              {mode === "worklet" && (
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700 min-w-[60px]">
                    Warmth:
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="4000"
                    step="100"
                    value={filterFreq}
                    onChange={(e) => setFilterFreq(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 min-w-[60px]">
                    {filterFreq}Hz
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Current Mode</CardTitle>
          </CardHeader>
          <CardContent>
            {mode === null && (
              <div className="text-center">
                <p className="text-gray-500 mb-2">
                  No audio playing. Choose a mode to start.
                </p>
                <p className="text-sm text-gray-400">
                  Try the Audio Worklet mode for beautiful ambient music!
                </p>
              </div>
            )}
            {mode === "main" && (
              <div className="text-center">
                <div className="text-red-600 font-semibold mb-2">
                  Main Thread Processing
                </div>
              </div>
            )}
            {mode === "worklet" && (
              <div className="text-center">
                <div className="text-green-600 font-semibold mb-2">
                  Audio Worklet Processing
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
