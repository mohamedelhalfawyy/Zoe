const mongoose = require('mongoose');
const config = require('config');

module.exports = async function () {
    const db = config.get('db');

    mongoose.set("strictQuery", false);
    await mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => console.log('Connected to MongoDB...'));
}
