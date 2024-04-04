import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Prefectures } from '../components/Prefectures';
import MockAdapter from 'axios-mock-adapter';
import {
  RESAS_API_ENDPOINT,
  RESAS_API_PREFECTURES
} from '../global';
import { apiClient } from '../components/dataSource';
import { PrefectureMockData } from './mock/dataSource.test.Mock';

const mock = new MockAdapter(apiClient);

describe('都道府県選択コンポーネント テスト', () => {
  const setChartRenderingList = jest.fn();

  test('Success', async () => {
    mock.onGet(`${RESAS_API_ENDPOINT}${RESAS_API_PREFECTURES}`)
      .reply(200, PrefectureMockData);
    render(
      <Prefectures setChartRenderingList={setChartRenderingList}/>
    );

    await waitFor(() => {
      expect(screen.getByText('東京都')).toBeInTheDocument();
    });
  });

  test('Bad_Response', async () => {
    mock.onGet(`${RESAS_API_ENDPOINT}${RESAS_API_PREFECTURES}`)
      .reply(404);
    render(
      <Prefectures setChartRenderingList={setChartRenderingList}/>
    );

    await waitFor(() => {
      expect(screen.getByText('Bad_Response - 404')).toBeInTheDocument();
    });
  });

  test('Request_Timeout', async () => {
    mock.onGet(`${RESAS_API_ENDPOINT}${RESAS_API_PREFECTURES}`)
      .timeout();
    render(
      <Prefectures setChartRenderingList={setChartRenderingList}/>
    );

    await waitFor(() => {
      expect(screen.getByText('Request_Timeout')).toBeInTheDocument();
    });
  });

  test('Bad_Request', async () => {
    render(
      <Prefectures setChartRenderingList={setChartRenderingList}/>
    );

    await waitFor(() => {
      expect(screen.getByText('Bad_Request')).toBeInTheDocument();
    });
  });
});