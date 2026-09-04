export default function Icon({ name, size = 24, color, style }: { name: string; size?: number; color?: string; style?: React.CSSProperties }) {
  return <span className="material-symbols-outlined" style={{ fontSize: size, color, ...style }}>{name}</span>;
}
