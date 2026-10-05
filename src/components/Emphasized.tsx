// Renders text where **double asterisks** mark emphasized spans.
const Emphasized = ({ text }: { text: string }) => (
  <>
    {text.split("**").map((part, i) =>
      i % 2 === 1 ? (
        <span key={i} className="font-medium text-foreground">
          {part}
        </span>
      ) : (
        part
      ),
    )}
  </>
);

export default Emphasized;
