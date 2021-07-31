const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLInt, GraphQLBoolean } = require("graphql");
const CustomerType = require("./Customer");
const UserType = require("./User");
const Customer = require("../../models/customer");
const User = require("../../models/user");

const CreditType = new GraphQLObjectType({
  name: "Credit",
  fields: () => ({
    _id: { type: GraphQLID },
    userId: {
      type: UserType,
      resolve: async (user) => {
        return await User.findOne({ _id: user.userId });
      },
    },
    customerId: {
      type: CustomerType,
      resolve: async (customer) => {
        return await Customer.findOne({ _id: customer.customerId });
      },
    },
    amount: { type: GraphQLInt },
    isIn: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
  }),
});

module.exports = CreditType;
