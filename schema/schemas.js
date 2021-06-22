// Pacakages
const { GraphQLSchema, GraphQLObjectType } = require("graphql");

// Query Functions
const { getAllUser, getUser } = require("./Query/User");
const { getAllSale, getSale, getAllSaleByReceiptNumber } = require("./Query/Sale");
const { getAllCustomer, getCustomer } = require("./Query/Customer");
const { getAllExpense, getExpense } = require("./Query/Expense");
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
    sales: getAllSale,
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
    createCustomer,
    updateCustomer,
    deleteCustomer,
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
