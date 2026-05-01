import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <span className="font-display text-xl text-white tracking-wide">
              Sparkle<span className="text-gold">Wash</span>
            </span>
            <p className="font-body text-white/35 text-sm mt-2">
              Lagos's premier auto detailing service.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            {[
              { label: 'Services', href: '#services' },
              { label: 'Reviews', href: '#testimonials' },
              { label: 'Contact', href: '#contact' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-sm text-white/40 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/dashboard"
              className="font-body text-sm text-white/40 hover:text-gold transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-white/25 text-xs">
            © {new Date().getFullYear()} SparkleWash. All rights reserved.
          </p>
          <p className="font-body text-white/20 text-xs">
            Built with TCprojects · Lagos, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}
