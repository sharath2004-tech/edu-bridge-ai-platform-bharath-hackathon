import OnboardingButton from "@/components/onboarding-button"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getSession } from "@/lib/auth"
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Download,
  GraduationCap,
  LineChart,
  MessageSquare,
  MonitorPlay,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Users
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Home() {
  // Check if user is already logged in
  const session = await getSession()
  
  // Redirect to appropriate dashboard if logged in
  if (session) {
    switch (session.role) {
      case 'super-admin':
        redirect('/super-admin/dashboard')
      case 'admin':
        redirect('/admin/dashboard')
      case 'principal':
        redirect('/principal/dashboard')
      case 'teacher':
        redirect('/teacher/dashboard')
      case 'student':
        redirect('/student/dashboard')
      default:
        redirect('/login')
    }
  }

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
            <OnboardingButton />
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

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: "1K+", label: "Active Students", icon: "👨‍🎓", color: "from-blue-500 to-cyan-500" },
            { value: "3", label: "Schools", icon: "🏫", color: "from-purple-500 to-pink-500" },
            { value: "95%", label: "Success Rate", icon: "📈", color: "from-green-500 to-emerald-500" },
            { value: "24/7", label: "AI Support", icon: "🤖", color: "from-orange-500 to-amber-500" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="group relative text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-slideInUp"
              style={{ animationDelay: `${i * 0.15}s`, animationFillMode: 'both' }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
              <div className="text-3xl mb-3 group-hover:scale-125 transition-transform duration-300">{stat.icon}</div>
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r ${stat.color} group-hover:w-1/2 transition-all duration-500 rounded-full`}></div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Excel</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform combines AI technology with proven educational methods
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { 
              icon: Brain, 
              title: "AI-Powered Learning", 
              desc: "Personalized study paths that adapt to your learning style and pace",
              color: "text-purple-500"
            },
            { 
              icon: Download, 
              title: "Offline Access", 
              desc: "Download content and learn anywhere, even without internet connection",
              color: "text-blue-500"
            },
            { 
              icon: MessageSquare, 
              title: "AI Chatbot Tutor", 
              desc: "24/7 intelligent assistant to answer questions and provide explanations",
              color: "text-green-500"
            },
            { 
              icon: MonitorPlay, 
              title: "Video Lessons", 
              desc: "High-quality video content with interactive elements and quizzes",
              color: "text-orange-500"
            },
            { 
              icon: Trophy, 
              title: "Gamification", 
              desc: "Earn points, badges, and climb leaderboards to stay motivated",
              color: "text-yellow-500"
            },
            { 
              icon: LineChart, 
              title: "Real-time Analytics", 
              desc: "Track progress with detailed insights and performance metrics",
              color: "text-cyan-500"
            },
            { 
              icon: Users, 
              title: "Collaborative Learning", 
              desc: "Connect with peers, share knowledge, and study together",
              color: "text-pink-500"
            },
            { 
              icon: Target, 
              title: "Adaptive Testing", 
              desc: "Smart quizzes that adjust difficulty based on your performance",
              color: "text-indigo-500"
            },
            { 
              icon: Shield, 
              title: "Safe & Secure", 
              desc: "Enterprise-grade security with data encryption and privacy protection",
              color: "text-red-500"
            },
          ].map((feature, i) => (
            <Card
              key={i}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border group"
            >
              <div className={`w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Account",
                desc: "Sign up as a student, teacher, or school administrator in seconds"
              },
              {
                step: "02",
                title: "Choose Your Path",
                desc: "Select courses and let our AI create a personalized learning journey"
              },
              {
                step: "03",
                title: "Start Learning",
                desc: "Access content, take quizzes, and track your progress in real-time"
              },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="text-5xl font-bold text-primary/20 mb-4">{step.step}</div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium border border-secondary/30">
              Why Choose EduBridge AI
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Transform Your Learning Experience
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              EduBridge AI combines cutting-edge artificial intelligence with proven educational methodologies 
              to deliver a learning experience that&apos;s both effective and engaging.
            </p>
            <div className="space-y-4">
              {[
                "Personalized learning paths powered by advanced AI",
                "Access to thousands of curated educational resources",
                "Real-time progress tracking and detailed analytics",
                "Gamified experience to boost motivation",
                "Collaborative tools for peer-to-peer learning",
                "Comprehensive support for teachers and administrators"
              ].map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started Free <Sparkles className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
            <Card className="relative p-8 border-border">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">AI-Powered Insights</div>
                    <div className="text-sm text-muted-foreground">Intelligent recommendations</div>
                  </div>
                  <div className="text-2xl font-bold text-primary">98%</div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Student Success Rate</div>
                    <div className="text-sm text-muted-foreground">Above average scores</div>
                  </div>
                  <div className="text-2xl font-bold text-green-500">95%</div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Active Community</div>
                    <div className="text-sm text-muted-foreground">Students & teachers</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-500">10K+</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from students and educators who have transformed their learning experience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                role: "Class 12 Student",
                content: "EduBridge AI helped me improve my grades significantly. The AI tutor is available 24/7 and explains concepts in a way that's easy to understand.",
                rating: 5
              },
              {
                name: "Rajesh Kumar",
                role: "Mathematics Teacher",
                content: "As a teacher, this platform has revolutionized how I track student progress and customize learning materials. The analytics are incredibly detailed.",
                rating: 5
              },
              {
                name: "Anita Desai",
                role: "School Principal",
                content: "We've seen a 30% improvement in overall student performance since implementing EduBridge AI. The offline feature is perfect for our remote students.",
                rating: 5
              },
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 border-border hover:shadow-lg transition-shadow">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <span key={j} className="text-yellow-500">⭐</span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl p-12 md:p-16 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of students and educators already transforming education with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Sparkles className="w-5 h-5" />
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/school-registration">
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Register Your School
                </Button>
              </Link>
            </div>
            <p className="text-sm mt-6 text-primary-foreground/80">
              No credit card required • Free forever for students • 14-day trial for schools
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">EduBridge AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering education through artificial intelligence and innovative technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/login" className="hover:text-foreground transition-colors">Login</Link></li>
                <li><Link href="/signup" className="hover:text-foreground transition-colors">Sign Up</Link></li>
                <li><Link href="/school-registration" className="hover:text-foreground transition-colors">Register School</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} EduBridge AI. All rights reserved. Built with ❤️ for education.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
