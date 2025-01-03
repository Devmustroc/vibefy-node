import express, { Express, Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Routes (à implémenter)
// import authRoutes from './modules/routes/auth.routes';
// import userRoutes from './modules/routes/user.routes';
// import playlistRoutes from './modules/routes/playlist.routes';
// import trackRoutes from './modules/routes/track.routes';

dotenv.config();

const app: Express = express();
const prisma = new PrismaClient();
const port = process.env.PORT ?? 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/tracks', trackRoutes);

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.json({ status : 'ok', timestamp: new Date().toISOString() });
});


// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('📦 Connected to database');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};

startServer();

export default app;