import { Sparkles } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";

type AskAboutButtonProps = {
  /** Question sent to the assistant, phrased as a visitor would ask it. */
  question: string;
  className?: string;
};

/** Opens the chat and asks a prepared question, so cards can stay short and the assistant holds the detail. */
const AskAboutButton = ({ question, className }: AskAboutButtonProps) => {
  const { ask } = useChat();

  return (
    <button
      type="button"
      onClick={() => ask(question)}
      title={question}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-primary/30 px-2.5 py-1 font-mono text-xs text-primary transition-colors hover:border-primary hover:bg-primary/10",
        className,
      )}
    >
      <Sparkles className="h-3.5 w-3.5" />
      Ask AI about this
    </button>
  );
};

export default AskAboutButton;
