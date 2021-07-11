const SaleType = require("../typeDefs/Sale");
const Sale = require("../../models/sale");
const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
} = require("graphql");

module.exports.createSale = {
  type: SaleType,
  args: {
    userId: { type: GraphQLNonNull(GraphQLID) },
    customerId: { type: GraphQLNonNull(GraphQLID) },
    productId: { type: GraphQLNonNull(GraphQLID) },
    receiptNumber: { type: GraphQLNonNull(GraphQLInt) },
    birNumber: { type: GraphQLInt },
    drNumber: { type: GraphQLInt },
    location: { type: GraphQLString },
    vehicleType: { type: GraphQLString },
    discountGiven: { type: GraphQLBoolean },
  },
  resolve: (parent, args) => {
    if(args.location === "null") args.location = null
    if(args.vehicleType === "null") args.vehicleType = null
    const sale = Sale(args);
    return sale.save({
      userId: args.userId,
      customerId: args.customerId,
      productId: args.productId,
      receiptNumber: args.receiptNumber,
      birNumber: args.birNumber,
      drNumber: args.drNumber,
      location: args.location,
      vehicleType: args.vehicleType,
      discountGiven: args.discountGiven,
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
    drNumber: { type: GraphQLInt },
    location: { type: GraphQLString },
    vehicleType: { type: GraphQLString },
    discountGiven: { type: GraphQLBoolean },
  },
  resolve: (parent, args) => {
    const toUpdate = {};
    args.userId ? (toUpdate.userId = args.userId) : null;
    args.customerId ? (toUpdate.customerId = args.customerId) : null;
    args.productId ? (toUpdate.productId = args.productId) : null;
    args.receiptNumber ? (toUpdate.receiptNumber = args.receiptNumber) : null;
    args.birNumber ? (toUpdate.birNumber = args.birNumber) : null;
    args.location ? (toUpdate.drNumber = args.drNumber) : null;
    args.birNumber ? (toUpdate.location = args.location) : null;
    args.vehicleType ? (toUpdate.vehicleType = args.vehicleType) : null;
    args.discountGiven ? (toUpdate.discountGiven = args.discountGiven) : null;
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
