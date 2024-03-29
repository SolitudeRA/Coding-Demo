/*#######################################################################################

    折れ線グラフコンポーネント

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip, Legend,
} from 'recharts';
import '../stylesheets/components/Charts.css';
import { Prefecture } from './Prefectures';
import { fetchPopulationCompositionPerYear } from './dataSource';

export interface PopulationCompositionPerYear {
  prefName: string;
  prefCode: number;
  boundaryYear: number;
  data: [{
    label: string;
    data: [
      {
        year: number;
        value: number;
        rate?: number;
      },
    ];
  }];
}

interface ChartsProps {
  chartRenderingList: Prefecture[];
}

function Charts({ chartRenderingList }: ChartsProps) {
  return (
    <div className={'charts global-container'}>
      <ChartsHeader chartRenderingList={chartRenderingList} />
      <ChartsContent chartRenderingList={chartRenderingList} />
      <ChartsFooter />
    </div>
  );
}

function ChartsHeader({ chartRenderingList }: ChartsProps) {
  return (
    <header className={'charts-header'}>
      <h2>選択した都道府県</h2>
      <div>
        {chartRenderingList.map((prefecture: Prefecture) => {
          return <span className={'charts-selected-prefecture'} key={prefecture.prefCode}>{prefecture.prefName}</span>;
        })}
      </div>
    </header>
  );
}

function ChartsContent({ chartRenderingList }: ChartsProps) {
  const [chartDataListOrigin, setChartDataListOrigin] = useState<PopulationCompositionPerYear[]>([]);
  const [chartDataList, setChartDataList] = useState<Metadata[]>([]);
  const [colorMap, setColorMap] = useState<Map<number, string>>();

  useEffect(() => {
    const newColorMap = new Map(colorMap);
    chartRenderingList.forEach((prefecture: Prefecture) => {
      newColorMap.set(prefecture.prefCode, getColor());
    });
    setColorMap(newColorMap);
    fetchPopulationCompositionPerYear(chartRenderingList, chartDataListOrigin, setChartDataListOrigin).then();
  }, [chartRenderingList]);

  useEffect(() => {
    setChartDataList(transformData(chartDataListOrigin));
  }, [chartDataListOrigin]);

  return (
    <div className="charts-content">
      <AreaChart width={1200} height={800} data={chartDataList}>
        <defs>
          {chartRenderingList.map((prefecture: Prefecture) => {
            return (
              <linearGradient key={prefecture.prefCode} id={`color-${prefecture.prefCode}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorMap?.get(prefecture.prefCode)} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colorMap?.get(prefecture.prefCode)} stopOpacity={0} />
              </linearGradient>
            );
          })}
        </defs>
        <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Legend />
        {chartRenderingList.map((prefecture: Prefecture) => {
          return (
            <Area
              key={prefecture.prefCode}
              type={'monotone'}
              dataKey={prefecture.prefName}
              fillOpacity={1}
              stroke={colorMap?.get(prefecture.prefCode)}
              fill={`url(#color-${prefecture.prefCode})`}
            />
          );
        })}
      </AreaChart>
    </div>
  );
}

function ChartsFooter() {
  const dataSource = 'testDataSource';
  return (
    <footer className="charts-footer">
      <p>Data is powered by {dataSource}</p>
    </footer>
  );
}


const colorPool = ['#8F48FA', '#FA48E6', '#CB48FA', '#5648FA',
  '#FA487C', '#E19CFA', '#6B617A', '#D2A6CD',
  '#62607A', '#7B6168', '#EAF2D4', '#4808D2'];
const getColor: () => string = chartsPalette(colorPool);

function chartsPalette(colors: string[]): () => string {
  let availableColors: string[] = [...colors];

  return function(): string {
    if (availableColors.length === 0) {
      availableColors = [...colors];
    }
    const randomIndex: number = Math.floor(Math.random() * availableColors.length);
    const color: string = availableColors[randomIndex];
    availableColors.splice(randomIndex, 1);
    return color;
  };
}

interface Metadata {
  year: number;

  [prefName: string]: number;
}

function transformData(dataArray: PopulationCompositionPerYear[]): Metadata[] {
  const metaDataList: Metadata[] = [];

  dataArray.forEach((populationData: PopulationCompositionPerYear) => {
    const prefName = populationData.prefName;
    populationData.data[0].data.forEach((element) => {
      let metaData = metaDataList.find(metadata => metadata.year === element.year);
      if (metaData) {
        metaData[prefName] = element.value;
      } else {
        metaData = { year: element.year, [prefName]: element.value };
        metaDataList.push(metaData);
      }
    });
  });


  metaDataList.sort((a, b) => a.year - b.year);

  return metaDataList;
}

export default Charts;
