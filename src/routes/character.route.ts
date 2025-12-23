import { Router } from 'express';
import * as characterController from '../controllers/character.controller';

const router = Router();

router.get('/id', characterController.getCharacterOCID);
router.get('/character/all', characterController.getAllCharacterData);

export default router;
