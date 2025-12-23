import { Request, Response } from 'express';
import { mapleAPIService } from '../services/mapleAPI.service';
import { validateRequiredParams } from '../services/nexonAPI.service';

/**
 * 取得角色 OCID
 */
export const getCharacterOCID = async (req: Request, res: Response) => {
  try {
    const { character_name } = req.query;

    const error = validateRequiredParams({ character_name });
    if (error) {
      return res.status(400).json({ error });
    }

    const data = await mapleAPIService.getCharacterOCID(character_name as string);
    res.json(data);
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || '伺服器錯誤',
      code: error.code,
    });
  }
};

/**
 * 取得所有角色資料
 * 後端會並行呼叫所有 Nexon API 端點，組合成完整資料回傳
 */
export const getAllCharacterData = async (req: Request, res: Response) => {
  try {
    const { ocid, date } = req.query;

    const error = validateRequiredParams({ ocid });
    if (error) {
      return res.status(400).json({ error });
    }

    const data = await mapleAPIService.getAllCharacterData(
      ocid as string,
      (date as string) || null
    );

    res.json(data);
  } catch (error: any) {
    res.status(error.status || 500).json({
      error: error.message || '伺服器錯誤',
      code: error.code,
    });
  }
};
