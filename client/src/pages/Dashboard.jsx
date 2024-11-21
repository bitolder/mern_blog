import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const pathFromUrl = new URLSearchParams(location.search);
    const tabFromUrl = pathFromUrl.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      {/** Profile */}
      <div className="flex-1 flex justify-center items-center ">
        {tab === "profile" && <DashProfile />}
      </div>
    </div>
  );
}
