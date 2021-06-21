const Sales = require("../../models/sale");
const SalesType = require("../typeDefs/Sale");
const { GraphQLID, GraphQLList, GraphQLInt } = require("graphql");

module.exports.getAllSale = {
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
