/*#######################################################################################

    都道府県選択コンポーネント

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import { useState, useEffect, type Dispatch, type SetStateAction, type FormEventHandler } from 'react';
import { fetchPrefectures } from './dataSource';
import '../stylesheets/components/Prefectures.css';
import { Checkbox } from './PrefecturesControl';
import { type AxiosResponse } from 'axios';

export interface Prefecture {
  prefCode: number;
  prefName: string;
}

/* ========================================== 都道府県コンポーネント ========================================== */

interface PrefecturesProps {
  setChartRenderingList: Dispatch<SetStateAction<Prefecture[]>>;
}

export function Prefectures({ setChartRenderingList }: PrefecturesProps) {
  const [prefecturesList, setPrefecturesList] = useState<Prefecture[]>([]);
  const [fetchingState, setFetchingState] = useState<[string, string]>(['Bad_Request', '']);

  // UI Rendering完成後、APIからprefecturesListを更新
  useEffect(() => {
    fetchPrefectures()
      .then((response: AxiosResponse) => {
        setPrefecturesList(response.data.result);
        setFetchingState(['Success', '']);
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
  }, []);

  switch (fetchingState[0]) {
    case 'Success':
      return (
        <div className={'prefectures'}>
          <PrefecturesHeader />
          <PrefecturesContent prefecturesList={prefecturesList} setChartRenderingList={setChartRenderingList} />
        </div>
      );
    case 'Bad_Response':
      return (
        <div className={'prefectures'}>
          <h2 className={'app-error'}>{`${fetchingState[0]} - ${fetchingState[1]}`}</h2>
        </div>
      );
    case 'Request_Timeout':
    case 'Bad_Request':
      return (
        <div className={'prefectures'}>
          <h2 className={'app-error'}>{`${fetchingState[0]}`}</h2>
        </div>
      );
  }

  return <div></div>;
}

/* ========================================== Header ========================================== */

function PrefecturesHeader() {
  return (
    <header className={'prefectures-header'}>
      <h1>都道府県</h1>
    </header>
  );
}

/* ========================================== Content ========================================== */

interface PrefecturesContentProps {
  prefecturesList: Prefecture[];
  setChartRenderingList: Dispatch<SetStateAction<Prefecture[]>>;
}

function PrefecturesContent({ prefecturesList, setChartRenderingList }: PrefecturesContentProps) {
  return (
    <div className={'prefectures-content'}>
      <PrefecturesForm prefecturesList={prefecturesList} setChartRenderingList={setChartRenderingList} />
    </div>
  );
}

export function PrefecturesForm({ prefecturesList, setChartRenderingList }: PrefecturesContentProps) {
  const [selectedPrefecturesList, setSelectedPrefecturesList] = useState<Prefecture[]>([]);

  const onSubmit: FormEventHandler = () => {
    setChartRenderingList(selectedPrefecturesList);
  };
  const onReset = () => {
    setSelectedPrefecturesList([]);
  };

  return (
    <div className={'prefectures-form'}>
      <CheckBoxWrapper
        prefecturesList={prefecturesList}
        selectedPrefecturesList={selectedPrefecturesList}
        setSelectedPrefecturesList={setSelectedPrefecturesList}
      />
      <div>
        <button className={'prefectures-form-submit'} name={'グラフを表示'} onClick={onSubmit}>
          {'グラフを表示'}
        </button>
        <button className={'prefectures-form-reset'} name={'リセット'} onClick={onReset}>
          {'リセット'}
        </button>
      </div>
    </div>
  );
}

interface CheckBoxContainerProps {
  prefecturesList: Prefecture[];
  selectedPrefecturesList: Prefecture[];
  setSelectedPrefecturesList: Dispatch<SetStateAction<Prefecture[]>>;
}

function CheckBoxWrapper({
  prefecturesList,
  selectedPrefecturesList,
  setSelectedPrefecturesList,
}: CheckBoxContainerProps) {
  const handleCheck = (prefecture: Prefecture) => {
    let newSelectedPrefecturesList: Prefecture[];
    if (Boolean(selectedPrefecturesList.find(element => element.prefName === prefecture.prefName))) {
      newSelectedPrefecturesList = selectedPrefecturesList.filter(element => element.prefName !== prefecture.prefName);
    } else {
      newSelectedPrefecturesList = selectedPrefecturesList.concat({
        prefCode: prefecture.prefCode,
        prefName: prefecture.prefName,
      });
    }
    setSelectedPrefecturesList(newSelectedPrefecturesList);
    console.log(selectedPrefecturesList);
  };

  return (
    <div className={'prefectures-checkbox-container'}>
      {prefecturesList.map((prefecture: Prefecture) => {
        return (
          <Checkbox
            key={prefecture.prefCode}
            name={prefecture.prefName}
            containerClassname={
              selectedPrefecturesList.find(element => element.prefCode === prefecture.prefCode)
                ? 'prefectures-checkbox prefectures-checkbox-checked'
                : 'prefectures-checkbox'
            }
            defaultValue={`${prefecture.prefCode}`}
            onCheck={handleCheck}
            checked={Boolean(selectedPrefecturesList.find(element => element.prefCode === prefecture.prefCode))}
          />
        );
      })}
    </div>
  );
}
