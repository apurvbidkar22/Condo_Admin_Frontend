import { Tab } from "@/models/Common";
import React, { useState } from "react";

interface TabsProps {
  tabs: Tab[];
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs = [], className }) => {
  const [openTab, setOpenTab] = useState<number>(0);

  const tabButtonClass = (index: number) =>
    `p-2 text-sm font-inter lg:text-base w-full whitespace-nowrap flex justify-center transition-all duration-300 cursor-pointer ${
      openTab === index ? "bg-[#D5F4FF] font-medium" : ""
    }`;

  return (
    <div className={`${className} w-full h-full`}>
      <nav className="w-full">
        <div className="flex items-center bg-white overflow-hidden ">
          {tabs.map((tab, index) => (
            <div
              key={index}
              onClick={() => setOpenTab(index)}
              className={tabButtonClass(index)}
            >
              {tab.name}
            </div>
          ))}
        </div>
      </nav>

      {tabs.map((tab, index) => (
        <section
          key={index}
          className={`w-full ${
            openTab !== index
              ? "hidden"
              : "block opacity-100 transition-opacity duration-300"
          }`}
        >
          {tab.content}
        </section>
      ))}
    </div>
  );
};
