export default function TopoFieldPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 bg-[#08080c] ${className || ''}`}
      style={{
        backgroundImage:
          'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.03) 0%, transparent 50%)',
      }}
    />
  );
}
