const ExpenseType = require("../typeDefs/Expense");
const Expense = require("../../models/expense");
const {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = require("graphql");

module.exports.createExpense = {
  type: ExpenseType,
  args: {
    userId: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    vendor: { type: GraphQLNonNull(GraphQLString)},
    cost: { type: GraphQLNonNull(GraphQLInt) },
  },
  resolve: (parent, args) => {
    const expense = Expense(args);
    return expense.save({
      userId: args.userId,
      name: args.name,
      customerId: args.customerId,
      cost: args.cost,
    });
  },
};

module.exports.updateExpense = {
  type: ExpenseType,
  args: {
    _id: { type: GraphQLID },
    userId: { type: GraphQLID },
    name: { type: GraphQLString },
    vendor: { type: GraphQLString},
    cost: { type: GraphQLInt },
  },
  resolve: (parent, args) => {
    const toUpdate = {};
    args.userId ? (toUpdate.userId = args.userId) : null;
    args.name ? (toUpdate.name = args.name) : null;
    args.vendor ? (toUpdate.vendor = args.vendor) : null;
    args.cost ? (toUpdate.cost = args.cost) : null;
    return Expense.findByIdAndUpdate({ _id: args._id }, { $set: toUpdate });
  },
};

module.exports.deleteExpense = {
  type: ExpenseType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    const expense = Expense(args);
    return expense.delete({ _id: args._id });
  },
};
