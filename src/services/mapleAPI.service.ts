/**
 * MapleStory Taiwan Open API Service
 * 官方 API 文檔：https://openapi.maplestory.nexon.com
 * 
 * 此 Service 只負責呼叫 Nexon API，業務邏輯寫在 CharacterService
 */

import { makeNexonAPIRequest } from './nexonAPI.service';
import {
  CharacterBasic,
  CharacterPopularity,
  CharacterStat,
  CharacterHyperStat,
  CharacterAbility,
  CharacterItemEquipment,
  CharacterSymbolEquipment,
  CharacterDojang,
  CharacterPropensity,
  CharacterCashItemEquipment,
  CharacterSetEffect,
  CharacterBeautyEquipment,
  CharacterAndroidEquipment,
  CharacterPetEquipment,
  CharacterSkill,
  CharacterLinkSkill,
  CharacterVMatrix,
  CharacterHexaMatrix,
  CharacterHexaMatrixStat,
  CharacterUnion,
  CharacterUnionRaider,
  CharacterUnionArtifact,
  CharacterUnionChampion,
} from '../types/mapleAPI';

export class MapleAPIService {
  /**
   * 檢視角色辨識器 (OCID)
   */
  async getCharacterOCID(characterName: string): Promise<{ ocid: string }> {
    return makeNexonAPIRequest<{ ocid: string }>('/id', {
      character_name: characterName,
    });
  }

  /**
   * 檢視基本資訊
   */
  async getCharacterBasic(ocid: string, date: string | null = null): Promise<CharacterBasic> {
    return makeNexonAPIRequest<CharacterBasic>('/character/basic', { ocid, date });
  }

  /**
   * 檢視名聲資訊
   */
  async getCharacterPopularity(ocid: string, date: string | null = null): Promise<CharacterPopularity> {
    return makeNexonAPIRequest<CharacterPopularity>('/character/popularity', { ocid, date });
  }

  /**
   * 檢視綜合能力值資訊
   */
  async getCharacterStat(ocid: string, date: string | null = null): Promise<CharacterStat> {
    return makeNexonAPIRequest<CharacterStat>('/character/stat', { ocid, date });
  }

  /**
   * 檢視極限屬性資訊
   */
  async getCharacterHyperStat(ocid: string, date: string | null = null): Promise<CharacterHyperStat> {
    return makeNexonAPIRequest<CharacterHyperStat>('/character/hyper-stat', { ocid, date });
  }

  /**
   * 檢視性向資訊
   */
  async getCharacterPropensity(ocid: string, date: string | null = null): Promise<CharacterPropensity> {
    return makeNexonAPIRequest<CharacterPropensity>('/character/propensity', { ocid, date });
  }

  /**
   * 檢視能力資訊
   */
  async getCharacterAbility(ocid: string, date: string | null = null): Promise<CharacterAbility> {
    return makeNexonAPIRequest<CharacterAbility>('/character/ability', { ocid, date });
  }

  /**
   * 檢視已裝備道具資訊 (不含現金道具)
   */
  async getCharacterItemEquipment(ocid: string, date: string | null = null): Promise<CharacterItemEquipment> {
    return makeNexonAPIRequest<CharacterItemEquipment>('/character/item-equipment', { ocid, date });
  }

  /**
   * 檢視已裝備現金道具資訊
   */
  async getCharacterCashItemEquipment(ocid: string, date: string | null = null): Promise<CharacterCashItemEquipment> {
    return makeNexonAPIRequest<CharacterCashItemEquipment>('/character/cashitem-equipment', { ocid, date });
  }

  /**
   * 檢視已裝備符文資訊
   */
  async getCharacterSymbolEquipment(ocid: string, date: string | null = null): Promise<CharacterSymbolEquipment> {
    return makeNexonAPIRequest<CharacterSymbolEquipment>('/character/symbol-equipment', { ocid, date });
  }

  /**
   * 檢視已套用的套裝效果資訊
   */
  async getCharacterSetEffect(ocid: string, date: string | null = null): Promise<CharacterSetEffect> {
    return makeNexonAPIRequest<CharacterSetEffect>('/character/set-effect', { ocid, date });
  }

  /**
   * 檢視已裝備的髮型、臉型與膚色資訊
   */
  async getCharacterBeautyEquipment(ocid: string, date: string | null = null): Promise<CharacterBeautyEquipment> {
    return makeNexonAPIRequest<CharacterBeautyEquipment>('/character/beauty-equipment', { ocid, date });
  }

  /**
   * 檢視已裝備機器人資訊
   */
  async getCharacterAndroidEquipment(ocid: string, date: string | null = null): Promise<CharacterAndroidEquipment> {
    return makeNexonAPIRequest<CharacterAndroidEquipment>('/character/android-equipment', { ocid, date });
  }

  /**
   * 檢視已裝備寵物資訊
   */
  async getCharacterPetEquipment(ocid: string, date: string | null = null): Promise<CharacterPetEquipment> {
    return makeNexonAPIRequest<CharacterPetEquipment>('/character/pet-equipment', { ocid, date });
  }

  /**
   * 檢視技能資訊
   */
  async getCharacterSkill(
    ocid: string,
    date: string | null = null,
    characterSkillGrade: string = '6'
  ): Promise<CharacterSkill> {
    return makeNexonAPIRequest<CharacterSkill>('/character/skill', {
      ocid,
      date,
      character_skill_grade: characterSkillGrade,
    });
  }

  /**
   * 檢視已裝備連結技能資訊
   */
  async getCharacterLinkSkill(ocid: string, date: string | null = null): Promise<CharacterLinkSkill> {
    return makeNexonAPIRequest<CharacterLinkSkill>('/character/link-skill', { ocid, date });
  }

  /**
   * 檢視 V 矩陣資訊 (使用技能 API 獲取 5 等技能資料)
   */
  async getCharacterVMatrix(ocid: string, date: string | null = null): Promise<CharacterVMatrix> {
    return makeNexonAPIRequest<CharacterVMatrix>('/character/skill', {
      ocid,
      date,
      character_skill_grade: '5',
    });
  }

  /**
   * 檢視 HEXA 核心資訊 (使用技能 API 獲取 6 等技能資料)
   */
  async getCharacterHexaMatrix(ocid: string, date: string | null = null): Promise<CharacterHexaMatrix> {
    return makeNexonAPIRequest<CharacterHexaMatrix>('/character/skill', {
      ocid,
      date,
      character_skill_grade: '6',
    });
  }

  /**
   * 檢視在 HEXA 矩陣中設定的 HEXA 屬性資訊
   */
  async getCharacterHexaMatrixStat(ocid: string, date: string | null = null): Promise<CharacterHexaMatrixStat> {
    return makeNexonAPIRequest<CharacterHexaMatrixStat>('/character/hexamatrix-stat', { ocid, date });
  }

  /**
   * 檢視武陵道場最高紀錄資訊
   */
  async getCharacterDojang(ocid: string, date: string | null = null): Promise<CharacterDojang> {
    return makeNexonAPIRequest<CharacterDojang>('/character/dojang', { ocid, date });
  }

  /**
   * 檢視戰地資訊
   */
  async getUnion(ocid: string, date: string | null = null): Promise<CharacterUnion> {
    return makeNexonAPIRequest<CharacterUnion>('/user/union', { ocid, date });
  }

  /**
   * 檢視戰地攻擊隊資訊
   */
  async getUnionRaider(ocid: string, date: string | null = null): Promise<CharacterUnionRaider> {
    return makeNexonAPIRequest<CharacterUnionRaider>('/user/union-raider', { ocid, date });
  }

  /**
   * 檢視戰地神器資訊
   */
  async getUnionArtifact(ocid: string, date: string | null = null): Promise<CharacterUnionArtifact> {
    return makeNexonAPIRequest<CharacterUnionArtifact>('/user/union-artifact', { ocid, date });
  }

  /**
   * 檢視聯盟冠軍資訊
   */
  async getUnionChampion(ocid: string, date: string | null = null): Promise<CharacterUnionChampion> {
    return makeNexonAPIRequest<CharacterUnionChampion>('/user/union-champion', { ocid, date });
  }
}

// 匯出單例
export const mapleAPIService = new MapleAPIService();
