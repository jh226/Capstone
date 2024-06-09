import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from "react-apexcharts";
import { useEffect,useState } from "react";
function ChartCircle({entity, entity_error}) {
  const [chartoptions, setchartoptions] =useState( {
    series: [3,1, 1, 1, 1],
    options: {
      chart: {
        height: 390,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      colors: ["#367689","#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
      labels: ["중구","동구", "서구", "대덕구", "유성구"],
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: 0,
        offsetY: 0,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0,
        },
        formatter: function (seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          vertical: 3,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    },
  });

  useEffect(() => {
    const locationCount = {};

    if(entity_error.length !==0 && entity.length !==0 ){
      
        const deviceLocationMap = entity.reduce((acc, curr) => {
          acc[curr.device_num] = curr.location;
          return acc;
      }, {});

      entity_error.forEach(error => {
          const location = deviceLocationMap[error.device_num];
          if (location) {
              if (!locationCount[location]) {
                  locationCount[location] = 0;
              }
              locationCount[location]++;
          }
      });

      const Location = (locationCount) => {
          const v1 = locationCount['중구'] ? locationCount['중구'] : 0
          const v2 = locationCount['동구'] ? locationCount['동구'] : 0
          const v3 = locationCount['서구'] ? locationCount['서구'] : 0
          const v4 = locationCount['대덕구'] ? locationCount['대덕구'] : 0
          const v5 = locationCount['유성구'] ? locationCount['유성구'] : 0
          return [v1, v2, v3, v4, v5]
      } 
      setchartoptions((prevState) => {
        const updatedSeries = Location(locationCount)
        
        return {
          ...prevState,
          series: updatedSeries
        };
      })
    }


  },[entity,entity_error])
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">행정구역별 오류</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          그래프
        </CardSubtitle>
        <Chart
          options={chartoptions.options}
          series={chartoptions.series}
          type="radialBar"
          height={425}
        />
      </CardBody>
    </Card>
  );
}

export default ChartCircle;
