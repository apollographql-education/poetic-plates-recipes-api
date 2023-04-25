# Recipes API

A GraphQL API for recipes.

The API is hosted at: https://poetic-plates-recipes-api.herokuapp.com/

You can use the Sandbox Explorer to run queries. Head to https://studio.apollographql.com/sandbox and connect to the API `https://poetic-plates-recipes-api.herokuapp.com/`.

To learn how to use this API to get started with GraphOS, check out our [Odyssey course](https://apollographql.com/tutorials/getting-started-with-graphos).

## Deploying to Railway

You can deploy your own copy of this using Railway!

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/w76a0i)

## Running locally

1. Clone the repo.
1. Run the following:

```shell
npm install
npm run dev
```

1. Open up `http://localhost:4001` to access [Apollo Sandbox](https://www.apollographql.com/docs/graphos/explorer/sandbox).

1. Run a few test queries:

```graphql
query GetRandomRecipe {
  randomRecipe {
    id
    name
    cookingTime
    prepTime
    servings
    instructions
    readyTime
    ingredients {
      text
    }
  }
}
```

```graphql
query GetRecipePage {
  recipe(id: "recOZrH0RhjSjATBp") {
    id
    name
    cookingTime
    prepTime
    readyTime
    servings
    instructions
    ingredients {
      text
    }
  }
  recentlyAddedRecipes {
    name
    cookingTime
    servings
  }
}
```

## Getting Help

For any issues or problems concerning the course content, please refer to the [Odyssey topic in our community forums](https://community.apollographql.com/tags/c/help/6/odyssey).
