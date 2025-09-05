import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export default function SharedWorker() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [worker, setWorker] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWorker = () => {
    try {
      const sharedWorker = new (window as any).SharedWorker(
        new URL("../../workers/shared-worker.js", import.meta.url)
      );

      sharedWorker.port.onmessage = (e: MessageEvent) => {
        setMessages((prev) => [...prev, `📨 ${e.data}`]);
      };

      sharedWorker.port.start();
      setWorker(sharedWorker);
      setIsConnected(true);
      setMessages((prev) => [...prev, "Connected to shared worker"]);
    } catch (error) {
      setMessages((prev) => [...prev, `Error: ${error}`]);
    }
  };

  const sendMessage = () => {
    if (worker && message.trim()) {
      worker.port.postMessage(message);
      setMessages((prev) => [...prev, `Sent: ${message}`]);
      setMessage("");
    }
  };

  const disconnectWorker = () => {
    if (worker) {
      worker.port.close();
      setWorker(null);
      setIsConnected(false);
      setMessages((prev) => [...prev, "Disconnected from shared worker"]);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="h-full bg-gradient-to-br from-green-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shared Worker
          </h1>
        </div>

        <div className=" gap-4 mb-2">
          <Card className="shadow-lg border-green-200 bg-white">
            <CardHeader className="bg-green-50 border-b border-green-200">
              <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Shared Worker (Cross-tab Communication)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={connectWorker}
                    disabled={isConnected}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Connect
                  </Button>
                  <Button
                    onClick={disconnectWorker}
                    disabled={!isConnected}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Disconnect
                  </Button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded-lg"
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    disabled={!isConnected}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!isConnected || !message.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Send
                  </Button>
                </div>

                <div className="text-sm text-gray-600 ">
                  <p>✅ Messages shared across tabs</p>
                  <p>✅ Real-time communication</p>
                  <p>✅ Efficient resource sharing</p>
                  <p>✅ Cross-tab synchronization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 flex items-center justify-between">
              <span>📋 Message Log</span>
              <Button onClick={clearMessages} variant="outline" size="sm">
                Clear
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">
                  No messages yet. Connect to the shared worker to start!
                </p>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className="text-gray-700 py-1 border-b border-gray-200 last:border-b-0"
                  >
                    {msg}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
