/*#######################################################################################

    折れ線グラフコンポーネント

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import React, { type FormEventHandler, useEffect, useState } from 'react';
import '../stylesheets/components/Charts.css';
import { Prefecture } from './Prefectures';
import { fetchPopulationCompositionPerYear } from './dataSource';
import { Button } from './PublicControl';
import { ChartsGraphWrapper } from './ChartsControl';
import { DATASOURCE } from '../global';

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

interface ChartsProps {
  chartRenderingList: Prefecture[];
}

function Charts({ chartRenderingList }: ChartsProps) {
  const [transformedChartDataMap, setTransformedChartDataMap] = useState<Map<string, Metadata[]>>(new Map());
  const [currentRenderingLabel, setCurrentRenderingLabel] = useState<string>('総人口');

  // chartRenderingListによって、APIからデータを取得、変換
  useEffect(() => {
    fetchPopulationCompositionPerYear(chartRenderingList).then((dataList) => {
      setTransformedChartDataMap(transformData(dataList));
    });
  }, [chartRenderingList]);

  return (
    <div className={'charts'}>
      <ChartsHeader
        labelList={[...transformedChartDataMap.keys()]}
        state={currentRenderingLabel}
        setState={setCurrentRenderingLabel}
      />
      <ChartsContent
        chartRenderingList={chartRenderingList}
        chartRenderingData={transformedChartDataMap.get(currentRenderingLabel)}
      />
      <ChartsFooter />
    </div>
  );
}

interface ChartsHeaderProps {
  labelList: string[];
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
}

// データラベル選択UI
function ChartsHeader({ labelList, state, setState }: ChartsHeaderProps) {
  const handleLabelClicked: FormEventHandler = event => {
    const target = event.target as HTMLInputElement;
    setState(target.name);
  };

  if (labelList.length === 0) {
    return (
      <div></div>
    );
  } else {
    return (
      <div className={'charts-select'}>
        {labelList.map((label: string) => {
          if (label === state) {
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
    );
  }
}

interface ChartsContentProps {
  chartRenderingList: Prefecture[];
  chartRenderingData: Metadata[] | undefined;
}

function ChartsContent({ chartRenderingList, chartRenderingData }: ChartsContentProps) {
  const colorPool = ['#3498DB', '#AE801F', '#DA5641', '#1D6647', '#8083E1', '#369DA8', '#7CAD31', '#FCAA44'];
  const [colorMap, setColorMap] = useState<Map<number, string>>(new Map());

  // 都道府県コードとカラーの対応関係を作成
  useEffect(() => {
    let colorIndex: number = 0;
    const updatedColorMap = new Map();
    chartRenderingList.forEach((prefecture: Prefecture) => {
      updatedColorMap.set(prefecture.prefCode, colorPool[colorIndex]);
      if (colorIndex + 1 > (colorPool.length - 1)) {
        colorIndex = 0;
      } else {
        colorIndex += 1;
      }
      setColorMap(updatedColorMap);
    });
  }, [chartRenderingList]);

  return (
    <div className={'charts-content'}>
      <ChartsGraphWrapper
        chartRenderingList={chartRenderingList}
        colorMap={colorMap}
        chartRenderingData={chartRenderingData}
      />
    </div>
  );
}

// Data Sourceの提示
function ChartsFooter() {
  return (
    <footer className="charts-footer">
      <p>{`Data from ${DATASOURCE}`}</p>
    </footer>
  );
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
function transformData(dataArray: PopulationCompositionPerYear[]): Map<string, Metadata[]> {
  const transformedData: LabeledMetadata[] = [];
  const transformedDataMap: Map<string, Metadata[]> = new Map();

  // 都道府県の名前、データを読み込む
  dataArray.forEach(({ prefName, data }) => {
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

export default Charts;
