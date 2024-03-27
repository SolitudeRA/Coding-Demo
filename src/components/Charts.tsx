/*#######################################################################################

    折れ線グラフコンポーネント

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import getPrefecturesData from './datasource';
import '../stylesheets/components/Charts.css';

function Charts() {
  return (
    <div className="charts global-container">
      <ChartsHeader />
      <ChartsContent />
      <ChartsFooter />
    </div>
  );
}

function ChartsHeader() {
  return (
    <header className="charts-header">

    </header>
  );
}

function ChartsContent() {
  return (
    <div className="charts-content">
      <LineChart width={800} height={500} data={getPrefecturesData}>
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis dataKey="uv" />
        <Tooltip />
      </LineChart>
    </div>
  );
}

function ChartsFooter() {
  const dataSource = 'testDataSource';
  return (
    <footer className="charts-footer">
      <p>
        Data is powered by {dataSource}
      </p>
    </footer>
  );
}

export default Charts;