"use client";

import Dropdown from "@/components/common/Dropdown";
import ResultInfo from "@/components/info/ResultInfo";
import { FiTv } from "react-icons/fi";

// Day mapping untuk display
const dayMap = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export default function ScheduleControls({
  selectedDay,
  page,
  totalItems,
  dataLength,
  onDayChange,
}) {
  // Info jumlah data
  const perPage = 25;
  const startIndex = (page - 1) * perPage + 1;
  const endIndex = startIndex + dataLength - 1;

  return (
    <section className="py-8 bg-[#0f0f1f]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Day Selector */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center space-x-3">
              <FiTv className="text-[#FF6363] text-lg" />
              <Dropdown
                label="SELECT DAY"
                options={[
                  { value: "monday", label: "Monday" },
                  { value: "tuesday", label: "Tuesday" },
                  { value: "wednesday", label: "Wednesday" },
                  { value: "thursday", label: "Thursday" },
                  { value: "friday", label: "Friday" },
                  { value: "saturday", label: "Saturday" },
                  { value: "sunday", label: "Sunday" },
                ]}
                value={selectedDay}
                onChange={onDayChange}
              />
            </div>
          </div>

          {/* Results Info */}
          <ResultInfo
            startIndex={startIndex}
            endIndex={endIndex}
            totalItems={totalItems}
            extra={`Airing on ${dayMap[selectedDay]}`}
          />
        </div>
      </div>
    </section>
  );
}
