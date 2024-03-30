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
import { type Dispatch, type SetStateAction } from 'react';
import { type Prefecture } from './Prefectures';
import { PopulationCompositionPerYear } from './Charts';

// APIクライアントを設定
const apiClient = axios.create({
  baseURL: RESAS_API_ENDPOINT,
  method: 'GET',
  timeout: 5000,
  headers: { 'X-API-KEY': RESAS_API_KEY },
});

// 都道府県データを取得
export async function fetchPrefectures() {
  try {
    const response = await apiClient.get(RESAS_API_PREFECTURES);
    return response.data.result;
  } catch (error) {
    console.error('API Client Error, unexpected state code.', error);
  }
}

// 人口構成データを取得
export async function fetchPopulationCompositionPerYear(
  chartRenderingList: Prefecture[],
  chartDataListOrigin: PopulationCompositionPerYear[],
  setChartDataListOrigin: Dispatch<
    SetStateAction<PopulationCompositionPerYear[]>
  >,
) {
  const cityCode = '-';
  let lastRequestTime = 0;
  for (const prefecture of chartRenderingList) {
    try {
      // Request rate limiter
      if (Date.now() - lastRequestTime < 200) {
        await new Promise(resolve =>
          setTimeout(resolve, 200 - (Date.now() - lastRequestTime)),
        );
      }
      lastRequestTime = Date.now();

      const response = await apiClient.get(
        RESAS_API_POPULATION_COMPOSITION_PER_YEAR,
        {
          params: {
            prefCode: prefecture.prefCode,
            cityCode: cityCode,
          },
        },
      );
      response.data.result.prefName = prefecture.prefName;
      response.data.result.prefCode = prefecture.prefCode;
      chartDataListOrigin = Array.from(chartDataListOrigin).concat([
        response.data.result,
      ]);
    } catch (error) {
      console.error('API Client Error, unexpected state code.', error);
    }
  }
  setChartDataListOrigin(chartDataListOrigin);
}
