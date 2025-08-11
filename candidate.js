const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  party: {
    type: String,
    required: true,
    trim: true
  },
  manifesto: {
    type: String,
    default: '',
    trim: true
  },
  pastExperience: {
    type: String,
    default: '',
    trim: true
  },
  education: {
    type: String,
    default: '',
    trim: true
  },
  partySymbolUrl: {
    type: String,
    default: ''
  },
  votes: {
    type: Number,
    default: 0,
    min: 0
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  isApproved: {
    type: Boolean,
    default: false
  }
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
