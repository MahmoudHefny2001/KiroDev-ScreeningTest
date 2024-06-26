const router = require('express').Router();

const bcrypt = require('bcrypt');

const User = require('../models/Users');

const jwt = require('jsonwebtoken');

// const verifyToken = require('./middlewares/verifyToken');

// route.get('/check-authentication', verifyToken, (req, res) => {
    // res.sendStatus(200);
// });


// REGISTRATION
router.post('/signup', async (request, response) => {

    try {
        const newUser = new User({
            username: request.body.username,
            email: request.body.email,
            phone_number: request.body.phone_number,
            password: await bcrypt.hash(request.body.password, 10),
        });

        const savedUser = await newUser.save();
        response.status(200)
        response.json({
            id: savedUser._id,
            username: savedUser.username,
            phone_number: savedUser.phone_number, 
            email: savedUser.email, 
        });

    } catch (error) {
        response.status(400).send(error);
    }
    
});



// LOGIN
router.post('/login', async (request, response) => {

    try {
        
        const { email_or_phone, password } = request.body;

        // Find the user by email or phone
        const user = await User.findOne({
            $or: [{ email: email_or_phone }, { phone_number: email_or_phone }]
        });

        if (!user) {
            return res.status(401).json('Invalid email/phone or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid email/phone or password');
        }

        // If the email/phone and password are valid, generate JWT tokens
        const accessToken = jwt.sign({ 
            userId: user._id,
            isAdmin: user.isAdmin, 
            }, 
            process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '2d'
        }
        );

        const refreshToken = jwt.sign({ 
            userId: user._id,
            isAdmin: user.isAdmin,
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d'
        });

        response.status(200);

        response.json({ 
            "message": "Logged in successfully!",
            accessToken, 
            refreshToken, 
            "user": {
                "id": user._id,
                "username": user.username,
                "phone_number": user.phone_number, 
                "email": user.email,
            },
        });

    } catch (error) {
        response.status(400).json(error);
    }

});


// LOGOUT

// In-memory store for invalidated tokens
const blacklistedTokens = new Set();

// Logout route to invalidate the token
router.post('/logout', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        blacklistedTokens.add(token);
        return res.send('Logged out successfully');
    }
    res.status(400).send('No token provided');
    
});


module.exports = router;

