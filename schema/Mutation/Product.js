const ProductType = require("../typeDefs/Product");
const Product = require("../../models/product");
const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = require("graphql");

module.exports.createProduct = {
  type: ProductType,
  args: {
    weight: { type: GraphQLNonNull(GraphQLInt) },
    scaleType: { type: GraphQLNonNull(GraphQLString) },
    cost: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: (parent, args) => {
    const product = Product(args);
    return product.save({
        weight: args.weight,
        scaleType: args.scaleType,
        cost: args.cost,
    });
  },
};

module.exports.updateProduct = {
  type: ProductType,
  args: {
    _id: { type: GraphQLID },
    weight: { type: GraphQLInt },
    scaleType: { type: GraphQLString },
    cost: { type: GraphQLInt },
  },
  resolve: (parent, args) => {
    const toUpdate = {};
    args.weight ? (toUpdate.weight = args.weight) : null;
    args.scaleType ? (toUpdate.scaleType = args.scaleType) : null;
    args.cost ? (toUpdate.cost = args.cost) : null;
    return Product.findByIdAndUpdate({ _id: args._id }, { $set: toUpdate });
  },
};

module.exports.deleteProduct = {
  type: ProductType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    const product = Product(args);
    return product.delete({ _id: args._id });
  },
};
