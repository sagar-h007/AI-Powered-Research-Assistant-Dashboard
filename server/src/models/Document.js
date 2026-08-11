import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true, // For O(log N) lookup of all documents in a project
  },
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Document content is required'],
  },
  aiSummary: {
    type: String,
    default: null,
  }
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);
export default Document;
