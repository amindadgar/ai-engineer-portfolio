const Footer = () => (
  <footer className="border-t border-border py-8">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()}{" "}
        <a href="https://amindadgar.com/" className="transition-colors hover:text-foreground">
          amindadgar.com
        </a>
      </p>
      <p className="font-mono text-xs text-muted-foreground">
        React · TypeScript · Tailwind
      </p>
    </div>
  </footer>
);

export default Footer;
