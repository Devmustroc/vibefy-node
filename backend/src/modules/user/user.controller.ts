import { Request, Response } from 'express';
import {updateUserSchema} from "./user.validation";
import {UserService} from "./user.service";

export class UserController {
  static async updateProfile(req: Request, res: Response) {
    try {
      const validatedInput = updateUserSchema.parse(req.body);
      const updatedUser = await UserService.updateUser(req.user.id, validatedInput);

        res.status(200).json(updatedUser);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: error.errors });
      }
      res.status(400).json({ message: error.message });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const result = await UserService.getUserProfile(req.user.id);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await UserService.getUserProfile(id);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async searchUsers(req: Request, res: Response) {
    try {
      const { query } = req.params;

      if (!query || typeof  query !== 'string') {
        return res.status(400).json({ message: 'Invalid query' });
      }

      const result = await UserService.searchUsers(query, req.user.id);
        res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getTopUsers(req: Request, res: Response) {
    try {
      const result = await UserService.getTopUsers();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}