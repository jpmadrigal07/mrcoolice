const Product = require("../../models/product");
const ProductType = require("../typeDefs/Product");
const { GraphQLID, GraphQLList } = require("graphql");

module.exports.getAllProduct = {
  type: GraphQLList(ProductType),
  resolve: () => {
    return Product.find();
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
