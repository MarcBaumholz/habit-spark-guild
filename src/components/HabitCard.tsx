import { Clock, Calendar, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HabitCardProps {
  title: string;
  description?: string;
  timePerWeek: string;
  frequency: string;
  streak?: number;
  category?: string;
  isSubscribed?: boolean;
  onClick?: () => void;
}

export const HabitCard = ({
  title,
  description,
  timePerWeek,
  frequency,
  streak,
  category,
  isSubscribed = false,
  onClick,
}: HabitCardProps) => {
  return (
    <Card
      className="group relative overflow-hidden bg-glass/60 backdrop-blur-glass border-glass-border hover:shadow-glass transition-all duration-300 cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground mb-1">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            )}
          </div>
          {isSubscribed && (
            <Badge variant="secondary" className="ml-2">
              Subscribed
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{timePerWeek}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{frequency}</span>
          </div>
          {streak && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <TrendingUp className="w-4 h-4" />
              <span>{streak} days</span>
            </div>
          )}
        </div>

        {category && (
          <div className="mt-4 pt-4 border-t border-border">
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};
