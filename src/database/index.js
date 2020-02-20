const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/noderest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
     });
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

module.exports = mongoose;