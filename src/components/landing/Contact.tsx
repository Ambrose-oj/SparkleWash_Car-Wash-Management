import { useLeads } from '../../context/LeadsContext';
import { useContactForm } from '../../hooks/useForm';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { CheckCircle, MapPin, Phone, Clock } from 'lucide-react';
import type { BusinessType } from '../../types';

const BUSINESS_TYPE_OPTIONS: { value: BusinessType; label: BusinessType }[] = [
  { value: 'Car Wash', label: 'Car Wash' },
  { value: 'Restaurant / Food Service', label: 'Restaurant / Food Service' },
  { value: 'Retail / Shop', label: 'Retail / Shop' },
  { value: 'Logistics / Delivery', label: 'Logistics / Delivery' },
  { value: 'Beauty / Salon', label: 'Beauty / Salon' },
  { value: 'Real Estate', label: 'Real Estate' },
  { value: 'Other', label: 'Other' },
];

export function Contact() {
  const { addLead } = useLeads();
  const { form, errors, state, handleChange, handleSubmit, reset } =
    useContactForm(addLead);

  return (
    <section
      id="contact"
      className="py-28 px-6 bg-brand-black relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_30%_50%,rgba(212,175,55,0.05),transparent)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left info */}
          <div>
            <p className="font-body text-gold text-sm tracking-widest uppercase mb-3">
              Get in Touch
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
              Let's Get Your
              <br />
              <em className="text-gold not-italic">Car Sorted.</em>
            </h2>
            <p className="font-body text-white/55 mb-10 leading-relaxed">
              Fill in your details below and our team will reach out within 1
              hour to confirm your booking and answer any questions. No
              commitment required.
            </p>

            {/* Info blocks */}
            <div className="flex flex-col gap-5">
              {[
                {
                  icon: Phone,
                  title: 'Call or WhatsApp',
                  value: '+234 800 SPARKLE',
                },
                {
                  icon: MapPin,
                  title: 'We Come to You',
                  value: 'Serving VI, Lekki, Ikoyi & Ikeja',
                },
                {
                  icon: Clock,
                  title: 'Operating Hours',
                  value: 'Mon–Sat, 7:00 AM – 7:00 PM',
                },
              ].map(({ icon: Icon, title, value }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-white/50 text-xs mb-0.5">
                      {title}
                    </p>
                    <p className="font-body text-white text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right form */}
          <div className="rounded-2xl border border-white/8 bg-brand-card p-8">
            {state === 'success' ? (
              <SuccessState onReset={reset} />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div>
                  <h3 className="font-display text-2xl text-white mb-1">
                    Book a Free Consultation
                  </h3>
                  <p className="font-body text-white/40 text-sm">
                    We'll call you back within 1 hour.
                  </p>
                </div>

                <Input
                  id="name"
                  label="Full Name"
                  placeholder="Babatunde Fashola"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  error={errors.name}
                  autoComplete="name"
                />
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="tunde@company.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={errors.email}
                  autoComplete="email"
                />
                <Input
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+234 803 456 7890"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  error={errors.phone}
                  autoComplete="tel"
                />
                <Select
                  id="businessType"
                  label="Business Type"
                  options={BUSINESS_TYPE_OPTIONS}
                  placeholder="Select your business type"
                  value={form.businessType}
                  onChange={(e) =>
                    handleChange('businessType', e.target.value)
                  }
                  error={errors.businessType}
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={state === 'loading'}
                  size="lg"
                  className="mt-1"
                >
                  Get My Free Consultation
                </Button>

                <p className="text-center font-body text-white/25 text-xs">
                  No spam. No commitment. Just a quick conversation.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-8 gap-5">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <CheckCircle size={28} className="text-emerald-400" />
      </div>
      <div>
        <h3 className="font-display text-2xl text-white mb-2">
          You're all set!
        </h3>
        <p className="font-body text-white/55 text-sm leading-relaxed">
          We've received your request and our team will call you back within 1
          hour to confirm your booking.
        </p>
      </div>
      <button
        onClick={onReset}
        className="font-body text-sm text-gold/70 hover:text-gold transition-colors underline underline-offset-4"
      >
        Submit another request
      </button>
    </div>
  );
}
