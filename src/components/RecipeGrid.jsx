import RecipeCard from "./RecipeCard";

export default function RecipeGrid({ recipes, favorites, onOpen, onFavorite }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-2 lg:grid-cols-3 lg:gap-4">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.idMeal}
          recipe={recipe}
          favorites={favorites}
          onOpen={onOpen}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
}