module.exports = {
  Recipe: {
    ingredients(recipe, _, { dataSources }) {
      return dataSources.recipesAPI.getRecipeIngredients(recipe.id);
    },
    relatedRecipes(recipe, _, { dataSources }) {
      const limit = 3;
      return dataSources.recipesAPI.getRelatedRecipes(recipe.id, limit);
    },
    cookware(recipe, _, { dataSources }) {
      const cookwareNamesList = dataSources.recipesAPI.getRecipeCookware(
        recipe.id
      );
      if (!cookwareNamesList) return;

      return cookwareNamesList.map((c) => ({
        name: c,
      }));
    },
  },
};
