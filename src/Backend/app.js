const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { authenticateUser, addUser } = require('./Schema/User');
const { addTask, getTask } = require('./Schema/Tasks')


const app = express();
// Middleware to parse JSON bodies  
app.use(bodyParser.json()); // For parsing application/json  
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

const mongoURI = 'mongodb://localhost:27017/whatsnext';

// Connect to mongodb
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.use(cors({
    origin: 'http://localhost:5173', // specify the front-end origin  
}));

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body.values;
    const valid = await authenticateUser(email, password);

    if (valid) {
        res.status(200).send("Authentication success");
    }
    else {

        res.status(401).send("Authentication failed");
    }
});

app.post('/api/sign', async (req, res) => {
    const { email, password } = req.body.values;

    const valid = await addUser(email, password);

    if (valid) {
        res.status(200).send("Registration success success");
    }
    else {

        res.status(401).send("Registration failed failed");
    }
});

app.get('/tasks/', async (req, res) => {
    const { email, password } = req.body.values;

    const valid = await addUser(email, password);

    if (valid) {
        res.status(200).send("Registration success success");
    }
    else {

        res.status(401).send("Registration failed failed");
    }
});



const port = process.env.PORT || 3000; // You can use environment variables for port configuration
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});