/*#######################################################################################

    折れ線グラフコンポーネント

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import React, { FormEventHandler, useEffect, useState } from 'react';
import { type TooltipProps } from 'recharts';
import { type ValueType, type NameType } from 'recharts/types/component/DefaultTooltipContent';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import '../stylesheets/components/Charts.css';
import { Prefecture } from './Prefectures';
import { fetchPopulationCompositionPerYear } from './dataSource';
import { DATASOURCE } from '../global';
import { Button } from './PublicControl';

export interface PopulationCompositionPerYear {
  prefName: string;
  prefCode: number;
  boundaryYear: number;
  data: [
    {
      label: string;
      data: [
        {
          year: number;
          value: number;
          rate?: number;
        },
      ];
    },
  ];
}

interface Metadata {
  year: number;

  [prefName: string]: number;
}

interface LabeledMetadata {
  label: string;
  data: Metadata[];
}

interface ChartsProps {
  chartRenderingList: Prefecture[];
}

function Charts({ chartRenderingList }: ChartsProps) {
  return (
    <div className={'charts'}>
      <ChartsContent chartRenderingList={chartRenderingList} />
      <ChartsFooter />
    </div>
  );
}

function ChartsContent({ chartRenderingList }: ChartsProps) {
  const [originalChartDataList, setOriginalChartDataList] = useState<PopulationCompositionPerYear[]>([]);
  const [transformedChartDataList, setTransformedChartDataList] = useState<Map<string, Metadata[]>>(new Map());
  const [currentRenderingLabel, setCurrentRenderingLabel] = useState<string>('総人口');
  const [colorMap, setColorMap] = useState<Map<number, string>>(new Map());

  // chartRenderingListによって、APIからデータを取得
  useEffect(() => {
    fetchPopulationCompositionPerYear(
      chartRenderingList,
      originalChartDataList,
      setOriginalChartDataList
    ).then();
  }, [chartRenderingList]);

  // APIからのデータの変換
  useEffect(() => {
    setTransformedChartDataList(transformData(originalChartDataList));
  }, [originalChartDataList]);

  // 都道府県コードとカラーの対応関係を作成
  useEffect(() => {
    let colorIndex: number = 0;
    const updatedColorMap = new Map();
    chartRenderingList.forEach((prefecture: Prefecture) => {
      updatedColorMap.set(prefecture.prefCode, getChartColor(colorIndex));
      colorIndex += 1;
      setColorMap(updatedColorMap);
    });
  }, [originalChartDataList]);

  const handleLabelClicked: FormEventHandler = event => {
    const target = event.target as HTMLInputElement;
    setCurrentRenderingLabel(target.name);
  };

  return (
    <div className={'charts-content'}>
      <div className={'charts-select'}>
        {[...transformedChartDataList.keys()].map((label: string) => {
          if (label === currentRenderingLabel) {
            return (
              <Button
                name={label}
                className={'charts-label-select charts-label-selected'}
                handleFunction={handleLabelClicked}
                innerText={label}
                key={label}
              />
            );
          } else {
            return (
              <Button
                name={label}
                className={'charts-label-select charts-label-unselect'}
                handleFunction={handleLabelClicked}
                innerText={label}
                key={label}
              />
            );
          }
        })}
      </div>
      <div className="charts-display">
        <ResponsiveContainer width={'95%'} height={800}>
          <AreaChart data={transformedChartDataList.get(currentRenderingLabel)}>
            <defs>
              {chartRenderingList.map((prefecture: Prefecture) => {
                return (
                  <linearGradient key={prefecture.prefCode} id={`color-${prefecture.prefCode}`}
                                  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="40%" stopColor={colorMap.get(prefecture.prefCode)} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={colorMap.get(prefecture.prefCode)} stopOpacity={0} />
                  </linearGradient>
                );
              })}
            </defs>
            <XAxis dataKey="year" />
            <YAxis width={85} tickFormatter={(value: number) => {
              if ((Math.floor(value / 10000)) === 0) {
                return '0';
              } else {
                return (Math.floor(value / 10000)) + '\n万人';
              }
            }} />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout={'vertical'}
              align={'right'}
              verticalAlign={'top'}
            />
            {chartRenderingList.map((prefecture: Prefecture) => {
              return (
                <Area key={prefecture.prefCode}
                      type={'natural'}
                      dot={true}
                      dataKey={prefecture.prefName}
                      fillOpacity={0.25}
                      stroke={colorMap.get(prefecture.prefCode)}
                      strokeWidth={2}
                      fill={`url(#color-${prefecture.prefCode})`}
                />
              );
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartsFooter() {
  return (
    <footer className="charts-footer">
      <p>{`Data from ${DATASOURCE}`}</p>
    </footer>
  );
}

const colorPool = [
  '#3498DB', '#ae801f',
  '#DA5641', '#2ea271',
  '#8083E1', '#369DA8',
  '#B5E074', '#2B3D4F'
];

function getChartColor(colorIndex: number): string {
  return colorPool[colorIndex];
}

// APIから得たをReChartデータへ変換
function transformData(dataArray: PopulationCompositionPerYear[]): Map<string, Metadata[]> {
  const transformedData: LabeledMetadata[] = [];
  const transformedDataMap: Map<string, Metadata[]> = new Map();

  dataArray.forEach(({ prefName, data }) => {
    data.forEach((dataWithLabel) => {
      let labeledData = transformedData.find((labeledData) => labeledData.label === dataWithLabel.label);

      if (labeledData === undefined) {
        labeledData = { label: dataWithLabel.label, data: [] };
        transformedData.push(labeledData);
      }

      dataWithLabel.data.forEach(({ year, value }) => {
        if (labeledData !== undefined) { // Ensure labeledData is defined
          let metadata = labeledData.data.find((metadata) => metadata.year === year);

          if (metadata === undefined) {
            metadata = { year, [prefName]: value };
            labeledData.data.push(metadata);
          } else {
            metadata[prefName] = value;
          }
        }
      });

      if (labeledData !== undefined) {
        labeledData.data.sort((a, b) => b.year - a.year);
      }
    });
  });

  transformedData.forEach((labeledData) => {
    transformedDataMap.set(labeledData.label, labeledData.data);
  });

  return transformedDataMap;
}

// Tooltipをカスタム（データを降順で表示する）
function CustomTooltip({ payload, label, active }: TooltipProps<ValueType, NameType>) {
  if (active && payload && payload.length) {
    const sortedPayload = [...payload].sort((a, b) => {
      if (b.value && a.value) {
        return Number(b.value) - Number(a.value);
      } else {
        return 0;
      }
    });
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label} 年`}</p>
        {sortedPayload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
}

export default Charts;
