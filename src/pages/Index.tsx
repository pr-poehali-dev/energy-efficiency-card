import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import ResourceCard from '@/components/ResourceCard';
import ClassBadge from '@/components/ClassBadge';
import {
  INITIAL_RESOURCES, Resource, getClass, plannedFact, ratioOf,
  classIndex, CLASS_SCALE,
} from '@/lib/energy';

export default function Index() {
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);

  const toggleMeasure = (resourceId: string, measureId: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId
          ? { ...r, measures: r.measures.map((m) => (m.id === measureId ? { ...m, enabled: !m.enabled } : m)) }
          : r,
      ),
    );
  };

  const summary = useMemo(() => {
    const factIdx = resources.map((r) => classIndex(getClass(ratioOf(r.fact, r.baseline)).label));
    const planIdx = resources.map((r) => classIndex(getClass(ratioOf(plannedFact(r), r.baseline)).label));
    const avgFact = Math.round(factIdx.reduce((a, b) => a + b, 0) / resources.length);
    const avgPlan = Math.round(planIdx.reduce((a, b) => a + b, 0) / resources.length);
    const activeCount = resources.reduce((a, r) => a + r.measures.filter((m) => m.enabled).length, 0);
    return {
      factClass: CLASS_SCALE[avgFact],
      planClass: CLASS_SCALE[avgPlan],
      activeCount,
      improved: avgPlan < avgFact,
    };
  }, [resources]);

  const hasPlan = summary.activeCount > 0;

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg opacity-40 animate-grid-flow" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[60rem] rounded-full blur-3xl animate-glow-pulse"
          style={{ background: 'radial-gradient(hsl(var(--primary) / 0.25), transparent 70%)' }} />
        <div className="container relative py-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 animate-fade-in opacity-0">
            <span className="h-2 w-2 rounded-full bg-primary animate-glow-pulse" />
            Система энергомониторинга · онлайн-расчёт
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="animate-fade-in opacity-0" style={{ animationDelay: '80ms' }}>
              <h1 className="font-display font-bold text-4xl md:text-6xl leading-none neon-text">
                КАРТОЧКА<br />ЭНЕРГОЭФФЕКТИВНОСТИ
              </h1>
              <p className="text-muted-foreground mt-4 max-w-xl">
                Расчёт класса энергосбережения по международной шкале A++ … G для каждого
                ресурса. Подберите мероприятия — и класс пересчитается в реальном времени.
              </p>
            </div>

            {/* Итоговый класс объекта */}
            <div className="glass rounded-2xl p-6 flex items-center gap-6 animate-scale-in opacity-0 shrink-0"
              style={{ animationDelay: '160ms' }}>
              <div className="text-center">
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Класс объекта</p>
                <ClassBadge info={hasPlan ? summary.planClass : summary.factClass} size="lg" />
                <p className="text-xs mt-2 text-muted-foreground">
                  {(hasPlan ? summary.planClass : summary.factClass).description}
                </p>
              </div>
              {hasPlan && summary.improved && (
                <div className="text-center animate-fade-in opacity-0">
                  <Icon name="ArrowRight" className="text-primary mx-auto mb-2" size={20} />
                  <p className="text-[11px] text-muted-foreground mb-1">было</p>
                  <ClassBadge info={summary.factClass} size="sm" />
                </div>
              )}
            </div>
          </div>

          {/* Метрики */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
            {[
              { icon: 'Boxes', label: 'Ресурсов', value: String(resources.length) },
              { icon: 'CheckCircle2', label: 'Мероприятий активно', value: String(summary.activeCount) },
              { icon: 'Scale', label: 'Шкала классов', value: 'A++ … G' },
              { icon: 'Activity', label: 'Расчёт', value: 'в реальном времени' },
            ].map((m, i) => (
              <div key={m.label} className="glass rounded-xl p-4 animate-fade-in opacity-0"
                style={{ animationDelay: `${240 + i * 60}ms` }}>
                <Icon name={m.icon} size={18} className="text-primary mb-2" />
                <p className="font-display text-lg font-semibold leading-tight">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* РЕСУРСЫ */}
      <main className="container py-10">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Gauge" className="text-accent" size={22} />
          <h2 className="font-display font-semibold text-2xl">Расчёт по ресурсам</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {resources.map((r, i) => (
            <ResourceCard key={r.id} resource={r} onToggleMeasure={toggleMeasure} delay={i * 90} />
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        Классы энергосбережения по международной шкале · A++ (наивысший) … G (низший)
      </footer>
    </div>
  );
}
