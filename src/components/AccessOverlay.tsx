type Props = {
  loading: boolean;
  children: React.ReactNode;
};

export function AccessOverlay({ loading, children }: Props) {
  return (
    <div className="relative">
      {/* conteúdo normal */}
      <div className={loading ? "opacity-50 pointer-events-none" : ""}>
        {children}
      </div>

      {/* overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <span className="text-sm font-medium text-white">
              Carregando acesso...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}