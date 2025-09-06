import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cpu, Wifi, WifiOff } from "lucide-react";

export default function ServiceWorker() {
  const [status, setStatus] = useState<string>("Not registered");
  const [cacheStatus, setCacheStatus] = useState<string>("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedData, setCachedData] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.register(
          new URL("../../workers/service-worker.js", import.meta.url)
        );
        setStatus(`Registered: ${registration.scope}`);

        const cache = await caches.open("demo-cache");
        const demoData = {
          timestamp: Date.now(),
          message: "This data was cached by the service worker",
          version: "1.0.0",
        };
        await cache.put("/demo-data", new Response(JSON.stringify(demoData)));
        setCacheStatus("Data cached successfully!");
      }
    } catch (error) {
      setStatus(`Error: ${error}`);
    }
  };

  const testCache = async () => {
    try {
      const cache = await caches.open("demo-cache");
      const response = await cache.match("/demo-data");
      if (response) {
        const data = await response.json();
        setCachedData(data);
        setCacheStatus(
          `Cached data retrieved: ${new Date(data.timestamp).toLocaleTimeString()}`
        );
      } else {
        setCacheStatus("No cached data found");
      }
    } catch (error) {
      setCacheStatus(`Cache error: ${error}`);
    }
  };

  const clearCache = async () => {
    try {
      await caches.delete("demo-cache");
      setCacheStatus("Cache cleared");
      setCachedData(null);
    } catch (error) {
      setCacheStatus(`Error clearing cache: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-6">
            <Cpu className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Service Worker Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Experience offline functionality, caching, and background sync with
            service workers!
          </p>
        </div>

        <Card className="mb-8 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <div
                className={`flex items-center gap-2 ${isOnline ? "text-green-600" : "text-red-600"}`}
              >
                {isOnline ? (
                  <Wifi className="w-5 h-5" />
                ) : (
                  <WifiOff className="w-5 h-5" />
                )}
                <span className="font-semibold">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>
              <div className="text-gray-500">|</div>
              <div className="text-gray-600">
                Service Worker: <span className="font-semibold">{status}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className=" gap-8 mb-8">
          <Card className="shadow-lg border-green-200 bg-white">
            <CardHeader className="bg-green-50 border-b border-green-200">
              <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                With Service Worker (Offline + Caching)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center gap-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={registerServiceWorker}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Register SW
                  </Button>
                  <Button
                    onClick={testCache}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Test Cache
                  </Button>
                  <Button
                    onClick={clearCache}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Clear Cache
                  </Button>
                </div>

                <div className="text-sm text-gray-600">
                  <p>✅ Offline functionality</p>
                  <p>✅ Background caching</p>
                  <p>✅ Push notifications</p>
                  <p>✅ Background sync</p>
                </div>

                {cachedData && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-blue-800 mb-1">
                      Cached Data:
                    </p>
                    <p className="text-xs text-blue-700">
                      Message: {cachedData.message}
                    </p>
                    <p className="text-xs text-blue-700">
                      Version: {cachedData.version}
                    </p>
                    <p className="text-xs text-blue-700">
                      Time: {new Date(cachedData.timestamp).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              Cache Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                {cacheStatus || "No cache operations performed yet."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
