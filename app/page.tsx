import { Github, Linkedin, Mail, MapPin, Calendar, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PersonalWebsite() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-slate-900 dark:text-white">Ben Bravo</div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex space-x-8">
                <a
                  href="#about"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  About
                </a>
                <a
                  href="#education"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Education
                </a>
                <a
                  href="#projects"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Projects
                </a>
                <a
                  href="#contact"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  Contact
                </a>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <img
                src="/images/profile.jpg"
                alt="Ben Bravo"
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                style={{ objectPosition: "90% 5%" }}
              />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6">Ben Bravo</h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Computer Science Student passionate about software development, problem-solving, and creating innovative
              solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4" />
                <span>Pittsburgh, PA</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <GraduationCap className="w-4 h-4" />
                <span>University of Pittsburgh</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Calendar className="w-4 h-4" />
                <span>Graduating Spring 2026</span>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href="https://www.linkedin.com/in/benbravo/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://github.com/BBrav0" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Education</h2>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                University of Pittsburgh
              </CardTitle>
              <CardDescription>Bachelor of Science in Computer Science</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Expected Graduation:</strong> Spring 2026
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong>Location:</strong> Pittsburgh, Pennsylvania
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder project cards */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Project One</CardTitle>
                <CardDescription>A brief description of your first project and the technologies used.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>React</Badge>
                  <Badge>TypeScript</Badge>
                  <Badge>Node.js</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Github className="w-4 h-4 mr-1" />
                    Code
                  </Button>
                  <Button size="sm">Live Demo</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Project Two</CardTitle>
                <CardDescription>A brief description of your second project and the technologies used.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>Python</Badge>
                  <Badge>Django</Badge>
                  <Badge>PostgreSQL</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Github className="w-4 h-4 mr-1" />
                    Code
                  </Button>
                  <Button size="sm">Live Demo</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Project Three</CardTitle>
                <CardDescription>A brief description of your third project and the technologies used.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>Java</Badge>
                  <Badge>Spring Boot</Badge>
                  <Badge>MySQL</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Github className="w-4 h-4 mr-1" />
                    Code
                  </Button>
                  <Button size="sm">Live Demo</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Get In Touch</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            I'm always interested in new opportunities and collaborations. Feel free to reach out if you'd like to
            connect!
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="mailto:your.email@example.com">
                <Mail className="w-4 h-4 mr-2" />
                Email Me
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://www.linkedin.com/in/benbravo/" target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://github.com/BBrav0" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400">© 2024 Ben Bravo. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
