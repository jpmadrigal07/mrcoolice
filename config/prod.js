// production keys
module.exports = {
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY,
  sessionKey: process.env.SECRET_KEY,
  redirectDomain: process.env.REDIRECT_DOMAIN,
};
