import React from "react";

function Tabs({ activeTab, setActiveTab }) {
  const tabs = [
    { label: "Đặc điểm", id: "features" },
    { label: "Phòng & giá", id: "rooms" },
    { label: "Giới thiệu", id: "introduction" },
    { label: "Quy định", id: "regulations" },
    { label: "Đánh giá", id: "reviews" },
  ];

  const handleTabClick = (index, id) => {
    setActiveTab(index);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-gray-100 shadow-md rounded-xl border-b border-gray-200 flex overflow-x-auto py-2">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => handleTabClick(index, tab.id)}
          className={`flex items-center px-4 py-2 text-sm mx-2 transition-all duration-200 ${
            activeTab === index
              ? "text-gray-700 bg-gray-50 border shadow-lg rounded-xl"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border hover:shadow hover:rounded-xl"
          }`}
        >
          <span>{tab.label}</span>
          {tab.label === "Đánh giá" && (
            <span className="ml-1 bg-gray-100 rounded px-1 text-xs">12</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
