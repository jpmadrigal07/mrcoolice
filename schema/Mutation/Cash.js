const CashType = require("../typeDefs/Cash");
const Cash = require("../../models/cash");
const { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLInt } = require("graphql");

module.exports.createCash = {
  type: CashType,
  args: {
    userId: { type: GraphQLNonNull(GraphQLID) },
    onePeso: { type: GraphQLInt },
    fivePeso: { type: GraphQLInt },
    tenPeso: { type: GraphQLInt },
    twentyPeso: { type: GraphQLInt },
    fiftyPeso: { type: GraphQLInt },
    oneHundredPeso: { type: GraphQLInt },
    twoHundredPeso: { type: GraphQLInt },
    fiveHundredPeso: { type: GraphQLInt },
    oneThousandPeso: { type: GraphQLInt },
    createdAt: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (parent, args) => {
    const customer = Cash(args);
    return customer.save({
      userId: args.userId,
      onePeso: args.onePeso,
      fivePeso: args.fivePeso,
      tenPeso: args.tenPeso,
      twentyPeso: args.twentyPeso,
      fiftyPeso: args.fiftyPeso,
      oneHundredPeso: args.oneHundredPeso,
      twoHundredPeso: args.twoHundredPeso,
      fiveHundredPeso: args.fiveHundredPeso,
      oneThousandPeso: args.oneThousandPeso,
      createdAt: args.createdAt,
    });
  },
};

module.exports.updateCash = {
  type: CashType,
  args: {
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    onePeso: { type: GraphQLInt },
    fivePeso: { type: GraphQLInt },
    tenPeso: { type: GraphQLInt },
    twentyPeso: { type: GraphQLInt },
    fiftyPeso: { type: GraphQLInt },
    oneHundredPeso: { type: GraphQLInt },
    twoHundredPeso: { type: GraphQLInt },
    fiveHundredPeso: { type: GraphQLInt },
    oneThousandPeso: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
  },
  resolve: (parent, args) => {
    const toUpdate = {};
    args.userId ? (toUpdate.userId = args.userId) : null;
    args.onePeso ? (toUpdate.onePeso = args.onePeso) : null;
    args.fivePeso ? (toUpdate.fivePeso = args.fivePeso) : null;
    args.tenPeso ? (toUpdate.tenPeso = args.tenPeso) : null;
    args.twentyPeso ? (toUpdate.twentyPeso = args.twentyPeso) : null;
    args.fiftyPeso ? (toUpdate.fiftyPeso = args.fiftyPeso) : null;
    args.oneHundredPeso ? (toUpdate.oneHundredPeso = args.oneHundredPeso) : null;
    args.twoHundredPeso ? (toUpdate.twoHundredPeso = args.twoHundredPeso) : null;
    args.fiveHundredPeso ? (toUpdate.fiveHundredPeso = args.fiveHundredPeso) : null;
    args.oneThousandPeso ? (toUpdate.oneThousandPeso = args.oneThousandPeso) : null;
    args.createdAt ? (toUpdate.createdAt = args.createdAt) : null;
    return Cash.findByIdAndUpdate({ _id: args._id }, { $set: toUpdate });
  },
};

module.exports.deleteCash = {
  type: CashType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    const college = Cash(args);
    return college.delete({ _id: args._id });
  },
};
