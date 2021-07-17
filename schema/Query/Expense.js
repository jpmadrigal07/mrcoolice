const Expense = require("../../models/expense");
const ExpenseType = require("../typeDefs/Expense");
const { GraphQLID, GraphQLList, GraphQLString } = require("graphql");

module.exports.getAllExpense = {
  type: GraphQLList(ExpenseType),
  resolve: () => {
    return Expense.find();
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
