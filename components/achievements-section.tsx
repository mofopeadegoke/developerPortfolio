"use client";

import { Award, Medal, Star, Trophy } from "lucide-react";

const achievements = [
  {
    icon: Trophy,
    title: "Winner",
    event: "Codespace x Couchbase Hackathon",
    year: "2023",
    color: "text-yellow-500",
  },
  {
    icon: Medal,
    title: "Finalist",
    event: "Construct AI 2024 Hackathon",
    year: "2024",
    color: "text-primary",
  },
  {
    icon: Star,
    title: "Top 15",
    event: "Teknofest Robotics Competition",
    year: "10,000+ participants",
    color: "text-primary",
  },
  {
    icon: Award,
    title: "Top 20",
    event: "Teknofest Tourism Software Competition",
    year: "5,000+ participants",
    color: "text-primary",
  },
  {
    icon: Medal,
    title: "Finalist",
    event: "EMUSoft Hackathon 2025",
    year: "2025",
    color: "text-primary",
  },
];

export function AchievementsSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Recognition
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
            Achievements
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <achievement.icon className={`h-8 w-8 ${achievement.color}`} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {achievement.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-2">
                {achievement.event}
              </p>
              <span className="text-xs text-primary font-medium">
                {achievement.year}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
