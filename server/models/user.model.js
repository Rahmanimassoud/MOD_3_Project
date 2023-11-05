
/*eslint-disable no-undef*/

const mongoose = require('mongoose')

// Schema
const userSchema = new mongoose.Schema({
    userName: {type: String,required: [true, "userName is required"],unique: true},
    email: {type: String,required: true,unique: true},
    password: {type: String,required: true},
    avatar: {
        type: String, default: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
    },
    
},
{
    timestamps: true
}

)

// create Model with that schema

const User = mongoose.model("User", userSchema)


module.exports = User;
// export default User;