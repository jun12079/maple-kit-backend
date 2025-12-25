import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/routes';

// 載入環境變數
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS 設定：開發環境允許 localhost，正式環境只允許指定的前端網址
const corsOptions = {
  origin: NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://127.0.0.1:3000']
};

// 中介層
app.use(cors(corsOptions)); // 啟用 CORS
app.use(express.json()); // 解析 JSON 請求
app.use(express.urlencoded({ extended: true })); // 解析 URL 編碼的請求

// 註冊路由
app.use('/', routes);

// 404 處理
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: '無此路由',
  });
});

// 錯誤處理中間件
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || '伺服器錯誤',
  });
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`伺服器正在執行，監聽 PORT: ${PORT}`);
  console.log(`環境: ${NODE_ENV}`);
  console.log(`允許的 CORS 來源: ${NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'localhost:3000'}`);
});

export default app;
