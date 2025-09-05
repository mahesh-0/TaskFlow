import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import router from "@/router";
import { Globe, ArrowRight, Sparkles } from "lucide-react";

export default function Homepage() {
  const tasks = [
    {
      title: "Web Workers",
      description: "Explore distributed, shared, service workers and worklets",
      icon: <Globe className="w-8 h-8" />,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
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
              <a href="#" className="text-gray-900 font-medium">
                Home
              </a>
              <a
                href="#tasks"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Tasks
              </a>
            </nav>
          </div>
        </div>
      </header>

      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 mr-2" />
              "TaskFlow" to Organize the task
            </div>

            <h2 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Welcome to the
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                TaskFlow
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Working on modern web development patterns, performance
              optimization, and advanced programming techniques. Below are the
              tasks I'm currently tackling.
            </p>
          </div>
        </div>
      </section>

      <section id="tasks" className="py-16 px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              What I’m Working On
            </h3>
            <p className="text-lg text-gray-600">
              Here are the tasks I work on
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tasks.map((task, index) => (
              <Card
                key={index}
                onClick={() => router.navigate({ to: "/workers" })}
                className="group cursor-pointer border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 ${task.color} ${task.hoverColor} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 shadow-lg`}
                  >
                    <div className="text-white">{task.icon}</div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                    {task.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed">
                    {task.description}
                  </CardDescription>
                  <div className="flex items-center justify-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white rounded transform rotate-45"></div>
            </div>
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <p className="text-gray-400">
            Organize, track, and complete our tasks with ease
          </p>
        </div>
      </footer>
    </div>
  );
}
