// back end installation
// cors, helmet, dotenv, morgan, express,
const express = require('express');

// require('dotenv').config();
// require('./config/db')
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

// ROUTES=====

// get all the events






app.listen(PORT, ()=> {
    console.log(`Server is up and running on port ${PORT}`);
});