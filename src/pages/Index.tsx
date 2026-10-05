import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ProjectsSection from "@/components/ProjectsSection";
import GitHubActivitySection from "@/components/GitHubActivitySection";
import SkillsSection from "@/components/SkillsSection";
import RecommendationsSection from "@/components/RecommendationsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WritingsSection from "@/components/WritingsSection";
import AskSection from "@/components/AskSection";
import ChatLauncher from "@/components/chat/ChatLauncher";
import SectionNav from "@/components/SectionNav";
import { ChatProvider } from "@/hooks/use-chat";

const Index = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <SectionNav />
        <HeroSection />
        <SkillsSection />
        <AboutSection />
        <AskSection />
        <RecommendationsSection />
        <ExperienceSection />
        <ProjectsSection />
        <GitHubActivitySection />
        <WritingsSection />
        <ContactSection />
        <Footer />
        <ChatLauncher />
      </div>
    </ChatProvider>
  );
};

export default Index;
