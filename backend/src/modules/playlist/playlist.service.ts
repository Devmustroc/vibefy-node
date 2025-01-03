import { PrismaClient } from "@prisma/client";
import {CreatePlaylistInput, UpdatePlaylistInput} from "./playlist.validation";

const prisma = new PrismaClient();

export class PlaylistService {
  static async createPlaylist(userId: string, input: CreatePlaylistInput) {
    const playlist = await prisma.playlist.create({
      data: {
        ...input,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            tracks: true,
          }
        }
      }
    });

    return playlist;
  }

  static async updatePlaylist(playlistId: string, userId: string, input: UpdatePlaylistInput) {
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: playlistId,
      },
    });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const updatedPlaylist = await prisma.playlist.update({
      where: {
        id: playlistId,
      },
      data: input,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        tracks: true,
        _count: {
          select: {
            tracks: true,
          },
        },
      },
    });

    return updatedPlaylist;
  }

  static async deletePlaylist(playlistId: string, userId: string) {
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: playlistId,
      },
    });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    if ((playlist.userId !== userId)) {
      throw new Error('Unauthorized');
    }

    await prisma.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    return {message: 'Playlist deleted'};
  };

  static async getPlaylist(playlistId: string) {
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: playlistId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        tracks: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              },
            },
          },
        },
        _count: {
          select: {
            tracks: true,
          },
        },
      },
    });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    return playlist;
  }

  static async addTrackToPlaylist(playlistId: string, trackId: string, userId: string) {
    const playlist = await prisma.playlist.findUnique({
      where: {
        id: playlistId,
      },
    });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const track = await prisma.track.findUnique({
      where: {
        id: trackId,
      },
    });

    if (!track) {
      throw new Error('Track not found');
    }

    const updatedPlaylist = await prisma.playlist.update({
      where: {id: playlistId},
      data: {
        tracks: {
          connect: {
            id: trackId,
          },
        },
      },
      include: {
        tracks: true,
        _count: {
          select: {
            tracks: true,
          },
        },
      }
    });

    return updatedPlaylist;
  }

  static async removeTrackFromPlaylist(playlistId: string, trackId: string, userId: string) {
    const playlist = await prisma.playlist.findUnique({
      where: {id: playlistId},
    });

    if (!playlist) {
      throw new Error('Playlist not found');
    }

    if (playlist.userId !== userId) {
      throw new Error('Not authorized to modify this playlist');
    }

    const updatedPlaylist = await prisma.playlist.update({
      where: {id: playlistId},
      data: {
        tracks: {
          disconnect: {id: trackId},
        },
      },
      include: {
        tracks: true,
        _count: {
          select: {
            tracks: true,
          },
        },
      },
    });

    return updatedPlaylist;
  }

  static async getUserPlaylists(userId: string) {
    const playlists = await prisma.playlist.findMany({
      where: {userId},
      include: {
        _count: {
          select: {
            tracks: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return playlists;
  }

  static async searchPlaylists(query: string) {
    const playlists = await prisma.playlist.findMany({
      where: {
        OR: [
          {name: {contains: query, mode: 'insensitive'}},
          {description: {contains: query, mode: 'insensitive'}},
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            tracks: true,
          },
        },
      },
      take: 10,
    });

    return playlists;
  }
}