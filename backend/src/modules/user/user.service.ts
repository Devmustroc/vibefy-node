import {UpdateUserInput} from "./user.validation";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  static async updateUser(userId: string, input: UpdateUserInput) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: input,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true
      }
    });

    return user;
  }

  static async getUserProfile(userId: string) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          playlists: {
            select: {
              id: true,
              name: true,
              description: true,
              coverImage: true,
            },
          },
          _count: {
            select: {
              playlists: true,
              tracks: true,
            },
          },
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
  }

  static async searchUsers(query: string, currentUserId: string) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } }
        ],
        NOT: { id: currentUserId }
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        _count: {
          select: {
            playlists: true,
          }
        }
      },
      take: 10
    });

    return users;
  }

  static async getTopUsers() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        _count: {
          select: {
            playlists: true,
          },
        },
      },
      orderBy: {
        playlists: {
          _count: 'desc'
        },
      },
      take: 5,
    });

    return users;
  }
}