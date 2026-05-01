import { Button } from '../ui/Button';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-0"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-brand-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_80%,rgba(212,175,55,0.06),transparent)]" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/5 blur-3xl animate-float pointer-events-none" />
      <div
        className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-gold/4 blur-3xl animate-float pointer-events-none"
        style={{ animationDelay: '1.5s' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-gold text-sm font-body mb-8 animate-fade-in"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          Lagos's Premium Auto Detailing
        </div>

        {/* Headline */}
        <h1
          className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] mb-6 animate-fade-up"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          Your Car Deserves
          <br />
          <em className="text-gold not-italic">Royalty Treatment.</em>
        </h1>

        {/* Subheadline */}
        <p
          className="font-body text-lg md:text-xl text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
          style={{ animationDelay: '0.35s', opacity: 0 }}
        >
          Professional auto detailing that respects your time, protects your
          investment, and keeps your vehicle showroom-ready — wherever you are
          in Lagos.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: '0.5s', opacity: 0 }}
        >
          <Button
            size="lg"
            onClick={() => scrollTo('#contact')}
            className="min-w-[200px]"
          >
            Book a Free Consultation
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => scrollTo('#services')}
            className="min-w-[160px]"
          >
            See Services
          </Button>
        </div>

        {/* Social proof */}
        <div
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in"
          style={{ animationDelay: '0.7s', opacity: 0 }}
        >
          {[
            { stat: '1,200+', label: 'Cars Serviced' },
            { stat: '98%', label: 'Satisfaction Rate' },
            { stat: '5 years', label: 'In Lagos Market' },
          ].map((item) => (
            <div key={item.stat} className="flex flex-col items-center">
              <span className="font-display text-2xl text-gold">
                {item.stat}
              </span>
              <span className="font-body text-sm text-white/40">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo('#services')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors"
        aria-label="Scroll to services"
      >
        <span className="text-xs font-body tracking-widest uppercase">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </button>
    </section>
  );
}
