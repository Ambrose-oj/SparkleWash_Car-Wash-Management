import { useState } from 'react';
import { testimonials } from '../../data/mockData';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export function Testimonials() {
  const [active, setActive] = useState(0);
  const count = testimonials.length;

  const prev = () => setActive((a) => (a - 1 + count) % count);
  const next = () => setActive((a) => (a + 1) % count);

  return (
    <section id="testimonials" className="py-28 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0C0C0C]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(212,175,55,0.06),transparent)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="font-body text-gold text-sm tracking-widest uppercase mb-3">
            Client Stories
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            What Lagos Says
          </h2>
          <p className="font-body text-white/50 max-w-lg mx-auto">
            Real results from real clients — businesses and individuals who
            trust SparkleWash with their vehicles.
          </p>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="relative">
            <TestimonialCard testimonial={testimonials[active]} />

            {/* Controls */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === active ? 'bg-gold w-6' : 'bg-white/20 w-1.5'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom trust signal */}
        <div className="mt-16 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-8">
          {[
            { label: 'Average Rating', value: '4.9 / 5.0' },
            { label: 'Reviews Collected', value: '340+' },
            { label: 'Repeat Clients', value: '78%' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="font-display text-2xl text-gold">{item.value}</p>
              <p className="font-body text-white/40 text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial: t }: { testimonial: (typeof testimonials)[0] }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-brand-card p-6 flex flex-col gap-4 hover:border-gold/20 transition-all duration-300">
      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < t.rating ? 'fill-gold text-gold' : 'text-white/20'}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="font-body text-white/70 text-sm leading-relaxed flex-1">
        "{t.content}"
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
        <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold text-xs font-semibold font-body">
          {t.avatar}
        </div>
        <div>
          <p className="font-body text-white text-sm font-medium">{t.name}</p>
          <p className="font-body text-white/40 text-xs">{t.role}</p>
        </div>
      </div>
    </div>
  );
}
