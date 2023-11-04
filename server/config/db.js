// connect mongoose to DB

/*eslint-disable no-undef*/
const mongoose = require('mongoose')

let connectionString = `mongodb+srv://Rahmani:${process.env.MONGODB}@mernmode3.zafhpkv.mongodb.net/mern?retryWrites=true&w=majority`
console.log(connectionString);

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});



mongoose.connection.once('open', ()=> {
    console.log("Connected to DB");
})