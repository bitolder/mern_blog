import React from "react";
import { useSelector } from "react-redux";
export default function ThemesProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white min-h-screen text-gray-700 dark:bg-[rgb(16,23,42)] dark:text-gray-200">
        {children}
      </div>
    </div>
  );
}
