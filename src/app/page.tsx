"use client"; // Ensures this is a Client Component

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { watchCombinedAlert } from "./utils/watchCombinedAlert";
import { startAutoPump, stopAutoPump } from "./utils/autoPump";

import { database, ref, set, onValue } from "./firebase";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";


function d1() {
  const { data: session } = useSession();
    if (!session) {
      redirect("/login");
    }
  const [isOn, setIsOn] = useState(false);
  const [mode, setMode] = useState("manual");
  const [sensorData, setSensorData] = useState({ temperature: "", humidity: "" });
  // const [waterLevel, setWaterLevel] = useState("");
  const [temperatureData, setTemperatureData] = useState<
  { time: string; temperature1: number }[]
>([]);

  
  const [phValue, setPhValue] = useState(null);
  const [waterLevel, setWaterLevel] = useState("");
  const [intensity, setLight] = useState("");
  const [WaterTemp, setWatertemp] = useState("");
  

  
  useEffect(() => {
    // Listen for toggle state
    const toggleRef = ref(database, "pump/status");
    const modeRef = ref(database, "pump/mode");

    if (mode === "auto") {
      startAutoPump(database);
    } else {
      stopAutoPump();
    }

    watchCombinedAlert();

    const unsubscribeToggle = onValue(toggleRef, (snapshot) => {
      if (snapshot.exists()) {
        setIsOn(snapshot.val() === "on");
      }
    });
    
    const unsubscribeMode = onValue(modeRef, (snapshot) => {
      if (snapshot.exists()) {
        setMode(snapshot.val());
      }
    });

    // Listen for sensorDHT data
    const sensorRef = ref(database, "sensorData/sensorDHT");
    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setSensorData({
          temperature: data.temperature || "N/A",
          humidity: data.humidity || "N/A",
        });
      
        
        setTemperatureData((prevData) => {
          if (!Array.isArray(prevData)) return []; // Prevent errors
          return [
            ...prevData.slice(-19), // Keep only the last 20 readings
            {
              time: new Date().toLocaleTimeString(),
              temperature1: Number(data?.temperature) || 0, // Ensure it's a number
            },
          ];
        });
        
      } else {
        setSensorData({ temperature: "N/A", humidity: "N/A" });
      }
    });

    const interval = setInterval(() => {
    fetch('/api/log');
  }, 10 * 60 * 1000); // every 5 minutes

    

    // Listen for water level data

    const WaterTemp = ref(database, "sensorData/sensorWater/waterTemp");
    onValue(WaterTemp, (snapshot) => {
      setWatertemp(snapshot.val());
    });

    const phRef = ref(database, "sensorData/sensorWater/phValue");
    onValue(phRef, (snapshot) => {
      setPhValue(snapshot.val());
    });

    const intensity = ref(database, "sensorData/sensorLight/intensity");
    onValue(intensity, (snapshot) => {
      setLight(snapshot.val());
    });

    const waterRef = ref(database, "sensorData/sensorWater/waterLevel");
    const unsubscribeWater = onValue(waterRef, (snapshot) => {
      setWaterLevel(snapshot.exists() ? snapshot.val() : "N/A");
    });

    

    return () => {
      clearInterval(interval)
      unsubscribeToggle();
      unsubscribeMode();
      unsubscribeSensor();
      unsubscribeWater();
      stopAutoPump();
    };

    

    

  }, [mode]);

  // 2) Handle toggle button click
  const handleToggle = () => {
    if (mode === "auto") return;
    const newState = isOn ? "off" : "on";
    set(ref(database, "pump/status"), newState);
    setIsOn(!isOn);
  };

  const handleModeToggle = () => {
    const newMode = mode === "manual" ? "auto" : "manual";
    set(ref(database, "pump/mode"), newMode);
    setMode(newMode);
  };
  
  

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
      
    <div className="row">
      <div className="col-md-60 col-lg-4 col-xl-4 order-0 mb-4">
        
        <div className="card h-100">
          <div className="card-header d-flex align-items-center justify-content-between pb-0">
            <div className="card-title mb-0">
              <h5 className="m-0 me-2">WATER PUMP</h5>
              <h3 className="text-muted">{mode.toUpperCase()} Mode</h3>
            </div>
            <div className="dropdown">
              <button
                className="btn p-0"
                type="button"
                id="orederStatistics"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="bx bx-dots-vertical-rounded"></i>
              </button>
              <div className="dropdown-menu dropdown-menu-end" aria-labelledby="orederStatistics">
                <a className="dropdown-item" href="javascript:void(0);">Select All</a>
                <a className="dropdown-item" href="javascript:void(0);">Refresh</a>
                <a className="dropdown-item" href="javascript:void(0);">Share</a>
              </div>
            </div>
          </div>
          <div className="card-body">
              <button onClick={handleModeToggle} className="mt-2 px-4 py-1 rounded text-white bg-primary">
                Switch Mode
              </button>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex flex-column align-items-center gap-1">
                <h2 className="mb-2">{isOn ? "ON" : "OFF"}</h2>
                <button
                    onClick={handleToggle}
                    className={`mt-2 px-4 py-2 rounded text-white ${
                      isOn ? "bg-gray" : "bg-gray"
                    }`}
                  >
                    {isOn ? "Turn ON" : "Turn OFF"}
                </button>

                    <h5></h5>
                <h5 className="m-0 me-2">WATER LEVELS</h5>
              </div>
                
              {/* <div id="orderStatisticsChart"></div> */}
            </div>
            <ul className="p-0 m-0">
              <li className="d-flex mb-4 pb-1">
                <div className="center">
                  <div className="circle">
                    <div className="wave">
                      
                      <p>{waterLevel !== null ? waterLevel : "Loading..."}</p>

                    </div>
                  </div>
                </div>
              </li>
              
            </ul>
          </div>
        </div>
      </div>
      
     
        <div className="col-lg-4 col-md-4 order-1">
            <div className="row">
              <div className="col-lg-6 col-md-12 col-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    
                    <span className="fw-semibold d-block mb-1">Water Temperature</span>
                    <h3 className="card-title mb-2">
                    
                    <p>{WaterTemp}</p>
                    </h3>
                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> </small>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 col-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    
                    <span className="fw-semibold d-block mb-1">Water pH</span>
                    <h3 className="card-title mb-2">
                    <p>{phValue !== null ? phValue : "Loading..."}</p>

                    </h3>
                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> </small>
                  </div>
                </div>
              </div>
              
              
              <div className="col-12 mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="text-nowrap mb-2">Air Temperature Graph</h5>
                    {temperatureData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={temperatureData}>
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Line type="monotone" dataKey="temperature1" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <p>Loading temperature data...</p>
                    )}

                  </div>
                </div>
              </div>

            </div>
          </div>

          
          
       
        <div className="col-12 col-md-8 col-lg-4 order-3 order-md-2">
            <div className="row">
              <div className="col-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    
                    <span className="fw-semibold d-block mb-1">Air Temperature</span>
                    <h3 className="card-title text-nowrap mb-2">

                    <p>{sensorData.temperature}</p>

                    </h3>
                    <small className="text-danger fw-semibold"><i className="bx bx-down-arrow-alt"></i> </small>
                  </div>
                </div>
              </div>
              <div className="col-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    
                    <span className="fw-semibold d-block mb-1">humidity</span>
                    <h3 className="card-title mb-2">
                      
                    <p>{sensorData.humidity}</p>

                    </h3>
                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> </small>
                  </div>
                </div>
              </div>


              <div className="col-6 mb-4">
                <div className="card">
                  <div className="card-body">
                    
                    <span className="fw-semibold d-block mb-1">Light</span>
                    <h3 className="card-title mb-2">

                      {intensity !== null ? intensity : "Loading..."}

                    </h3>
                    <small className="text-success fw-semibold"><i className="bx bx-up-arrow-alt"></i> </small>
                  </div>
                </div>
              </div>

            
            </div>
          </div>
        </div>         
    </div>

  )
}
export default d1