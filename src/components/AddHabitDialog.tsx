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
import { useToast } from "@/hooks/use-toast";

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialStatus?: "current" | "in_progress" | "planned";
  onSuccess: () => void;
}

export const AddHabitDialog = ({
  open,
  onOpenChange,
  userId,
  initialStatus = "planned",
  onSuccess,
}: AddHabitDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [timePerWeek, setTimePerWeek] = useState("");
  const [frequency, setFrequency] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("habits").insert({
        user_id: userId,
        title,
        description,
        category,
        time_per_week: timePerWeek,
        frequency,
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
      setCategory("");
      setTimePerWeek("");
      setFrequency("");
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
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time">Time per Week</Label>
              <Input
                id="time"
                value={timePerWeek}
                onChange={(e) => setTimePerWeek(e.target.value)}
                placeholder="e.g., 3h 30min"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Input
                id="frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                placeholder="e.g., Daily"
                className="mt-1"
              />
            </div>
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
