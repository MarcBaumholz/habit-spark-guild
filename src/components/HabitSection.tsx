import { ReactNode } from "react";

interface HabitSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export const HabitSection = ({ title, description, icon, children }: HabitSectionProps) => {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-accent/50 flex items-center justify-center text-accent-foreground">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </section>
  );
};
