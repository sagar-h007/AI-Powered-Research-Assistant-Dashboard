import express from 'express';
import { 
  getProjects, 
  createProject, 
  getProjectById, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all project routes
router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

export default router;
