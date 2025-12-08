import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Users, Zap, GraduationCap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">EduBridge AI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/school-registration">
              <Button variant="ghost" className="hidden sm:inline-flex">Register School</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center animate-fadeIn">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium border border-secondary/30">
              AI-Powered Learning Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-balance">
              Learn Smarter with <span className="text-primary">AI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl text-balance">
              EduBridge AI provides personalized learning experiences with offline access, AI-powered content
              generation, and seamless peer collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Start Learning <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative h-96 hidden md:flex items-center justify-center animate-slideInRight">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-xl w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80" 
                alt="Students learning with technology" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">Modern Education Platform</h3>
                  <p className="text-sm text-white/90">Empowering students and teachers with AI-driven insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Registration CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 border border-primary/20 rounded-3xl p-8 md:p-12 text-center">
          <div className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
            For Schools & Institutions
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bring AI-Powered Learning to Your School
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join hundreds of schools transforming education with EduBridge AI. Get started with our comprehensive platform designed for modern institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/school-registration">
              <Button size="lg" className="gap-2">
                <BookOpen className="w-5 h-5" />
                Register Your School
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="bg-background">
                School Admin Login
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            ✓ Free setup • ✓ No credit card required • ✓ 24/7 support
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need for modern learning</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: BookOpen, title: "AI Content", desc: "Personalized learning paths powered by AI" },
            { icon: Zap, title: "Offline First", desc: "Learn anywhere without internet connection" },
            { icon: Users, title: "Peer Sharing", desc: "Collaborate and share knowledge with peers" },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
