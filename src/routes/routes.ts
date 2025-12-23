import { Router } from 'express';
import indexRoutes from './index.route';
import characterRoutes from './character.route';

const router = Router();

// 註冊各個路由模組
router.use('/', indexRoutes);
router.use('/api/maple', characterRoutes);

export default router;
