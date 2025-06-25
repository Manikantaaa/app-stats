"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

interface AppData {
  as_id: number;
  as_date: string;
  as_app_id: number;
  as_count: number;
  as_created_at: string;
  as_updated_at: string;
  as_status: number;
  appName: string;
}

const dummyData: AppData[] = [
  {
    as_id: 1,
    as_date: "2025-06-01T00:00:00.000Z",
    as_app_id: 1,
    as_count: 120,
    as_created_at: "2025-06-01T00:00:00.000Z",
    as_updated_at: "2025-06-01T00:00:00.000Z",
    as_status: 1,
    appName: "face",
  },
  {
    as_id: 2,
    as_date: "2025-06-01T00:00:00.000Z",
    as_app_id: 2,
    as_count: 180,
    as_created_at: "2025-06-01T00:00:00.000Z",
    as_updated_at: "2025-06-01T00:00:00.000Z",
    as_status: 1,
    appName: "chat",
  },
  {
    as_id: 3,
    as_date: "2025-06-02T00:00:00.000Z",
    as_app_id: 1,
    as_count: 300,
    as_created_at: "2025-06-02T00:00:00.000Z",
    as_updated_at: "2025-06-02T00:00:00.000Z",
    as_status: 1,
    appName: "face",
  },
  {
    as_id: 4,
    as_date: "2025-06-02T00:00:00.000Z",
    as_app_id: 2,
    as_count: 240,
    as_created_at: "2025-06-02T00:00:00.000Z",
    as_updated_at: "2025-06-02T00:00:00.000Z",
    as_status: 1,
    appName: "chat",
  },
  {
    as_id: 5,
    as_date: "2025-06-02T00:00:00.000Z",
    as_app_id: 3,
    as_count: 100,
    as_created_at: "2025-06-02T00:00:00.000Z",
    as_updated_at: "2025-06-02T00:00:00.000Z",
    as_status: 1,
    appName: "photo",
  },
  {
    as_id: 6,
    as_date: "2025-06-03T00:00:00.000Z",
    as_app_id: 1,
    as_count: 400,
    as_created_at: "2025-06-03T00:00:00.000Z",
    as_updated_at: "2025-06-03T00:00:00.000Z",
    as_status: 1,
    appName: "face",
  },
  {
    as_id: 7,
    as_date: "2025-06-03T00:00:00.000Z",
    as_app_id: 4,
    as_count: 350,
    as_created_at: "2025-06-03T00:00:00.000Z",
    as_updated_at: "2025-06-03T00:00:00.000Z",
    as_status: 1,
    appName: "video",
  },
  {
    as_id: 8,
    as_date: "2025-06-04T00:00:00.000Z",
    as_app_id: 2,
    as_count: 270,
    as_created_at: "2025-06-04T00:00:00.000Z",
    as_updated_at: "2025-06-04T00:00:00.000Z",
    as_status: 1,
    appName: "chat",
  },
  {
    as_id: 9,
    as_date: "2025-06-04T00:00:00.000Z",
    as_app_id: 3,
    as_count: 210,
    as_created_at: "2025-06-04T00:00:00.000Z",
    as_updated_at: "2025-06-04T00:00:00.000Z",
    as_status: 1,
    appName: "photo",
  },
  {
    as_id: 10,
    as_date: "2025-06-05T00:00:00.000Z",
    as_app_id: 1,
    as_count: 150,
    as_created_at: "2025-06-05T00:00:00.000Z",
    as_updated_at: "2025-06-05T00:00:00.000Z",
    as_status: 1,
    appName: "face",
  },
  {
    as_id: 11,
    as_date: "2025-06-05T00:00:00.000Z",
    as_app_id: 2,
    as_count: 260,
    as_created_at: "2025-06-05T00:00:00.000Z",
    as_updated_at: "2025-06-05T00:00:00.000Z",
    as_status: 1,
    appName: "chat",
  },
  {
    as_id: 12,
    as_date: "2025-06-05T00:00:00.000Z",
    as_app_id: 4,
    as_count: 390,
    as_created_at: "2025-06-05T00:00:00.000Z",
    as_updated_at: "2025-06-05T00:00:00.000Z",
    as_status: 1,
    appName: "video",
  },
];


const appNames = ["face", "chat", "photo", "video"];
const start = new Date("2025-06-01");

export default function GraphAnalysis() {

  const router = useRouter();
  const { user } = useAuthContext();
  const [userLogged, setUserLogged] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<AppData[]>([])
    const today = new Date("2025-06-05"); // replace with `new Date()` for live date
    const [startDate, setStartDate] = useState<Date | null>(
    new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000)
    );
    const [endDate, setEndDate] = useState<Date | null>(today);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
    else {
      setUserLogged(true)
    }
  }, [user, router]);
 
  useEffect(() => {
    if (startDate && endDate) {
      const diff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff !== 4) return; // total 5 days

      const filtered = dummyData.filter((entry) => {
        const entryDate = new Date(entry.as_date);
        return (
          entryDate >= startDate &&
          entryDate <= endDate &&
          (!selectedApp || entry.appName === selectedApp)
        );
      });

      setFilteredData(filtered);
    }
  }, [startDate, endDate, selectedApp]);

//    const getChartOptions = () => {
//         const dateGroups: { [date: string]: AppData[] } = {};

//         filteredData.forEach((entry) => {
//         const dateStr = new Date(entry.as_date).toISOString().split("T")[0];
//         if (!dateGroups[dateStr]) dateGroups[dateStr] = [];
//         dateGroups[dateStr].push(entry);
//         });

//         const categories = Object.keys(dateGroups).sort();
//         const allAppNames = Array.from(
//         new Set(filteredData.map((d) => d.appName))
//         );

//         const series = allAppNames.map((name) => ({
//         name,
//         data: categories.map((date) => {
//             const entry = dateGroups[date]?.find((e) => e.appName === name);
//             return entry ? entry.as_count : 0;
//         }),
//         }));

//         return {
//         chart: {
//             type: "column",
//         },
//         title: {
//             text: "App Stats by Date (Filtered by App and Date)"
//         },
//         xAxis: {
//             categories,
//             crosshair: true,
//         },
//         yAxis: {
//             min: 0,
//             title: {
//             text: "Count",
//             },
//         },
//         tooltip: {
//             shared: true,
//             useHTML: true,
//             headerFormat: '<b>{point.key}</b><table>',
//             pointFormat:
//             '<tr><td style="color:{series.color}">{series.name}: </td>' +
//             '<td style="text-align: right"><b>{point.y}</b></td></tr>',
//             footerFormat: '</table>',
//         },
//         plotOptions: {
//             column: {
//             pointPadding: 0.2,
//             borderWidth: 0,
//             },
//         },
//         series,
//         };
//     };

    const getChartOptions = () => {
        const dateRange: string[] = [];

        if (startDate && endDate) {
            const curr = new Date(startDate);
            while (curr <= endDate) {
            dateRange.push(curr.toISOString().split("T")[0]);
            curr.setDate(curr.getDate() + 1);
            }
        }

        const allAppNames =
            selectedApp && selectedApp !== ""
            ? [selectedApp]
            : Array.from(new Set(dummyData.map((d) => d.appName)));

        const series = allAppNames.map((name) => {
            return {
            name,
            data: dateRange.map((date) => {
                const found = filteredData.find(
                (entry) =>
                    entry.appName === name &&
                    entry.as_date.startsWith(date)
                );
                return found ? found.as_count : 0;
            }),
            };
        });

  return {
    chart: {
      type: "column",
    },
    title: {
      text: "App Stats by Date (Filtered by App and Date)",
    },
    xAxis: {
      categories: dateRange,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Count",
      },
    },
    tooltip: {
      shared: true,
      useHTML: true,
      headerFormat: "<b>{point.key}</b><table>",
      pointFormat:
        '<tr><td style="color:{series.color}">{series.name}: </td>' +
        '<td style="text-align: right"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series,
  };
};


    if (!user) return null;
  return (
    <>
      {userLogged &&
           <div className="p-6">
      <h2 className="text-xl font-bold mb-4">App Stats Chart</h2>

      <div className="flex gap-4 mb-4 items-center">
        <div>
          <label className="block mb-1">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className="border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">App Name</label>
          <select
            value={selectedApp || ""}
            onChange={(e) =>
              setSelectedApp(e.target.value || null)
            }
            className="border p-2 rounded"
          >
            <option value="">All</option>
            {appNames.map((app) => (
              <option key={app} value={app}>
                {app}
              </option>
            ))}
          </select>
        </div>
      </div>

     <HighchartsReact
        highcharts={Highcharts}
        options={getChartOptions()}
        />
    </div>
        }
    </>
  );
}
