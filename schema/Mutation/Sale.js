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
    productId: { type: GraphQLNonNull(GraphQLID) },
    receiptNumber: { type: GraphQLNonNull(GraphQLInt) },
    birNumber: { type: GraphQLInt },
  },
  resolve: (parent, args) => {
    const sale = Sale(args);
    return sale.save({
      userId: args.userId,
      customerId: args.customerId,
      productId: args.productId,
      receiptNumber: args.receiptNumber,
      birNumber: args.birNumber,
    });
  },
};

module.exports.updateSale = {
  type: SaleType,
  args: {
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    customerId: { type: GraphQLID },
    productId: { type: GraphQLID },
    receiptNumber: { type: GraphQLInt },
    birNumber: { type: GraphQLInt },
  },
  resolve: (parent, args) => {
    const toUpdate = {};
    args.userId ? (toUpdate.userId = args.userId) : null;
    args.customerId ? (toUpdate.customerId = args.customerId) : null;
    args.productId ? (toUpdate.productId = args.productId) : null;
    args.receiptNumber ? (toUpdate.receiptNumber = args.receiptNumber) : null;
    args.birNumber ? (toUpdate.birNumber = args.birNumber) : null;
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
