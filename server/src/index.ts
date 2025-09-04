import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import inventoryAccessRoutes from '~routes/inventoryAccessRoutes';
import likeRoutes from '~routes/likeRoutes';
import tagRoutes from '~routes/tagRoutes';
import categoryRoutes from '~routes/categoryRoutes';
import userRoutes from '~routes/userRoutes';
import authRoutes from '~routes/authRoutes';
import inventoryRoutes from '~routes/inventoryRoutes';
import customFieldRoutes from '~routes/customFieldRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.UI_URL || false,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.send('Server is up!');
});

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inventories', inventoryRoutes);
app.use('/api/inventories', inventoryAccessRoutes);
app.use('/api/items', likeRoutes);
app.use('/api/items', likeRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/custom-fields', customFieldRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});