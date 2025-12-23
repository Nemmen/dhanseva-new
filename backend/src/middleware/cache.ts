import { Request, Response, NextFunction } from 'express';

// Cache control middleware
export const cacheControl = (maxAge: number = 300) => {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
    next();
  };
};

// No cache middleware for sensitive endpoints
export const noCache = (_req: Request, res: Response, next: NextFunction): void => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
};

// ETag support for conditional requests
export const conditionalGet = (req: Request, res: Response, next: NextFunction): void => {
  const etag = req.headers['if-none-match'];
  if (etag && res.getHeader('ETag') === etag) {
    res.sendStatus(304);
    return;
  }
  next();
};
