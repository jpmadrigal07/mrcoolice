const { GraphQLObjectType, GraphQLString, GraphQLBoolean } = require('graphql');

const VerifyTokenType = new GraphQLObjectType({
    name: "VerifyToken",
    fields: () => ({
        token: { type: GraphQLString },
        isVerified: { type: GraphQLBoolean }
    })
});

module.exports = VerifyTokenType;