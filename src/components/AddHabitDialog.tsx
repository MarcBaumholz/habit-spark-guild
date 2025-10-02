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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialStatus?: "current" | "in_progress" | "planned";
  onSuccess: () => void;
}

const DOMAIN_OPTIONS = [
  "Health",
  "Spirituality",
  "Intellectual",
  "Finance",
  "Career",
  "Adventure",
  "Relationships",
  "Emotions"
];

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

export const AddHabitDialog = ({
  open,
  onOpenChange,
  userId,
  initialStatus = "planned",
  onSuccess,
}: AddHabitDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domains, setDomains] = useState<string[]>([]);
  const [frequencyDays, setFrequencyDays] = useState(7);
  const [context, setContext] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [smartGoal, setSmartGoal] = useState("");
  const [why, setWhy] = useState("");
  const [minimalDose, setMinimalDose] = useState("");
  const [habitLoop, setHabitLoop] = useState("");
  const [implementationIntentions, setImplementationIntentions] = useState("");
  const [hurdles, setHurdles] = useState("");
  const [reminderType, setReminderType] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const toggleDomain = (domain: string) => {
    setDomains(prev =>
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("habits").insert({
        user_id: userId,
        title,
        description,
        domains,
        frequency_days: frequencyDays,
        context,
        difficulty,
        smart_goal: smartGoal,
        why,
        minimal_dose: minimalDose,
        habit_loop: habitLoop,
        implementation_intentions: implementationIntentions,
        hurdles,
        reminder_type: reminderType,
        status,
        is_public: isPublic,
      });

      if (error) throw error;

      toast({ title: "Habit created!" });
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      setDomains([]);
      setFrequencyDays(7);
      setContext("");
      setDifficulty("Medium");
      setSmartGoal("");
      setWhy("");
      setMinimalDose("");
      setHabitLoop("");
      setImplementationIntentions("");
      setHurdles("");
      setReminderType("");
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
      <DialogContent className="bg-card border-glass-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Habit Name *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Morning Meditation"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Domains (Life Areas) *</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {DOMAIN_OPTIONS.map((domain) => (
                <div key={domain} className="flex items-center space-x-2">
                  <Checkbox
                    id={domain}
                    checked={domains.includes(domain)}
                    onCheckedChange={() => toggleDomain(domain)}
                  />
                  <Label htmlFor={domain} className="cursor-pointer text-sm">
                    {domain}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequencyDays">Frequency (Days/Week) *</Label>
              <Input
                id="frequencyDays"
                type="number"
                min="1"
                max="7"
                value={frequencyDays}
                onChange={(e) => setFrequencyDays(parseInt(e.target.value))}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty *</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="context">Context (When & Where) *</Label>
            <Input
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g., 6am, bedroom, before coffee"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="smartGoal">SMART Goal *</Label>
            <Textarea
              id="smartGoal"
              value={smartGoal}
              onChange={(e) => setSmartGoal(e.target.value)}
              placeholder="Specific, measurable goal (e.g., Meditate 10 minutes daily for 66 days)"
              required
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="why">Why (Your Motivation) *</Label>
            <Textarea
              id="why"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="e.g., To reduce stress and improve focus"
              required
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="minimalDose">Minimal Dose *</Label>
            <Input
              id="minimalDose"
              value={minimalDose}
              onChange={(e) => setMinimalDose(e.target.value)}
              placeholder="Fallback for tough days (e.g., 5 minutes breathing)"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="habitLoop">Habit Loop *</Label>
            <Textarea
              id="habitLoop"
              value={habitLoop}
              onChange={(e) => setHabitLoop(e.target.value)}
              placeholder="Cue → Craving → Routine → Reward (e.g., Alarm rings → Want calm → Sit and meditate → Feel peaceful + coffee)"
              required
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="implementationIntentions">Implementation Intentions *</Label>
            <Textarea
              id="implementationIntentions"
              value={implementationIntentions}
              onChange={(e) => setImplementationIntentions(e.target.value)}
              placeholder="If-then planning (e.g., If alarm rings, then I sit on cushion)"
              required
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="hurdles">Potential Hurdles *</Label>
            <Textarea
              id="hurdles"
              value={hurdles}
              onChange={(e) => setHurdles(e.target.value)}
              placeholder="e.g., Too tired, no time, forget"
              required
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="reminderType">Reminder Type *</Label>
            <Input
              id="reminderType"
              value={reminderType}
              onChange={(e) => setReminderType(e.target.value)}
              placeholder="e.g., Phone alarm, Discord bot"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Additional Notes (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between py-2 px-1 rounded-lg bg-muted/50">
            <div>
              <Label htmlFor="public" className="cursor-pointer">Make Public</Label>
              <p className="text-xs text-muted-foreground mt-1">Others can view and subscribe to this habit</p>
            </div>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
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
              {loading ? "Creating..." : "Create Habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
