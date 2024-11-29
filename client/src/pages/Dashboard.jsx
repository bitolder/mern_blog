import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
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
      {/** sidebar */}
      <div className="md:w-56">
        <DashSidebar />
      </div>
      {/** Profile */}
      <div className="flex-1  ">
        {/** Profile */}
        {tab === "profile" && <DashProfile />}
        {/** Post */}
        {tab === "posts" && <DashPosts />}
        {/** Users */}
        {tab === "users" && <DashUsers />}
      </div>
    </div>
  );
}
