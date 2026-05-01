import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Clock, Tag } from 'lucide-react';
import type { Service } from '../../types';
import { getServices } from '../../services/mockApi';

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices().then((res) => {
      setServices(res.data);
      setLoading(false);
    });
  }, []);

  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="services" className="py-28 px-6 bg-brand-black relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(212,175,55,0.04),transparent)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="font-body text-gold text-sm tracking-widest uppercase mb-3">What We Offer</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Services Built for Results</h2>
          <p className="font-body text-white/50 max-w-xl mx-auto">
            Every service is designed around one goal: making your vehicle look exceptional and stay that way longer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ServiceSkeleton key={i} />)
            : services.map((service, i) => (
                <ServiceCard key={service.id} service={service} index={i} />
              ))}
        </div>

        <div className="text-center mt-12">
          <p className="font-body text-white/40 text-sm mb-4">Not sure which service you need?</p>
          <Button variant="secondary" onClick={() => scrollTo('#contact')}>
            Get a Free Recommendation
          </Button>
        </div>
      </div>
    </section>
  );
}

function ServiceSkeleton() {
  return (
    <div className="rounded-2xl border border-white/8 bg-brand-card p-6 flex flex-col gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-white/5" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-1/2" />
        <div className="h-3 bg-white/5 rounded w-full mt-2" />
        <div className="h-3 bg-white/5 rounded w-5/6" />
      </div>
    </div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const scrollTo = (href: string) =>
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div
      className="relative group rounded-2xl border border-white/8 bg-brand-card p-6 flex flex-col gap-4 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {service.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gold text-brand-black text-xs font-semibold font-body rounded-full whitespace-nowrap">
          Most Popular
        </div>
      )}

      <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-2xl group-hover:bg-gold/15 transition-colors">
        {service.icon}
      </div>

      <div className="flex-1">
        <h3 className="font-display text-xl text-white mb-1">{service.title}</h3>
        <p className="font-body text-gold text-sm font-medium mb-3">{service.outcome}</p>
        <p className="font-body text-white/50 text-sm leading-relaxed">{service.description}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/8">
        <div className="flex items-center gap-1 text-white/40 text-xs font-body">
          <Clock size={12} />
          {service.duration}
        </div>
        <div className="flex items-center gap-1 text-white/80 text-sm font-semibold font-body">
          <Tag size={12} className="text-gold" />
          {service.price}
        </div>
      </div>

      <button
        onClick={() => scrollTo('#contact')}
        className="w-full py-2.5 rounded-lg border border-gold/20 text-gold text-sm font-body font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gold/10 mt-1"
      >
        Book This Service →
      </button>
    </div>
  );
}
