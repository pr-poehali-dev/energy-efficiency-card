import { CLASS_SCALE, ClassInfo } from '@/lib/energy';

interface Props {
  active: ClassInfo;
  planned?: ClassInfo;
}

export default function ClassScale({ active, planned }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {CLASS_SCALE.map((c, i) => {
        const isActive = c.label === active.label;
        const isPlanned = planned && c.label === planned.label && planned.label !== active.label;
        const width = 40 + i * 6;
        return (
          <div key={c.label} className="flex items-center gap-2">
            <div
              className="relative flex items-center rounded-r-md h-7 transition-all duration-500"
              style={{
                width: `${width}%`,
                background: `linear-gradient(90deg, ${c.color}, ${c.color}99)`,
                opacity: isActive || isPlanned ? 1 : 0.28,
                boxShadow: isActive ? `0 0 20px rgb(${c.glow} / 0.6)` : 'none',
              }}
            >
              <span className="pl-3 font-display font-bold text-[#06120a] text-sm">{c.label}</span>
            </div>
            {isActive && (
              <span className="text-xs font-medium text-foreground/90 animate-fade-in">● Факт</span>
            )}
            {isPlanned && (
              <span className="text-xs font-medium text-primary animate-fade-in">▲ План</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
