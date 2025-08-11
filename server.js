// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config();

const app = express();  // ✅ Only once

app.use(cors());
app.use(express.json());

// Serve static files from root (where index.html is)
app.use(express.static(path.join(__dirname)));

// For any route, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// DB connection
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/securevote";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// Import models
const Admin = require('./admin');           // Adjust path if needed
const User = require('./user');             // Adjust path if needed
const Candidate = require('./candidate');   // Adjust path if needed

// Test route
app.get("/", (req, res) => {
  res.send("✅ SecureVote backend is live!");
});
// Insert dummy data once to create collections (REMOVE AFTER FIRST RUN)
async function insertDummyData() {
  const admins = await Admin.find({});
  if (admins.length === 0) {
    await Admin.create({
      adminId: 'admin001',
      pin: '1234'
    });
    console.log("✔️ Dummy admin inserted");
  }

  const users = await User.find({});
  if (users.length === 0) {
    await User.create({
    fullName: 'User One',
    voterId: 'VOTER123456',
    email: 'user@example.com',
    password: await bcrypt.hash('user123', 10),
    hasVoted: false // New field added
  });
    console.log("✔️ Dummy user inserted");
  }

  const candidates = await Candidate.find({});
  if (candidates.length === 0) {
    const dummyCandidates = [
      {
        name: 'Aarav Sharma',
        party: 'Youth Alliance',
        manifesto: 'Focus on education and employment',
        pastExperience: 'Student Council President 2018-2020',
        education: 'B.A. Political Science',
        partySymbolUrl: 'https://via.placeholder.com/100x100.png?text=YA',
        votes: 0,
        isApproved: true
      },
      {
        name: 'Meera Iyer',
        party: 'Green Future',
        manifesto: 'Environmental conservation and renewable energy',
        pastExperience: 'NGO Volunteer for climate awareness',
        education: 'M.Sc. Environmental Science',
        partySymbolUrl: 'https://via.placeholder.com/100x100.png?text=GF',
        votes: 0,
        isApproved: true
      },
      {
        name: 'Kabir Verma',
        party: 'Tech Progress',
        manifesto: 'Digital literacy and technology-driven governance',
        pastExperience: 'Software Engineer at MNC',
        education: 'B.Tech Computer Science',
        partySymbolUrl: 'https://via.placeholder.com/100x100.png?text=TP',
        votes: 0,
        isApproved: true
      },
      {
        name: 'Priya Malhotra',
        party: 'Women First',
        manifesto: 'Women empowerment and equal opportunities',
        pastExperience: 'Women rights activist',
        education: 'M.A. Sociology',
        partySymbolUrl: 'https://via.placeholder.com/100x100.png?text=WF',
        votes: 0,
        isApproved: true
      },
      {
        name: 'Rohan Das',
        party: 'Farmers Voice',
        manifesto: 'Better MSP and irrigation facilities',
        pastExperience: 'Agriculture cooperative head',
        education: 'B.Sc. Agriculture',
        partySymbolUrl: 'https://via.placeholder.com/100x100.png?text=FV',
        votes: 0,
        isApproved: true
      },
      {
        name: 'Ananya Roy',
        party: 'Health For All',
        manifesto: 'Free healthcare and better hospitals',
        pastExperience: 'Doctor in rural health programs',
        education: 'MBBS',
        partySymbolUrl: 'https://via.placeholder.com/100x100.png?text=HFA',
        votes: 0,
        isApproved: true
      },
      {
        name: 'Vikram Singh',
        party: 'Strong Nation',
        manifesto: 'National security and infrastructure development',
        pastExperience: 'Ex-Defence officer',
        education: 'B.A. Defence Studies',
        partySymbolUrl: 'https://via.placeholder.com/100x100.png?text=SN',
        votes: 0,
        isApproved: true
      },
      {
        name: 'Sanya Kapoor',
        party: 'Culture Connect',
        manifesto: 'Preserving heritage and promoting arts',
        pastExperience: 'Cultural program coordinator',
        education: 'M.A. History',
        partySymbolUrl: 'https://via.placeholder.com/100x100.png?text=CC',
        votes: 0,
        isApproved: true
      },
      {
        name: 'Dev Patel',
        party: 'Youth Power',
        manifesto: 'Start-up funding and youth skill programs',
        pastExperience: 'Entrepreneur',
        education: 'MBA',
        partySymbolUrl: 'https://via.placeholder.com/100x100.png?text=YP',
        votes: 0,
        isApproved: true
      },
      {
        name: 'Ishita Bose',
        party: 'Education First',
        manifesto: 'Modern schools and free higher education',
        pastExperience: 'Education NGO founder',
        education: 'B.Ed',
        partySymbolUrl: 'https://via.placeholder.com/100x100.png?text=EF',
        votes: 0,
        isApproved: true
      }
    ];

    await Candidate.insertMany(dummyCandidates);
    console.log("✔️ 10 Dummy candidates inserted");
  }
}

insertDummyData(); // Comment or remove this line after first run

const otps = new Map();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP route
app.post('/api/send-otp', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required to send OTP." });

  const otp = generateOTP();
  otps.set(email, otp);

  console.log(`Sending OTP to ${email}: ${otp}`);  // Replace with real email service

  // Just respond success for now
  res.json({ message: "OTP sent to your email." });
});

// Verify OTP route
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." });

  const validOtp = otps.get(email);
  if (validOtp === otp) {
    otps.delete(email); // OTP used, remove it
    return res.json({ message: "OTP verified successfully!" });
  } else {
    return res.status(400).json({ message: "Invalid OTP." });
  }
});

// Registration route
app.post('/api/users/register', async (req, res) => {
  try {
    const { fullName, voterId, email, password } = req.body;

    // Basic validation
    if (!fullName || !voterId || !email || !password) {
      return res.status(400).json({ message: "All fields (fullName, voterId, email, password) are required." });
    }

    // Check if voterId or email already exists in the users collection
    const existingUser = await User.findOne({ 
      $or: [ { email }, { voterId } ] 
    });
    if (existingUser) {
      return res.status(400).json({ message: "Voter ID or Email already registered." });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user document
    const newUser = new User({
      fullName,
      voterId,
      email,
      password: hashedPassword
    });

    // Save user to MongoDB
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully." });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Server error." });
  }
});

// Voter login
app.post('/api/users/login', async (req, res) => {
  const { voterId, password } = req.body;
  const user = await User.findOne({ voterId });
  
  if (!user) return res.status(400).json({ message: "Voter not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  res.json({ message: "Voter login successful" });
});

// Admin login
app.post('/api/admins/login', async (req, res) => {
  try {
    const { adminId, pin } = req.body;

    const admin = await Admin.findOne({ adminId });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    if (admin.pin !== pin) return res.status(400).json({ message: "Invalid PIN" });

    res.json({ message: "Admin login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/candidates', async (req, res) => {
  try {
    // Fetch only approved candidates, select relevant fields
    const candidates = await Candidate.find({ isApproved: true }).select('name party manifesto partySymbolUrl');
    res.json(candidates);
  } catch (err) {
    console.error('Error fetching candidates:', err);
    res.status(500).json({ message: 'Server error fetching candidates' });
  }
});

// Route for results.html — fetch candidate names & vote counts
app.get('/api/results', async (req, res) => {
  try {
    // Fetch approved candidates with name and vote count
    const candidates = await Candidate.find({ isApproved: true })
      .select('name votes');

    res.json(candidates);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Server error fetching results' });
  }
});


app.post('/api/vote/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { voterId } = req.body;  // Received from frontend

    if (!voterId) {
      return res.status(400).json({ message: "Voter ID required to cast vote" });
    }

    // Optional: Check if voter has already voted here (implement as needed)

    // Find candidate and increment votes by 1
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.votes += 1;
    await candidate.save();

    // Optional: Save voterId vote record to prevent duplicate voting

    res.json({ message: "Vote cast successfully" });
  } catch (err) {
    console.error('Error casting vote:', err);
    res.status(500).json({ message: 'Server error casting vote' });
  }
});

app.post('/api/mark-voted', async (req, res) => {
  try {
    const { voterId } = req.body;
    const user = await User.findOne({ voterId });
    if (!user) return res.status(404).json({ message: 'Voter not found' });

    if (user.hasVoted) return res.status(400).json({ message: 'Already marked as voted' });

    user.hasVoted = true;
    await user.save();
    res.json({ message: 'Marked as voted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking as voted' });
  }
});

// ✅ Check voting status
app.get('/api/check-vote-status/:voterId', async (req, res) => {
  try {
    const voter = await User.findOne({ voterId: req.params.voterId });
    if (!voter) return res.status(404).json({ message: 'Voter not found' });
    res.json({ hasVoted: voter.hasVoted });
  } catch (err) {
    res.status(500).json({ message: 'Error checking vote status' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




