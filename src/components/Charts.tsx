/*#######################################################################################

    折れ線グラフコンポーネント

    Author: SolitudeRA
    Github: @SolitudeRA
    Mail: studio@solitudera.com

#########################################################################################*/

import React from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import '../stylesheets/components/Charts.css';
import { fetchPopulationCompositionPerYear } from './dataSource';

interface PopulationCompositionPerYear {
  boundaryYear: number;
  data: {
    label: string;
    data: [
      {
        year: number;
        value: number;
        rate: number | undefined;
      },
    ];
  };
}

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
  const [dataList, setDataList] = React.useState<string>('');

  React.useEffect(() => {
    fetchPopulationCompositionPerYear(13).then(
      (response: PopulationCompositionPerYear) => {
        setDataList(JSON.stringify(response));
      },
    );
  });

  return <header className="charts-header">{dataList}</header>;
}

function ChartsContent() {
  return (
    <div className="charts-content">
      <LineChart width={800} height={500}>
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
      <p>Data is powered by {dataSource}</p>
    </footer>
  );
}

export default Charts;
