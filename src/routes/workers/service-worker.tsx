import ServiceWorker from "@/components/ServiceWorker";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workers/service-worker")({
  component: ServiceWorker,
});
