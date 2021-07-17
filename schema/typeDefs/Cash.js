const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt } = require("graphql");
const UserType = require("./User");
const User = require("../../models/user");

const CashType = new GraphQLObjectType({
  name: "Cash",
  fields: () => ({
    _id: { type: GraphQLID },
    userId: {
      type: UserType,
      resolve: async (expense) => {
        return await User.findOne({ _id: expense.userId });
      },
    },
    onePeso: { type: GraphQLInt },
    fivePeso: { type: GraphQLInt },
    tenPeso: { type: GraphQLInt },
    twentyPeso: { type: GraphQLInt },
    fiftyPeso: { type: GraphQLInt },
    oneHundredPeso: { type: GraphQLInt },
    twoHundredPeso: { type: GraphQLInt },
    fiveHundredPeso: { type: GraphQLInt },
    oneThousandPeso: { type: GraphQLInt },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
  }),
});

module.exports = CashType;
