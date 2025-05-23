import React from "react";
import {
  FaAnchor,
  FaBed,
  FaShip,
  FaMapMarkerAlt,
  FaBuilding,
} from "react-icons/fa";

function BoatInfo({ yacht }) {
  return (
    <div className="md:w-4/12">
      <div className="mx-auto border shadow-md rounded-3xl bg-white p-6 relative overflow-hidden">
        <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
          Thông tin du thuyền
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-2 items-center gap-x-4">
            <div className="flex items-center gap-3">
              <FaAnchor className="text-gray-600" size={22} />
              <p className="font-normal text-gray-600 text-base">Hạ thủy</p>
            </div>
            <p className="text-gray-900 font-medium text-base">
              {yacht.launch}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center gap-x-4">
            <div className="flex items-center gap-3">
              <FaBed className="text-gray-600" size={22} />
              <p className="font-normal text-gray-600 text-base">Cabin</p>
            </div>
            <p className="text-gray-900 font-medium text-base">20</p>{" "}
            {/* Static or update via API if available */}
          </div>
          <div className="grid grid-cols-2 items-center gap-x-4">
            <div className="flex items-center gap-3">
              <FaShip className="text-gray-600" size={22} />
              <p className="font-normal text-gray-600 text-base">Thân vỏ</p>
            </div>
            <p className="text-gray-900 font-medium text-base">
              {yacht.hullBody}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center gap-x-4">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-gray-600" size={22} />
              <p className="font-normal text-gray-600 text-base">Hành trình</p>
            </div>
            <p className="text-gray-900 font-medium text-base">
              {yacht.itinerary}
            </p>
          </div>
          <div className="grid grid-cols-2 items-center gap-x-4">
            <div className="flex items-center gap-3">
              <FaBuilding className="text-gray-600" size={22} />
              <p className="font-normal text-gray-600 text-base">Điều hành</p>
            </div>
            <p className="text-gray-900 font-medium text-base">
              {yacht.IdCompanys.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoatInfo;
