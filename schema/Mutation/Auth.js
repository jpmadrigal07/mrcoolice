const { GraphQLString } = require('graphql');
const jsonwebtoken = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../models/user');
const AuthType = require('../typeDefs/Auth');

module.exports.login = {
    type: AuthType,
    args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    resolve: async (parent, args) => {
        const { username, password } = User(args)
        try {
            const user = await User.findOne({ username })
            if (!user) {
              throw new Error('No user with that username')
            }
            const isValid = await password === user.password;
            if (!isValid) {
              throw new Error('Incorrect password')
            }
            // return jwt
            const token = jsonwebtoken.sign(
              { id: user.id, username: user.username, role: user.userType},
              keys.cookieKey,
              { expiresIn: '1d'}
            )
            return { token, user }
        } catch (error) {
          throw new Error(error.message)
        }
    }
}

module.exports.verifyAuth = {
    type: AuthType,
    args: {
        token: { type: GraphQLString }
    },
    resolve: async (parent, args) => {
        try {
            // Check if token is defined
            const { token } = args
            if(token) {
                throw new Error('Token is invalid')
            }
            // Verify the token
            const { username, exp } = jwt.verify(token, keys.cookieKey);
            // Check if username exist in db
            const user = await User.findOne({ username })
            if (!user) {
              throw new Error('No user with that username')
            }
            // Check if token is not expired
            const elapsedTimeInSeconds = Math.floor(parseInt(exp) - Date.now() / 1000);
            const elapsedSeconds = elapsedTimeInSeconds % 60;
            if (Math.sign(elapsedSeconds) === -1) {
              throw new Error('Token is expired')
            }
            // Return isVerified true if all 3 condition passed
            return { isVerified: true }
        } catch (error) {
          throw new Error(error.message)
        }
    }
}