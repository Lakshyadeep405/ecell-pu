import React from 'react';
import { cn } from "@/lib/utils";

// --- Feature Card Sub-component ---
export interface FeatureCardProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ Icon, title, description, className }, ref) => {
    const titleId = React.useId();
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-start gap-4 p-6 rounded-none border-2 border-border bg-card shadow-[4px_4px_0px_#00FF66] transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0px_#00FF66]",
          className
        )}
        aria-labelledby={titleId}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-none border-2 border-border bg-muted text-primary">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <h3 id={titleId} className="text-lg font-black tracking-tight text-foreground uppercase font-[family-name:var(--font-outfit)]">
            {title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    );
  }
);
FeatureCard.displayName = "FeatureCard";

// --- Main FeatureGrid Component ---
export interface FeatureGridProps extends React.ComponentPropsWithoutRef<'section'> {
  sectionTitle: React.ReactNode;
  sectionDescription: React.ReactNode;
  features: FeatureCardProps[];
}

export const FeatureGrid = React.forwardRef<HTMLElement, FeatureGridProps>(
  ({ sectionTitle, sectionDescription, features = [], className, ...props }, ref) => {
    const titleId = React.useId();

    return (
      <section
        ref={ref}
        className={cn("w-full py-12", className)}
        aria-labelledby={titleId}
        {...props}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 id={titleId} className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl uppercase font-[family-name:var(--font-outfit)]" style={{ textShadow: "3px 3px 0px oklch(0.85 0.28 140)" }}>
              {sectionTitle}
            </h2>
            <p className="mt-6 text-muted-foreground md:text-lg max-w-2xl mx-auto leading-relaxed">
              {sectionDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
    );
  }
);
FeatureGrid.displayName = "FeatureGrid";
