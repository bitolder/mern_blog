import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const pathFromUrl = new URLSearchParams(location.search);
    console.log(pathFromUrl.get("tab"));
    setTab(pathFromUrl.get("tab"));
  }, [location.search]);
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* SideBar */}
      <div className="md:w-56">
        <DashSidebar />
      </div>
      {/* Profile */}
      <div>{tab === "profile" && <DashProfile />}</div>
    </div>
  );
}
