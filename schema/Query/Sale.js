const Sales = require('../../models/sale');
const SalesType = require('../typeDefs/Sale');
const { GraphQLID, GraphQLList } = require('graphql')

module.exports.getAllSale = {
    type: GraphQLList(SalesType),
    resolve: () => {
        return Sales.find()
    }
};

module.exports.getSale = {
    type: SalesType,
    args: {
        _id: { type: GraphQLID }
    },
    resolve: (parent, args) => {
        return Sales.findById(args._id).exec()
    }
}