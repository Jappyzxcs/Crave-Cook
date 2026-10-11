export default function Sidebar({ view, setView, setCategory, setQuery, favoritesCount }) {
  return (
    <>
      {/* Desktop Sidebar (Hidden on mobile) */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-gray-200 bg-white px-5 pb-4 pt-8 md:flex">
        
        <button
          className="mb-10 flex items-center gap-3 text-left focus:outline-none"
          onClick={() => {
            setView("discover");
            setCategory("All recipes");
            setQuery("");
          }}
          aria-label="Crave & Cook home"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm shadow-amber-500/20">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900">
            Crave & Cook
          </span>
        </button>

        <p className="mb-3 ml-2 text-xs font-bold tracking-wider text-gray-400">
          MENU
        </p>

        <nav className="flex flex-col gap-2">
          <button
            className={`flex min-h-11 items-center gap-3 rounded-xl px-4 text-left text-sm font-semibold transition-all ${
              view === "discover" ? "bg-amber-50 text-amber-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setView("discover")}
          >
            <span className="text-xl">⌂</span>
            <span>Discover</span>
          </button>

          <button
            className={`flex min-h-11 items-center gap-3 rounded-xl px-4 text-left text-sm font-semibold transition-all ${
              view === "favorites" ? "bg-amber-50 text-amber-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setView("favorites")}
          >
            <span className="text-xl">♡</span>
            <span>Favorites</span>
            <span className={`ml-auto grid h-6 min-w-6 place-items-center rounded-full px-2 text-[10px] font-bold ${
              view === "favorites" ? "bg-amber-200 text-amber-800" : "bg-gray-100 text-gray-500"
            }`}>
              {favoritesCount}
            </span>
          </button>
        </nav>

        <button
          onClick={() => setView("about")}
          className="mt-auto flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gray-200 bg-white text-sm font-bold text-gray-700 shadow-sm">
            J
          </div>
          <div className="flex flex-col">
            <strong className="text-sm font-bold text-gray-900">Jappy</strong>
            <span className="text-xs font-medium text-gray-500">WMAD Developer</span>
          </div>
        </button>
      </aside>

      {/* Mobile Bottom Navigation (Hidden on desktop) */}
      <nav className="fixed bottom-0 left-0 z-40 flex h-20 w-full items-center justify-around border-t border-gray-200 bg-white/90 px-2 pb-safe backdrop-blur-md md:hidden">
        <button
          className={`flex flex-col items-center justify-center gap-1.5 p-2 transition-colors ${
            view === "discover" ? "text-amber-500" : "text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => setView("discover")}
        >
          <span className="text-2xl leading-none">⌂</span>
          <span className="text-[10px] font-bold tracking-wide">Discover</span>
        </button>

        <button
          className={`flex flex-col items-center justify-center gap-1.5 p-2 transition-colors ${
            view === "favorites" ? "text-amber-500" : "text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => setView("favorites")}
        >
          <div className="relative">
            <span className="text-2xl leading-none">♡</span>
            {favoritesCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white ring-2 ring-white">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-wide">Favorites</span>
        </button>

        <button
          className={`flex flex-col items-center justify-center gap-1.5 p-2 transition-colors ${
            view === "about" ? "text-amber-500" : "text-gray-400 hover:text-gray-600"
          }`}
          onClick={() => setView("about")}
        >
          <span className="text-2xl leading-none">☺</span>
          <span className="text-[10px] font-bold tracking-wide">About</span>
        </button>
      </nav>
    </>
  );
}