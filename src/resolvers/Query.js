module.exports = {
  Query: {
    randomRecipe(_, __, { dataSources }) {
      return dataSources.recipesAPI.getRandomRecipe();
    },
    allRecipes(_, __, { dataSources }) {
      return dataSources.recipesAPI.getAllRecipes();
    },
    recipe(_, { id }, { dataSources }) {
      try {
        const recipe = dataSources.recipesAPI.getRecipe(id);
        return recipe;
      } catch (e) {
        return new Error(e);
      }
    },
    recentlyAddedRecipes(_, __, { dataSources }) {
      return dataSources.recipesAPI.getRecentlyAddedRecipes();
    },
  },
};
