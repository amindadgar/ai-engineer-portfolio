import type { ReactNode } from "react";

// Minimal, safe markdown for assistant replies: paragraphs, "-"/"1." lists, **bold**, `code`, [links](url).
// Everything is rendered as React text (no HTML injection); only http(s), mailto, and in-page links are allowed.

const SAFE_HREF = /^(https?:\/\/|mailto:|#)/i;

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

const renderInline = (text: string, onLinkClick?: () => void): ReactNode[] =>
  text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-medium text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code key={i} className="rounded bg-secondary px-1 py-0.5 font-mono text-[0.85em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (!SAFE_HREF.test(href)) return label;
      const external = /^https?:/i.test(href);
      return (
        <a
          key={i}
          href={href}
          onClick={external ? undefined : onLinkClick}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-primary underline-offset-2 hover:underline"
        >
          {label}
        </a>
      );
    }
    return part;
  });

type Block = { type: "p"; lines: string[] } | { type: "ul" | "ol"; items: string[] };

const parseBlocks = (text: string): Block[] => {
  const blocks: Block[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const bullet = line.match(/^[-*•]\s+(.*)$/);
    const numbered = line.match(/^\d+[.)]\s+(.*)$/);
    const last = blocks[blocks.length - 1];
    if (!line) {
      blocks.push({ type: "p", lines: [] });
    } else if (bullet || numbered) {
      const type = bullet ? "ul" : "ol";
      const item = (bullet ?? numbered)![1];
      if (last?.type === type) last.items.push(item);
      else blocks.push({ type, items: [item] });
    } else if (last?.type === "p") {
      last.lines.push(line.replace(/^#+\s*/, ""));
    } else {
      blocks.push({ type: "p", lines: [line.replace(/^#+\s*/, "")] });
    }
  }
  return blocks.filter((b) => (b.type === "p" ? b.lines.length > 0 : b.items.length > 0));
};

const ChatMarkdown = ({ text, onLinkClick }: { text: string; onLinkClick?: () => void }) => (
  <div className="space-y-2.5">
    {parseBlocks(text).map((block, i) => {
      if (block.type === "p") {
        return (
          <p key={i}>
            {block.lines.map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {renderInline(line, onLinkClick)}
              </span>
            ))}
          </p>
        );
      }
      const List = block.type;
      return (
        <List key={i} className={`space-y-1 pl-5 ${block.type === "ul" ? "list-disc" : "list-decimal"} marker:text-primary/70`}>
          {block.items.map((item, j) => (
            <li key={j}>{renderInline(item, onLinkClick)}</li>
          ))}
        </List>
      );
    })}
  </div>
);

export default ChatMarkdown;
