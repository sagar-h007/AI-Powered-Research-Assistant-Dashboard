import Project from '../models/Project.js';
import z from 'zod';

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'archived', 'completed']).optional(),
});

// @desc    Get all projects for a user with pagination
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Project.countDocuments({ userId: req.user._id });

    res.status(200).json({
      projects,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res, next) => {
  try {
    const validatedData = projectSchema.parse(req.body);

    const project = await Project.create({
      userId: req.user._id,
      ...validatedData
    });

    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400);
      return next(new Error(error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res, next) => {
  try {
    const validatedData = projectSchema.partial().parse(req.body);

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      validatedData,
      { new: true, runValidators: true }
    );

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    res.status(200).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400);
      return next(new Error(error.errors.map(e => e.message).join(', ')));
    }
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // We ideally should also delete associated Documents here, 
    // but for this MVP we'll just delete the project.
    res.status(200).json({ message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};
