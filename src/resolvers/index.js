const { Query } = require("./Query");
const { Mutation } = require("./Mutation");
const { Recipe } = require("./Recipe");
const resolvers = {
  Query,
  Mutation,
  Recipe,
};

module.exports = resolvers;
