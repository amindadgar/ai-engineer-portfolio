import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "About", type: "section", href: "#about" },
  { label: "Experience", type: "section", href: "#experience" },
  { label: "Projects", type: "section", href: "#projects" },
  { label: "Skills", type: "section", href: "#skills" },
  { label: "Writings", type: "section", href: "#writings" },
  { label: "Volunteer Work", type: "section", href: "#volunteer" },
  { label: "Contact", type: "section", href: "#contact" },
] as const;

const linkClasses = "text-sm text-muted-foreground transition-colors hover:text-foreground";

const getSectionDestination = (href: string) => ({
  pathname: "/",
  hash: href,
  search: "",
});

const isLinkActive = (href: string, pathname: string, hash: string, isHome: boolean) => {
  return isHome && hash === href;
};

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
    const active = isLinkActive(link.href, location.pathname, location.hash, isHome);

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
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gradient">M. Amin Dadgar</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(renderNavLink)}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-foreground p-2"
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
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <div key={link.href} onClick={() => setMobileOpen(false)}>
              {renderNavLink(link)}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
