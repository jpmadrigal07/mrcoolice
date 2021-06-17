const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');
 
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        _id: { type: GraphQLID },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        userType: { type: GraphQLString },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        deletedAt: { type: GraphQLString }
    })
});

module.exports = UserType;
