import express from 'express';
import { getDocuments, addDocument } from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router({ mergeParams: true }); // Important for nested routes like /projects/:projectId/documents

router.use(protect);

router.route('/')
  .get(getDocuments)
  .post(addDocument);

export default router;
