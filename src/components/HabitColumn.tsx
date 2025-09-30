import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HabitColumnProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  onAdd?: () => void;
}

export const HabitColumn = ({ title, icon, children, onAdd }: HabitColumnProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
        </div>
        {onAdd && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={onAdd}
          >
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        {children}
      </div>
    </div>
  );
};
