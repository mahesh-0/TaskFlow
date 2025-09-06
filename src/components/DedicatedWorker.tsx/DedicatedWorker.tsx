import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as Comlink from "comlink";

export default function DedicatedWorker() {
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState("/images/sample.jpg");
  const [processingTime, setProcessingTime] = useState<number>(0);

  const applyAdvancedFilters = async () => {
    setLoading(true);
    setProcessingTime(0);

    const startTime = performance.now();

    const img = new Image();
    img.src = imageSrc;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const { data } = imageData;

    const worker = new Worker(
      new URL("../../workers/image-process.js", import.meta.url),
      { type: "module" }
    );

    const api = Comlink.wrap<{
      processImageChunk(
        chunk: Uint8ClampedArray
      ): Promise<Uint8ClampedArray>;
    }>(worker);

    const processedData = await api.processImageChunk(data);

    worker.terminate();

    imageData.data.set(processedData);
    ctx.putImageData(imageData, 0, 0);
    setImageSrc(canvas.toDataURL());

    const endTime = performance.now();
    setProcessingTime(endTime - startTime);
    setLoading(false);
  };

  const resetImage = () => {
    setImageSrc("/images/sample.jpg");
    setProcessingTime(0);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Dedicated Worker</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <img src={imageSrc} alt="demo" className="max-h-64 rounded-lg shadow" />

        <div className="text-center space-y-2">
          <div className="flex gap-4">
            <button
              onClick={applyAdvancedFilters}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Apply Grayscale Filter"}
            </button>
            <button
              onClick={resetImage}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600"
            >
              Reset
            </button>
          </div>

          {processingTime > 0 && (
            <p className="text-sm text-green-600 font-semibold">
              Processed in {processingTime.toFixed(2)}ms using a dedicated
              worker
            </p>
          )}
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 font-medium">Applied Filter:</p>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              Grayscale
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
