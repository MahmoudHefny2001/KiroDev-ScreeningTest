const express = require('express');

const mongoose = require('mongoose');


const cors = require('cors');

const dotenv = require('dotenv');

const app = express();

dotenv.config();


const userRoute = require('./routes/authentication');


app.listen(
    process.env.PORT || 5000, () => {
    console.log('Server is running on port 5000');
});


mongoose.connect(process.env.MONGO_URL,)
.then(() => {
    console.log('Database connected');
}
)
.catch((error) => {
    console.log('Database connection error :', error);
}
);


app.use(cors());

app.use(express.json());


app.use('/api/v1/auth', userRoute);