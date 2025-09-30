import { Target, Zap, Clock, Heart } from "lucide-react";
import { HabitCard } from "@/components/HabitCard";
import { HabitSection } from "@/components/HabitSection";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Profile = () => {
  // Mock data - wird später durch echte Daten ersetzt
  const currentHabits = [
    {
      title: "Morning Meditation",
      description: "10 minutes of mindfulness practice",
      timePerWeek: "1h 10min",
      frequency: "Daily",
      streak: 23,
      category: "Wellness",
    },
    {
      title: "Reading",
      description: "Read 30 pages before bed",
      timePerWeek: "3h 30min",
      frequency: "Daily",
      streak: 45,
      category: "Learning",
    },
    {
      title: "Workout",
      description: "Strength training session",
      timePerWeek: "4h 30min",
      frequency: "3x per week",
      streak: 12,
      category: "Fitness",
    },
  ];

  const workingOnHabits = [
    {
      title: "Cold Shower",
      description: "2 minutes cold shower after workout",
      timePerWeek: "20min",
      frequency: "Daily",
      streak: 5,
      category: "Health",
    },
    {
      title: "Journaling",
      description: "Evening reflection and gratitude",
      timePerWeek: "1h 45min",
      frequency: "Daily",
      streak: 8,
      category: "Mental Health",
    },
  ];

  const plannedHabits = [
    {
      title: "Language Learning",
      description: "Spanish practice with Duolingo",
      timePerWeek: "2h 30min",
      frequency: "5x per week",
      category: "Learning",
    },
    {
      title: "Meal Prep",
      description: "Sunday meal preparation",
      timePerWeek: "3h",
      frequency: "Weekly",
      category: "Nutrition",
    },
  ];

  const subscribedHabits = [
    {
      title: "5AM Club",
      description: "Wake up at 5AM and start the day productively",
      timePerWeek: "7h",
      frequency: "Daily",
      category: "Productivity",
      isSubscribed: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-glass/40 backdrop-blur-glass border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-background shadow-glass">
              <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">John Doe</h1>
              <p className="text-muted-foreground mb-4">Building better habits, one day at a time</p>
              <div className="flex gap-6 text-sm">
                <div>
                  <span className="font-semibold text-foreground">6</span>
                  <span className="text-muted-foreground ml-1">Active Habits</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">45</span>
                  <span className="text-muted-foreground ml-1">Day Streak</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground">12h 35min</span>
                  <span className="text-muted-foreground ml-1">Weekly Time</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="self-start">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <HabitSection
          title="Current Habits"
          description="Your established daily and weekly routines"
          icon={<Target className="w-5 h-5" />}
        >
          {currentHabits.map((habit, index) => (
            <HabitCard key={index} {...habit} />
          ))}
        </HabitSection>

        <HabitSection
          title="In Progress"
          description="New habits you're currently building"
          icon={<Zap className="w-5 h-5" />}
        >
          {workingOnHabits.map((habit, index) => (
            <HabitCard key={index} {...habit} />
          ))}
        </HabitSection>

        <HabitSection
          title="Planned"
          description="Habits you want to start in the future"
          icon={<Clock className="w-5 h-5" />}
        >
          {plannedHabits.map((habit, index) => (
            <HabitCard key={index} {...habit} />
          ))}
        </HabitSection>

        <HabitSection
          title="Subscribed Habits"
          description="Habits you've adopted from others"
          icon={<Heart className="w-5 h-5" />}
        >
          {subscribedHabits.map((habit, index) => (
            <HabitCard key={index} {...habit} />
          ))}
        </HabitSection>
      </div>
    </div>
  );
};

export default Profile;
