import { useState, useCallback } from "react";

const API = "https://www.themealdb.com/api/json/v1/1";

export function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecipes = useCallback(async (endpoint) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}${endpoint}`);
      if (!response.ok) throw new Error("Request failed");

      const data = await response.json();
      setRecipes(data.meals || []);
    } catch {
      setError("Couldn't load recipes. Check your connection and try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { recipes, loading, error, fetchRecipes };
}