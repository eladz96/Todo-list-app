import { Request, Response } from 'express';
import { Task } from '../models/taskModel';

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { headline, priority, description, userId } = req.body;

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

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

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

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!updated) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task', details: err });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task', details: err });
  }
};
