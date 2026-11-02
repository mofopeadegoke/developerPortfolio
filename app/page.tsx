import { GalleryProvider } from "@/components/gallery/gallery-stage";
import { Navigation } from "@/components/navigation";
import { EntranceSection } from "@/components/entrance-section";
import { ExperienceSection } from "@/components/experience-section";
import { ProjectsSection } from "@/components/projects-section";
import { SkillsSection } from "@/components/skills-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Portfolio() {
  return (
    <GalleryProvider>
      <a href="#experience" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-ground focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navigation />
      <main>
        <EntranceSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </GalleryProvider>
  );
}
