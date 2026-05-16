interface ScoreBadgeProps {
  score: number;
  showLabel?: boolean;
}

function getScoreTier(score: number): {
  label: string;
  color: string;
  bg: string;
} {
  if (score >= 80) return { label: 'Hot',    color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
  if (score >= 60) return { label: 'Warm',   color: 'text-gold',        bg: 'bg-gold/10'        };
  if (score >= 40) return { label: 'Cool',   color: 'text-blue-400',    bg: 'bg-blue-400/10'    };
  return               { label: 'Cold',   color: 'text-white/30',    bg: 'bg-white/5'        };
}

export function ScoreBadge({ score, showLabel = false }: ScoreBadgeProps) {
  const tier = getScoreTier(score);

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${tier.bg}`}>
      <span className={`font-body text-xs font-semibold tabular-nums ${tier.color}`}>
        {score}
      </span>
      {showLabel && (
        <span className={`font-body text-xs ${tier.color} opacity-70`}>
          {tier.label}
        </span>
      )}
    </div>
  );
}
