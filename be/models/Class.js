// filepath: c:\Users\ngltd\REPO\cusc-schedule\be\models\Class.js

import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  schedule: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Class = mongoose.model('Class', classSchema);

export default Class;