import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Why Us', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-brand-black/90 backdrop-blur-md border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center text-brand-black text-xs font-bold font-display">
              S
            </div>
            <div className="absolute inset-0 rounded-full bg-gold/40 scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm" />
          </div>
          <span className="font-display text-xl text-white tracking-wide">
            Sparkle<span className="text-gold">Wash</span>
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <button
                onClick={() => scrollTo(link.href)}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-body tracking-wide"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              Admin
            </Button>
          </Link>
          <button
            onClick={() => scrollTo('#contact')}
          >
            <Button size="sm">Book Now</Button>
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={clsx(
          'md:hidden absolute top-full left-0 right-0 bg-brand-black/95 backdrop-blur-md border-b border-white/5',
          'transition-all duration-300 overflow-hidden',
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.href)}
              className="text-left text-white/70 hover:text-white text-base font-body py-1"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button onClick={() => scrollTo('#contact')}>
              <Button fullWidth>Book Now</Button>
            </button>
            <Link to="/dashboard">
              <Button variant="secondary" fullWidth>
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
