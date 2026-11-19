import { GalleryProvider } from "@/components/gallery/gallery-stage";
import { Navigation } from "@/components/navigation";
import { EntranceSection } from "@/components/entrance-section";
import { ProjectsSection } from "@/components/projects-section";
import { OpenSourceSection } from "@/components/open-source-section";
import { ExperienceSection } from "@/components/experience-section";
import { SkillsSection } from "@/components/skills-section";
import { AboutSection, AwardsSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { Motion } from "@/components/motion";

export default function Portfolio() {
  return (
    <GalleryProvider>
      <a href="#work" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-ground focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navigation />
      <main>
        <EntranceSection />
        <ProjectsSection />
        <OpenSourceSection />
        <ExperienceSection />
        <SkillsSection />
        <AboutSection />
        <AwardsSection />
        <ContactSection />
      </main>
      <Footer />
      <div aria-hidden="true" className="grain" />
      <Motion />
    </GalleryProvider>
  );
}
