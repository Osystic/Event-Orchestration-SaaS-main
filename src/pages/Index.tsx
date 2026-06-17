import { useEffect, useState } from "react";
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
    "Select your event theme and launch instantly",
    "Automate planning with AI-powered workflows",
    "Adapt to real-time changes without disruption",
    "Track performance with built-in analytics",
    "Connect with trusted vendors and partners",
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

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 overflow-hidden">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link to="/auth">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Free Starter Plan Today
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 w-full sm:w-auto border-amber-200/80 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
              onClick={() => scrollToId("pricing")}
            >
              Book a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Section 1: Turn Your Vision Into a Seamless Experience */}
      <section id="capabilities" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-y border-amber-200/40 bg-gradient-to-br from-rose-50/80 via-amber-50/60 to-orange-50/70 dark:from-muted/40 dark:via-muted/30 dark:to-muted/40">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-4">
              Turn Your Vision Into a Seamless Experience
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Stop juggling spreadsheets, messages, and last-minute chaos.
            </p>
            <p className="text-lg text-muted-foreground text-pretty mt-2">
              With IDA Event Partners, you can:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
            {capabilities.map((cap, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-muted/20 border border-amber-100/60">
                <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-foreground font-medium">{cap}</span>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                Create Your First Event in Minutes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Built for Hosts & Professional Event Planners */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-balance">
            Built for Hosts & Professional Event Planners
          </h2>
          <p className="text-lg text-muted-foreground mb-10 text-pretty">
            Whether you're planning your own event or managing multiple clients:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
            <Card className="text-center border border-amber-100/60 shadow-md bg-white/70 dark:bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Hosts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Create stunning, organized events with zero overwhelm</p>
              </CardContent>
            </Card>
            <Card className="text-center border border-amber-100/60 shadow-md bg-white/70 dark:bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Event Planners</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Scale operations, manage teams, and deliver flawlessly</p>
              </CardContent>
            </Card>
            <Card className="text-center border border-amber-100/60 shadow-md bg-white/70 dark:bg-muted/20">
              <CardHeader>
                <CardTitle className="text-lg">Businesses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Connect, collaborate, and grow your network</p>
              </CardContent>
            </Card>
          </div>
          <Link to="/auth">
            <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
              Start Planning Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Section 3: Why Choose IDA Event Partners? */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-y border-amber-200/40 bg-gradient-to-br from-amber-50/60 via-orange-50/40 to-rose-50/50 dark:from-muted/30 dark:via-muted/20 dark:to-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Why Choose IDA Event Partners?</p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
              Most tools help you plan.<br />We help you execute—flawlessly.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
            {whyChoose.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-white/60 dark:bg-muted/20 border border-amber-100/60">
                <item.icon className="h-5 w-5 text-primary shrink-0" />
                <span className="text-foreground font-medium">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="text-center space-y-6">
            <p className="text-2xl sm:text-3xl font-bold text-primary">Save up to 70% of Your Planning Time</p>
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Pricing */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Starter Plan */}
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
                <Button size="lg" className="w-full" onClick={() => handleCheckout("starter")}>
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="flex flex-col h-full border border-amber-300/80 shadow-lg ring-2 ring-amber-200/60 bg-gradient-to-br from-amber-50/90 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/15">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">Pro Plan</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Built for Growth</CardDescription>
                <p className="text-2xl font-semibold text-foreground mt-2">$29/mo</p>
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
                  className="w-full"
                  disabled={checkoutLoading === "pro"}
                  onClick={() => handleCheckout("pro")}
                >
                  {checkoutLoading === "pro" ? "Loading..." : "Upgrade to Pro"}
                </Button>
              </CardContent>
            </Card>

            {/* Business Plan */}
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
                  Contact Sales
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
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
                  Request Enterprise Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 border-y border-amber-200/40 bg-gradient-to-br from-rose-50/80 via-amber-50/60 to-orange-50/70 dark:from-muted/40 dark:via-muted/30 dark:to-muted/40">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">
            Don't Let Event Chaos Cost You Time &amp; Money
          </h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Every missed detail impacts your event. Join planners and hosts who are creating better events—faster and smarter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap pt-4">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                Start Your Free Starter Plan Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="text-lg px-8 py-3 border-amber-200/80 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300"
              onClick={() => scrollToId("pricing")}
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
