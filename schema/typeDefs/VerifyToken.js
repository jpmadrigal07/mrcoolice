const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID } = require('graphql');

const VerifyTokenType = new GraphQLObjectType({
    name: "VerifyToken",
    fields: () => ({
        token: { type: GraphQLString },
        isVerified: { type: GraphQLBoolean },
        userId: { type: GraphQLID }
    })
});

module.exports = VerifyTokenType;