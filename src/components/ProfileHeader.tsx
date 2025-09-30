import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, LogOut, TrendingUp } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";

interface Profile {
  username: string;
  bio?: string;
  personality_type?: string;
  total_streak: number;
  avatar_url?: string;
}

interface ProfileHeaderProps {
  user: User;
  profile: Profile | null;
  onLogout: () => void;
  onProfileUpdate: () => void;
}

export const ProfileHeader = ({ user, profile, onLogout, onProfileUpdate }: ProfileHeaderProps) => {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <div className="bg-card/60 backdrop-blur-glass border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-glass">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-2xl bg-gradient-primary">
                  {profile?.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {profile?.username}
                </h1>
                {profile?.bio && (
                  <p className="text-muted-foreground mb-3 max-w-md">
                    {profile.bio}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-3 items-center">
                  {profile?.personality_type && (
                    <Badge variant="outline" className="text-sm">
                      {profile.personality_type}
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-foreground">
                      {profile?.total_streak || 0}
                    </span>
                    <span className="text-muted-foreground">day streak</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <EditProfileDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
        userId={user.id}
        onSuccess={() => {
          onProfileUpdate();
          setEditOpen(false);
        }}
      />
    </>
  );
};
