import { Clock, Calendar, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HabitKanbanCardProps {
  id: string;
  title: string;
  description?: string;
  timePerWeek?: string;
  frequency?: string;
  streak?: number;
  category?: string;
  onClick: (id: string) => void;
}

export const HabitKanbanCard = ({
  id,
  title,
  description,
  timePerWeek,
  frequency,
  streak,
  category,
  onClick,
}: HabitKanbanCardProps) => {
  return (
    <Card
      className="group p-4 bg-card/80 backdrop-blur-sm border-glass-border hover:border-primary/50 hover:shadow-glass transition-all duration-300 cursor-pointer"
      onClick={() => onClick(id)}
    >
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {timePerWeek && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{timePerWeek}</span>
            </div>
          )}
          {frequency && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3 h-3" />
              <span>{frequency}</span>
            </div>
          )}
          {streak !== undefined && streak > 0 && (
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp className="w-3 h-3" />
              <span className="font-semibold">{streak}d</span>
            </div>
          )}
        </div>

        {category && (
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        )}
      </div>
    </Card>
  );
};
