import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import clicksTable from './clicksTable';
const InteractiveDataTable = ({ ticker }) => {
  const [data, setData] = useState([]);
  const [margin, setMargin] = useState({ top: 50, right: 150, bottom: 50, left: 60 });
  const [xMin, setXMin] = useState('auto');
  const [xMax, setXMax] = useState('auto');
  const [yMin, setYMin] = useState('auto');
  const [yMax, setYMax] = useState('auto');
  const [dataClicks, setDataClicks] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/data/'+ticker)
      .then(response => response.json())
      .then(data => {
        const formattedData = [
          {
            id: ticker,
            data: data.times.map((time, index) => ({
              x: new Date(time).getTime(),
              y: data.prices[index],
            })),
          },
        ];

        setData(formattedData);

        // Calculate x-axis min and max
        const xValues = data.times.map(time => new Date(time).getTime());
        const calculatedXMin = Math.min(...xValues);
        const calculatedXMax = Math.max(...xValues);
        setXMin(calculatedXMin);
        setXMax(calculatedXMax);

        // Calculate y-axis min and max
        const yValues = data.prices;
        const calculatedYMin = Math.min(...yValues);
        const calculatedYMax = Math.max(...yValues);
        setYMin(calculatedYMin);
        setYMax(calculatedYMax);

        // Calculate dynamic margins (if needed)
        const calculatedMargin = {
          top: 50,
          right: 150,
          bottom: 50,
          left: 60,
        };
        setMargin(calculatedMargin);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [ticker]);

  const formatXAxis = tick => {
    const date = new Date(tick);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div style={{ height: 400 }}>
      <ResponsiveLine
        data={data}
        margin={margin}
        xScale={{ type: 'linear', min: xMin, max: xMax }}
        yScale={{ type: 'linear', stacked: true, min: yMin, max: yMax }}
        yFormat=" >-.2f"
        curve="monotoneX"
        axisTop={null}
        onClick={(data) => {
          setDataClicks([...dataClicks, data])
        }}
        axisRight={{
          tickValues: 5,
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: '.2s',
          legend: '',
          legendOffset: 0,
        }}
        axisBottom={{
          tickValues: 5,
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: formatXAxis,
          legend: 'time',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickValues: 5,
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: '.4s',
          legend: 'price',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        enableGridX={false}
        colors={{ scheme: 'spectral' }}
        lineWidth={1}
        pointSize={4}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={1}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 140,
            translateY: 0,
            itemsSpacing: 2,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 12,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
      
      <clicksTable/>
    </div>
  );
};

export default InteractiveDataTable;
