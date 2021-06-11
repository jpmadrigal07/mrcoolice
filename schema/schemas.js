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

// Mutation Functions
const { login, verifyAuth } = require('./Mutation/Auth');
const { login, verifyAuth } = require('./Mutation/Auth');
const { login, verifyAuth } = require('./Mutation/Auth');
const { login, verifyAuth } = require('./Mutation/Auth');
const { login, verifyAuth } = require('./Mutation/Auth');

const Query = new GraphQLObjectType({
    name: "Query",
    fields: {
        Users: getAllUser,
        User: getUser,
        Customers: getAllCustomer,
        Customer: getCustomer,
        Expenses: getAllExpense,
        Expense: getExpense,
        Sales: getAllSale,
        Sale: getSale
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        login,
        verifyAuth
    }
});


module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
});