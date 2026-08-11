import Document from '../models/Document.js';
import Project from '../models/Project.js';
import z from 'zod';

const documentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

// @desc    Get all documents for a project
// @route   GET /api/projects/:projectId/documents
// @access  Private
export const getDocuments = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const documents = await Document.find({ projectId }).sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    next(error);
  }
};

// @desc    Add a document to a project and generate mock AI summary
// @route   POST /api/projects/:projectId/documents
// @access  Private
export const addDocument = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    
    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const validatedData = documentSchema.parse(req.body);

    // Mock AI service call (Simulating latency and summarization)
    const mockAiSummary = await new Promise(resolve => {
      setTimeout(() => {
        resolve(`AI Summary: The document "${validatedData.title}" focuses on key themes extracted from its content. It highlights main findings in approximately ${validatedData.content.split(' ').length} words.`);
      }, 1000);
    });

    const document = await Document.create({
      projectId,
      title: validatedData.title,
      content: validatedData.content,
      aiSummary: mockAiSummary
    });

    res.status(201).json(document);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400);
      return next(new Error(error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
};
