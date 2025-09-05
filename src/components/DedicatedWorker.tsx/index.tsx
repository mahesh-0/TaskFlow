import DedicatedWorker from "./DedicatedWorker";
import WithoutWorker from "./WithoutWorker";

export default function Worker() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-8 bg-gray-50 px-8 py-2 -my-5">
      <h1 className="text-3xl font-bold text-gray-900">
        Dedicated Worker – Image Processing
      </h1>
      <p className="text-gray-600 max-w-2xl text-center">
        Compare how the browser behaves{" "}
        <b>with and without a dedicated worker</b>. Without workers, the UI
        freezes while processing. With a dedicated worker, the task runs in a
        separate thread, keeping the UI responsive and smooth.
      </p>
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-6xl">
        <WithoutWorker />
        <DedicatedWorker />
      </div>
    </div>
  );
}
