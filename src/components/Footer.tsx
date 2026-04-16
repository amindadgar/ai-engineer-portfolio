const Footer = () => (
  <footer className="py-8 border-t border-border">
    <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Mohammad Amin Dadgar
      </p>
      <p className="text-xs text-muted-foreground">
        Built with React + TypeScript + Tailwind
      </p>
    </div>
  </footer>
);

export default Footer;
