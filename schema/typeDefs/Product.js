const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
  } = require("graphql");
  
  const ProductType = new GraphQLObjectType({
    name: "Product",
    fields: () => ({
      _id: { type: GraphQLID },
      weight: { type: GraphQLInt },
      scaleType: { type: GraphQLString },
      cost: { type: GraphQLInt },
      createdAt: { type: GraphQLString },
      updatedAt: { type: GraphQLString },
      deletedAt: { type: GraphQLString },
    }),
  });
  
  module.exports = ProductType;
  