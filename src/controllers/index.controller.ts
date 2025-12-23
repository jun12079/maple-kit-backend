import { Request, Response } from 'express';

// 取得 API 基本資訊
export const getApiInfo = (req: Request, res: Response) => {
  res.json({
    message: 'Maple Kit Backend API',
    status: 'running',
    version: '1.0.0'
  });
};

// 健康檢查
export const healthCheck = (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
};
