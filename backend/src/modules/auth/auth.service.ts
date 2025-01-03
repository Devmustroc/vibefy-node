import jwt from 'jsonwebtoken';
import {LoginInput, RegisterInput} from "../../types/authentification.types";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class AuthService {
  private static generateToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  static async register(input: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
    });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        password: hashedPassword,
      }
    });

    const token = this.generateToken(user.id);

    return { user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }, token
    };
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);

    return { user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
        token
    };
  }
}