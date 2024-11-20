import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
export default function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const pathFromUrl = new URLSearchParams(location.search);
    console.log(pathFromUrl.get("tab"));
    setTab(pathFromUrl.get("tab"));
  }, [location.search]);

  return (
    <Sidebar className=" w-full md:w-56">
      <Sidebar.ItemGroup>
        <Link to={"/dashboard?tab=profile"}>
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={"User"}
            labelColor="dark"
          >
            Profile
          </Sidebar.Item>
        </Link>
        <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
          Sign out
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar>
  );
}
