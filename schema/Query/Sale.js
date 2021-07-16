const Sales = require("../../models/sale");
const SalesType = require("../typeDefs/Sale");
const { GraphQLID, GraphQLList, GraphQLInt, GraphQLString } = require("graphql");

module.exports.getAllSale = {
  type: GraphQLList(SalesType),
  resolve: (parent) => {
    return Sales.find();
  },
};

module.exports.getAllSaleByUser = {
  type: GraphQLList(SalesType),
  args: {
    userId: { type: GraphQLString },
  },
  resolve: (parent, { userId }) => {
    return Sales.find({ userId });
  },
};

module.exports.getAllSaleByReceiptNumber = {
  type: GraphQLList(SalesType),
  args: {
    receiptNumber: { type: GraphQLInt },
  },
  resolve: (parent, args) => {
    return Sales.find({ receiptNumber: args.receiptNumber });
  },
};

module.exports.getSale = {
  type: SalesType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    return Sales.findById(args._id).exec();
  },
};
