export type EnergyClass = 'A++' | 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface ClassInfo {
  label: EnergyClass;
  color: string;
  glow: string;
  maxRatio: number;
  description: string;
}

export const CLASS_SCALE: ClassInfo[] = [
  { label: 'A++', color: '#00e676', glow: '0 132 62', maxRatio: 0.5, description: 'Наивысшая эффективность' },
  { label: 'A+', color: '#39d353', glow: '55 211 83', maxRatio: 0.6, description: 'Очень высокая' },
  { label: 'A', color: '#7ed957', glow: '126 217 87', maxRatio: 0.75, description: 'Высокая' },
  { label: 'B', color: '#c3e939', glow: '195 233 57', maxRatio: 0.9, description: 'Повышенная' },
  { label: 'C', color: '#ffd60a', glow: '255 214 10', maxRatio: 1.05, description: 'Нормальная' },
  { label: 'D', color: '#ffa41b', glow: '255 164 27', maxRatio: 1.25, description: 'Пониженная' },
  { label: 'E', color: '#ff7b2c', glow: '255 123 44', maxRatio: 1.5, description: 'Низкая' },
  { label: 'F', color: '#ff5252', glow: '255 82 82', maxRatio: 1.75, description: 'Очень низкая' },
  { label: 'G', color: '#e53935', glow: '229 57 53', maxRatio: Infinity, description: 'Крайне низкая' },
];

// Соотношение фактического потребления к нормативному (baseline).
// ratio < 1 — экономия, > 1 — перерасход.
export function getClass(ratio: number): ClassInfo {
  return CLASS_SCALE.find((c) => ratio <= c.maxRatio) ?? CLASS_SCALE[CLASS_SCALE.length - 1];
}

export function classIndex(label: EnergyClass): number {
  return CLASS_SCALE.findIndex((c) => c.label === label);
}

export interface Measure {
  id: string;
  title: string;
  reduction: number; // % снижения ресурса
  enabled: boolean;
}

export interface Resource {
  id: string;
  name: string;
  icon: string;
  unit: string;
  fact: number;      // фактическое потребление
  baseline: number;  // нормативное потребление (эталон)
  accent: string;
  measures: Measure[];
}

export function plannedFact(r: Resource): number {
  const totalReduction = r.measures
    .filter((m) => m.enabled)
    .reduce((acc, m) => acc * (1 - m.reduction / 100), 1);
  return r.fact * totalReduction;
}

export function ratioOf(consumption: number, baseline: number): number {
  return baseline > 0 ? consumption / baseline : 999;
}

export const INITIAL_RESOURCES: Resource[] = [
  {
    id: 'hvs', name: 'Холодное водоснабжение', icon: 'Droplet', unit: 'м³/год', accent: '#38bdf8',
    fact: 4200, baseline: 3600,
    measures: [
      { id: 'hvs1', title: 'Установка приборов учёта и датчиков утечек', reduction: 8, enabled: false },
      { id: 'hvs2', title: 'Замена сантехники на водосберегающую', reduction: 12, enabled: false },
      { id: 'hvs3', title: 'Ремонт и балансировка трубопроводов', reduction: 6, enabled: false },
    ],
  },
  {
    id: 'gvs', name: 'Горячее водоснабжение', icon: 'Waves', unit: 'Гкал/год', accent: '#fb923c',
    fact: 320, baseline: 240,
    measures: [
      { id: 'gvs1', title: 'Теплоизоляция трубопроводов ГВС', reduction: 15, enabled: false },
      { id: 'gvs2', title: 'Циркуляционные насосы с частотным приводом', reduction: 10, enabled: false },
      { id: 'gvs3', title: 'Аэраторы и терморегуляторы', reduction: 9, enabled: false },
    ],
  },
  {
    id: 'gas', name: 'Природный газ', icon: 'Flame', unit: 'м³/год', accent: '#f472b6',
    fact: 18500, baseline: 15000,
    measures: [
      { id: 'gas1', title: 'Модернизация котельного оборудования', reduction: 18, enabled: false },
      { id: 'gas2', title: 'Автоматика погодного регулирования', reduction: 11, enabled: false },
      { id: 'gas3', title: 'Экономайзеры утилизации тепла дымовых газов', reduction: 7, enabled: false },
    ],
  },
  {
    id: 'heat', name: 'Тепловая энергия', icon: 'Thermometer', unit: 'Гкал/год', accent: '#f87171',
    fact: 1480, baseline: 1000,
    measures: [
      { id: 'heat1', title: 'Утепление фасада и кровли', reduction: 22, enabled: false },
      { id: 'heat2', title: 'Индивидуальный тепловой пункт (ИТП)', reduction: 14, enabled: false },
      { id: 'heat3', title: 'Замена окон на энергоэффективные', reduction: 12, enabled: false },
    ],
  },
  {
    id: 'elec', name: 'Электрическая энергия', icon: 'Zap', unit: 'кВт·ч/год', accent: '#facc15',
    fact: 96000, baseline: 80000,
    measures: [
      { id: 'elec1', title: 'Светодиодное освещение с датчиками движения', reduction: 16, enabled: false },
      { id: 'elec2', title: 'Частотные преобразователи на насосах', reduction: 9, enabled: false },
      { id: 'elec3', title: 'Солнечные панели на кровле', reduction: 13, enabled: false },
    ],
  },
];
