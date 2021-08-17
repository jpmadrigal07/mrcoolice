const Sales = require("../../models/sale");
const Customer = require("../../models/customer");
const SalesType = require("../typeDefs/Sale");
const { GraphQLID, GraphQLList, GraphQLInt, GraphQLString, GraphQLNonNull } = require("graphql");

module.exports.getAllSale = {
  type: GraphQLList(SalesType),
  args: {
    first: { type: GraphQLInt },
    after: { type: GraphQLInt },
  },
  resolve: (parent, { first, after }) => {
    const skip = after ? after : null;
    const limit = first ? first : null;
    return Sales.find().sort({ createdAt: -1 }).skip( skip ).limit( limit );
  },
};

module.exports.getAllSaleSearch = {
  type: GraphQLList(SalesType),
  args: {
    searchPhrase: { type: GraphQLNonNull(GraphQLString) },
    first: { type: GraphQLInt },
    after: { type: GraphQLInt },
  },
  resolve: (parent, { searchPhrase, first, after }) => {
    return Customer.find({description: {$regex: searchPhrase}}).sort({ createdAt: -1 }).exec().then(res => {
      const skip = after ? after : null;
      const limit = first ? first : null;
      const descNumber = res.map(res => res._id);
      return Sales.find({customerId: {$in: descNumber}}).sort({ createdAt: -1 }).skip( skip ).limit( limit );
    });
  },
};

module.exports.getSaleCount = {
  type: GraphQLInt,
  resolve: (parent) => {
    return Sales.countDocuments();
  },
};

module.exports.getSaleSearchCount = {
  type: GraphQLInt,
  args: {
    searchPhrase: { type: GraphQLNonNull(GraphQLString) },
  },
  resolve: (parent, { searchPhrase }) => {
    return Customer.find({description: {$regex: searchPhrase}}).sort({ createdAt: -1 }).exec().then(res => {
      const descNumber = res.map(res => res._id);
      return Sales.find({customerId: {$in: descNumber}}).countDocuments();
    });
  },
};

module.exports.getLastSale = {
  type: GraphQLList(SalesType),
  resolve: (parent) => {
    return Sales.find().sort( { createdAt : -1 } ).limit(1);
  },
};

module.exports.getAllSaleByUser = {
  type: GraphQLList(SalesType),
  args: {
    userId: { type: GraphQLString },
  },
  resolve: (parent, { userId }) => {
    return Sales.find({ userId });
  },
};

module.exports.getAllSaleByReceiptNumber = {
  type: GraphQLList(SalesType),
  args: {
    receiptNumber: { type: GraphQLInt },
  },
  resolve: (parent, args) => {
    return Sales.find({ receiptNumber: args.receiptNumber });
  },
};

module.exports.getSale = {
  type: SalesType,
  args: {
    _id: { type: GraphQLID },
  },
  resolve: (parent, args) => {
    return Sales.findById(args._id).exec();
  },
};
