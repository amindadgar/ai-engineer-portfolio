import type { ReactNode } from "react";

type SectionHeadingProps = {
  index: string;
  kicker: string;
  title: string;
  description?: ReactNode;
};

const SectionHeading = ({ index, kicker, title, description }: SectionHeadingProps) => (
  <div className="mb-10">
    <p className="label-mono mb-3">
      <span className="text-muted-foreground">{index}</span>
      <span className="mx-2 text-muted-foreground/50">/</span>
      {kicker}
    </p>
    <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h2>
    {description && (
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {description}
      </p>
    )}
  </div>
);

export default SectionHeading;
