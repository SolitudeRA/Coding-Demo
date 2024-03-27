/*#######################################################################################

    都道府県選択コンポーネント

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import React from 'react';
import '../stylesheets/components/Prefectures.css';

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

    </header>
  );
}

function PrefecturesContent() {
  return (
    <div className="prefectures-content">

    </div>
  );
}

function PrefecturesFooter() {
  return (
    <div className="prefectures-footer">

    </div>
  );
}

export default Prefectures;
