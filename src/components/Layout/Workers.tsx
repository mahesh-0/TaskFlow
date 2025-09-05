import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import router from "@/router";
import { Users, Share2, Cpu, Music } from "lucide-react";

export default function WebWorkers() {
  const workers = [
    {
      title: "Dedicated Workers",
      description:
        "Run tasks in a separate thread to keep the main UI responsive and smooth.",
      icon: <Users className="w-8 h-8" />,
      color: "bg-blue-500",
      hoverColor: "group-hover:bg-blue-600",
      route: "/workers/dedicated-worker",
    },
    {
      title: "Shared Workers",
      description:
        "Share a single worker between multiple browser contexts or tabs.",
      icon: <Share2 className="w-8 h-8" />,
      color: "bg-green-500",
      hoverColor: "group-hover:bg-green-600",
      route: "/workers/shared-worker",
    },
    {
      title: "Service Workers",
      description:
        "Enable offline experiences, background sync, and push notifications.",
      icon: <Cpu className="w-8 h-8" />,
      color: "bg-purple-500",
      hoverColor: "group-hover:bg-purple-600",
      route: "/workers/service-worker",
    },
    {
      title: "Audio Worklet",
      description:
        "Handle real-time audio processing off the main thread for smooth playback and effects.",
      icon: <Music className="w-8 h-8" />,
      color: "bg-pink-500",
      hoverColor: "group-hover:bg-pink-600",
      route: "/workers/audio-worklet",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-5 h-5 border-2 border-white rounded-md transform rotate-45"></div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
            </div>
            <nav className="flex items-center space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </a>
              <a
                href="#workers"
                className="text-gray-900 font-semibold underline"
              >
                Web Workers
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-10 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Web Workers
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Efficient multitasking for the modern web: faster, smarter,
            seamless.
          </p>
        </div>
      </section>

      <section id="workers" className="py-16 px-6 lg:px-8 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {workers.map((worker, idx) => (
              <Card
                key={idx}
                onClick={() => {
                  if (worker.route) {
                    router.navigate({ to: worker.route as any });
                  }
                }}
                className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white rounded-2xl cursor-pointer"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 ${worker.color} ${worker.hoverColor} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg text-white`}
                  >
                    {worker.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700">
                    {worker.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {worker.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER SAME AS HOMEPAGE */}
      <footer className="py-12 px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded transform rotate-45"></div>
            </div>
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <p className="text-gray-400">
            Organize, track, and complete your tasks with ease
          </p>
        </div>
      </footer>
    </div>
  );
}
