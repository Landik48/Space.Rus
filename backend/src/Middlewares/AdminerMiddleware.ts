import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export function adminerAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token =
      req.cookies?.access_token ||
      req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).send('Не авторизован');
    }

    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);

    if (!payload.isAdmin) {
      return res.status(403).send('Нет прав');
    }

    (req as any).user = payload;

    next();
  } catch (e) {
    return res.status(401).send('Не авторизован');
  }
}