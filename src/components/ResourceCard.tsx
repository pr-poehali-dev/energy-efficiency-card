import Icon from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import ClassBadge from '@/components/ClassBadge';
import ClassScale from '@/components/ClassScale';
import { Resource, getClass, plannedFact, ratioOf } from '@/lib/energy';

interface Props {
  resource: Resource;
  onToggleMeasure: (resourceId: string, measureId: string) => void;
  delay: number;
}

export default function ResourceCard({ resource, onToggleMeasure, delay }: Props) {
  const factClass = getClass(ratioOf(resource.fact, resource.baseline));
  const planned = plannedFact(resource);
  const plannedClass = getClass(ratioOf(planned, resource.baseline));
  const hasActive = resource.measures.some((m) => m.enabled);
  const improved = plannedClass.label !== factClass.label;
  const savePct = Math.round((1 - planned / resource.fact) * 100);

  const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU');

  return (
    <div
      className="glass rounded-2xl p-6 animate-fade-in opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${resource.accent}1f`, border: `1px solid ${resource.accent}40` }}
          >
            <Icon name={resource.icon} size={24} style={{ color: resource.accent }} />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg leading-tight">{resource.name}</h3>
            <p className="text-xs text-muted-foreground">Норматив: {fmt(resource.baseline)} {resource.unit}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ClassBadge info={hasActive ? plannedClass : factClass} size="md" />
          {hasActive && improved && (
            <span className="text-[10px] text-primary flex items-center gap-0.5">
              <Icon name="TrendingUp" size={11} /> было {factClass.label}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl bg-secondary/50 p-3">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Факт</p>
          <p className="font-display text-xl font-semibold">{fmt(resource.fact)}</p>
          <p className="text-[11px] text-muted-foreground">{resource.unit}</p>
        </div>
        <div className="rounded-xl p-3" style={{ background: hasActive ? 'hsl(var(--primary) / 0.12)' : 'hsl(var(--secondary) / 0.5)' }}>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">План</p>
          <p className="font-display text-xl font-semibold" style={{ color: hasActive ? 'hsl(var(--primary))' : undefined }}>
            {fmt(planned)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {hasActive ? `−${savePct}% экономия` : resource.unit}
          </p>
        </div>
      </div>

      <div className="mb-5">
        <ClassScale active={factClass} planned={hasActive ? plannedClass : undefined} />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
          <Icon name="Lightbulb" size={13} /> Мероприятия по энергосбережению
        </p>
        <div className="space-y-2">
          {resource.measures.map((m) => (
            <label
              key={m.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-secondary/40 hover:bg-secondary/70 px-3 py-2.5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="text-xs font-semibold shrink-0 rounded-md px-1.5 py-0.5"
                  style={{ background: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))' }}
                >
                  −{m.reduction}%
                </span>
                <span className="text-sm truncate">{m.title}</span>
              </div>
              <Switch checked={m.enabled} onCheckedChange={() => onToggleMeasure(resource.id, m.id)} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
