
/*eslint-disable no-undef*/

const mongoose = require('mongoose')

// Schema
const userSchema = new mongoose.Schema({
    userName: {type: String,required: [true, "userName is required"],unique: true},
    email: {type: String,required: true,unique: true},
    password: {type: String,required: true}
    
},
{
    timestamps: true
}

)

// create Model with that schema

const User = mongoose.model("User", userSchema)


module.exports = User;
// export default User;