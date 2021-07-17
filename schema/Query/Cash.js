const Cash = require("../../models/cash");
const CashType = require("../typeDefs/Cash");
const { GraphQLID, GraphQLList, GraphQLString } = require("graphql");

module.exports.getAllCash = {
  type: GraphQLList(CashType),
  resolve: () => {
    return Cash.find();
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
