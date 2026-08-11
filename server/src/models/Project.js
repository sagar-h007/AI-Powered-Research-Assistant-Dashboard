import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'completed'],
    default: 'active',
  },
  tags: [{
    type: String, // Embedded primitive array - fine because size is naturally bounded
    trim: true,
  }]
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
