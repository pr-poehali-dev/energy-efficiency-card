import { ClassInfo } from '@/lib/energy';

interface Props {
  info: ClassInfo;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { box: 'h-9 w-11 text-lg', pad: 'px-2' },
  md: { box: 'h-14 w-16 text-2xl', pad: 'px-3' },
  lg: { box: 'h-24 w-28 text-5xl', pad: 'px-4' },
};

export default function ClassBadge({ info, size = 'md' }: Props) {
  const s = sizes[size];
  return (
    <div
      className={`${s.box} ${s.pad} flex items-center justify-center rounded-xl font-display font-bold tracking-tight transition-all duration-500`}
      style={{
        background: `linear-gradient(135deg, ${info.color}, ${info.color}cc)`,
        color: '#06120a',
        boxShadow: `0 0 32px rgb(${info.glow} / 0.55), inset 0 1px 0 rgb(255 255 255 / 0.35)`,
      }}
    >
      {info.label}
    </div>
  );
}
