import WebWorkers from "@/components/Layout/Workers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workers/")({
  component: WebWorkers,
});
