import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import RecommendationsSection from "@/components/RecommendationsSection";
import VolunteerSection from "@/components/VolunteerSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WritingsSection from "@/components/WritingsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <RecommendationsSection />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <WritingsSection />
      <VolunteerSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
