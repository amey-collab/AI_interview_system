const GlassCard = ({ children, className = '' }) => {
  return (
    <div className={`rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-glow backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
