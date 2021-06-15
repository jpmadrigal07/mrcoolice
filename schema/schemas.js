// Pacakages
const {
    GraphQLSchema,
    GraphQLObjectType
} = require('graphql');

// Query Functions
const { getAllUser, getUser } = require('./Query/User');
const { getAllSale, getSale } = require('./Query/Sale');
const { getAllCustomer, getCustomer } = require('./Query/Customer');
const { getAllExpense, getExpense } = require('./Query/Expense');
const { verifyToken } = require('./Query/Authentication');

// Mutation Functions
const { login } = require('./Mutation/Authentication');
const { createExpense, updateExpense, deleteExpense } = require('./Mutation/Expense');
const { createCustomer, updateCustomer, deleteCustomer } = require('./Mutation/Customer');
const { createSale, updateSale, deleteSale } = require('./Mutation/Sale');
const { createUser, updateUser, deleteUser } = require('./Mutation/User');

const Query = new GraphQLObjectType({
    name: "Query",
    fields: {
        users: getAllUser, user: getUser,
        customers: getAllCustomer, customer: getCustomer,
        expenses: getAllExpense, expense: getExpense,
        sales: getAllSale, sale: getSale,
        verifyToken
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createExpense, updateExpense, deleteExpense,
        createCustomer, updateCustomer, deleteCustomer,
        createSale, updateSale, deleteSale,
        createUser, updateUser, deleteUser,
        login
    }
});

module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});