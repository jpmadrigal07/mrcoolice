const Expense = require("../../models/expense");
const ExpenseType = require("../typeDefs/Expense");
const { GraphQLID, GraphQLList, GraphQLString, GraphQLInt } = require("graphql");

module.exports.getAllExpense = {
  type: GraphQLList(ExpenseType),
  args: {
    first: { type: GraphQLInt },
    after: { type: GraphQLInt },
  },
  resolve: (parent, { first, after }) => {
    const skip = after ? after : null;
    const limit = first ? first : null;
    return Expense.find().skip( skip ).limit( limit );
  },
};

module.exports.getAllExpenseByUser = {
  type: GraphQLList(ExpenseType),
  args: {
    userId: { type: GraphQLString },
  },
  resolve: (parent, { userId }) => {
    return Expense.find({ userId });
  },
};

module.exports.getExpense = {
  type: ExpenseType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    return Expense.findById(args._id).exec();
  },
};
