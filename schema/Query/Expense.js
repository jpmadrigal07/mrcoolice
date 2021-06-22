const Expense = require("../../models/expense");
const ExpenseType = require("../typeDefs/Expense");
const { GraphQLID, GraphQLList } = require("graphql");

module.exports.getAllExpense = {
  type: GraphQLList(ExpenseType),
  resolve: () => {
    return Expense.find();
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
