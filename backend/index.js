const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Serve static files from the 'pages' directory
app.use(express.static('pages'));

mongoose.connect('mongodb+srv://testing:LearnSmashers098@cluster0.enfcqss.mongodb.net/registrationFormDb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const registration = mongoose.model('registration', registrationSchema);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/pages/index.html');
});

// POST route for form submission
app.post('/success', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        const existingUser = await registration.findOne({ email:email });
        if (!existingUser) {
            const registrationData = new registration({
                name,
                email,
                password,
            });
    
            await registrationData.save();
            res.redirect('/success');

            if (password !== confirmPassword) {
                // Password and Confirm Password do not match
                return res.redirect('/error');
            }
        }else{
            alert("Email already exists")
            res.redirect('/error');
        }

        

    } 
    catch (error) {
        console.log(error);
        res.redirect('/error');
    }
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/pages/success.html');
});

app.get('/error', (req, res) => {
    res.sendFile(__dirname + '/pages/error.html');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
