import { Request, Response } from 'express';
import { Task } from '../models/taskModel';

interface AuthRequest extends Request {
  userId?: string;
}

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { headline, priority, description } = req.body;
    const userId = req.userId;

    if (!headline || !priority || !userId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const task = await Task.create({ headline, priority, description, userId });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task', details: err });
  }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(400).json({ error: 'Missing userId' });
      return;
    }

    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks', details: err });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!task) {
      res.status(404).json({ error: 'Task not found or not yours' });
      return;
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task', details: err });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) {
      res.status(404).json({ error: 'Task not found or not yours' });
      return;
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task', details: err });
  }
};
