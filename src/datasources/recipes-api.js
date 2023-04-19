const recipesData = require("./recipes.json"); // from Airtable, exported as JSON using their API
const ingredientsData = require("./ingredients.json"); // from Airtable, exported as JSON using their API
const utils = require("./recipe-utils");

class RecipesAPI {
  getRandomRecipe() {
    const randomEntry = Math.floor(Math.random() * recipesData.length);
    return utils.formattedRecipe(recipesData[randomEntry]);
  }

  getAllRecipes() {
    return recipesData.map((r) => utils.formattedRecipe(r));
  }

  getRecipe(recipeId) {
    const recipe = recipesData.find((r) => r.id === recipeId);
    if (!recipe) {
      throw new Error("Could not find recipe");
    }
    return utils.formattedRecipe(recipe);
  }

  // author's note: we're making this slow/unoptimized intentionally, for tutorial purposes :)
  getRecentlyAddedRecipes(limit = 3) {
    const copiedData = [...recipesData];
    const sorted = copiedData.sort((a, b) => {
      return new Date(b.createdTime) - new Date(a.createdTime);
    });
    const mostRecent = sorted.slice(0, limit);
    return mostRecent.map((r) => utils.formattedRecipe(r));
  }

  getRecipeIngredients(recipeId) {
    const recipe = recipesData.find((r) => r.id === recipeId);

    if (!recipe) {
      throw new Error("Could not find recipe");
    }

    const ingredientsForRecipe = recipe.fields.ingredients.map(
      (ingredient, index) => {
        const ingredientId = recipe.fields.ingredientsIdList[index];
        return {
          id: ingredientId,
          fullText: ingredient,
        };
      }
    );
    return ingredientsForRecipe;
  }

  // author's note: we're making this slow/unoptimized intentionally, for tutorial purposes :)
  getRelatedRecipes(recipeId, limit) {
    const recipe = recipesData.find((r) => r.id === recipeId);
    if (!recipe) {
      throw new Error("Could not find recipe");
    }
    // algorithm to find related recipes: for each ingredient in the recipe, find recipes that use that ingredient
    const recipeIngredientIds = recipe.fields.ingredientsIdList;

    var relatedRecipeIds = [];
    for (var i = 0; i < recipeIngredientIds.length; i++) {
      const ingredient = ingredientsData.find(
        (ing) => ing.id === recipeIngredientIds[i]
      );
      if (ingredient) {
        if (ingredient.fields.recipes) {
          const recipeIdsWithIngredient = ingredient.fields.recipes;
          relatedRecipeIds = [...relatedRecipeIds, ...recipeIdsWithIngredient];
        }
      }
    }

    // get unique ids, cut to the limit and remove ids matching the same recipe we're already looking at
    const recipeIds = [...new Set(relatedRecipeIds.splice(0, limit))].filter(
      (rId) => rId !== recipeId
    );

    const relatedRecipes = [];
    for (var i = 0; i < recipeIds.length; i++) {
      const related = recipesData.find((r) => r.id === recipeIds[i]);
      relatedRecipes.push(related);
    }

    return relatedRecipes.map((r) => utils.formattedRecipe(r));
  }
}

module.exports = RecipesAPI;
