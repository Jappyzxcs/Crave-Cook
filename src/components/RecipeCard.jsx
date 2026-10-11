export default function RecipeCard({ recipe, favorites, onOpen, onFavorite }) {
  const saved = favorites.some((item) => item.idMeal === recipe.idMeal);

  return (
    <article className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
      {/* Floating Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavorite(recipe);
        }}
        className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform hover:scale-110 active:scale-95 ${
          saved 
            ? "bg-white text-rose-500 shadow-md" 
            : "bg-black/20 text-white hover:bg-white hover:text-rose-500"
        }`}
        aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      >
        <span className="text-lg leading-none mt-0.5">{saved ? "♥" : "♡"}</span>
      </button>

      {/* Image with Gradient Overlay */}
      <div 
        className="relative h-48 w-full overflow-hidden bg-gray-100"
        onClick={() => onOpen(recipe)}
      >
        <div className="absolute inset-0 z-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 z-10 translate-y-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          View Recipe
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4" onClick={() => onOpen(recipe)}>
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
            {recipe.strCategory || "Recipe"}
          </span>
          <span className="text-[10px] font-medium text-gray-400">
            {recipe.strArea || "World"}
          </span>
        </div>
        <h3 className="line-clamp-2 text-sm font-bold leading-tight text-gray-900 md:text-base">
          {recipe.strMeal}
        </h3>
      </div>
    </article>
  );
}