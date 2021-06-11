const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require('graphql');
const UserType = require('./User');

const Auth = new GraphQLObjectType({
    name: "AuthPayload",
    fields: () => ({
        token: { type: GraphQLString },
        user: { type: UserType },
        isVerified: { type: GraphQLBoolean }
    })
});

module.exports = Auth;