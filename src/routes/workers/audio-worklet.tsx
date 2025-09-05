import AudioWorklet from "@/components/AudioWorklet";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workers/audio-worklet")({
  component: AudioWorklet,
});
