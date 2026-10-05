import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Ask AI", href: "#ask" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Writings", href: "#writings" },
  { label: "Community", href: "#volunteer" },
] as const;

const linkClasses = "text-sm text-muted-foreground transition-colors hover:text-foreground";

const getSectionDestination = (href: string) => ({
  pathname: "/",
  hash: href,
  search: "",
});

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderNavLink = (link: (typeof navLinks)[number]) => {
    const active = isHome && location.hash === link.href;

    return (
      <Link
        key={link.href}
        to={getSectionDestination(link.href)}
        className={cn(linkClasses, active && "text-foreground")}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            amindadgar.com
          </span>
          <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
            Freelance AI Engineer
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map(renderNavLink)}
          <Link
            to={getSectionDestination("#contact")}
            className="rounded-md border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-foreground/30 hover:bg-secondary"
          >
            Contact
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="space-y-3 border-b border-border bg-background/95 px-6 py-4 backdrop-blur-xl md:hidden">
          {navLinks.map((link) => (
            <div key={link.href} onClick={() => setMobileOpen(false)}>
              {renderNavLink(link)}
            </div>
          ))}
          <div onClick={() => setMobileOpen(false)}>
            <Link to={getSectionDestination("#contact")} className={linkClasses}>
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
