const { GraphQLObjectType, GraphQLID, GraphQLString } = require("graphql");
const UserType = require("./User");
const User = require("../../models/user");

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    _id: { type: GraphQLID },
    type: { type: GraphQLString },
    userId: {
      type: UserType,
      resolve: async (expense) => {
        return await User.findOne({ _id: expense.userId });
      },
    },
    description: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
  }),
});

module.exports = CustomerType;
