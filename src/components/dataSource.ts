/*#######################################################################################

    都道府県データソース ( RESAS(地域経済分析システム) API )

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/
import {
  RESAS_API_ENDPOINT,
  RESAS_API_KEY,
  RESAS_API_POPULATION_COMPOSITION_PER_YEAR,
  RESAS_API_PREFECTURES
} from '../global';
import axios, { type AxiosResponse } from 'axios';
import { type Prefecture } from './Prefectures';
import { type PopulationCompositionPerYear } from './Charts';

// APIクライアントを設定
export const apiClient = axios.create({
  baseURL: RESAS_API_ENDPOINT,
  method: 'GET',
  timeout: 5000,
  headers: { 'X-API-KEY': RESAS_API_KEY }
});

// 都道府県データを取得
export async function fetchPrefectures(): Promise<AxiosResponse> {
  return await apiClient.get(RESAS_API_PREFECTURES);
}

// 人口構成データを取得
export async function fetchPopulationData(chartRenderingList: Prefecture[]): Promise<AxiosResponse[]> {
  const cityCode = '-';
  const resultList: AxiosResponse[] = [];
  let lastRequestTime = 0;

  for (const prefecture of chartRenderingList) {
    // Request rate limiter
    if (Date.now() - lastRequestTime < 200) {
      await new Promise(resolve => setTimeout(resolve, 200 - (Date.now() - lastRequestTime)));
    }
    lastRequestTime = Date.now();
    const response = await apiClient.get(RESAS_API_POPULATION_COMPOSITION_PER_YEAR, {
      params: {
        prefCode: prefecture.prefCode,
        cityCode: cityCode
      }
    });
    response.data.result.prefName = prefecture.prefName;
    response.data.result.prefCode = prefecture.prefCode;
    resultList.push(response);
  }

  return resultList;
}

export interface Metadata {
  year: number;

  [prefName: string]: number;
}

interface LabeledMetadata {
  label: string;
  data: Metadata[];
}

// APIから得たをReChartデータへの変換関数
export async function fetchTransformedPopulationData(chartRenderingList: Prefecture[]): Promise<Map<string, Metadata[]>> {
  const resultList: AxiosResponse[] = await fetchPopulationData(chartRenderingList);
  const dataList: PopulationCompositionPerYear[] = resultList.map((result) => {
    return result.data.result;
  });
  const transformedData: LabeledMetadata[] = [];
  const transformedDataMap: Map<string, Metadata[]> = new Map();

  // 都道府県の名前、データを読み込む
  dataList.forEach(({ prefName, data }) => {
    data.forEach(dataWithLabel => {
      // transformedDataでラベルが存在しない場合、新規作成
      let labeledData = transformedData.find(labeledData => labeledData.label === dataWithLabel.label);
      if (labeledData === undefined) {
        labeledData = { label: dataWithLabel.label, data: [] };
        transformedData.push(labeledData);
      }

      // 各都道府県のデータを、ラベルごとで整理
      dataWithLabel.data.forEach(({ year, value }) => {
        if (labeledData !== undefined) {
          let metadata = labeledData.data.find(metadata => metadata.year === year);

          if (metadata === undefined) {
            metadata = { year, [prefName]: value };
            labeledData.data.push(metadata);
          } else {
            metadata[prefName] = value;
          }
        }
      });

      // 各ラベルのデータ年ごと昇順で整理
      if (labeledData !== undefined) {
        labeledData.data.sort((a, b) => b.year - a.year);
      }
    });
  });

  //transformedData Array を Map に変換
  transformedData.forEach(labeledData => {
    transformedDataMap.set(labeledData.label, labeledData.data);
  });

  return transformedDataMap;
}