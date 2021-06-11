const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } = require('graphql');
const UserType = require('./User');
const User = require('../../models/user');

const ExpenseType = new GraphQLObjectType({
    name: "Expense",
    fields: () => ({
        _id: { type: GraphQLID },
        userId: {
            type: UserType,
            resolve: async (expense) => {
                return await User.findOne({_id: expense.userId});
            }
        },
        name: { type: GraphQLString },
        cost: { type: GraphQLInt },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        deletedAt: { type: GraphQLString }
    })
});

module.exports = ExpenseType;