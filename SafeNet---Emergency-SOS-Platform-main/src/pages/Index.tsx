import { Button } from "@/components/ui/button";
import { Shield, MapPin, Users, TrendingUp, AlertCircle, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-lg border-b z-50">
        <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">SafeNet</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/map">
              <Button variant="ghost">Live Map</Button>
            </Link>
            <Link to="/volunteer">
              <Button variant="secondary">Volunteer Dashboard</Button>
            </Link>
            <Link to="/sos">
              <Button variant="default" className="gradient-emergency border-0">
                Emergency SOS
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 gradient-hero">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Fast. Verified. Life-Saving.</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Emergency Help,
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              When Seconds Matter
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with verified volunteers, NGOs, and emergency services instantly.
            Real-time coordination for medical emergencies, disasters, and safety alerts.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/sos">
              <Button size="lg" className="gradient-emergency border-0 text-lg h-14 px-8 shadow-glow animate-pulse-glow">
                <AlertCircle className="w-5 h-5 mr-2" />
                Send SOS Alert
              </Button>
            </Link>
            <Link to="/volunteer">
              <Button size="lg" variant="secondary" className="text-lg h-14 px-8">
                <Heart className="w-5 h-5 mr-2" />
                Become a Responder
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How SafeNet Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A comprehensive platform designed to save lives through verified, real-time emergency coordination
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-14 h-14 rounded-xl gradient-emergency flex items-center justify-center mb-6">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Instant SOS Alerts</h3>
              <p className="text-muted-foreground leading-relaxed">
                One-tap emergency alerts with GPS location, automatically verified and routed to nearby responders.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-14 h-14 rounded-xl gradient-trust flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Real-Time Mapping</h3>
              <p className="text-muted-foreground leading-relaxed">
                Live map view of all active emergencies with intelligent routing to the nearest available help.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-success flex items-center justify-center mb-6">
                <div className="bg-black w-[100px] h-[60px] rounded-2xl flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>


              </div>
              <h3 className="text-2xl font-semibold mb-4">Verified Network</h3>
              <p className="text-muted-foreground leading-relaxed">
                AI-powered verification system ensures only genuine emergencies reach our trusted volunteer network.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-warning flex items-center justify-center mb-6">
                <div className="bg-gradient-to-b from-green-500 to-green-400 rounded-2xl w-[120px] h-[60px] flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Privacy Protected</h3>
              <p className="text-muted-foreground leading-relaxed">
                End-to-end encryption and strict privacy controls keep your sensitive data secure.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-14 h-14 rounded-xl gradient-trust flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Multi-Role Support</h3>
              <p className="text-muted-foreground leading-relaxed">
                Purpose-built dashboards for volunteers, doctors, NGOs, and emergency services.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-medium hover:shadow-strong transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-success flex items-center justify-center mb-6">
                <div className="bg-gradient-to-b from-red-500 to-red-400 rounded-2xl w-[120px] h-[60px] flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>

              </div>
              <h3 className="text-2xl font-semibold mb-4">Analytics Dashboard</h3>
              <p className="text-muted-foreground leading-relaxed">
                Heat maps, response time reports, and insights to improve emergency response efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">2.5s</div>
              <div className="text-muted-foreground">Avg. Alert Time</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-secondary mb-2">5,000+</div>
              <div className="text-muted-foreground">Verified Volunteers</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-success mb-2">98%</div>
              <div className="text-muted-foreground">Response Rate</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent mb-2">24/7</div>
              <div className="text-muted-foreground">Always Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our network of heroes who are saving lives every day
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/volunteer">
              <Button size="lg" variant="secondary" className="text-lg h-14 px-8">
                Register as Responder
              </Button>
            </Link>
            <Link to="/analytics">
              <Button size="lg" variant="outline" className="text-lg h-14 px-8">
                View Analytics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">SafeNet</span>
          </div>
          <p className="text-sm">
            Saving lives through technology and community. Available 24/7 for emergencies.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
