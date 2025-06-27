"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import getApiUrl from "@/constants/endpoints";

const Appstats = () => {
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("Yesterday");
  const [customDates, setCustomDates] = useState({ from: "", to: "" });
  const [statsData, setStatsData] = useState<{ name: string; count: number }[]>([]);
  const [userLogged, setUserLogged] = useState<boolean>(false);
  const router = useRouter();
  const { user } = useAuthContext();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userApps, setUserApps] = useState<string[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCheckboxChange = (appName: string) => {
    setError(null);
    setSelectedApps((prev) =>
      prev.includes(appName)
        ? prev.filter((item) => item !== appName)
        : [...prev, appName]
    );
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

// 1️⃣ First useEffect: Check login
useEffect(() => {
  if (!user) {
    router.push("/");
  } else {
    setUserLogged(true);
  }
}, [router]);

// 2️⃣ Second useEffect: Wait for userApps to load before setting state & fetching stats
useEffect(() => {
  if (user && user.userApps) {

    const userAppNames = user.userApps.map((ua: any) => ua.app.app_name);
    setUserApps(userAppNames);

    // Clear selected apps
    setSelectedApps(userAppNames);

    // Fetch stats with all apps for Yesterday
    fetchStats(userAppNames);
  }
}, []); 


  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const fetchStats = async (apps: string[]) => {
  if (apps.length === 0) {
    setError("Please select at least one app.");
    return;
  }

  try {
    setError(null); // Clear any previous error
    setLoading(true);
    const response = await axios.post(getApiUrl("appStats") + "/count", {
      apps,
      dateFilter,
      customDates,
      userId: user?.id,
    });
    setStatsData(response.data);
  } catch (error) {
    console.error("Failed to fetch stats:", error);
  } finally {
    setLoading(false);
  }
};


  // const handleSubmit = () => {
  
  //   fetchStats(selectedApps);
  // };

  if (!user) return null;

  return (
    
    <>
    {loading ?( <p>Loading...</p> ): (
      userLogged &&(
        <>
          <div className="filter-section">
            <div className="dropdown-wrapper" ref={dropdownRef}>
              <label className="section-label">Select Apps:</label>
              <div className="custom-dropdown" onClick={toggleDropdown}>
                {selectedApps.length > 0 ? selectedApps.join(", ") : "Select apps..."}
                <span className="arrow">&#9662;</span>
              </div>
              {dropdownOpen && (
                <div className="dropdown-options">
                  {userApps.map((app) => (
                    <label key={app} style={{ display: "block" }}>
                      <input
                        type="checkbox"
                        value={app}
                        checked={selectedApps.includes(app)}
                        onChange={() => handleCheckboxChange(app)}
                      />
                      <span>{app}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="date-buttons">
              {["Today", "Yesterday", "1 week", "1 month", "Custom"].map((btn) => (
                <button
                  key={btn}
                  className={`date-btn ${dateFilter === btn ? "active" : ""}`}
                  onClick={() => setDateFilter(btn)}
                >
                  {btn}
                </button>
              ))}
            <button
              className="submit-btn"
              onClick={() => fetchStats(selectedApps)}
              // disabled={selectedApps.length === 0}
            >
              Submit
            </button>

            </div>

            {dateFilter === "Custom" && (
              <div className="custom-date-wrapper">
                <div className="custom-date-inputs">
                  <input
                    type="date"
                    value={customDates.from}
                    onChange={(e) =>
                      setCustomDates({ ...customDates, from: e.target.value })
                    }
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={customDates.to}
                    onChange={(e) =>
                      setCustomDates({ ...customDates, to: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>
          <div>{error && <p className="text-red-500 mt-2 pl-8">{error}</p>}</div>
          <table>
            <thead>
              <tr>
                <th>App Name</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {statsData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.name}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ))}
    </>
  );
};

export default Appstats;
