const app = require('./app')
const mongoose = require('mongoose');

const { dbConnection, db, options } = require('./utils/database-utils');

mongoose.connect(db, options, (err) => dbConnection(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));