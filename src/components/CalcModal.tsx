import Icon from '@/components/ui/icon';
import ClassBadge from '@/components/ClassBadge';
import { Resource, getClass, plannedFact, ratioOf } from '@/lib/energy';

interface Props {
  resource: Resource | null;
  onClose: () => void;
}

export default function CalcModal({ resource, onClose }: Props) {
  if (!resource) return null;
  const r = resource;
  const fmt = (n: number) => Math.round(n).toLocaleString('ru-RU');
  const fmt2 = (n: number) => n.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const factClass = getClass(ratioOf(r.fact, r.baseline));
  const planned = plannedFact(r);
  const plannedClass = getClass(ratioOf(planned, r.baseline));
  const active = r.measures.filter((m) => m.enabled);
  const savePct = r.fact > 0 ? (1 - planned / r.fact) * 100 : 0;

  const factRatio = ratioOf(r.fact, r.baseline);
  const planRatio = ratioOf(planned, r.baseline);
  const factDev = (factRatio - 1) * 100;
  const planDev = (planRatio - 1) * 100;

  const rows = [
    { code: '1', label: 'Норматив (эталонное потребление)', unit: r.unit, fact: fmt(r.baseline), plan: fmt(r.baseline) },
    { code: '2', label: 'Годовое потребление ресурса', unit: r.unit, fact: fmt(r.fact), plan: fmt(planned), hl: true },
    { code: '3', label: 'Удельное отклонение от норматива', unit: '%', fact: `${factDev > 0 ? '+' : ''}${fmt2(factDev)}`, plan: `${planDev > 0 ? '+' : ''}${fmt2(planDev)}` },
    { code: '4', label: 'Экономия ресурса за счёт мероприятий', unit: '%', fact: '—', plan: `−${fmt2(savePct)}` },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between gap-4 p-6 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${r.accent}1f`, border: `1px solid ${r.accent}40` }}
            >
              <Icon name={r.icon} size={22} style={{ color: r.accent }} />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg leading-tight">{r.name}</h3>
              <p className="text-xs text-muted-foreground">Протокол расчёта класса энергосбережения</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="X" size={22} />
          </button>
        </div>

        {/* Классы */}
        <div className="grid grid-cols-2 gap-3 p-6">
          <div className="rounded-xl bg-secondary/60 p-4 flex items-center gap-3">
            <ClassBadge info={factClass} size="md" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Факт</p>
              <p className="font-display font-semibold">{factClass.description}</p>
            </div>
          </div>
          <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
            <ClassBadge info={plannedClass} size="md" />
            <div>
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">План</p>
              <p className="font-display font-semibold" style={{ color: 'hsl(var(--primary))' }}>{plannedClass.description}</p>
            </div>
          </div>
        </div>

        {/* Таблица показателей */}
        <div className="px-6 pb-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <Icon name="Table" size={13} /> Показатели энергоэффективности
          </p>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/60 text-left">
                  <th className="px-3 py-2 font-medium text-muted-foreground w-8">№</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground">Показатель</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground text-center w-16">Ед.</th>
                  <th className="px-3 py-2 font-medium text-muted-foreground text-right w-24">Факт</th>
                  <th className="px-3 py-2 font-medium text-primary text-right w-24">План</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.code} className={`border-t border-border ${row.hl ? 'bg-primary/5' : ''}`}>
                    <td className="px-3 py-2.5 text-muted-foreground">{row.code}</td>
                    <td className="px-3 py-2.5">{row.label}</td>
                    <td className="px-3 py-2.5 text-center text-muted-foreground text-xs">{row.unit}</td>
                    <td className="px-3 py-2.5 text-right font-medium tabular-nums">{row.fact}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-primary tabular-nums">{row.plan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Применённые мероприятия */}
        <div className="p-6 pt-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
            <Icon name="ListChecks" size={13} /> Учтённые мероприятия
            {active.length === 0 && <span className="normal-case tracking-normal">— не выбраны</span>}
          </p>
          {active.length > 0 && (
            <div className="space-y-2">
              {active.map((m) => (
                <div key={m.id} className="flex items-center justify-between gap-3 rounded-lg bg-secondary/50 px-3 py-2">
                  <span className="text-sm flex items-center gap-2">
                    <Icon name="Check" size={14} className="text-primary" /> {m.title}
                  </span>
                  <span className="text-xs font-semibold rounded-md px-1.5 py-0.5 shrink-0" style={{ background: 'hsl(var(--primary) / 0.12)', color: 'hsl(var(--primary))' }}>
                    −{m.reduction}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
