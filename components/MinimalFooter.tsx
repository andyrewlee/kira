export default function MinimalFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-black/20 bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 py-4 text-xs flex items-center justify-between">
        <span className="font-mono uppercase tracking-[0.2em] opacity-70">kira</span>
        <span className="opacity-70">© {year}</span>
      </div>
    </footer>
  );
}

