/*#######################################################################################

    アプリ本体

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import { useState } from 'react';
import { Prefecture, Prefectures } from './Prefectures';
import Charts from './Charts';

// App Component 折れ線グラフで何を表示するか（chartRenderingList）のstateを管理する
function App() {
  const [chartRenderingList, setChartRenderingList] = useState<Prefecture[]>([]);

  return (
    <div className={'global-container'}>
      <Prefectures setChartRenderingList={setChartRenderingList} />
      <Charts chartRenderingList={chartRenderingList} />
    </div>
  );
}

export default App;
