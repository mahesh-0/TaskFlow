import Worker from "@/components/DedicatedWorker.tsx";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workers/dedicated-worker")({
  component: Worker,
});