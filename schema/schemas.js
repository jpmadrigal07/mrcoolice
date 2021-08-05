// Pacakages
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

// Query Functions
const { getAllUser, getUser } = require("./Query/User");
const { getAllSale, getSale, getAllSaleByReceiptNumber, getAllSaleByUser } = require("./Query/Sale");
const { getAllCashOnHand, getCashOnHand, getAllCashOnHandByUser } = require("./Query/CashOnHand");
const { getAllCredit, getCredit, getAllCreditByCustomer } = require("./Query/Credit");
const { getAllCustomer, getCustomer } = require("./Query/Customer");
const { getAllExpense, getExpense, getAllExpenseByUser } = require("./Query/Expense");
const { getAllCash, getCash, getAllCashByUser } = require("./Query/Cash");
const { verifyToken } = require("./Query/Authentication");
const { updateCode } = require("./Query/UpdateCode");
const { getAllProduct, getProduct } = require("./Query/Product");

// Mutation Functions
const { login } = require("./Mutation/Authentication");
const {
  createExpense,
  updateExpense,
  deleteExpense,
} = require("./Mutation/Expense");
const {
  createCredit,
  updateCredit,
  deleteCredit,
} = require("./Mutation/Credit");
const {
  createCashOnHand,
  updateCashOnHand,
  deleteCashOnHand,
} = require("./Mutation/CashOnHand");
const {
  createCash,
  updateCash,
  deleteCash,
} = require("./Mutation/Cash");
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./Mutation/Product");
const {
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("./Mutation/Customer");
const { createSale, updateSale, deleteSale } = require("./Mutation/Sale");
const { createUser, updateUser, deleteUser } = require("./Mutation/User");

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    users: getAllUser,
    user: getUser,
    customers: getAllCustomer,
    customer: getCustomer,
    expenses: getAllExpense,
    expense: getExpense,
    expenseByUser: getAllExpenseByUser,
    cashes: getAllCash,
    cash: getCash,
    cashByUser: getAllCashByUser,
    credits: getAllCredit,
    credit: getCredit,
    creditByCustomer: getAllCreditByCustomer,
    cashOnHands: getAllCashOnHand,
    cashOnHand: getCashOnHand,
    cashOnHandByUser: getAllCashOnHandByUser,
    sales: getAllSale,
    salesByUser: getAllSaleByUser,
    salesByReceiptNumber: getAllSaleByReceiptNumber,
    sale: getSale,
    products: getAllProduct,
    product: getProduct,
    verifyToken,
    updateCode,
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createExpense,
    updateExpense,
    deleteExpense,
    createCash,
    updateCash,
    deleteCash,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    createCredit,
    updateCredit,
    deleteCredit,
    createCashOnHand,
    updateCashOnHand,
    deleteCashOnHand,
    createSale,
    updateSale,
    deleteSale,
    createUser,
    updateUser,
    deleteUser,
    createProduct,
    updateProduct,
    deleteProduct,
    login,
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
