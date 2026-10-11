import { useEffect } from "react";

const API = "https://www.themealdb.com/api/json/v1/1";

export default function RecipeModal({ recipe, onClose, onUpdateRecipe }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    async function loadDetails() {
      if (!recipe.loadingDetails) return;
      try {
        const response = await fetch(
          `${API}/lookup.php?i=${encodeURIComponent(recipe.idMeal)}`
        );
        if (!response.ok) throw new Error("Request failed");
        const data = await response.json();
        onUpdateRecipe(data.meals?.[0] || recipe);
      } catch {
        onUpdateRecipe({ ...recipe, loadingDetails: false });
      }
    }
    loadDetails();
  }, [recipe, onUpdateRecipe]);

  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1;
    const name = recipe[`strIngredient${number}`]?.trim();
    const measure = recipe[`strMeasure${number}`]?.trim();
    return name ? { id: number, name, measure } : null;
  }).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6" onClick={onClose}>
      <section
        className="relative flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg font-bold text-gray-600 shadow-sm backdrop-blur transition-colors hover:bg-white hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          onClick={onClose}
          aria-label="Close recipe"
        >
          ×
        </button>

        {recipe.loadingDetails ? (
          <div className="flex min-h-100 flex-col items-center justify-center gap-3 text-sm font-medium text-gray-400">
             <span className="h-8 w-8 animate-spin rounded-full border-4 border-gray-100 border-t-amber-500" />
             Loading recipe details...
          </div>
        ) : (
          <>
            <div className="h-64 w-full shrink-0 sm:h-80">
              <img
                className="h-full w-full object-cover"
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-amber-500">
                {recipe.strArea || "International"} · {recipe.strCategory || "Recipe"}
              </p>
              <h2 id="modal-title" className="mb-6 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                {recipe.strMeal}
              </h2>

              <div className="mb-8">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Ingredients</h3>
                <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  {ingredients.map((item) => (
                    <li key={item.id} className="flex justify-between border-b border-gray-100 pb-2 text-sm">
                      <span className="text-gray-600">{item.name}</span>
                      <span className="font-medium text-gray-900">{item.measure}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-900">Cooking instructions</h3>
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                  {recipe.strInstructions || "No instructions available."}
                </p>
              </div>

              {recipe.strYoutube && (
                <a
                  className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100"
                  href={recipe.strYoutube}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch cooking video ↗
                </a>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}