/*#######################################################################################

    都道府県選択コンポーネント

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import * as React from 'react';
import { fetchPrefectures } from './dataSource';
import '../stylesheets/components/Prefectures.css';

interface Prefecture {
  prefCode: number;
  prefName: string;
}

function Prefectures() {
  return (
    <div className="prefectures global-container">
      <PrefecturesHeader />
      <PrefecturesContent />
      <PrefecturesFooter />
    </div>
  );
}

function PrefecturesHeader() {
  return (
    <header className="prefectures-header">
      <h1>都道府県</h1>
    </header>
  );
}

function PrefecturesContent() {
  return (
    <div className="prefectures-content">
      <PrefecturesForm />
    </div>
  );
}

function PrefecturesForm() {
  const [dataList, setDataList] = React.useState<string>('');

  React.useEffect(() => {
    fetchPrefectures().then((response: Prefecture[]) => {
      setDataList(JSON.stringify(response));
    });
  });

  return <form>{dataList}</form>;
}

function PrefecturesFooter() {
  return <div className="prefectures-footer"></div>;
}

export default Prefectures;
