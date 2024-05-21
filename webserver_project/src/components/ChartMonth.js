import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from "react-apexcharts";

function ChartMonth() {
  const chartoptions = {
    series: [
      {
        name: "동구",
        data: [0, 31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "서구",
        data: [0, 11, 32, 45, 32, 34, 52, 41],
      },
      {
        name: "유성구",
        data: [0, 0, 12, 42, 23, 34, 55, 32],
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
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
        ],
      },
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
