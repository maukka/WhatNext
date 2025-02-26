// Define User schema  
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create User model  
const User = mongoose.model('User', userSchema);

async function authenticateUser(email, password) {

    try {

        const user = await User.findOne({ email });

        // If user was found
        if (user) {

            //Compare the hashed password
            const match = await bcrypt.compare(password, user.password);

            // If password matches
            if (match) {
                return true;
            }
        }

        return false;

    } catch (error) {
        console.error('Error during authentication:', error);
        throw error; // Handle error appropriately )
    }

}

async function addUser(email, password) {

    // Check if user already exists  
    const existingUser = await User.findOne({ email });
    // Check if user allready exists in database
    if (existingUser) {
        return false;
    }

    // Hash password  
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user  
    const newUser = new User({
        email,
        password: hashedPassword
    });

    try {
        // Save user to the database  
        await newUser.save();
    } catch (error) {
        return false;
    }

    return true;
}



module.exports = { authenticateUser, addUser };