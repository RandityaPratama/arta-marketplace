import React from 'react';

export default function TabNavigation({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === tab.id
              ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
