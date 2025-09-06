import * as Comlink from "comlink";

const workerApi = {
  async processImageChunk(chunk) {
    // Create a new array to return
    const result = new Uint8ClampedArray(chunk.length);
    
    // Apply grayscale filter to the entire image data
    for (let i = 0; i < chunk.length; i += 4) {
      const avg = (chunk[i] + chunk[i + 1] + chunk[i + 2]) / 3;
      result[i] = result[i + 1] = result[i + 2] = avg;
      result[i + 3] = chunk[i + 3]; // keep alpha channel
    }
    
    return result;
  }
};

Comlink.expose(workerApi);