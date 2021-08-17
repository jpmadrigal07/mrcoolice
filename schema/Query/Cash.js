const Cash = require("../../models/cash");
const CashType = require("../typeDefs/Cash");
const { GraphQLID, GraphQLList, GraphQLString, GraphQLInt } = require("graphql");

module.exports.getAllCash = {
  type: GraphQLList(CashType),
  args: {
    first: { type: GraphQLInt },
    after: { type: GraphQLInt },
  },
  resolve: (parent, { first, after }) => {
    const skip = after ? after : null;
    const limit = first ? first : null;
    return Cash.find().skip( skip ).limit( limit );
  },
};

module.exports.getAllCashByUser = {
  type: GraphQLList(CashType),
  args: {
    userId: { type: GraphQLString },
  },
  resolve: (parent, { userId }) => {
    return Cash.find({ userId });
  },
};

module.exports.getCash = {
  type: CashType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    return Cash.findById(args._id).exec();
  },
};
