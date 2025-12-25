/**
 * Character Service
 * 處理角色查詢相關的業務邏輯
 */

import { mapleAPIService } from './mapleAPI.service';
import {
  CharacterBasic,
  CharacterUnionChampion,
  UnionChampionDetail,
} from '../types/mapleAPI';

/**
 * 經驗值數據點介面
 */
export interface ExperienceDataPoint {
  date: string;       // 顯示日期 (MM/DD)
  exp: number;        // 經驗值百分比
  level: number;      // 角色等級
  fullDate: string;   // 完整日期 (YYYY-MM-DD)
}

export class CharacterService {
  /**
   * 取得角色 OCID
   */
  async getCharacterOCID(characterName: string): Promise<{ ocid: string }> {
    return mapleAPIService.getCharacterOCID(characterName);
  }

  /**
   * 一次獲取所有角色相關資料
   * 並行呼叫所有 Nexon API 端點並組合結果
   */
  async getAllCharacterData(ocid: string, date: string | null = null): Promise<any> {
    try {
      // 並行呼叫所有端點
      const [
        basic,
        popularity,
        stat,
        hyperStat,
        ability,
        propensity,
        itemEquipment,
        cashItemEquipment,
        symbolEquipment,
        setEffect,
        beautyEquipment,
        androidEquipment,
        petEquipment,
        skill,
        linkSkill,
        vMatrix,
        hexaMatrix,
        hexaMatrixStat,
        dojang,
        union,
        unionRaider,
        unionArtifact,
        unionChampion,
      ] = await Promise.allSettled([
        mapleAPIService.getCharacterBasic(ocid, date),
        mapleAPIService.getCharacterPopularity(ocid, date),
        mapleAPIService.getCharacterStat(ocid, date),
        mapleAPIService.getCharacterHyperStat(ocid, date),
        mapleAPIService.getCharacterAbility(ocid, date),
        mapleAPIService.getCharacterPropensity(ocid, date),
        mapleAPIService.getCharacterItemEquipment(ocid, date),
        mapleAPIService.getCharacterCashItemEquipment(ocid, date),
        mapleAPIService.getCharacterSymbolEquipment(ocid, date),
        mapleAPIService.getCharacterSetEffect(ocid, date),
        mapleAPIService.getCharacterBeautyEquipment(ocid, date),
        mapleAPIService.getCharacterAndroidEquipment(ocid, date),
        mapleAPIService.getCharacterPetEquipment(ocid, date),
        mapleAPIService.getCharacterSkill(ocid, date, '6'),
        mapleAPIService.getCharacterLinkSkill(ocid, date),
        mapleAPIService.getCharacterVMatrix(ocid, date),
        mapleAPIService.getCharacterHexaMatrix(ocid, date),
        mapleAPIService.getCharacterHexaMatrixStat(ocid, date),
        mapleAPIService.getCharacterDojang(ocid, date),
        mapleAPIService.getUnion(ocid, date),
        mapleAPIService.getUnionRaider(ocid, date),
        mapleAPIService.getUnionArtifact(ocid, date),
        mapleAPIService.getUnionChampion(ocid, date),
      ]);

      // 取得主角色的基本資料（如果成功的話）
      const mainCharacterBasic = basic.status === 'fulfilled' ? basic.value : null;

      // 取得前六天的經驗值歷史紀錄
      const expHistory = await this.getExpHistory(ocid, date, mainCharacterBasic);

      // 建立七天經驗值數據
      const expData = this.buildExperienceData(expHistory, mainCharacterBasic);

      // 取得 unionChampion 資料
      const unionChampionData: CharacterUnionChampion | null = 
        unionChampion.status === 'fulfilled' ? unionChampion.value : null;

      // 取得 unionChampion 分身的詳細資料（圖片和等級）
      const unionChampionDetails = await this.getUnionChampionDetails(
        unionChampionData,
        mainCharacterBasic,
        date
      );

      // 組合所有成功的結果
      return {
        ocid,
        date: date || new Date().toISOString().split('T')[0],
        basic: basic.status === 'fulfilled' ? basic.value : null,
        popularity: popularity.status === 'fulfilled' ? popularity.value : null,
        stat: stat.status === 'fulfilled' ? stat.value : null,
        hyperStat: hyperStat.status === 'fulfilled' ? hyperStat.value : null,
        ability: ability.status === 'fulfilled' ? ability.value : null,
        propensity: propensity.status === 'fulfilled' ? propensity.value : null,
        itemEquipment: itemEquipment.status === 'fulfilled' ? itemEquipment.value : null,
        cashItemEquipment: cashItemEquipment.status === 'fulfilled' ? cashItemEquipment.value : null,
        symbolEquipment: symbolEquipment.status === 'fulfilled' ? symbolEquipment.value : null,
        setEffect: setEffect.status === 'fulfilled' ? setEffect.value : null,
        beautyEquipment: beautyEquipment.status === 'fulfilled' ? beautyEquipment.value : null,
        androidEquipment: androidEquipment.status === 'fulfilled' ? androidEquipment.value : null,
        petEquipment: petEquipment.status === 'fulfilled' ? petEquipment.value : null,
        skill: skill.status === 'fulfilled' ? skill.value : null,
        linkSkill: linkSkill.status === 'fulfilled' ? linkSkill.value : null,
        vMatrix: vMatrix.status === 'fulfilled' ? vMatrix.value : null,
        hexaMatrix: hexaMatrix.status === 'fulfilled' ? hexaMatrix.value : null,
        hexaMatrixStat: hexaMatrixStat.status === 'fulfilled' ? hexaMatrixStat.value : null,
        dojang: dojang.status === 'fulfilled' ? dojang.value : null,
        union: union.status === 'fulfilled' ? union.value : null,
        unionRaider: unionRaider.status === 'fulfilled' ? unionRaider.value : null,
        unionArtifact: unionArtifact.status === 'fulfilled' ? unionArtifact.value : null,
        unionChampion: unionChampionData,
        unionChampionDetails,
        expHistory,
        expData,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 取得前六天的經驗值歷史紀錄
   * @private
   */
  private async getExpHistory(
    ocid: string,
    date: string | null,
    mainCharacterBasic: CharacterBasic | null
  ): Promise<CharacterBasic[]> {
    const expHistory: CharacterBasic[] = [];
    
    if (!mainCharacterBasic) {
      return expHistory;
    }

    const currentDate = date ? new Date(date) : new Date();

    for (let i = 6; i >= 1; i--) {
      try {
        const pastDate = new Date(currentDate);
        pastDate.setDate(pastDate.getDate() - i);
        const dateString = pastDate.toISOString().split('T')[0];

        const pastBasic = await mapleAPIService.getCharacterBasic(ocid, dateString);
        expHistory.push(pastBasic);
      } catch (error) {
        console.error(`無法取得 ${i} 天前的資料:`, error);
      }
    }

    return expHistory;
  }

  /**
   * 建立七天經驗值數據
   * @private
   */
  private buildExperienceData(
    expHistory: CharacterBasic[],
    currentBasic: CharacterBasic | null
  ): ExperienceDataPoint[] {
    const expData: ExperienceDataPoint[] = [];
    const today = new Date();

    // 處理過去 6 天的歷史數據
    expHistory.forEach((historyItem, index) => {
      const daysAgo = 6 - index;
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);
      const fullDateString = date.toISOString().split('T')[0] || '';

      expData.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        exp: parseFloat(historyItem.character_exp_rate || '0'),
        level: historyItem.character_level,
        fullDate: fullDateString,
      });
    });

    // 添加今天的數據
    if (currentBasic) {
      const fullDateString = today.toISOString().split('T')[0] || '';
      
      expData.push({
        date: `${today.getMonth() + 1}/${today.getDate()}`,
        exp: parseFloat(currentBasic.character_exp_rate || '0'),
        level: currentBasic.character_level,
        fullDate: fullDateString,
      });
    }

    return expData;
  }

  /**
   * 取得 unionChampion 分身的詳細資料（圖片和等級）
   * @private
   */
  private async getUnionChampionDetails(
    unionChampionData: CharacterUnionChampion | null,
    mainCharacterBasic: CharacterBasic | null,
    date: string | null
  ): Promise<UnionChampionDetail[]> {
    const unionChampionDetails: UnionChampionDetail[] = [];

    if (!unionChampionData || !unionChampionData.union_champion || unionChampionData.union_champion.length === 0) {
      return unionChampionDetails;
    }

    for (const champion of unionChampionData.union_champion) {
      try {
        // 如果分身名稱和主角色名稱相同，直接使用已查詢的資料
        if (mainCharacterBasic && champion.champion_name === mainCharacterBasic.character_name) {
          unionChampionDetails.push({
            champion_name: champion.champion_name,
            character_image: mainCharacterBasic.character_image,
            character_level: mainCharacterBasic.character_level,
          });
          continue;
        }

        // 步驟 1: 取得角色的 OCID
        const { ocid: championOcid } = await mapleAPIService.getCharacterOCID(champion.champion_name);

        // 步驟 2: 使用 OCID 取得角色基本資料
        const basicInfo = await mapleAPIService.getCharacterBasic(championOcid, date);

        // 步驟 3: 將需要的資料加入結果
        unionChampionDetails.push({
          champion_name: champion.champion_name,
          character_image: basicInfo.character_image,
          character_level: basicInfo.character_level,
        });
      } catch (error) {
        // 如果某個分身資料取得失敗，記錄錯誤但繼續處理其他分身
        console.error(`無法取得分身 ${champion.champion_name} 的資料:`, error);
      }
    }

    return unionChampionDetails;
  }
}

// 匯出單例
export const characterService = new CharacterService();
