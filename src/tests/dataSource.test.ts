import { fetchPopulationCompositionPerYear, fetchPrefectures } from '../components/dataSource';
import { type Prefecture } from '../components/Prefectures';

describe('RESAS API Client テスト (Data Source)', () => {
  const prefectureMockTokyo: Prefecture = { prefCode: 13, prefName: '東京都' };
  const prefectureMockChiba: Prefecture = { prefCode: 12, prefName: '千葉県' };
  const chartRenderingListMock: Prefecture[] = [prefectureMockChiba, prefectureMockTokyo];

  test('都道府県一覧 データ読み込み', async () => {
    expect(await fetchPrefectures())
      .toContainEqual(prefectureMockTokyo);
  });

  test('人口構成 データ読み込み', async () => {
    const result = await fetchPopulationCompositionPerYear(chartRenderingListMock);

    // resultは空でない
    expect(result).toBeTruthy();
    // resultの構造は期待通りである
    expect(result[0]).toHaveProperty('prefName');
    expect(result[0]).toHaveProperty('prefCode');
    expect(result[0]).toHaveProperty('boundaryYear');
    expect(result[0]).toHaveProperty('data')
  });
});
