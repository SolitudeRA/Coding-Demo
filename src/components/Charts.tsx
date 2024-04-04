/*#######################################################################################

    折れ線グラフコンポーネント

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import React, { type FormEventHandler, useEffect, useState } from 'react';
import '../stylesheets/components/Charts.css';
import { Prefecture } from './Prefectures';
import { type Metadata, fetchTransformedPopulationData } from './dataSource';
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

/* ========================================== 折れ線グラフコンポーネント ========================================== */

function Charts({ chartRenderingList }: ChartsProps) {
  const [transformedChartDataMap, setTransformedChartDataMap] = useState<Map<string, Metadata[]>>(new Map());
  const [currentRenderingLabel, setCurrentRenderingLabel] = useState<string>('総人口');
  const [fetchingState, setFetchingState] = useState<[string, string]>(['Bad_Request', '']);

  // chartRenderingListによって、APIからデータを取得、変換
  useEffect(() => {
    fetchTransformedPopulationData(chartRenderingList)
      .then(transformedDataMap => {
        setFetchingState(['Success', '']);
        setTransformedChartDataMap(transformedDataMap);
      })
      .catch(error => {
        if (error.response) {
          setFetchingState(['Bad_Response', `${error.response.status}`]);
        } else if (error.code === 'ECONNABORTED') {
          setFetchingState(['Request_Timeout', '']);
        } else {
          setFetchingState(['Bad_Request', '']);
        }
      });
  }, [chartRenderingList]);

  switch (fetchingState[0]) {
    case 'Success':
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
    case 'Bad_Response':
      return (
        <div className={'charts'}>
          <h2 className={'app-error'}>{`${fetchingState[0]} - ${fetchingState[1]}`}</h2>
          <ChartsFooter />
        </div>
      );
    case 'Request_Timeout':
    case 'Bad_Request':
      return (
        <div className={'charts'}>
          <h2 className={'app-error'}>{`${fetchingState[0]}`}</h2>
          <ChartsFooter />
        </div>
      );
  }

  return <div></div>;
}

/* ========================================== Header ========================================== */

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
    return <div></div>;
  } else {
    return (
      <div className={'charts-select'}>
        {labelList.map((label: string) => {
          if (label === state) {
            return (
              <button
                key={label}
                className={'charts-label-select charts-label-selected'}
                name={label}
                onClick={handleLabelClicked}
              >
                {label}
              </button>
            );
          } else {
            return (
              <button
                key={label}
                className={'charts-label-select charts-label-unselect'}
                name={label}
                onClick={handleLabelClicked}
              >
                {label}
              </button>
            );
          }
        })}
      </div>
    );
  }
}

/* ========================================== Content ========================================== */

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
      if (colorIndex + 1 > colorPool.length - 1) {
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

/* ========================================== Footer ========================================== */

// Data Sourceの提示
function ChartsFooter() {
  return (
    <footer className="charts-footer">
      <p>{`Data from ${DATASOURCE}`}</p>
      <p>Developed by SolitudeRA</p>
    </footer>
  );
}

export default Charts;
