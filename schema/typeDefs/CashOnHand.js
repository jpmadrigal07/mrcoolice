const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } = require("graphql");
const UserType = require("./User");
const User = require("../../models/user");

const CashOnHandType = new GraphQLObjectType({
  name: "CashOnHand",
  fields: () => ({
    _id: { type: GraphQLID },
    userId: {
      type: UserType,
      resolve: async (user) => {
        return await User.findOne({ _id: user.userId });
      },
    },
    amount: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
  }),
});

module.exports = CashOnHandType;
