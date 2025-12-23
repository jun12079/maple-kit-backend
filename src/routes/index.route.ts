import { Router } from 'express';
import { getApiInfo, healthCheck } from '../controllers/index.controller';

const router = Router();

// 基本路由
router.get('/', getApiInfo);
router.get('/health', healthCheck);

export default router;
