// connect mongoose to DB

/*eslint-disable no-undef*/
const mongoose = require('mongoose')

let connectionString = process.env.MONGODB;
console.log(connectionString);

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



mongoose.connection.once('open', ()=> {
    console.log("Connected to DB");
})