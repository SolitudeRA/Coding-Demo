import MockAdapter from 'axios-mock-adapter';
import { fetchPrefectures, fetchPopulationData, apiClient } from '../components/dataSource';
import { type Prefecture } from '../components/Prefectures';
import { RESAS_API_ENDPOINT, RESAS_API_PREFECTURES, RESAS_API_POPULATION_COMPOSITION_PER_YEAR } from '../global';
import { PrefectureMockData, PopulationCompositionPerYearMockData } from './mock/dataSource.test.Mock';

const mock = new MockAdapter(apiClient);

describe('RESAS API Client テスト (Data Source)', () => {
  const prefectureMockSaiTama: Prefecture = { prefCode: 11, prefName: '埼玉県' };
  const prefectureMockTokyo = { prefCode: 13, prefName: '東京都' };
  const chartRenderingList = [prefectureMockTokyo];

  describe('都道府県一覧 データ読み込み (fetchPrefectures)', () => {
    test('作動異常なし', async () => {
      mock.onGet(`${RESAS_API_ENDPOINT}${RESAS_API_PREFECTURES}`).reply(200, PrefectureMockData);
      const fetchedData = await fetchPrefectures();

      expect(fetchedData.data.result).toContainEqual(prefectureMockSaiTama);
    });
  });

  describe('人口構成 データ読み込み (fetchPopulationData)', () => {
    test(`作動異常なし`, async () => {
      mock
        .onGet(`${RESAS_API_ENDPOINT}${RESAS_API_POPULATION_COMPOSITION_PER_YEAR}`, {
          params: {
            prefCode: prefectureMockTokyo.prefCode,
            cityCode: '-',
          },
        })
        .reply(200, PopulationCompositionPerYearMockData);
      const fetchedData = await fetchPopulationData(chartRenderingList);

      expect(fetchedData[0].data).toMatchObject(PopulationCompositionPerYearMockData);
    });
  });
});
