import { RequestHandler } from 'express';
import path from 'path';

export const index: RequestHandler = (req, res, next) => {
  try {
    res.sendFile(path.resolve(process.cwd(), 'build', 'index.html'));
  } catch (err) {
    next(err);
  }
};
