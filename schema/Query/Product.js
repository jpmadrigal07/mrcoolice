const Product = require("../../models/product");
const ProductType = require("../typeDefs/Product");
const { GraphQLID, GraphQLList, GraphQLInt } = require("graphql");

module.exports.getAllProduct = {
  type: GraphQLList(ProductType),
  args: {
    first: { type: GraphQLInt },
    after: { type: GraphQLInt },
  },
  resolve: (parent, { first, after }) => {
    const skip = after ? after : null;
    const limit = first ? first : null;
    return Product.find().skip( skip ).limit( limit );
  },
};

module.exports.getProduct = {
  type: ProductType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    return Product.findById(args._id).exec();
  },
};
