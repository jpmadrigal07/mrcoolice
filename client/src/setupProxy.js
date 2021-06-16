const {createProxyMiddleware } = require('http-proxy-middleware');
 
module.exports = function(app) {
    app.use(createProxyMiddleware('/mrcoolice', { target: 'http://localhost:5000' }));
};