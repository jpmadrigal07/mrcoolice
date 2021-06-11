const { GraphQLID, GraphQLString, GraphQLNonNull } = require('graphql');
const Sale = require('../../models/sale');

module.exports.createUser = {
    type: CollegeType,
    args: {
        collegeName: { type: GraphQLNonNull(GraphQLString) },
        collegeCode: { type: GraphQLNonNull(GraphQLString) }
    },
    resolve: (parent, args) => {
        const college = Colleges(args)
        return college.save({collegeName: args.collegeName, collegeCode: args.collegeCode})
    }
}

module.exports.updateUser = {
    type: CollegeType,
    args: {
        _id: { type: GraphQLID },
        collegeName: { type: GraphQLString },
        collegeCode: { type: GraphQLString }
    },
    resolve: (parent, args) => {
        return Colleges.findByIdAndUpdate({_id: args._id}, {collegeName: args.collegeName, collegeCode: args.collegeCode})
    }
}

module.exports.deleteUser = {
    type: CollegeType,
    args: {
        _id: { type: GraphQLID }
    },
    resolve: (parent, args) => {
        const college = Colleges(args)
        return college.delete({_id: args._id})
    }
}