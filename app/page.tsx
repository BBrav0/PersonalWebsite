"use client"
import { Github, Linkedin, Mail, MapPin, Calendar, GraduationCap, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GithubProjectsSoftware, GithubProjectsProjects } from "@/components/github-projects"
import { useState, useEffect } from "react"

export default function PersonalWebsite() {
  const [rateLimited, setRateLimited] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#software", label: "Software" },
    { href: "/blog", label: "Blog" },
    { href: "/resume", label: "Resume" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ]

  return (
    <div className="min-h-screen bg-background noise-bg">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-glow-pulse animation-delay-1000" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-glow-pulse animation-delay-700" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'glass-strong shadow-lg shadow-black/5 dark:shadow-black/20' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <a href="#" className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Ben Bravo</span>
            </a>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-strong border-t border-border/50 animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Last Update */}
      {lastUpdate && (
        <div className="text-center text-xs text-muted-foreground py-2 bg-primary/5 border-b border-primary/10">
          Last site update: {formatDate(lastUpdate)}
        </div>
      )}

      {/* Hero Section */}
      <section id="about" className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center">
            {/* Profile Image */}
            <div className="w-28 h-28 mx-auto mb-8 relative animate-fade-in-up">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 animate-pulse opacity-60 blur-md" />
              <img
                src="/images/profile.jpg"
                alt="Ben Bravo"
                className="relative w-full h-full object-cover rounded-full border-2 border-white/20 shadow-2xl shadow-primary/20"
                style={{ objectPosition: "90% 5%" }}
              />
            </div>

            {/* Heading */}
            <div className="animate-fade-in-up animation-delay-100 opacity-0">
              <p className="text-sm font-medium text-primary mb-4 tracking-widest uppercase">Computer Science Student</p>
              <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
                <span className="text-foreground">Hi, I&apos;m </span>
                <span className="gradient-text">Ben Bravo</span>
              </h1>
            </div>

            {/* Description */}
            <div className="animate-fade-in-up animation-delay-200 opacity-0">
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Passionate about software development, problem-solving, and creating innovative solutions that make a real difference.
              </p>
            </div>

            {/* Info Badges */}
            <div className="animate-fade-in-up animation-delay-300 opacity-0">
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Pittsburgh, PA</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-sm text-muted-foreground">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  <span>University of Pittsburgh</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>Graduating Spring 2026</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up animation-delay-400 opacity-0">
              <div className="flex gap-3 justify-center">
                <Button asChild className="group">
                  <a href="https://www.linkedin.com/in/benbravo/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                    LinkedIn
                  </a>
                </Button>
                <Button variant="outline" asChild className="group">
                  <a href="https://github.com/BBrav0" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Education Card */}
          <div className="mt-20 animate-fade-in-up animation-delay-500 opacity-0">
            <div className="max-w-2xl mx-auto rounded-2xl border bg-card/50 backdrop-blur-sm p-6 sm:p-8 hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Education</h3>
                  <p className="text-sm text-muted-foreground">Bachelor of Science in Computer Science</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 ml-[52px]">
                <div className="text-sm">
                  <span className="text-muted-foreground">Expected Graduation</span>
                  <p className="font-medium text-foreground">Spring 2026</p>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <p className="font-medium text-foreground">Pittsburgh, Pennsylvania</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Software Section */}
      <section id="software" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Software</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Notable Software
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A curated selection of my most impactful software solutions, each reflecting a commitment to quality, innovation, and ongoing enhancement.
            </p>
          </div>
          {rateLimited && (
            <div className="text-center text-destructive font-semibold mb-4">
              GitHub API rate limit exceeded. Software cannot be loaded at this time.
            </div>
          )}
          <GithubProjectsSoftware 
            onRateLimit={() => setRateLimited(true)} 
            onLatestUpdate={setLastUpdate}
          />
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Projects Section */}
      <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Projects</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              My Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A showcase of select personal and professional projects, highlighting both past achievements and ongoing endeavors across diverse domains.
            </p>
          </div>
          {rateLimited && (
            <div className="text-center text-destructive font-semibold mb-4">
              GitHub API rate limit exceeded. Projects cannot be loaded at this time.
            </div>
          )}
          <GithubProjectsProjects 
            onRateLimit={() => setRateLimited(true)} 
            onLatestUpdate={setLastUpdate}
          />
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Contact Section */}
      <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              I&apos;m always interested in new opportunities and collaborations. Feel free to reach out if you&apos;d like to connect!
            </p>
            <div className="flex gap-3 justify-center">
              <Button size="lg" asChild className="group min-w-[160px]">
                <a href="mailto:contact@benbravo.net">
                  <Mail className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                  Email Me
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="group min-w-[160px]">
                <a href="https://github.com/BBrav0" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ben Bravo
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/BBrav0" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/in/benbravo/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="mailto:contact@benbravo.net" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
