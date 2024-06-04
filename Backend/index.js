const express = require('express')
const app = express()
const port = 3002
const mongoose = require('mongoose')
const sanitizeHtml = require('sanitize-html');
const bcrypt = require('bcrypt');
const validator = require('validator');
const axios = require('axios')
const twilio = require('twilio');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const session = require('express-session');
const cors = require('cors')
const crypto = require('crypto');



app.use(cors({
    origin: '*',
    methods: ['get', 'post', 'patch', 'delete']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,
       
     } 
}));


// Endpoint to send OTP
// app.post('/sendOTP', async (req, res) => {
 
//     const phoneNumber = req.body.phoneNumber;
//     console.log(phoneNumber)
//     // Generate OTP
//     const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });

//     try {
//         // Save OTP to MongoDB
//         // await OtpModel.findOneAndUpdate({ phoneNumber }, { phoneNumber, otp }, { upsert: true });

//         // Send OTP as SMS using Twilio
//         await client.messages.create({
//             body: `Your OTP is: ${otp}`,
//             from: twilioPhoneNumber,
//             to: phoneNumber
//         });

//         res.send('OTP sent successfully');
//     } catch (error) {
//         console.error('Error sending OTP:', error);
//         res.status(500).send('Failed to send OTP');
//     }
// });


// // Endpoint to verify OTP
// app.post('/verifyOTP', async (req, res) => {
//     const { phoneNumber, otp } = req.body;

//     try {
//         // Retrieve OTP from MongoDB
//         const savedOtp = await OtpModel.findOne({ phoneNumber });

//         if (!savedOtp || savedOtp.otp !== otp) {
//             return res.status(400).send('Invalid OTP');
//         }

//         // OTP verified successfully
//         res.send('OTP verified successfully');
//     } catch (error) {
//         console.error('Error verifying OTP:', error);
//         res.status(500).send('Failed to verify OTP');
//     }
// });


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, 
    secure: false,
    auth: {
      user: 'gajjarnaimish490@gmail.com',
      pass: 'fzbc omxk unew xcun' 
    }
  });
  
  // Generate a 6-digit OTP
  function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }
  let storedOTPs = {};
  function storeOTP(email, otp) {
    storedOTPs[email] = otp;
    setTimeout(() => {
      delete storedOTPs[email]; 
    }, 300000); 
  }
  // Endpoint to send OTP
  app.post('/send-otp', (req, res) => {
    const { email } = req.body;
    console.log(email)
    const otp = generateOTP();
    storeOTP(email, otp);
    const mailOptions = {
      from: "gajjarnaimish490@gmail.com",
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Failed to send OTP:', error);
        return res.status(500).send({ message: 'Failed to send OTP', error: error.message });
      } else {
        console.log('OTP sent: ' + info.response);
        return res.status(200).send({ message: 'OTP sent successfully', otp });
      }
    });
  });
  app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    console.log(email,otp)
    if (storedOTPs[email] === otp) {
      delete storedOTPs[email]; 
      return res.status(200).send({ message: 'OTP verified successfully' });
    } else {
      return res.status(401).send({ message: 'Invalid OTP' });
    }
  });



//connection 

async function connection() {
    try {
        await mongoose.connect('mongodb+srv://Nrgajjar30:Naimish%403009@cluster0.di9i8s8.mongodb.net/')
        console.log("Connected to Database")
    }
    catch (err) {
        console.log("Error connecting database")
    }
}
connection()

//UserSchema

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model("users", UserSchema)


app.post('/findaccount', async (req, res) =>{
    const data = req.body
    const emailorphone = sanitizeHtml(data.id);
    req.session.email = emailorphone
     console.log(req.session.email)
        try {
            const user = await User.findOne({ "email": emailorphone });
            console.log("Hello from email")
            console.log(user)
            if (!user) {
                return res.status(400).send("No user exists")
            }
            else {
                res.send("You can reset password")
            }
        }
        catch (e) {
            return res.send({ msg: "Error finding user" })
        }
    
})



function encrptpassword(req, res, next) {
    req.password = bcrypt.hashSync(sanitizeHtml(req.body.password), 10)
    next()
}

app.post('/resetpassword', encrptpassword, async (req, res) => {

    const password = req.password
    console.log(req.body.email)
    console.log(password)

    try {
        const user = await User.updateOne({ "email": req.body.email }, { "password": password });
        console.log("Hello from email")
        console.log(user)
        if (!user) {
            return res.status(400).send("No user exists")
        }
        else {
            res.send("Password reset successfully")
        }
    }
    catch (e) {
        return res.send({ msg: "Error finding user" })
    }

})

app.post('/signup', encrptpassword, async (req, res) => {
    const data = req.body
    const name = sanitizeHtml(data.name);
    const email = sanitizeHtml(data.email);
    const phone = sanitizeHtml(data.phonenumber);
    const password = req.password;
    console.log(data)
    console.log(password)
    try {

        const user = await User.create({
            name: name,
            email: email,
            phone: phone,
            password: password
        });
        console.log(user)
        res.status(201).json({ message: "User created successfully", user: user });
    } catch (err) {
        res.status(400).json({ error: "User already exists Please login", details: err.message });
    }
})


app.post('/login', async (req, res) => {
    const data = req.body
    const emailorphone = sanitizeHtml(data.id);
    const password = sanitizeHtml(data.password);
    console.log(emailorphone, password)
    if (validator.isEmail(emailorphone)) {
        try {
            const user = await User.findOne({ "email": emailorphone });
            console.log("Hello from email")
            console.log(user)
            if (!user) {
                return res.status(400).send("No user exists")
            }
            else {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return res.send({ msg: "Login Succesfull" })
                }
                else {
                    return res.status(400).send({ msg: "Wrong password" })
                }
            }
        }
        catch (e) {
            return res.send({ msg: "Error finding user" })
        }
    }
    else {
        try {
            const user = await User.findOne({ "phone": emailorphone });
            console.log("Hello from phonenumber")
            console.log(user)
            if (!user) {
                return res.status(400).send("No user exists")
            }
            else {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return res.send({ msg: "Login Succesfull" })
                }
                else {
                    console.log("Hi")
                    return res.status(400).send({ msg: "Wrong password" })
                }
            }
        }
        catch (e) {
            return res.send({ msg: "Error finding user" })
        }
    }

})

app.listen(port, () => console.log(`Listening on port ${port}`))
