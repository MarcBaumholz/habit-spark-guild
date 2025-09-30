import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { ProfileHeader } from "@/components/ProfileHeader";
import { HabitColumn } from "@/components/HabitColumn";
import { HabitKanbanCard } from "@/components/HabitKanbanCard";
import { HabitDetailDialog } from "@/components/HabitDetailDialog";
import { AddHabitDialog } from "@/components/AddHabitDialog";
import { Target, Zap, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProfileNew = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [currentHabits, setCurrentHabits] = useState<any[]>([]);
  const [inProgressHabits, setInProgressHabits] = useState<any[]>([]);
  const [plannedHabits, setPlannedHabits] = useState<any[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addStatus, setAddStatus] = useState<"current" | "in_progress" | "planned">("planned");
  const navigate = useNavigate();
  const { toast } = useToast();

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
    if (user) {
      fetchProfile();
      fetchHabits();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    setProfile(data);
  };

  const fetchHabits = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching habits:", error);
      return;
    }

    setCurrentHabits(data.filter((h) => h.status === "current"));
    setInProgressHabits(data.filter((h) => h.status === "in_progress"));
    setPlannedHabits(data.filter((h) => h.status === "planned"));
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
      <ProfileHeader
        user={user}
        profile={profile}
        onLogout={handleLogout}
        onProfileUpdate={fetchProfile}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-280px)]">
          <HabitColumn
            title="Current Habits"
            icon={<Target className="w-5 h-5" />}
            onAdd={() => handleAddHabit("current")}
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
            onAdd={() => handleAddHabit("in_progress")}
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
            onAdd={() => handleAddHabit("planned")}
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
      />

      <AddHabitDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        userId={user.id}
        initialStatus={addStatus}
        onSuccess={fetchHabits}
      />
    </div>
  );
};

export default ProfileNew;
