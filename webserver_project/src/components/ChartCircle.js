import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from "react-apexcharts";

function ChartCircle() {
  const chartoptions = {
    series: [76, 67, 61, 90],
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
      colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
      labels: ["동구", "서구", "유성구", "대덕구"],
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
  };
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">행정구역별</CardTitle>
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
