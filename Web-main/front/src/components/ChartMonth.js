import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from "react-apexcharts";
import {useState,useEffect } from "react";

function ChartMonth({data}) {
  const [noData,] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const [chartoptions, setchartoptions] = useState({
    series: [
      {
        name: "`중구` temp",
        data: noData,
      },
      {
        name: "`동구` temp",
        data: noData,
      },
      {
        name: "`서구` temp",
        data: noData,
      },
      {
        name: "`대덕구` temp",
        data: noData,
      },
      {
        name: "`유성구` temp",
        data: noData,
      },
      {
        name: "`중구` humi",
        data: noData,
      },
      {
        name: "`동구` humi",
        data: noData,
      },
      {
        name: "`서구` humi",
        data: noData,
      },
      {
        name: "`대덕구` humi",
        data: noData,
      },
      {
        name: "`유성구` humi",
        data : noData,
      },
    ],
    options: {
      chart: {
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 3,
      },

      stroke: {
        curve: "smooth",
        width: 1,
      },
      xaxis: {
        categories: [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",

        ],
      },
    },
  }) 

  useEffect(() => {
    const fillBlankData = (data) => {
      const hoursSet = new Set(data.map(item => item.hour));

      for (let i = 0; i < 24; i++) {
          if (!hoursSet.has(i)) {
              data.push({ hour: i, location: '', avg_tem: 0, avg_hum: 0, current_date: '' });
          }
      }
      return data
      
    } 

    const preprocess_Data = (data) => {
      let filteredData1 = data.filter(item => item.location === "중구")
      let filteredData2 = data.filter(item => item.location === "동구")
      let filteredData3 = data.filter(item => item.location === "서구")
      let filteredData4 = data.filter(item => item.location === "대덕구")
      let filteredData5 = data.filter(item => item.location === "유성구")

      if(filteredData1.length !== 24 || filteredData2.length !== 24 || filteredData3.length !== 24 ||filteredData4.length !== 24 || filteredData5.length !== 24){
        if(filteredData1.length !== 24)
          filteredData1 = fillBlankData(filteredData1, "중구")
        if(filteredData2.length !== 24)
          filteredData2 = fillBlankData(filteredData2, "동구")
        if(filteredData3.length !== 24)
          filteredData3 = fillBlankData(filteredData3, "서구")
        if(filteredData4.length !== 24)
          filteredData4 = fillBlankData(filteredData4, "대덕구")
        if(filteredData5.length !== 24)
          filteredData5 = fillBlankData(filteredData5, "유성구")

      }
      filteredData1.sort((a, b) => a.hour - b.hour);
      filteredData2.sort((a, b) => a.hour - b.hour);
      filteredData3.sort((a, b) => a.hour - b.hour);
      filteredData4.sort((a, b) => a.hour - b.hour);
      filteredData5.sort((a, b) => a.hour - b.hour);
      console.log(filteredData1,filteredData2,filteredData3,filteredData4,filteredData5)
      const region1_tem = filteredData1.map(data => data.avg_tem.toFixed(2));
      const region2_tem = filteredData2.map(data => data.avg_tem.toFixed(2));
      const region3_tem = filteredData3.map(data => data.avg_tem.toFixed(2));
      const region4_tem = filteredData4.map(data => data.avg_tem.toFixed(2));
      const region5_tem = filteredData5.map(data => data.avg_tem.toFixed(2));

      const region1_hum = filteredData1.map(data => data.avg_hum.toFixed(2));
      const region2_hum = filteredData2.map(data => data.avg_hum.toFixed(2));
      const region3_hum = filteredData3.map(data => data.avg_hum.toFixed(2));
      const region4_hum = filteredData4.map(data => data.avg_hum.toFixed(2));
      const region5_hum = filteredData5.map(data => data.avg_hum.toFixed(2));

      return [region1_tem,region2_tem,region3_tem,region4_tem,region5_tem,region1_hum,region2_hum,region3_hum,region4_hum,region5_hum]
    }

    const graph_Data = (prevState,predata) => {
        const updatedSeries = prevState.series.map(seriesItem => {
          if (seriesItem.name === "`중구` temp") {
            return {
              ...seriesItem,
              data: predata[0]
            };
          }
          else if (seriesItem.name === "`동구` temp") {
            return {
              ...seriesItem,
              data: predata[1]
            };
          }
          else if (seriesItem.name === "`서구` temp") {
            return {
              ...seriesItem,
              data: predata[2]
            };
          }
          else if (seriesItem.name === "`대덕구` temp") {
            return {
              ...seriesItem,
              data: predata[3]
            };
          }
          else if (seriesItem.name === "`유성구` temp") {
            return {
              ...seriesItem,
              data: predata[4]
            };
          }
          if (seriesItem.name === "`중구` humi") {
            return {
              ...seriesItem,
              data: predata[5]
            };
          }
          else if (seriesItem.name === "`동구` humi") {
            return {
              ...seriesItem,
              data: predata[6]
            };
          }
          else if (seriesItem.name === "`서구` humi") {
            return {
              ...seriesItem,
              data: predata[7]
            };
          }
          else if (seriesItem.name === "`대덕구` humi") {
            return {
              ...seriesItem,
              data: predata[8]
            };
          }
          else if (seriesItem.name === "`유성구` humi") {
            return {
              ...seriesItem,
              data: predata[9]
            };
          }
          return seriesItem;

          
        });
      
        return {
          ...prevState,
          series: updatedSeries
        };
    } 
    if(data.length !== 0 && data.length === 120){
      const predata = preprocess_Data(data)
      setchartoptions(prevState => graph_Data(prevState,predata));
    }
    else if(data.length !==0 ){
      const predata = preprocess_Data(data)
      setchartoptions(prevState => graph_Data(prevState,predata));
    }
    else {
      const predata = [noData,noData,noData,noData,noData,noData,noData,noData,noData,noData]
      setchartoptions(prevState => graph_Data(prevState,predata))
    }
  }, [data, noData])
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">행정구역별 온습도</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          그래프
        </CardSubtitle>
        <Chart
          type="area"
          width="100%"
          height="390"
          options={chartoptions.options}
          series={chartoptions.series}
        ></Chart>
      </CardBody>
    </Card>
  );
}

export default ChartMonth;
