import Homepage from "@/components/Layout/Home";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Homepage,
});
