/*#######################################################################################

    都道府県選択コンポーネント

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import { useState, useEffect, type Dispatch, type SetStateAction, type FormEventHandler } from 'react';
import { fetchPrefectures } from './dataSource';
import '../stylesheets/components/Prefectures.css';

export interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PrefecturesProps {
  selectedPrefecturesList: Prefecture[];
  setSelectedPrefecturesList: Dispatch<SetStateAction<Prefecture[]>>;
  handleSubmit: FormEventHandler;
}

interface PrefecturesContentProps {
  prefecturesList: Prefecture[];
  selectedPrefecturesList: Prefecture[];
  setSelectedPrefecturesList: Dispatch<SetStateAction<Prefecture[]>>;
  handleSubmit: FormEventHandler;
}

interface PrefectureCheckboxProps {
  prefecture: Prefecture;
  handleCheck: FormEventHandler;
}

export function Prefectures({ selectedPrefecturesList, setSelectedPrefecturesList, handleSubmit }: PrefecturesProps) {
  const [prefecturesList, setPrefecturesList] = useState<Prefecture[]>([]);

  useEffect(() => {
    fetchPrefectures().then((response: Prefecture[]) => {
      setPrefecturesList(response);
    });
  }, []);

  return (
    <div className={'prefectures global-container'}>
      <PrefecturesHeader />
      <PrefecturesContent
        prefecturesList={prefecturesList}
        selectedPrefecturesList={selectedPrefecturesList}
        setSelectedPrefecturesList={setSelectedPrefecturesList}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

function PrefecturesHeader() {
  return (
    <header className={'prefectures-header'}>
      <h1>都道府県</h1>
    </header>
  );
}

function PrefecturesContent({
                              prefecturesList,
                              selectedPrefecturesList,
                              setSelectedPrefecturesList,
                              handleSubmit,
                            }: PrefecturesContentProps) {
  return (
    <div className={'prefectures-content'}>
      <PrefecturesForm
        prefecturesList={prefecturesList}
        selectedPrefecturesList={selectedPrefecturesList}
        setSelectedPrefecturesList={setSelectedPrefecturesList}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

function PrefecturesForm({
                           prefecturesList,
                           selectedPrefecturesList,
                           setSelectedPrefecturesList,
                           handleSubmit,
                         }: PrefecturesContentProps) {
  const handleCheck: FormEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      const newSelectedPrefecturesList = Array.from(selectedPrefecturesList);
      selectedPrefecturesList = newSelectedPrefecturesList.concat([{
        prefCode: Number(target.value),
        prefName: target.name,
      }]);
      setSelectedPrefecturesList(selectedPrefecturesList);
    } else {
      const newSelectedPrefecturesList = Array.from(selectedPrefecturesList);
      selectedPrefecturesList = newSelectedPrefecturesList.filter((prefecture: Prefecture) => {
        return prefecture.prefName !== target.name;
      });
      setSelectedPrefecturesList(selectedPrefecturesList);
    }
  };

  return (
    <div id={'prefectures-form'} className={'prefectures-form'}>
      {prefecturesList.map((prefecture: Prefecture) => {
        return (
          <PrefectureCheckBox
            key={prefecture.prefCode}
            prefecture={prefecture}
            handleCheck={handleCheck}
          />
        );
      })}
      <button onClick={handleSubmit}>提出</button>
    </div>
  );
}

function PrefectureCheckBox({ prefecture, handleCheck }: PrefectureCheckboxProps) {
  const { prefName } = prefecture;

  return (
    <div className={'prefectures-checkbox'} key={prefecture.prefCode}>
      <input type={'checkbox'}
             name={prefName}
             defaultValue={prefecture.prefCode}
             onInput={handleCheck}
      />
      <label form={prefecture.prefName}>{prefecture.prefName}</label>
    </div>
  );
}

export default Prefectures;