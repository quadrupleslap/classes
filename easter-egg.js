//TODO: Base-64 thanks.
//TODO: Also, I think we need a way to hide the Node Unblocker dependency lol.
module.exports = function (app) {
    var Unblocker = require('unblocker');
    app.use(new Unblocker({
        prefix: '/data/'
    }));
}