import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-32 px-6 text-center gap-4">
      <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
        <Construction size={22} className="text-gold" />
      </div>
      <div>
        <h2 className="font-display text-2xl text-white mb-2">{title}</h2>
        <p className="font-body text-white/40 text-sm max-w-sm">{description}</p>
      </div>
      <span className="px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-gold text-xs font-body">
        Coming Soon
      </span>
    </div>
  );
}
