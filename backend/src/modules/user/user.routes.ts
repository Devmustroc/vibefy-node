import { Router } from "express";
import {authenticateToken} from "../../middleware/auth.middleware";
import {UserController} from "./user.controller";

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Profile routes
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);

// User search and discovery routes
router.get('/search', UserController.searchUsers);
router.get('/top', UserController.getTopUsers);

// Get specific user by ID
router.get('/:id', UserController.getUserById);

export default router;