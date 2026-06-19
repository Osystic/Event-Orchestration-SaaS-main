import { useEffect, useState, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FolderOpen, Clock, Users, Zap, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MarketingTopBar } from "@/components/MarketingTopBar";
import { IEP_LOGO_COLORED } from "@/lib/brandAssets";
import { redirectToCheckout } from "@/lib/checkout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("revealed");
        } else {
          el.classList.remove("revealed");
          el.style.transitionDelay = "0ms";
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    const raw = window.location.hash.replace(/^#/, "");
    if (raw && document.getElementById(raw)) {
      requestAnimationFrame(() => scrollToId(raw));
    }
  }, []);

  const handleCheckout = async (planId: "starter" | "pro" | "business") => {
    if (planId === "starter") {
      navigate("/auth");
      return;
    }
    if (planId === "business") return;

    if (!user) {
      navigate("/auth");
      return;
    }

    setCheckoutLoading(planId);
    try {
      const success = await redirectToCheckout(planId);
      if (!success) {
        toast({
          title: "Checkout unavailable",
          description: "Unable to start checkout. Please try again later.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const capabilities = [
    "🎯 Select your event theme and launch instantly",
    "❄️ Automate planning with AI-powered workflows",
    "📋 Adapt to real-time changes without disruption",
    "📊 Track performance with built-in analytics",
    "🤝 Connect with trusted vendors and partners",
  ];

  const whyChoose = [
    { icon: FolderOpen, label: "Centralized event command center" },
    { icon: Clock, label: "Reusable templates to save hours" },
    { icon: Users, label: "Real-time collaboration across teams" },
    { icon: Zap, label: "Smart automation to reduce manual work" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/95 via-orange-50/50 to-rose-50/40 dark:from-background dark:via-background dark:to-background">
      <MarketingTopBar page="home" />

      {/* Section 1: Hero */}
      <section id="hero" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-y border-amber-200/40 bg-gradient-to-br from-rose-50/80 via-amber-50/60 to-orange-50/70 dark:from-muted/40 dark:via-muted/30 dark:to-muted/40">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-4">
                Plan Memorable Events—Without the Chaos
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Bring your vision to life with ease. With IDA Event Partners, you can create unforgettable events while we handle the complexity behind the scenes.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="text-center mb-16">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  Start Planning Your Event
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="text-center mb-12">
              <p className="text-lg text-muted-foreground text-pretty mb-6">
                Choose your event theme and let our intelligent platform guide you every step of the way—from concept to execution.
              </p>
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  Choose Your Theme
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div>
              <div id="features" className="text-center mb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6">Features</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
                {capabilities.map((cap, i) => (
                  <div key={i} className="flex items-center justify-center gap-3 p-4 rounded-lg bg-white/60 dark:bg-muted/20 border border-amber-100/60 text-center">
                    <span className="text-foreground font-medium">{cap}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mb-12">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Collaborate &amp; Grow</h3>
                <p className="text-lg text-muted-foreground text-pretty mb-6">
                  Connect with trusted businesses and service providers to enhance your event and expand your network.
                </p>
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    Browse Vendors
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="text-center mb-12">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Designed for Everyone</h3>
                <p className="text-lg text-muted-foreground text-pretty mb-6">
                  Whether you're hosting your own event or working as a professional planner, IDA Event Partners gives you the tools to succeed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                  <Link to="/auth">
                    <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                      I'm a Host
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                      I'm an Event Planner
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Create Smarter. Plan Better. Execute Flawlessly.</h3>
                <p className="text-lg text-muted-foreground text-pretty mb-6">
                  Get started today and turn your ideas into unforgettable experiences.
                </p>
                <Link to="/auth">
                  <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 2: Combined Features Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-4">
                🎉 Plan Unforgettable Events—Without the Stress
              </h2>
              <p className="text-lg text-muted-foreground text-pretty mb-8">
                From idea to execution, IDA Event Partners gives you everything you need to plan, manage, and scale exceptional events—all in one place.
              </p>
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  Start your free starter plan today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="text-center mb-8 mt-16">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">✨ Turn Your Vision Into a Seamless Experience</h3>
              <p className="text-lg text-muted-foreground text-pretty">Stop juggling spreadsheets, messages, and last-minute chaos.</p>
              <p className="text-lg text-muted-foreground text-pretty mt-2">With IDA Event Partners, you can:</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="max-w-3xl mx-auto mb-6 space-y-3">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex items-center justify-center gap-3 px-4 text-center">
                  <span className="text-foreground font-medium">{cap}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={250}>
            <p className="text-center text-lg text-muted-foreground italic mb-16">
              You focus on the experience. We handle the system.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4">🚀 Built for Hosts &amp; Professional Event Planners</h3>
              <p className="text-lg text-muted-foreground text-pretty">Whether you're planning your own event or managing multiple clients:</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="max-w-3xl mx-auto mb-8 space-y-3 px-4">
              <div className="flex items-center justify-center gap-3 text-center">
                <span className="text-foreground font-medium">✅ Hosts — Create stunning, organized events with zero overwhelm</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-center">
                <span className="text-foreground font-medium">✅ Event Planners — Scale operations, manage teams, and deliver flawlessly</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-center">
                <span className="text-foreground font-medium">✅ Businesses — Connect, collaborate, and grow your network</span>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="text-center mb-16">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  Create your first event in minutes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">💡 Why Choose IDA Event Partners?</h3>
              <p className="text-lg text-muted-foreground text-pretty">Most tools help you plan.</p>
              <p className="text-lg text-muted-foreground text-pretty">We help you execute—flawlessly.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
              {whyChoose.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-white/60 dark:bg-muted/20 border border-amber-100/60">
                  <item.icon className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">Save up to 70% of your planning time</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 4: Pricing */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-4">
                💰 Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground text-lg">Start free. Upgrade when you're ready.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Starter Plan */}
            <ScrollReveal delay={0}>
              <Card className="flex flex-col h-full border border-amber-100/60 shadow-md bg-white/70 dark:bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Starter Plan</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Free</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-6">
                  <ul className="space-y-2 text-base text-muted-foreground flex-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Basic event creation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Limited templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Core planning tools</span>
                    </li>
                  </ul>
                  <Button size="lg" className="w-full text-lg justify-center" onClick={() => handleCheckout("starter")}>
                    👉 Get Started Free
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Pro Plan */}
            <ScrollReveal delay={100}>
              <Card className="flex flex-col h-full border border-amber-300/80 shadow-lg ring-2 ring-amber-200/60 bg-gradient-to-br from-amber-50/90 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/15">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Pro Plan</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Built for Growth</CardDescription>
                  <p className="text-2xl font-semibold text-foreground mt-2">$45/mo</p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-6">
                  <ul className="space-y-2 text-base text-muted-foreground flex-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Unlimited events</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Advanced AI workflows</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Real-time collaboration tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Analytics dashboard</span>
                    </li>
                  </ul>
                  <Button
                    size="lg"
                    className="w-full text-lg justify-center"
                    disabled={checkoutLoading === "pro"}
                    onClick={() => handleCheckout("pro")}
                  >
                    {checkoutLoading === "pro" ? "Loading..." : "👉 Upgrade to Pro"}
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Business Plan */}
            <ScrollReveal delay={200}>
              <Card className="flex flex-col h-full border border-amber-100/60 shadow-md bg-white/70 dark:bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Business Plan</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">For Teams & Organizations</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-6">
                  <ul className="space-y-2 text-base text-muted-foreground flex-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Multi-user collaboration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Vendor & partner integrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Custom workflow automation</span>
                    </li>
                  </ul>
                  <Button size="lg" variant="outline" className="w-full" disabled>
                    TBA
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>

            {/* Enterprise Plan */}
            <ScrollReveal delay={300}>
              <Card className="flex flex-col h-full border border-amber-100/60 shadow-md bg-white/70 dark:bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">Enterprise Plan</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">Custom Specifications</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-6">
                  <ul className="space-y-2 text-base text-muted-foreground flex-1">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>White Label</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Custom Integrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Dedicated Support</span>
                    </li>
                  </ul>
                  <Button size="lg" variant="outline" className="w-full" disabled>
                    TBA
                  </Button>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-y border-amber-200/40 bg-gradient-to-br from-rose-50/80 via-amber-50/60 to-orange-50/70 dark:from-muted/40 dark:via-muted/30 dark:to-muted/40">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
              ⏳ Don't Let Event Chaos Cost You Time &amp; Money
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-lg text-muted-foreground text-pretty">
              Every missed detail impacts your event. Join planners and hosts who are creating better events—faster and smarter.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap pt-4">
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                  ✅ Start Planning Smarter Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                type="button"
                size="lg"
                className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => scrollToId("pricing")}
              >
                Schedule a Demo
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Index;
