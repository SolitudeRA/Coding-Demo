/*#######################################################################################

    都道府県選択コンポーネント

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import { useState, useEffect, type Dispatch, type SetStateAction, type FormEventHandler, type MouseEvent } from 'react';
import { fetchPrefectures } from './dataSource';
import '../stylesheets/components/Prefectures.css';
import { Button, Checkbox } from './PublicControl';

export interface Prefecture {
  prefCode: number;
  prefName: string;
}

interface PrefecturesProps {
  selectedPrefecturesList: Prefecture[];
  setSelectedPrefecturesList: Dispatch<SetStateAction<Prefecture[]>>;
  handleSubmit: FormEventHandler;
}

export function Prefectures({ selectedPrefecturesList, setSelectedPrefecturesList, handleSubmit }: PrefecturesProps) {
  const [prefecturesList, setPrefecturesList] = useState<Prefecture[]>([]);

  useEffect(() => {
    fetchPrefectures().then((response: Prefecture[]) => {
      setPrefecturesList(response);
    });
  }, []);

  return (
    <div className={'prefectures'}>
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

interface PrefecturesContentProps {
  prefecturesList: Prefecture[];
  selectedPrefecturesList: Prefecture[];
  setSelectedPrefecturesList: Dispatch<SetStateAction<Prefecture[]>>;
  handleSubmit: FormEventHandler;
}

function PrefecturesContent({
                              prefecturesList,
                              selectedPrefecturesList,
                              setSelectedPrefecturesList,
                              handleSubmit
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

export function PrefecturesForm({
                                  prefecturesList,
                                  selectedPrefecturesList,
                                  setSelectedPrefecturesList,
                                  handleSubmit
                                }: PrefecturesContentProps) {
  const handleCheckboxChange: FormEventHandler = event => {
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      const updatedSelectedPrefecturesList = Array.from(selectedPrefecturesList);
      selectedPrefecturesList = updatedSelectedPrefecturesList.concat([
        {
          prefCode: Number(target.value),
          prefName: target.name
        }
      ]);
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
    <div className={'prefectures-form'}>
      <CheckBoxWrapper
        prefecturesList={prefecturesList}
        selectedPrefecturesList={selectedPrefecturesList}
        handleCheckboxChange={handleCheckboxChange}
      />
      <div>
        <Button
          name={'グラフを表示'}
          className={'prefectures-form-submit'}
          handleFunction={handleSubmit}
          innerText={'グラフを表示'}
        />
      </div>
    </div>
  );
}

interface CheckBoxContainerProps {
  prefecturesList: Prefecture[];
  selectedPrefecturesList: Prefecture[];
  handleCheckboxChange: FormEventHandler;
}

function CheckBoxWrapper({ prefecturesList, selectedPrefecturesList, handleCheckboxChange }: CheckBoxContainerProps) {
  // Check box container部分のClick eventを対処する
  const handleContainerClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    if (target.tagName !== 'INPUT') {
      const checkbox = target.querySelector('input[type="checkbox"]');
      if (checkbox) {
        (checkbox as HTMLInputElement).click();
      }
    }
  };
  // label部分のClick eventを対処する
  const handleLabelClick = (event: MouseEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const checkbox = event.currentTarget.previousSibling as HTMLInputElement;
    checkbox.click();
  };

  return (
    <div className={'prefectures-checkbox-container'} onClick={handleContainerClick}>
      {prefecturesList.map((prefecture: Prefecture) => {
        if (selectedPrefecturesList.find(selectedPrefecture => prefecture.prefCode === selectedPrefecture.prefCode)) {
          return (
            <Checkbox
              name={prefecture.prefName}
              containerClassname={'prefectures-checkbox prefectures-checkbox-checked'}
              controlClassName={''}
              defaultValue={`${prefecture.prefCode}`}
              handleFunction={handleCheckboxChange}
              labelClassName={''}
              innerText={prefecture.prefName}
              handleLabelClick={handleLabelClick}
              key={prefecture.prefCode}
            />
          );
        } else {
          return (
            <Checkbox
              name={prefecture.prefName}
              containerClassname={'prefectures-checkbox'}
              controlClassName={''}
              defaultValue={`${prefecture.prefCode}`}
              handleFunction={handleCheckboxChange}
              labelClassName={''}
              innerText={prefecture.prefName}
              handleLabelClick={handleLabelClick}
              key={prefecture.prefCode}
            />
          );
        }
      })}
    </div>
  );
}
