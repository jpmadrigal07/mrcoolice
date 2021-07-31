const CreditType = require("../typeDefs/Credit");
const Credit = require("../../models/credit");
const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");

module.exports.createCredit = {
  type: CreditType,
  args: {
    userId: { type: GraphQLNonNull(GraphQLID) },
    customerId: { type: GraphQLNonNull(GraphQLID) },
    amount: { type: GraphQLInt },
    isIn: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
  },
  resolve: (parent, args) => {
    const customer = Credit(args);
    return customer.save({
      userId: args.userId,
      customerId: args.customerId,
      amount: args.amount,
      isIn: args.isIn,
      createdAt: args.createdAt,
    });
  },
};

module.exports.updateCredit = {
  type: CreditType,
  args: {
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    customerId: { type: GraphQLID },
    amount: { type: GraphQLInt },
    isIn: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
  },
  resolve: (parent, args) => {
    const toUpdate = {};
    args.userId ? (toUpdate.userId = args.userId) : null;
    args.customerId ? (toUpdate.customerId = args.customerId) : null;
    args.amount ? (toUpdate.amount = args.amount) : null;
    typeof args.isIn !== 'null' || typeof args.isIn !== 'undefined' ? (toUpdate.isIn = args.isIn) : null;
    args.createdAt ? (toUpdate.createdAt = args.createdAt) : null;
    return Credit.findByIdAndUpdate({ _id: args._id }, { $set: toUpdate });
  },
};

module.exports.deleteCredit = {
  type: CreditType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    const college = Credit(args);
    return college.delete({ _id: args._id });
  },
};
