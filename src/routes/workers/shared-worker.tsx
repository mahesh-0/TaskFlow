import SharedWorker from "@/components/SharedWorker";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workers/shared-worker")({
  component: SharedWorker,
});
