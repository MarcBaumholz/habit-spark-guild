import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  username: string;
  bio?: string;
  personality_type?: string;
  habit_type?: string;
  skills?: string[];
  total_streak: number;
  avatar_url?: string;
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
  userId: string;
  onSuccess: () => void;
}

const HABIT_TYPES = [
  "Health & Fitness",
  "Productivity & Focus",
  "Learning & Growth",
  "Social & Relationships",
  "Mindfulness & Wellness"
];

export const EditProfileDialog = ({
  open,
  onOpenChange,
  profile,
  userId,
  onSuccess,
}: EditProfileDialogProps) => {
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [personalityType, setPersonalityType] = useState(profile?.personality_type || "");
  const [habitType, setHabitType] = useState(profile?.habit_type || "");
  const [skills, setSkills] = useState(profile?.skills?.join(", ") || "");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const skillsArray = skills.split(",").map(s => s.trim()).filter(s => s);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          bio,
          personality_type: personalityType,
          habit_type: habitType,
          skills: skillsArray,
        })
        .eq("user_id", userId);

      if (error) throw error;

      toast({ title: "Profile updated successfully!" });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-glass-border">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="personality">Personality Type</Label>
            <Input
              id="personality"
              value={personalityType}
              onChange={(e) => setPersonalityType(e.target.value)}
              placeholder="e.g., INTJ, Achiever, Creator"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="habitType">Habit Type</Label>
            <Select value={habitType} onValueChange={setHabitType}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select habit type" />
              </SelectTrigger>
              <SelectContent>
                {HABIT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., Meditation, Running, Journaling"
              className="mt-1"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
