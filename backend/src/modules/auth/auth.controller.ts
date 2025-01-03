import { Request, Response } from 'express';
import {AuthService} from "./auth.service";
import {loginSchema, registerSchema, updateProfileSchema} from "./auth.validation";

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const validatedInput = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedInput);

      res.status(201).json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const validatedInput = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedInput);

      res.json(result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
     res.status(400).json({ error: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const validatedInput = updateProfileSchema.parse(req.body);
      const result = await AuthService.updateProfile(req.user.id, validatedInput, );
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors });
      }
      res.status(400).json({ error: error.message });
    }
  };

  static async getProfile(req: Request, res: Response) {
    try {
      const result = await AuthService.getProfile(req.user.id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}