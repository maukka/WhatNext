
import { User } from './User';


const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model  
        ref: 'User', // Reference name for Mongoose to recognize  
        required: true,
    },
    isDone: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.model('Task', TaskSchema);

async function addTask(title, description, username, isDone) {

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return false;
        }
        const newTask = new Task({
            title,
            description,
            user: user._id,
            isDone
        });


        // Save user to the database  
        await newTask.save();
    } catch (error) {
        return false;

    }
}

async function getTasks(username) {

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return null;
        }
        const tasks = await Task.find({ user: user._id }).populate('user', 'username'); // Fetch tasks for the user
        return tasks;
    } catch (error) {
        return null;
    }
}


module.exports = { addTask, getTasks };