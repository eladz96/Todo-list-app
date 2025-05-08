import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  headline:    { type: String, required: true },
  priority:    { type: String, enum: ['low', 'medium', 'high'], required: true },
  description: { type: String },
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);
