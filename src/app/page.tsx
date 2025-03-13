'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Define a type for the data
interface DataPoint {
  time: any;
  temperature: any;
  humidity: any;
}

const ThingSpeakChart = () => {
  const [data, setData] = useState<DataPoint[]>([]); // Use the type DataPoint for the data state
  const [lightOn, setLightOn] = useState(true); // State for light (true = on, false = off)

  const lightOnImage =
    'https://stilettodreams.wordpress.com/wp-content/uploads/2012/05/light-bulb.jpg'; // You should have an image for the light on
  const lightOffImage =
    'https://media.istockphoto.com/id/502789173/photo/light-bulb-concept.jpg?s=612x612&w=0&k=20&c=vJfSDuFJf_4UsQcUsdMNUfDkkNU6Bf9cTHF-n4-Zwvs='; // You should
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

        // Map the data to include temperature (field1) and humidity (field2)
        const temperatureHumidityData = response.data.feeds.map(
          (feed: any) => ({
            time: formatTimeVietnamese(feed?.created_at),
            temperature: feed.field1,
            humidity: feed.field2,
          })
        );

        setData(temperatureHumidityData); // Set the data to state

        // Automatically check if temperature > 40 or humidity < 60, and turn the light off if true
        const lightShouldBeOff = temperatureHumidityData.some(
          (item: any) => item.temperature > 40 || item.humidity < 60
        );
        setLightOn(!lightShouldBeOff); // If condition is met, turn the light off
      } catch (error) {
        console.error('Error fetching data from ThingSpeak:', error);
      }
    };

    // Fetch the data immediately
    fetchData();

    // Set interval to call the API every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup function to clear interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to only run this effect once when component mounts

  return (
    <div style={{ width: '100%', height: '500px' }} className='mt-10'>
      <h1 className='text-center py-4 font-bold text-lg'>
        Biều đồ nhiệt độ/độ ẩm
      </h1>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='time' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='temperature'
            stroke='#d62020'
            activeDot={{ r: 8 }}
          />
          <Line
            type='monotone'
            dataKey='humidity'
            stroke='#00b300' // Green color for humidity line
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Light Image */}
      <div
        className='light-container'
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <img
          src={lightOn ? lightOnImage : lightOffImage}
          alt='Light'
          style={{ width: '80px', height: '80px' }}
        />
      </div>
    </div>
  );
};

export default ThingSpeakChart;
