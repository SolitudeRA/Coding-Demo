/*#######################################################################################

    都道府県データソース ( RESAS(地域経済分析システム) API )

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import {
  RESAS_API_ENDPOINT,
  RESAS_API_KEY,
  RESAS_API_PREFECTURES,
  RESAS_API_POPULATION_COMPOSITION_PER_YEAR,
} from '../global';
import axios from 'axios';

// APIクライアントを設定
const apiClient = axios.create({
  baseURL: RESAS_API_ENDPOINT,
  method: 'get',
  timeout: 5000,
  headers: { 'X-API-KEY': RESAS_API_KEY },
});

// 都道府県データを取得
export async function fetchPrefectures() {
  try {
    const response = await apiClient.get(RESAS_API_PREFECTURES);
    return response.data;
  } catch (error) {
    console.error('API Client Error, unexpected state code.', error);
  }
}

// 人口構成データを取得
export async function fetchPopulationCompositionPerYear(prefCode: number) {
  const cityCode = '-';
  try {
    const response = await apiClient.get(
      RESAS_API_POPULATION_COMPOSITION_PER_YEAR,
      {
        params: {
          prefCode: prefCode,
          cityCode: cityCode,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('API Client Error, unexpected state code.', error);
  }
}
