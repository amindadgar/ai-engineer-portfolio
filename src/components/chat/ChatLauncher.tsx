import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import ChatPanel from "@/components/chat/ChatPanel";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

/** Floating "Ask AI" button that opens the same chat in a side sheet; hidden while the Ask section is on screen. */
const ChatLauncher = () => {
  const [open, setOpen] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);

  useEffect(() => {
    const section = document.getElementById("ask");
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setSectionVisible(entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {!sectionVisible && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-lg shadow-black/40 transition-colors animate-fade-in hover:border-primary hover:bg-surface-hover"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          Ask AI
        </button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 border-border p-0 pt-12 sm:max-w-md">
          <SheetTitle className="sr-only">Amin's AI assistant</SheetTitle>
          <SheetDescription className="sr-only">Ask about Amin's experience, projects, and recent work.</SheetDescription>
          <ChatPanel className="min-h-0 flex-1 rounded-none border-0 border-t" onLinkClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ChatLauncher;
