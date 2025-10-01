import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Calendar, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Groups = () => {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [memberCounts, setMemberCounts] = useState<{ [key: string]: number }>({});
  const [groupMembers, setGroupMembers] = useState<{ [key: string]: any[] }>({});
  const [userGroups, setUserGroups] = useState<Set<string>>(new Set());
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
      fetchGroups();
      fetchUserGroups();
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

  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from("groups")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching groups:", error);
      return;
    }

    setGroups(data || []);

    // Fetch member counts and member profiles for each group
    const counts: { [key: string]: number } = {};
    const members: { [key: string]: any[] } = {};
    
    for (const group of data || []) {
      const { data: memberData, count } = await supabase
        .from("group_members")
        .select("user_id", { count: "exact" })
        .eq("group_id", group.id)
        .limit(4);
      
      counts[group.id] = count || 0;

      if (memberData && memberData.length > 0) {
        const userIds = memberData.map((m) => m.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("avatar_url, username, user_id")
          .in("user_id", userIds);
        
        members[group.id] = profiles || [];
      } else {
        members[group.id] = [];
      }
    }
    
    setMemberCounts(counts);
    setGroupMembers(members);
  };

  const fetchUserGroups = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("group_members")
      .select("group_id")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching user groups:", error);
      return;
    }

    setUserGroups(new Set(data?.map((m) => m.group_id) || []));
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) return;

    const currentCount = memberCounts[groupId] || 0;
    const group = groups.find((g) => g.id === groupId);
    
    if (currentCount >= (group?.max_members || 8)) {
      toast({
        title: "Group Full",
        description: "This group has reached its maximum capacity.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("group_members")
      .insert({ group_id: groupId, user_id: user.id });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to join group.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "You've joined the group!",
    });

    fetchGroups();
    fetchUserGroups();
  };

  const handleViewGroup = (groupId: string) => {
    navigate(`/group/${groupId}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleViewProfile = () => {
    if (user) {
      navigate(`/profile/${user.id}`);
    }
  };

  if (!user) {
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Accountability Groups</h1>
            <p className="text-muted-foreground">Join a 66-day journey with like-minded people</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleViewProfile}>
              My Profile
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            const isMember = userGroups.has(group.id);
            const currentCount = memberCounts[group.id] || 0;
            const isFull = currentCount >= group.max_members;

            return (
              <Card key={group.id} className="bg-card/60 backdrop-blur-glass border-glass-border hover:shadow-glass transition-all">
                <CardHeader>
                  <CardTitle className="text-foreground">{group.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{group.journey_days} day journey</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>
                        {currentCount} / {group.max_members} members
                      </span>
                    </div>

                    {groupMembers[group.id]?.length > 0 && (
                      <div className="flex -space-x-2">
                        {groupMembers[group.id].slice(0, 4).map((member) => (
                          <Avatar key={member.user_id} className="w-8 h-8 border-2 border-background">
                            <AvatarImage src={member.avatar_url} />
                            <AvatarFallback className="text-xs bg-primary/20">
                              {member.username?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    )}
                    
                    {isMember ? (
                      <Button 
                        className="w-full" 
                        onClick={() => handleViewGroup(group.id)}
                      >
                        View Group
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleJoinGroup(group.id)}
                        disabled={isFull}
                      >
                        {isFull ? "Group Full" : "Join Group"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No groups available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
