/*#######################################################################################

    アプリ本体

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import { useState, type FormEventHandler } from 'react';
import { Prefecture, Prefectures } from './Prefectures';
import Charts from './Charts';

function App() {
  const [selectedPrefecturesList, setSelectedPrefecturesList] = useState<Prefecture[]>([]);
  const [chartRenderingList, setChartRenderingList] = useState<Prefecture[]>([]);

  const handleSubmit: FormEventHandler = () => {
    setChartRenderingList(selectedPrefecturesList);
  };

  return (
    <div className={'global-container'}>
      <Prefectures
        selectedPrefecturesList={selectedPrefecturesList}
        setSelectedPrefecturesList={setSelectedPrefecturesList}
        handleSubmit={handleSubmit}
      />
      <Charts chartRenderingList={chartRenderingList} />
    </div>
  );
}

export default App;
