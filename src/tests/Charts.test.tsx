import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import {
  RESAS_API_ENDPOINT,
  RESAS_API_POPULATION_COMPOSITION_PER_YEAR
} from '../global';
import { ChartsMockData } from './mock/Charts.test.Mock';
import { apiClient } from '../components/dataSource';
import Charts from '../components/Charts';
import { type Prefecture } from '../components/Prefectures';

const mock = new MockAdapter(apiClient);

describe('折れ線グラフコンポーネント テスト', () => {
  const prefectureTokyo: Prefecture = { prefCode: 13, prefName: '東京都' };
  const chartRenderingList: Prefecture[] = [prefectureTokyo];

  test('Success', async () => {
    mock.onGet(`${RESAS_API_ENDPOINT}${RESAS_API_POPULATION_COMPOSITION_PER_YEAR}`)
      .reply(200, ChartsMockData);
    render(<Charts chartRenderingList={chartRenderingList} />);

    await waitFor(() => {
      expect(screen.getByText('総人口')).toBeInTheDocument();
    });
  });

  test('Bad_Response', async () => {
    mock.onGet(`${RESAS_API_ENDPOINT}${RESAS_API_POPULATION_COMPOSITION_PER_YEAR}`)
      .reply(404);
    render(<Charts chartRenderingList={chartRenderingList} />);

    await waitFor(() => {
      expect(screen.getByText('Bad_Response - 404')).toBeInTheDocument();
    });
  });

  test('Request_Timeout', async () => {
    mock.onGet(`${RESAS_API_ENDPOINT}${RESAS_API_POPULATION_COMPOSITION_PER_YEAR}`)
      .timeout();
    render(<Charts chartRenderingList={chartRenderingList} />);

    await waitFor(() => {
      expect(screen.getByText('Request_Timeout')).toBeInTheDocument();
    });
  });

  test('Bad_Request', async () => {
    render(<Charts chartRenderingList={chartRenderingList} />);

    await waitFor(() => {
      expect(screen.getByText('Bad_Request')).toBeInTheDocument();
    });
  });
});