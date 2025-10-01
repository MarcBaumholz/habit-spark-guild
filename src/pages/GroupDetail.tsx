import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GroupDetail = () => {
  const { groupId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
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
    if (user && groupId) {
      fetchGroup();
      fetchMembers();
    }
  }, [user, groupId]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    setUser(session.user);
  };

  const fetchGroup = async () => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (error) {
      console.error("Error fetching group:", error);
      toast({
        title: "Error",
        description: "Failed to load group details.",
        variant: "destructive",
      });
      return;
    }

    setGroup(data);
  };

  const fetchMembers = async () => {
    const { data: memberData, error: memberError } = await supabase
      .from("group_members")
      .select("user_id, joined_at")
      .eq("group_id", groupId);

    if (memberError) {
      console.error("Error fetching members:", memberError);
      return;
    }

    // Fetch profiles for all members
    const userIds = memberData?.map((m) => m.user_id) || [];
    if (userIds.length === 0) {
      setMembers([]);
      return;
    }

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .in("user_id", userIds);

    if (profileError) {
      console.error("Error fetching profiles:", profileError);
      return;
    }

    // Merge member data with profile data
    const mergedMembers = memberData?.map((member) => {
      const profile = profiles?.find((p) => p.user_id === member.user_id);
      return {
        ...member,
        ...profile,
      };
    }) || [];

    setMembers(mergedMembers);
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  if (!user || !group) {
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate("/groups")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Groups
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{group.name}</h1>
          <p className="text-muted-foreground">{group.description}</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{members.length} / {group.max_members} members</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <Card 
              key={member.user_id} 
              className="bg-card/60 backdrop-blur-glass border-glass-border hover:shadow-glass transition-all cursor-pointer"
              onClick={() => handleViewProfile(member.user_id)}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 mb-4 border-2 border-primary/20">
                  <AvatarImage src={member.avatar_url} />
                  <AvatarFallback className="text-lg bg-gradient-primary">
                    {member.username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-foreground mb-1">{member.username}</h3>
                {member.personality_type && (
                  <p className="text-xs text-muted-foreground">{member.personality_type}</p>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  {member.total_streak || 0} day streak
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No members in this group yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetail;
