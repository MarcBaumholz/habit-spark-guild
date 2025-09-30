import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import brainLogo from "@/assets/brain-logo.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <img
              src={brainLogo}
              alt="HabitFlow"
              className="w-40 h-40 mx-auto mb-8 drop-shadow-silver animate-fade-in"
            />
            
            <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
              Build Your Mind
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                One Habit at a Time
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Join groups, subscribe to others' habits, and build a better version
              <br />
              of yourself with a clean, minimalist habit tracking system.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 shadow-glass hover:shadow-deep transition-all"
                onClick={() => navigate("/auth")}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-glass/60 backdrop-blur-glass rounded-2xl p-8 border border-glass-border shadow-subtle hover:shadow-glass transition-all duration-300">
            <div className="w-12 h-12 bg-accent/50 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Group Profiles
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Join groups and see the habit profiles of your peers. Stay motivated together.
            </p>
          </div>

          <div className="bg-glass/60 backdrop-blur-glass rounded-2xl p-8 border border-glass-border shadow-subtle hover:shadow-glass transition-all duration-300">
            <div className="w-12 h-12 bg-accent/50 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Subscribe to Habits
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Discover inspiring habits from others and adopt them as templates for yourself.
            </p>
          </div>

          <div className="bg-glass/60 backdrop-blur-glass rounded-2xl p-8 border border-glass-border shadow-subtle hover:shadow-glass transition-all duration-300">
            <div className="w-12 h-12 bg-accent/50 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Track Progress
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Organize habits into current, in progress, and planned. See your journey clearly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
