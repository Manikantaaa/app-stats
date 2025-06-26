"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import getApiUrl from "@/constants/endpoints";
import axios from "axios";

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

const appIdToName: Record<number, string> = {
  1: "face",
  2: "chat",
  3: "photo",
  4: "video",
};


export default function GraphAnalysis() {

  const router = useRouter();
  const { user } = useAuthContext();
  const [userLogged, setUserLogged] = useState<boolean>(false);
  const [allData, setAllData] = useState<AppData[]>([]);
  const [appNames, setAppNames] = useState<string[]>([])
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
 
  const fetchAppStats = async ()=>{
    try{
      const res = await axios.get(getApiUrl("appStats"));
      const rawData: AppData[] = res.data.data;

      const processedData: AppData[] = rawData.map((item)=>({
        ...item,
        appName: item.appName
      }));
      setAllData(processedData);

      const uniqueAppNames = Array.from(
        new Set(processedData.map((d)=> d.appName))
      );
      setAppNames(uniqueAppNames);
    } catch (err){
      console.error("Failed to fetch Apps", err)
    }
  };

  useEffect(()=>{
    fetchAppStats();
  },[])

  useEffect(() => {
    
    if (startDate && endDate) {
      const diff = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff !== 4) return; // total 5 days

      const filtered = allData.filter((entry) => {
        const entryDate = new Date(entry.as_date);
        return (
          entryDate >= startDate &&
          entryDate <= endDate &&
          (!selectedApp || entry.appName === selectedApp)
        );
      });

      setFilteredData(filtered);
    }
  }, [startDate, endDate, selectedApp, allData]);


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
            : appNames;

        // const series = allAppNames.map((name) => {
        //     return {
        //     name,
        //     data: dateRange.map((date) => {
        //         const found = filteredData.find(
        //         (entry) =>
        //             entry.appName === name &&
        //             entry.as_date.startsWith(date)
        //         );
        //         return found ? found.as_count : 0;
        //     }),
        //     };
        // });
        
        const series = allAppNames.map((name)=>({
          name,
          data: dateRange.map((date)=>{
            const found = filteredData.find(
              (entry)=>
                entry.appName === name && entry.as_date.startsWith(date)
            );
            return found ? found.as_count : 0;
          }),
        }));

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
