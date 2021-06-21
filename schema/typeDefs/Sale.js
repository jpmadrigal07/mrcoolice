const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
} = require("graphql");
const UserType = require("./User");
const CustomerType = require("./Customer");
const User = require("../../models/user");
const Customer = require("../../models/customer");

const SaleType = new GraphQLObjectType({
  name: "Sale",
  fields: () => ({
    _id: { type: GraphQLID },
    userId: {
      type: UserType,
      resolve: async (sale) => {
        return await User.findOne({ _id: sale.userId });
      },
    },
    customerId: {
      type: CustomerType,
      resolve: async (sale) => {
        return await Customer.findOne({ _id: sale.customerId });
      },
    },
    receiptNumber: { type: GraphQLInt },
    iceType: { type: GraphQLString },
    weight: { type: GraphQLInt },
    scaleType: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
  }),
});

module.exports = SaleType;
