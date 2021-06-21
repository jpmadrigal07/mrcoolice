const SaleType = require("../typeDefs/Sale");
const Sale = require("../../models/sale");
const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} = require("graphql");

module.exports.createSale = {
  type: SaleType,
  args: {
    userId: { type: GraphQLNonNull(GraphQLID) },
    customerId: { type: GraphQLNonNull(GraphQLID) },
    iceType: { type: GraphQLNonNull(GraphQLString) },
    weight: { type: GraphQLNonNull(GraphQLInt) },
    scaleType: { type: GraphQLNonNull(GraphQLString) },
    receiptNumber: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: (parent, args) => {
    const sale = Sale(args);
    return sale.save({
      userId: args.userId,
      customerId: args.customerId,
      iceType: args.iceType,
      weight: args.weight,
      scaleType: args.scaleType,
      receiptNumber: args.receiptNumber,
    });
  },
};

module.exports.updateSale = {
  type: SaleType,
  args: {
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    customerId: { type: GraphQLID },
    iceType: { type: GraphQLString },
    weight: { type: GraphQLInt },
    scaleType: { type: GraphQLString },
    receiptNumber: { type: GraphQLInt },
  },
  resolve: (parent, args) => {
    const toUpdate = {};
    args.userId ? (toUpdate.userId = args.userId) : null;
    args.customerId ? (toUpdate.customerId = args.customerId) : null;
    args.iceType ? (toUpdate.iceType = args.iceType) : null;
    args.weight ? (toUpdate.weight = args.weight) : null;
    args.scaleType ? (toUpdate.scaleType = args.scaleType) : null;
    args.receiptNumber ? (toUpdate.receiptNumber = args.receiptNumber) : null;
    return Sale.findByIdAndUpdate({ _id: args._id }, { $set: toUpdate });
  },
};

module.exports.deleteSale = {
  type: SaleType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    const sale = Sale(args);
    return sale.delete({ _id: args._id });
  },
};
