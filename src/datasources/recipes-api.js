const recipesData = require("./recipes.json"); // from Airtable, exported as JSON using their API
const ingredientsData = require("./ingredients.json"); // from Airtable, exported as JSON using their API
const utils = require("./recipe-utils");

class RecipesAPI {
  // Returns a random Recipe object from the full list of recipes
  getRandomRecipe() {
    const randomEntry = Math.floor(Math.random() * recipesData.length);
    return utils.formattedRecipe(recipesData[randomEntry]);
  }

  // Returns all of the Recipe objects from the full list of recipes
  getAllRecipes() {
    return recipesData.map((r) => utils.formattedRecipe(r));
  }

  // Returns a Recipe object based on an id (Airtable-generated ID)
  getRecipe(recipeId) {
    const recipe = recipesData.find((r) => r.id === recipeId);
    if (!recipe) {
      throw new Error("Could not find recipe");
    }
    return utils.formattedRecipe(recipe);
  }

  // Returns a list of Recipe objects (length decided by limit) that were most recently added
  // author's note: we're making this slow/unoptimized intentionally, for tutorial purposes :)
  async getRecentlyAddedRecipes(limit = 3) {
    const copiedData = [...recipesData];
    const sorted = copiedData.sort((a, b) => {
      return new Date(b.createdTime) - new Date(a.createdTime);
    });
    const mostRecent = sorted.slice(0, limit);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return mostRecent.map((r) => utils.formattedRecipe(r));
  }

  // Returns a list of Ingredient objects based on the recipe ID (Airtable-generated)
  getRecipeIngredients(recipeId) {
    const recipe = recipesData.find((r) => r.id === recipeId);

    if (!recipe) {
      throw new Error("Could not find recipe");
    }

    const ingredientsForRecipe = recipe.fields.ingredients.map(
      (ingredient, index) => {
        const ingredientId = recipe.fields.ingredientsIdList[index];
        const ingredientName =
          ingredientsData.find((i) => i.id == ingredientId)?.fields?.name ||
          null;

        // need to match the field names in the schema
        return {
          id: ingredientId,
          text: ingredient,
          name: ingredientName,
        };
      }
    );
    return ingredientsForRecipe;
  }

  // Returns a list of Recipe objects that are related to the given recipeId
  // author's note: we're making this slow/unoptimized intentionally, for tutorial purposes :)
  async getRelatedRecipes(recipeId, limit = 3) {
    const recipe = recipesData.find((r) => r.id === recipeId);
    if (!recipe) {
      throw new Error("Could not find recipe");
    }

    // algorithm to find related recipes: for each ingredient in the recipe, find recipes that use that ingredient
    const recipeIngredientIds = recipe.fields.ingredientsIdList;

    var relatedRecipeIds = [];

    // look through each ingredient in the recipe's
    for (var i = 0; i < recipeIngredientIds.length; i++) {
      // find it in the "db"
      const ingredient = ingredientsData.find(
        (ing) => ing.id === recipeIngredientIds[i]
      );

      if (ingredient) {
        // look through its recipes
        if (ingredient.fields.recipes) {
          const recipeIdsWithIngredient = ingredient.fields.recipes;
          relatedRecipeIds = [...relatedRecipeIds, ...recipeIdsWithIngredient];
        }

        // use the ingredient name to find other recipes
        const ingredientsWithSameName = ingredientsData.filter(
          (ing) => ingredient.fields.name === ing.fields.name
        );
        const recipesWithSameIngredientName = ingredientsWithSameName
          .map((ing) => ing.fields.recipes)
          .flat();
        relatedRecipeIds = [
          ...relatedRecipeIds,
          ...recipesWithSameIngredientName,
        ];
      }
    }

    // get unique ids, cut to the limit and remove ids matching the same recipe we're already looking at
    const recipeIds = [...new Set(relatedRecipeIds.splice(0, limit))].filter(
      (rId) => rId !== recipeId
    );

    // get the actual recipe objects
    const relatedRecipes = [];
    for (var i = 0; i < recipeIds.length; i++) {
      const related = recipesData.find((r) => r.id === recipeIds[i]);
      relatedRecipes.push(related);
    }

    // add arbitrary slowness for tutorial purposes
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return relatedRecipes.map((r) => utils.formattedRecipe(r));
  }

  // Returns a list of Strings - the names of the cookware the recipe uses
  getRecipeCookware(recipeId) {
    const recipe = recipesData.find((r) => r.id === recipeId);
    if (!recipe) {
      throw new Error("Could not find recipe");
    }
    return recipe.fields.equipment;
  }
}

module.exports = RecipesAPI;
