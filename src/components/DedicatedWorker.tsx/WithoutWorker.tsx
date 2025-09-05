import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WithoutWorker() {
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState("/images/sample.jpg");

  const applyGrayscale = async () => {
    setLoading(true);

    const img = new Image();
    img.src = imageSrc;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }

    ctx.putImageData(imageData, 0, 0);
    setImageSrc(canvas.toDataURL());
    setLoading(false);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Without Worker</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <img src={imageSrc} alt="demo" className="max-h-64 rounded-lg shadow" />
        <button
          onClick={applyGrayscale}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Apply Grayscale"}
        </button>
      </CardContent>
    </Card>
  );
}
