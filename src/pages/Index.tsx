import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, BarChart3, Bell, FolderOpen, CheckCircle, Zap, TrendingUp, Shield, Clock, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MarketingTopBar } from "@/components/MarketingTopBar";
import { MarketingWaitlistForm } from "@/components/marketing/MarketingWaitlistForm";
import { IEP_LOGO_COLORED } from "@/lib/brandAssets";
import { redirectToCheckout } from "@/lib/checkout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

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
    { icon: Target, label: "Select your event theme and launch instantly" },
    { icon: Zap, label: "Automate planning with AI-powered workflows" },
    { icon: TrendingUp, label: "Adapt to real-time changes without disruption" },
    { icon: BarChart3, label: "Track performance with built-in analytics" },
    { icon: Users, label: "Connect with trusted vendors and partners" },
  ];

  const whyChoose = [
    { icon: FolderOpen, label: "Centralized event command center" },
    { icon: Clock, label: "Reusable templates to save hours" },
    { icon: Users, label: "Real-time collaboration across teams" },
    { icon: Zap, label: "Smart automation to reduce manual work" },
  ];

  const features = [
    {
      icon: FolderOpen,
      title: "Organize every detail",
      description: "Organize and manage every detail in one place",
      color: "from-rose-400 to-orange-400",
      bgColor: "bg-gradient-to-br from-rose-100/90 to-orange-100/80 dark:from-rose-900/25 dark:to-orange-900/20",
    },
    {
      icon: Calendar,
      title: "AI-powered workflows",
      description: "Use AI-powered workflows to streamline planning",
      color: "from-amber-400 to-yellow-400",
      bgColor: "bg-gradient-to-br from-amber-100/90 to-yellow-100/80 dark:from-amber-900/25 dark:to-yellow-900/20",
    },
    {
      icon: Bell,
      title: "Real-time changes",
      description: "Handle real-time event changes with confidence",
      color: "from-sky-400 to-cyan-400",
      bgColor: "bg-gradient-to-br from-sky-100/90 to-cyan-100/80 dark:from-sky-900/25 dark:to-cyan-900/20",
    },
    {
      icon: Users,
      title: "Reusable templates",
      description: "Build and reuse templates for faster setup",
      color: "from-emerald-400 to-teal-400",
      bgColor: "bg-gradient-to-br from-emerald-100/90 to-teal-100/80 dark:from-emerald-900/25 dark:to-teal-900/20",
    },
    {
      icon: BarChart3,
      title: "Built-in analytics",
      description: "Track performance with built-in analytics",
      color: "from-orange-400 to-rose-400",
      bgColor: "bg-gradient-to-br from-orange-100/90 to-rose-100/80 dark:from-orange-900/25 dark:to-rose-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/95 via-orange-50/50 to-rose-50/40 dark:from-background dark:via-background dark:to-background">
      <MarketingTopBar page="home" />

      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(251,191,36,0.22),transparent_55%),radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(244,114,182,0.12),transparent_50%)]"
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <img
              src={IEP_LOGO_COLORED}
              alt="Ida Event Partners — We Got You"
              className="block w-full max-w-[min(100vw,35rem)] h-auto mx-auto object-contain object-center drop-shadow-md"
              width={640}
              height={192}
              loading="eager"
              decoding="async"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance text-foreground tracking-tight">
            Plan Unforgettable Events—Without the Stress
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-pretty">
            From idea to execution, IDA Event Partners gives you everything you need to plan, manage, and scale exceptional events—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3 shadow-md">
                Start with Your Vision
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 w-full sm:w-auto border-amber-200/80 bg-white/60 backdrop-blur-sm"
              onClick={() => scrollToId("capabilities")}
            >
              See how it works
            </Button>
          </div>
        </div>
      </section>

      {/* Turn Your Vision Into a Seamless Experience */}
      <section id="capabilities" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-y border-amber-200/40 bg-gradient-to-br from-rose-50/80 via-amber-50/60 to-orange-50/70 dark:from-muted/40 dark:via-muted/30 dark:to-muted/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-4">
              Turn Your Vision Into a Seamless Experience
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Stop juggling spreadsheets, messages, and last-minute chaos. With IDA Event Partners, you can:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {capabilities.map((cap, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-muted/20 border border-amber-100/60">
                <cap.icon className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">{cap.label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-lg text-muted-foreground mt-8 italic">
            You focus on the experience. We handle the system.
          </p>
        </div>
      </section>

      {/* Built for Hosts & Professional Event Planners */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-balance">
            Built for Hosts & Professional Event Planners
          </h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Whether you're planning your own event or managing multiple clients:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Hosts", desc: "Create stunning, organized events with zero overwhelm" },
              { label: "Event Planners", desc: "Scale operations, manage teams, and deliver flawlessly" },
              { label: "Businesses", desc: "Connect, collaborate, and grow your network" },
            ].map((item) => (
              <Card key={item.label} className="text-center border border-amber-100/60 shadow-md bg-white/70 dark:bg-muted/20">
                <CardHeader>
                  <CardTitle className="text-lg">{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-3 shadow-md">
                Create your first event in minutes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Smart Tools That Work for You */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-gradient-to-br from-rose-50/70 via-amber-50/50 to-orange-50/60 dark:from-muted/30 dark:via-muted/20 dark:to-muted/30 border-y border-amber-100/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 text-balance">
            Smart Tools That Work for You
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-pretty max-w-2xl mx-auto">
            Choose your event theme and let our intelligent platform guide you every step of the way—from concept to execution.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`text-center h-full border border-amber-100/60 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${feature.bgColor}`}
              >
                <CardHeader>
                  <div
                    className={`mx-auto mb-4 p-4 bg-gradient-to-br ${feature.color} rounded-full w-fit shadow-md`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborate & Grow */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">Collaborate & Grow</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
            Connect with trusted businesses and service providers to enhance your event and expand your network.
          </p>
        </div>
      </section>

      {/* Why Choose IDA Event Partners? */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-y border-amber-200/40 bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-rose-50/50 dark:from-muted/30 dark:via-muted/20 dark:to-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Why Choose IDA Event Partners?</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
              Most tools help you plan.<br />We help you execute—flawlessly.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {whyChoose.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-white/60 dark:bg-muted/20 border border-amber-100/60">
                <item.icon className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground font-medium">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <p className="text-2xl sm:text-3xl font-bold text-primary">Save up to 70% of your planning time</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Starter Plan",
                subtitle: "Free",
                features: ["Basic event creation", "Limited templates", "Core planning tools"],
                cta: "Get started free",
                planId: "starter" as const,
                disabled: false,
                highlight: false,
              },
              {
                name: "Pro Plan",
                subtitle: "Built for Growth",
                price: "$29/mo",
                features: [
                  "Unlimited events",
                  "Advanced AI workflows",
                  "Real-time collaboration tools",
                  "Analytics dashboard",
                ],
                cta: "Upgrade to Pro and scale faster",
                planId: "pro" as const,
                disabled: false,
                highlight: true,
              },
              {
                name: "Business Plan",
                subtitle: "For Teams & Organizations",
                features: [
                  "Multi-user collaboration",
                  "Vendor & partner integrations",
                  "Priority support",
                  "Custom workflow automation",
                ],
                cta: "TBA",
                planId: "business" as const,
                disabled: true,
                highlight: false,
              },
            ].map((tier) => (
              <Card
                key={tier.name}
                className={`flex flex-col h-full border ${
                  tier.highlight
                    ? "border-amber-300/80 shadow-lg ring-2 ring-amber-200/60 bg-gradient-to-br from-amber-50/90 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/15"
                    : "border-amber-100/60 shadow-md bg-white/70 dark:bg-muted/20"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">{tier.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{tier.subtitle}</CardDescription>
                  {tier.price && (
                    <p className="text-2xl font-semibold text-foreground mt-2">{tier.price}</p>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-6">
                  <ul className="space-y-2 text-base text-muted-foreground flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {tier.disabled ? (
                    <Button size="lg" disabled className="w-full">
                      {tier.cta}
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full"
                      disabled={checkoutLoading === tier.planId}
                      onClick={() => handleCheckout(tier.planId)}
                    >
                      {checkoutLoading === tier.planId ? "Loading..." : tier.cta}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Don't Let Event Chaos Cost You Time & Money */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-y border-amber-200/40 bg-gradient-to-br from-rose-50/80 via-amber-50/60 to-orange-50/70 dark:from-muted/40 dark:via-muted/30 dark:to-muted/40">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
            Don't Let Event Chaos Cost You Time &amp; Money
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Every missed detail impacts your event. Join planners and hosts who are creating better events—faster and smarter.
          </p>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8 py-3 shadow-md mt-4">
              Start Planning Smarter Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Waitlist */}
      <section
        id="waitlist"
        className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-y border-amber-100/60 bg-white/55 dark:bg-muted/25 backdrop-blur-sm"
      >
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-balance">Get launch updates</h2>
          <p className="text-center text-muted-foreground text-sm sm:text-base mb-6 text-pretty">
            Join the campaign list for IEP — product news, early access, and event planning tips. Prefer to start
            immediately?{" "}
            <Link to="/auth" className="text-primary font-medium underline-offset-4 hover:underline">
              Start your free trial
            </Link>
            .
          </p>
          <MarketingWaitlistForm signupSource="landing_home" />
          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/marketing-creatives" className="underline-offset-4 hover:underline">
              View social ad previews (team)
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-gradient-to-r from-amber-100/50 via-rose-50/40 to-orange-50/50 dark:from-muted/50 dark:via-muted/40 dark:to-muted/50 border-t border-amber-200/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 text-balance">Create Smarter. Plan Better. Execute Flawlessly.</h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 text-pretty">
            Get started today and turn your ideas into unforgettable experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-3 shadow-md">
                Start your free Starter Plan today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
