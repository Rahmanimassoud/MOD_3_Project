
const express = require('express');
const User = require('./models/user.model');
require('dotenv').config();
require('./config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const PORT = 3000

const app = express();


// START MIDDLEWARE====================
app.use(express.json());

// app.use(cors({
//     origin: '*'
// }));

// app.use(morgan('dev'))
// app.use(helmet());
// END MIDDLEWARE ===================

// ==================================ROUTES===================================

// USER ROUTES===========

app.post('/signUp', async (req, res)=> {
    const {userName, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({userName, email, password: hashedPassword});
    try{
        await newUser.save();
        res.status(201).send("User was created successfully")
    } catch (error) {
        res.status(500).send(error, "Error while creating the USer")
    }
})

// Sign In Route
app.post('/signIn', async (req, res) => {
    // use model to put user in collection
    // should get the email and pass in the req.body
    // 1. get the user with this email
    let dbUser = await User.findOne({email: req.body.email});
    // compare
    // 2. compare entered password with pass of this user
    if (!dbUser) return res.status(400).send("email or password incorrect");

    bcrypt.compare(req.body.password, dbUser.password, (err, isMatch) => { 
        if (isMatch) {
            // let the frontend know that the login was successful!
            // dont want password
            dbUser.password = "";
            // now just email and username
            const token = jwt.sign({id: dbUser._id}, process.env.TOKEN_SECRET, { expiresIn: "1h" });
            res.cookie('access_token', token, {httpOnly: true});
            const {password: pass, ...rest} = dbUser._doc
            res.status(200).send({token, dbUser});

            // log them in ( on frontend can do certain things, get info related to account, can do BACKEND stuff related to their account, permissions for CRUD functionality related to their account, allow only certain users to do certain things )
        } else {
            res.status(400).send("email or password incorrect")
        }
    })
})



app.listen(PORT, ()=> {
    console.log(`Server is up and running on port ${PORT}`);
});