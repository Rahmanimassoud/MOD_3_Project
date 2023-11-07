
const express = require('express');
const User = require('./models/user.model');
require('dotenv').config();
require('./config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const verifyToken = require('./verifyUser');
const Listing = require('./models/listing.model');

const PORT = 3000
const app = express();


// START MIDDLEWARE====================
app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//     origin: '*'
// }));

// app.use(morgan('dev'))
// app.use(helmet());
// END MIDDLEWARE ===================

// ================================== USER ROUTES===================================
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

// sign out route

app.get("/signout", (req, res) => {

    try {
        res.clearCookie('access_token');
        res.status(200).send("User has been logged out")

    } catch(error) {
        console.log(error);
    }
})
// ==================================
// SignUp Route
app.post('/signUp', async (req, res)=> {
    const {userName, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({userName, email, password: hashedPassword});
    try{
        await newUser.save();
        res.status(201).send("User was created successfully")
    } catch (error) {
        res.status(500).json(error.message, "Error while creating the USer")
    }
})
// ===================================
// Google OAuth route
app.post("/google", async (req, res)=> {

    try{
        // find the user, using the email which is coming from req.body
        const user = await User.findOne({email: req.body.email})
        //if the user exist, authentecate the user, else create the user
        if(user) {
            const token = jwt.sign({id: user._id}, process.env.TOKEN_SECRET, { expiresIn: "1h" });
            const {password: pass, ...rest} = user._doc
            res.cookie('access_token', token, {httpOnly: true});
            res.status(200).send(rest);

        } else {
            // since the we dont get a password from google we need to create a random password, cuz in our model pasword is required to save the user in db
            const generatedPass = Math.random().toString(36).slice(-8);  //36 mean 1to9 and a toz, -8 means the last 8 digits and if want to make a 16 digit password you can do like thie ====Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)===
            const hashedPassword = bcrypt.hashSync(generatedPass, 10) //after generating the password we need to hash it.
            const newUser = new User({userName: req.body.name.split(" ").join("").toLowerCase()+Math.random().toString(36).slice(-8),
            email: req.body.email, password: hashedPassword, avatar: req.body.image}); //now save the user
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.TOKEN_SECRET);
            const {password: pass, ...rest} = newUser._doc
            res.cookie('access_token', token, {httpOnly: true}).status(200).send(rest);
        }
    } catch (error){
        next(error);
    }
})
// =================================
// update Route For User
app.post("/update/:id", verifyToken, async(req, res, next) => {
    if(req.user.id !== req.params.id) return res.status(401).json("Your not allowed")

    try{
        if(req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password , 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, {new: true})
        const {password, ...rest} = updatedUser._doc
        res.status(200).send(rest)

    } catch (error) {
        next(error);
    }

})

// Getting the information for update page
app.get("/getListing/:id", async(req, res, next) => {

    try {
        const listing = await Listing.findById(req.params.id)
        if(!listing){
            return res.status(404).json("nothing to show")
        }
        res.status(201).send(listing)

    } catch(error) {
        res.status(404).send("Error getting the information");
        next(error)
    }


})

// delete route
app.delete("/delete/:id", verifyToken, async(req, res) => {
    if(req.user.id !== req.params.id) return res.status(401).json("Your not allowed to delete this account")

    try{
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token')
        res.status(200).json({message: "User has been deleted...."})
    } catch(err) {
        console.log(err);
    }

})

// =====================================LISTING ROUTES================================



// Create a Listing
app.post('/listing/create', verifyToken, async (req, res) => {
    
    try{
        const listing  = await Listing.create(req.body);
        res.status(201).send(listing)
    } catch (error) {
        res.status(404).send("Error Listing " + error.message);
    }
    
})

// Get Listings of Each User
app.get('/listing/:id', verifyToken, async (req, res)=> {
    if(req.user.id === req.params.id) {
        try{
            const Listings = await Listing.find({userRef: req.params.id});
            res.status(201).send(Listings)
            // console.log(Listings, "this is listings from index.js");

        } catch (err){
            // next(err) //might need to change just to send the error not use next
            res.status(404).send("Error Listing " + err.message)
        }

    } else {
        return res.status(401).json("You can only view your own listing") //if didnt worked remove the next like the delete function

    }

})

app.delete("/listing/delete/:id", verifyToken, async(req, res) => {

    // check to see if this user has any listing
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return res.status(404).json("nothing to delete")
    }

    if(req.user.id !== listing.userRef) {  //might need to add .toString() after the userRef to convert it ot String
        return res.status(401).json("Your not allowed to delete this listing")
    }

    try{
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Listing was deleted...."})
    } catch {
        console.log("Error");
    }
})



// Update Listing
app.post('/listing/update/:id', verifyToken, async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)
    if(!listing){
        return res.status(404).json("nothing to edit")
    }

    if(req.user.id !== listing.userRef) {  //might need to add .toString() after the userRef to convert it ot String
        return res.status(401).json("Your can only update your own listing")
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).json(updatedListing)

    } catch (error){
        console.log("error updating listing");
        next(error)
    }

})







app.listen(PORT, ()=> {
    console.log(`Server is up and running on port ${PORT}`);
});