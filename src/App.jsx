import { useEffect, useState } from "react";
import { useRecipes } from "./hooks/useRecipes";
import { useDebounce } from "./hooks/useDebounce";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import RecipeGrid from "./components/RecipeGrid";
import RecipeModal from "./components/RecipeModal";

const categories = [
  "All recipes",
  "Chicken",
  "Seafood",
  "Vegetarian",
  "Pasta",
  "Dessert",
];

function getSavedFavorites() {
  try {
    return JSON.parse(localStorage.getItem("crave-favorites")) || [];
  } catch {
    return [];
  }
}

export default function App() {
  const [favorites, setFavorites] = useState(getSavedFavorites);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 400);
  const [category, setCategory] = useState("All recipes");
  const [view, setView] = useState("discover");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [toast, setToast] = useState("");

  const { recipes, loading, error, fetchRecipes } = useRecipes();

  useEffect(() => {
    if (debouncedQuery) {
      fetchRecipes(`/search.php?s=${encodeURIComponent(debouncedQuery)}`);
      if (category !== "") setCategory("");
    } else if (category === "All recipes" || !category) {
      // FIX: Empty string fetches a default diverse array instead of just chicken
      fetchRecipes(`/search.php?s=`);
    } else {
      fetchRecipes(`/filter.php?c=${encodeURIComponent(category)}`);
    }
  }, [debouncedQuery, category, fetchRecipes]);

  useEffect(() => {
    localStorage.setItem("crave-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function searchRecipes(event) {
    event.preventDefault();
    setView("discover");
  }

  function chooseCategory(item) {
    setCategory(item);
    setQuery("");
    setView("discover");
  }

  function toggleFavorite(recipe) {
    setFavorites((current) => {
      const exists = current.some((item) => item.idMeal === recipe.idMeal);
      if (exists) {
        setToast("Removed from favorites");
        return current.filter((item) => item.idMeal !== recipe.idMeal);
      } else {
        setToast("Saved to favorites");
        return [...current, recipe];
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div 
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-6 py-3 text-xs font-semibold text-white shadow-xl transition-all" 
          role="status"
        >
          {toast}
        </div>
      )}

      <Sidebar
        view={view}
        setView={setView}
        setCategory={setCategory}
        setQuery={setQuery}
        favoritesCount={favorites.length}
      />

      {/* Added pb-20 for mobile bottom nav clearance */}
      <main className="mx-auto flex min-h-screen max-w-[1600px] flex-col pb-20 md:ml-60 md:pb-0">
        <Topbar />

        {view === "discover" && (
          <>
            <section className="flex flex-col items-start gap-5 border-b border-gray-100 bg-white px-4 py-10 md:px-8 md:py-14">
              <div className="max-w-162.5">
                <h1 className="m-0 text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
                  What are you <span className="text-amber-500">craving?</span>
                </h1>
                <p className="mt-3 text-sm text-gray-500 md:text-base">
                  Search for your favorite dishes, ingredients, or explore new culinary ideas to cook today.
                </p>
              </div>

              <form 
                className="mt-2 flex w-full max-w-137.5 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 py-1.5 pl-4 pr-1.5 shadow-sm transition-all focus-within:border-amber-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-amber-500/20" 
                onSubmit={searchRecipes}
              >
                <span className="text-xl text-gray-400">⌕</span>
                <input
                  type="search"
                  placeholder="Try 'chicken', 'pasta', or 'curry'..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="w-full bg-transparent py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />
                <button 
                  type="submit"
                  className="shrink-0 rounded-full bg-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-amber-600"
                >
                  Search
                </button>
              </form>
            </section>

            <section className="px-4 py-6 md:px-8 md:py-10">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Browse by category
                  </p>
                  <h2 className="m-0 text-2xl font-bold tracking-tight text-gray-900">
                    Explore recipes
                  </h2>
                </div>
                <span className="pb-1 text-[11px] font-medium whitespace-nowrap text-gray-500">
                  {loading ? "Loading..." : `${recipes.length} recipes`}
                </span>
              </div>

             {/* Added native utility classes to hide the scrollbar while keeping it swipeable on mobile */}
              <div className="mb-8 flex flex-nowrap gap-2.5 overflow-x-auto pb-2 scrollbar-none md:flex-wrap [&::-webkit-scrollbar]:hidden">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all ${
                      category === item
                        ? "bg-gray-900 text-white shadow-md"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => chooseCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div aria-live="polite" aria-atomic="true">
                {loading && (
                  <div className="flex min-h-62.5 flex-col items-center justify-center gap-3 text-center text-sm font-medium text-gray-400">
                    <span className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-amber-500" />
                    Finding recipes...
                  </div>
                )}

                {!loading && error && (
                  <div className="flex min-h-62.5 flex-col items-center justify-center gap-3 text-center text-sm text-gray-500">
                    <p className="max-w-100 m-0 leading-relaxed">{error}</p>
                    <button
                      className="mt-2 rounded-full border border-gray-300 bg-white px-5 py-2 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
                      onClick={() => fetchRecipes(`/search.php?s=chicken`)}
                    >
                      Try again
                    </button>
                  </div>
                )}

                {!loading && !error && recipes.length === 0 && (
                  <div className="flex min-h-62.5 flex-col items-center justify-center gap-2 text-center">
                    <h2 className="m-0 text-xl font-bold text-gray-900">No recipes found</h2>
                    <p className="max-w-100 m-0 text-sm text-gray-500 leading-relaxed">
                      We couldn't find anything matching your search. Try another ingredient or select a different category.
                    </p>
                  </div>
                )}
              </div>

              {!loading && !error && recipes.length > 0 && (
                <RecipeGrid
                  recipes={recipes}
                  favorites={favorites}
                  onOpen={(r) => setSelectedRecipe({ ...r, loadingDetails: true })}
                  onFavorite={toggleFavorite}
                />
              )}
            </section>
          </>
        )}

        {view === "favorites" && (
          <section className="flex flex-col px-4 py-8 md:px-8 md:py-12">
            <div className="mb-8 border-b border-gray-200 pb-6">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                Your saved collection
              </p>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h1 className="m-0 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                    Your favorites
                  </h1>
                  <p className="mt-2 m-0 text-sm text-gray-500">
                    The recipes you want to come back to and cook later.
                  </p>
                </div>
                <span className="pb-1 text-[11px] font-medium whitespace-nowrap text-gray-500">
                  {favorites.length} saved
                </span>
              </div>
            </div>

            <div aria-live="polite" className="flex grow flex-col justify-center min-h-[40vh]">
              {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-amber-50 text-amber-500">
                    <span className="text-4xl mt-1">♡</span>
                  </div>
                  <div>
                    <h2 className="m-0 text-xl font-bold text-gray-900">Your collection is empty</h2>
                    <p className="max-w-87.5 m-0 mx-auto mt-2 text-sm leading-relaxed text-gray-500">
                      Save recipes using the heart button on any dish and find them all gathered right here.
                    </p>
                  </div>
                  <button
                    className="mt-4 shrink-0 rounded-full bg-amber-500 px-6 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-amber-600"
                    onClick={() => setView("discover")}
                  >
                    Discover recipes
                  </button>
                </div>
              ) : (
                <RecipeGrid
                  recipes={favorites}
                  favorites={favorites}
                  onOpen={(r) => setSelectedRecipe({ ...r, loadingDetails: true })}
                  onFavorite={toggleFavorite}
                />
              )}
            </div>
          </section>
        )}

        {view === "about" && (
          <section className="flex flex-col px-4 py-8 md:px-8 md:py-12">
            <div className="mb-8 border-b border-gray-200 pb-6">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                A little about this project
              </p>
              <h1 className="m-0 text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                Made by a hungry developer.
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:max-w-200">
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-4">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-amber-50 text-2xl font-bold text-amber-500">
                    J
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">The Developer</p>
                    <h2 className="m-0 text-xl font-bold text-gray-900">Hi, I'm Jappy.</h2>
                  </div>
                </div>
                <p className="m-0 text-sm leading-relaxed text-gray-500">
                  A WMAD developer who is always hungry. I built CraveCook to make discovering recipes simple, practical, and enjoyable. This serves as a portfolio piece demonstrating modern frontend UI/UX and API integration.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-2 m-0 text-sm font-bold uppercase tracking-wider text-gray-900">The Project</h3>
                  <p className="m-0 text-sm leading-relaxed text-gray-500">
                    A responsive recipe finder. Search meals, explore categories, view ingredients and instructions, and reliably save favorite recipes to your local device.
                  </p>
                </article>

                <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-3 m-0 text-sm font-bold uppercase tracking-wider text-gray-900">Built With</h3>
                  <ul className="m-0 grid grid-cols-2 gap-3 p-0 list-none text-sm text-gray-500">
                    <li className="flex items-center gap-2"><span className="text-amber-500">▹</span> React & Vite</li>
                    <li className="flex items-center gap-2"><span className="text-amber-500">▹</span> Tailwind CSS v4</li>
                    <li className="flex items-center gap-2"><span className="text-amber-500">▹</span> TheMealDB API</li>
                    <li className="flex items-center gap-2"><span className="text-amber-500">▹</span> Custom Hooks</li>
                  </ul>
                </article>
              </div>
            </div>
          </section>
        )}

        <footer className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 bg-white px-4 py-6 text-xs font-medium text-gray-400 md:px-8">
          <span>© {new Date().getFullYear()} Crave and Cook. Built by Jappy.</span>
          <span>Recipe data provided by TheMealDB.</span>
        </footer>
      </main>

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onUpdateRecipe={setSelectedRecipe}
        />
      )}
    </div>
  );
}