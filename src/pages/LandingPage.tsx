import { lazy, Suspense } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Footer } from '../components/landing/Footer';

const Services = lazy(() =>
  import('../components/landing/Services').then((m) => ({ default: m.Services }))
);
const Testimonials = lazy(() =>
  import('../components/landing/Testimonials').then((m) => ({
    default: m.Testimonials,
  }))
);
const Contact = lazy(() =>
  import('../components/landing/Contact').then((m) => ({ default: m.Contact }))
);

function SectionLoader() {
  return (
    <div className="py-28 flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-brand-black min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<SectionLoader />}>
          <Services />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
