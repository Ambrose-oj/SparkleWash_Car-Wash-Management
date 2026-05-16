import { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { getAvailability, createBooking } from '../../services/api';
import type { Service } from '../../types';
import db from '../../data/db.json';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Slot {
  slot: string;
  available: boolean;
  remaining: number;
}

type BookingState = 'idle' | 'loading' | 'success' | 'error';

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  date: string;
  timeSlot: string;
}

const INITIAL_FORM: BookingForm = {
  name: '',
  email: '',
  phone: '',
  serviceId: '',
  date: '',
  timeSlot: '',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

function formatSlot(slot: string): string {
  const [h, m] = slot.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Booking() {
  const services = db.services as Service[];

  const [form, setForm] = useState<BookingForm>(INITIAL_FORM);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingState, setBookingState] = useState<BookingState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch availability whenever date changes
  useEffect(() => {
    if (!form.date) return;

    let cancelled = false;
    setSlotsLoading(true);
    setForm((prev) => ({ ...prev, timeSlot: '' }));

    getAvailability(form.date)
      .then((res) => {
        if (!cancelled) setSlots(res.data.slots);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setSlotsLoading(false);
      });

    return () => { cancelled = true; };
  }, [form.date]);

  function set(field: keyof BookingForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrorMsg('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.serviceId || !form.date || !form.timeSlot) {
      setErrorMsg('Please fill in all fields and select a time slot.');
      return;
    }

    setBookingState('loading');
    setErrorMsg('');

    try {
      await createBooking({
        name: form.name,
        email: form.email,
        phone: form.phone,
        serviceId: form.serviceId,
        date: form.date,
        timeSlot: form.timeSlot,
      });
      setBookingState('success');
      setForm(INITIAL_FORM);
      setSlots([]);
    } catch (err) {
      setBookingState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Booking failed. Please try again.');
    }
  }

  if (bookingState === 'success') {
    return (
      <section id="booking" className="py-28 px-6 bg-brand-black relative">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-gold" />
          </div>
          <h2 className="font-display text-3xl text-white mb-3">You're booked!</h2>
          <p className="font-body text-white/50 mb-8">
            We'll confirm your appointment via email within 2 hours.
          </p>
          <button
            onClick={() => setBookingState('idle')}
            className="px-6 py-3 rounded-lg border border-gold/30 text-gold font-body text-sm hover:bg-gold/10 transition-colors"
          >
            Book another appointment
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-28 px-6 bg-[#0A0A0A] relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(212,175,55,0.05),transparent)]" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="font-body text-gold text-sm tracking-widest uppercase mb-3">Book a Service</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Schedule Your Appointment
          </h2>
          <p className="font-body text-white/50 max-w-lg mx-auto">
            Choose your service, pick a date, and lock in your time slot. We'll take care of the rest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Personal details */}
          <div className="rounded-2xl border border-white/8 bg-brand-card p-6 flex flex-col gap-4">
            <h3 className="font-body text-white/60 text-xs tracking-widest uppercase">Your Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(
                [
                  { field: 'name', label: 'Full Name', placeholder: 'Emeka Obi', type: 'text' },
                  { field: 'email', label: 'Email', placeholder: 'emeka@gmail.com', type: 'email' },
                  { field: 'phone', label: 'Phone', placeholder: '+234 800 000 0000', type: 'tel' },
                ] as const
              ).map(({ field, label, placeholder, type }) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="font-body text-white/40 text-xs">{label}</label>
                  <input
                    type={type}
                    value={form[field]}
                    onChange={(e) => set(field, e.target.value)}
                    placeholder={placeholder}
                    className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/40 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Service selection */}
          <div className="rounded-2xl border border-white/8 bg-brand-card p-6 flex flex-col gap-4">
            <h3 className="font-body text-white/60 text-xs tracking-widest uppercase">Select Service</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => set('serviceId', s.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                    form.serviceId === s.id
                      ? 'border-gold/50 bg-gold/5'
                      : 'border-white/8 hover:border-white/20'
                  }`}
                >
                  <span className="text-xl">{s.icon}</span>
                  <div>
                    <p className="font-body text-white text-sm font-medium">{s.title}</p>
                    <p className="font-body text-white/40 text-xs">{s.price} · {s.duration}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date + time slot */}
          <div className="rounded-2xl border border-white/8 bg-brand-card p-6 flex flex-col gap-4">
            <h3 className="font-body text-white/60 text-xs tracking-widest uppercase">Date & Time</h3>

            <div className="flex flex-col gap-1.5">
              <label className="font-body text-white/40 text-xs flex items-center gap-1.5">
                <Calendar size={12} /> Pick a date
              </label>
              <input
                type="date"
                value={form.date}
                min={todayString()}
                onChange={(e) => set('date', e.target.value)}
                className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-body text-sm focus:outline-none focus:border-gold/40 transition-colors [color-scheme:dark]"
              />
            </div>

            {form.date && (
              <div className="flex flex-col gap-2">
                <label className="font-body text-white/40 text-xs flex items-center gap-1.5">
                  <Clock size={12} /> Available slots
                </label>
                {slotsLoading ? (
                  <div className="flex gap-2 flex-wrap">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-9 w-20 rounded-lg bg-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    {slots.map(({ slot, available }) => (
                      <button
                        key={slot}
                        type="button"
                        disabled={!available}
                        onClick={() => available && set('timeSlot', slot)}
                        className={`px-3 py-2 rounded-lg font-body text-sm transition-all ${
                          form.timeSlot === slot
                            ? 'bg-gold text-brand-black font-semibold'
                            : available
                            ? 'border border-white/15 text-white/70 hover:border-gold/40 hover:text-white'
                            : 'border border-white/5 text-white/20 cursor-not-allowed line-through'
                        }`}
                      >
                        {formatSlot(slot)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {errorMsg && (
            <p className="font-body text-red-400 text-sm text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={bookingState === 'loading'}
            className="w-full py-4 rounded-xl bg-gold text-brand-black font-body font-semibold hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bookingState === 'loading' ? 'Confirming booking…' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </section>
  );
}
