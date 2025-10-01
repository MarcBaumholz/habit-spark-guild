import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, TrendingUp, Heart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HabitDetailDialogProps {
  habitId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  userId: string;
  isOwnHabit?: boolean;
}

export const HabitDetailDialog = ({
  habitId,
  open,
  onOpenChange,
  onDelete,
  userId,
  isOwnHabit = true,
}: HabitDetailDialogProps) => {
  const [habit, setHabit] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (habitId && open) {
      fetchHabit();
      checkSubscription();
    }
  }, [habitId, open]);

  const fetchHabit = async () => {
    if (!habitId) return;

    const { data, error } = await supabase
      .from("habits")
      .select("*")
      .eq("id", habitId)
      .single();

    if (error) {
      toast({ title: "Error loading habit", variant: "destructive" });
      return;
    }

    setHabit(data);
  };

  const checkSubscription = async () => {
    if (!habitId) return;

    const { data } = await supabase
      .from("subscribed_habits")
      .select("id")
      .eq("user_id", userId)
      .eq("habit_id", habitId)
      .maybeSingle();

    setIsSubscribed(!!data);
  };

  const handleSubscribe = async () => {
    if (!habitId) return;
    setLoading(true);

    try {
      if (isSubscribed) {
        const { error } = await supabase
          .from("subscribed_habits")
          .delete()
          .eq("user_id", userId)
          .eq("habit_id", habitId);

        if (error) throw error;
        setIsSubscribed(false);
        toast({ title: "Unsubscribed from habit" });
      } else {
        const { error } = await supabase
          .from("subscribed_habits")
          .insert({ user_id: userId, habit_id: habitId });

        if (error) throw error;
        setIsSubscribed(true);
        toast({ title: "Subscribed to habit!" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!habitId) return;
    setLoading(true);

    try {
      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitId);

      if (error) throw error;

      toast({ title: "Habit deleted" });
      onDelete();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!habit) return null;

  const isOwner = habit.user_id === userId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-glass-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{habit.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {habit.description && (
            <p className="text-muted-foreground">{habit.description}</p>
          )}

          <div className="flex flex-wrap gap-4">
            {habit.time_per_week && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm">{habit.time_per_week}</span>
              </div>
            )}
            {habit.frequency && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span className="text-sm">{habit.frequency}</span>
              </div>
            )}
            {habit.streak > 0 && (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">{habit.streak} days</span>
              </div>
            )}
          </div>

          {habit.category && (
            <div>
              <Badge variant="outline">{habit.category}</Badge>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-border">
            {isOwnHabit ? (
              <Button
                onClick={handleDelete}
                disabled={loading}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            ) : (
              <Button
                onClick={handleSubscribe}
                disabled={loading}
                variant={isSubscribed ? "outline" : "default"}
              >
                <Heart className={`w-4 h-4 mr-2 ${isSubscribed ? "fill-current" : ""}`} />
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
