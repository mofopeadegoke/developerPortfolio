"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote:
      "Daniel's ability to quickly grasp complex requirements and deliver clean, maintainable code is exceptional. His product mindset makes him a valuable asset to any team.",
    author: "Tech Lead",
    role: "Technolink Software",
    initials: "TL",
  },
  {
    quote:
      "Working with Daniel during the hackathon was incredible. His leadership and technical skills helped us secure first place. He's a true problem solver.",
    author: "Team Member",
    role: "Codespace x Couchbase Hackathon",
    initials: "TM",
  },
  {
    quote:
      "Daniel's attention to detail and commitment to accessibility in his code shows a developer who truly cares about end users. His work on our frontend was outstanding.",
    author: "Project Manager",
    role: "Ozbul Software",
    initials: "PM",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-24 px-6 bg-card/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-2">
            What People Say
          </h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-card rounded-xl border border-border p-8 md:p-12 text-center">
                    <Quote className="h-12 w-12 text-primary/30 mx-auto mb-6" />
                    <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {testimonial.initials}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-foreground">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              aria-label="Previous testimonial"
              className="border-border hover:bg-secondary bg-transparent"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              aria-label="Next testimonial"
              className="border-border hover:bg-secondary bg-transparent"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
