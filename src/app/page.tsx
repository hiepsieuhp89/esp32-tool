'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import IconTemp from './componet/IconTemp';
import IconHumidity from './componet/IconHumidity';
import IconLight from './componet/IconLight';
import IconLightOff from './componet/IconLightOff';

// Define a type for the data

const ThingSpeakChart = () => {
  const [data, setData] = useState<any>(); // Use the type DataPoint for the data state
  function formatTimeVietnamese(timestamp: any) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  }

  useEffect(() => {
    // Function to fetch data from ThingSpeak API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'https://api.thingspeak.com/channels/2876887/feeds.json?api_key=JHOB4CV990GEFDPG'
        );
        setData(response); // Set the data to state
      } catch (error) {
        console.error('Error fetching data from ThingSpeak:', error);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const lastDataPoint = data?.data?.feeds[data?.data?.feeds.length - 1];
  console.log('Last data point:', lastDataPoint);
  const temp = lastDataPoint?.field1;
  const humidity = lastDataPoint?.field2;
  const light = lastDataPoint?.field3;
  const time = lastDataPoint?.created_at;

  return (
    <div className='max-w-[1200px] mx-auto'>
      <div className='pb-0 pt-4'>
        <h1>Thời gian:{formatTimeVietnamese(time)}</h1>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'start',
          gap: '20px',
          marginTop: '5px',
        }}
      >
        <div
          style={{
            width: '20%',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <IconTemp />
          <p className='font-bold'>{temp}°C</p>
          <p>Nhiệt độ</p>
        </div>
        <div
          style={{
            width: '20%',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <IconHumidity />
          <p className='font-bold text-green-700'>{humidity}%</p>
          <p>Độ ẩm</p>
        </div>
        <div
          style={{
            width: '20%',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          {light === '0' ? <IconLight /> : <IconLightOff />}
          <p></p>
          <p className='pt-4'>Đèn tín hiệu</p>
        </div>
      </div>
    </div>
  );
};

export default ThingSpeakChart;
