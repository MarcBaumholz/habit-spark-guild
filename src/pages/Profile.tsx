import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ProfileHeader } from "@/components/ProfileHeader";
import { HabitColumn } from "@/components/HabitColumn";
import { HabitKanbanCard } from "@/components/HabitKanbanCard";
import { HabitDetailDialog } from "@/components/HabitDetailDialog";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { Button } from "@/components/ui/button";
import { Target, Zap, Clock, ArrowLeft, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [currentHabits, setCurrentHabits] = useState<any[]>([]);
  const [inProgressHabits, setInProgressHabits] = useState<any[]>([]);
  const [plannedHabits, setPlannedHabits] = useState<any[]>([]);
  const [subscribedHabits, setSubscribedHabits] = useState<any[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addStatus, setAddStatus] = useState<"current" | "in_progress" | "planned">("planned");
  const navigate = useNavigate();
  const { toast } = useToast();

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user && userId) {
      fetchProfile();
      fetchHabits();
      if (isOwnProfile) {
        fetchSubscribedHabits();
      }
    }
  }, [user, userId, isOwnProfile]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const fetchProfile = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    setProfile(data);
  };

  const fetchHabits = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching habits:", error);
      return;
    }

    setCurrentHabits(data.filter((h) => h.status === "current"));
    setInProgressHabits(data.filter((h) => h.status === "in_progress"));
    setPlannedHabits(data.filter((h) => h.status === "planned"));
  };

  const fetchSubscribedHabits = async () => {
    if (!user) return;

    const { data: subscriptions, error: subError } = await supabase
      .from("subscribed_habits")
      .select("habit_id")
      .eq("user_id", user.id);

    if (subError) {
      console.error("Error fetching subscriptions:", subError);
      return;
    }

    const habitIds = subscriptions?.map((s) => s.habit_id) || [];
    if (habitIds.length === 0) {
      setSubscribedHabits([]);
      return;
    }

    const { data: habits, error: habitsError } = await supabase
      .from("habits")
      .select("*")
      .in("id", habitIds);

    if (habitsError) {
      console.error("Error fetching subscribed habits:", habitsError);
      return;
    }

    setSubscribedHabits(habits || []);
  };

  const handleHabitClick = (id: string) => {
    setSelectedHabitId(id);
    setDetailOpen(true);
  };

  const handleAddHabit = (status: "current" | "in_progress" | "planned") => {
    setAddStatus(status);
    setAddOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <Button 
          variant="ghost" 
          onClick={() => isOwnProfile ? navigate("/groups") : navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isOwnProfile ? "Back to Groups" : "Back"}
        </Button>
      </div>

      <ProfileHeader
        user={{ id: userId } as User}
        profile={profile}
        onLogout={handleLogout}
        onProfileUpdate={fetchProfile}
        isOwnProfile={isOwnProfile}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isOwnProfile && subscribedHabits.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Subscribed Habits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscribedHabits.map((habit) => (
                <HabitKanbanCard
                  key={habit.id}
                  id={habit.id}
                  title={habit.title}
                  description={habit.description}
                  timePerWeek={habit.time_per_week}
                  frequency={habit.frequency}
                  streak={habit.streak}
                  category={habit.category}
                  onClick={handleHabitClick}
                />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          <HabitColumn
            title="Current Habits"
            icon={<Target className="w-5 h-5" />}
            onAdd={isOwnProfile ? () => handleAddHabit("current") : undefined}
          >
            {currentHabits.map((habit) => (
              <HabitKanbanCard
                key={habit.id}
                id={habit.id}
                title={habit.title}
                description={habit.description}
                timePerWeek={habit.time_per_week}
                frequency={habit.frequency}
                streak={habit.streak}
                category={habit.category}
                onClick={handleHabitClick}
              />
            ))}
            {currentHabits.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No current habits yet
              </div>
            )}
          </HabitColumn>

          <HabitColumn
            title="In Progress"
            icon={<Zap className="w-5 h-5" />}
            onAdd={isOwnProfile ? () => handleAddHabit("in_progress") : undefined}
          >
            {inProgressHabits.map((habit) => (
              <HabitKanbanCard
                key={habit.id}
                id={habit.id}
                title={habit.title}
                description={habit.description}
                timePerWeek={habit.time_per_week}
                frequency={habit.frequency}
                streak={habit.streak}
                category={habit.category}
                onClick={handleHabitClick}
              />
            ))}
            {inProgressHabits.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No habits in progress
              </div>
            )}
          </HabitColumn>

          <HabitColumn
            title="Planned"
            icon={<Clock className="w-5 h-5" />}
            onAdd={isOwnProfile ? () => handleAddHabit("planned") : undefined}
          >
            {plannedHabits.map((habit) => (
              <HabitKanbanCard
                key={habit.id}
                id={habit.id}
                title={habit.title}
                description={habit.description}
                timePerWeek={habit.time_per_week}
                frequency={habit.frequency}
                category={habit.category}
                onClick={handleHabitClick}
              />
            ))}
            {plannedHabits.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No planned habits
              </div>
            )}
          </HabitColumn>
        </div>
      </div>

      <HabitDetailDialog
        habitId={selectedHabitId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onDelete={fetchHabits}
        userId={user.id}
        isOwnHabit={isOwnProfile}
      />

      {isOwnProfile && (
        <AddHabitDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          userId={user.id}
          initialStatus={addStatus}
          onSuccess={fetchHabits}
        />
      )}
    </div>
  );
};

export default Profile;
