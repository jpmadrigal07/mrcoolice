const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");
const UserType = require("./User");
const CustomerType = require("./Customer");
const ProductType = require("./Product");
const User = require("../../models/user");
const Customer = require("../../models/customer");
const Product = require("../../models/product");

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
    productId: {
      type: ProductType,
      resolve: async (sale) => {
        return await Product.findOne({ _id: sale.productId });
      },
    },
    birNumber: { type: GraphQLInt },
    drNumber: { type: GraphQLInt },
    location: { type: GraphQLString },
    vehicleType: { type: GraphQLString },
    discountGiven: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    deletedAt: { type: GraphQLString },
  }),
});

module.exports = SaleType;
