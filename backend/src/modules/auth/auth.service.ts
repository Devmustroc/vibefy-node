import jwt from 'jsonwebtoken';
import {LoginInput, RegisterInput, UpdateProfile} from './auth.validation';
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

  static async updateProfile(userId: string, input: UpdateProfile) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updateData = {} as UpdateProfile;

    if (input.name) {
      updateData.name = input.name;
    }
    if (input.currentPassword && input.newPassword) {
      const isPasswordValid = await bcrypt.compare(input.currentPassword, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        updateData.newPassword = await bcrypt.hash(input.newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    return updatedUser;
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}