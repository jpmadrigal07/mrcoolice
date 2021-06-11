const { GraphQLObjectType, GraphQLID, GraphQLString } = require('graphql');

const CustomerType = new GraphQLObjectType({
    name: "Customer",
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        deletedAt: { type: GraphQLString }
    })
});

module.exports = CustomerType;