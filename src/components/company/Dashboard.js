import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import "./Dashboard.scss";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { FaCalendar } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { FaCalendarTimes } from "react-icons/fa";
import { FaCalendarDay } from "react-icons/fa";
import { FaMoneyCheckAlt } from "react-icons/fa";
import {
  exportBookingOrder,
  getAllBooking,
  getBookingByYear,
  getStatisticBooking,
  getStatisticService,
} from "../../services/ApiServices";
import { useSelector } from "react-redux";
import { RiFileExcel2Fill } from "react-icons/ri";
const Dashboard = () => {
  const idCompany = useSelector((state) => state?.account?.idCompany);
  const [totalBooking, setTotalBooking] = useState("");
  const [totalService, setTotalService] = useState("");
  const [allBooking, setAllBooking] = useState({});
  const [allBookingByYear, setAllBookingByYear] = useState([]);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    getTotalBooking();
    getTotalService();
    getAllBookingStatus();
    getAllBookingByYear();
  }, [month, year]);

  const getTotalBooking = async () => {
    try {
      let res = await getStatisticBooking(idCompany, month, year);
      if (res && res.data && res.data.data) {
        setTotalBooking(res.data.data);
      } else if (res.data.data === 0) {
        setTotalBooking(res.data.data);
      }
    } catch (error) {}
  };
  const getTotalService = async () => {
    try {
      let res = await getStatisticService(idCompany, month, year);
      if (res && res.data && res.data.data) {
        setTotalService(res.data.data);
      } else if (res.data.data === 0) {
        setTotalService(res.data.data);
      }
    } catch (error) {}
  };
  const getAllBookingStatus = async () => {
    try {
      let res = await getAllBooking(idCompany, month, year);
      if (res && res.data && res.data.data) {
        setAllBooking(res.data.data);
      }
    } catch (error) {}
  };
  const getAllBookingByYear = async () => {
    try {
      let res = await getBookingByYear(idCompany, year);
      if (res && res.data && res.data.data) {
        setAllBookingByYear(res.data.data);
      }
    } catch (error) {}
  };

  const reportBookingOrder = async () => {
    try {
      let res = await exportBookingOrder(idCompany);
      // Tạo URL và tải file về
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `YachtBooking_${month}/${year}.xls`); // Tên file khi tải về
      document.body.appendChild(link);
      link.click();
    } catch (error) {}
  };
  const total = Object.values(allBooking).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <div className="border mx-3 border-gray-300 rounded-xl">
      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-3">
            <Form.Select
              onChange={(event) => setMonth(event.target.value)}
              style={{
                width: "fit-content",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
            >
              <option value="7">July</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </Form.Select>
            <Form.Select
              onChange={(event) => setYear(event.target.value)}
              className="mx-3"
              style={{
                width: "fit-content",
                borderRadius: "10px",
                border: "1px solid #ccc",
              }}
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </Form.Select>
          </div>
          <button
            onClick={reportBookingOrder}
            className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
          >
            <RiFileExcel2Fill className="mr-2" />
            Export Booking Order
          </button>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="bg-yellow-100 rounded-lg p-6 flex-1 shadow">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-bold">{total ? total : 0}</h4>
              <FaCalendar className="text-3xl text-yellow-500" />
            </div>
            <p className="mt-2 text-gray-600">Total Booking</p>
          </div>
          <div className="bg-blue-100 rounded-lg p-6 flex-1 shadow">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-bold">
                {allBooking.Confirmed ? allBooking.Confirmed : 0}
              </h4>
              <FaCalendarCheck className="text-3xl text-blue-500" />
            </div>
            <p className="mt-2 text-gray-600">Confirmed Booking</p>
          </div>
          <div className="bg-red-100 rounded-lg p-6 flex-1 shadow">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-bold">
                {allBooking.Cancelled ? allBooking.Cancelled : 0}
              </h4>
              <FaCalendarTimes className="text-3xl text-red-500" />
            </div>
            <p className="mt-2 text-gray-600">Cancel Booking</p>
          </div>
          <div className="bg-green-100 rounded-lg p-6 flex-1 shadow">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-bold">
                {allBooking.Pending ? allBooking.Pending : 0}
              </h4>
              <FaCalendarDay className="text-3xl text-green-500" />
            </div>
            <p className="mt-2 text-gray-600">Pending Booking</p>
          </div>
        </div>
        <div className="flex gap-4 bg-gray-100 rounded-lg p-4 mb-8">
          <div className="bg-white rounded-lg p-6 flex-1 shadow mx-2">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-bold">
                {totalBooking.toLocaleString() === "0"
                  ? 0
                  : totalBooking.toLocaleString()}{" "}
                vnd
              </h4>
              <FaMoneyCheckAlt className="text-3xl text-green-500" />
            </div>
            <p className="mt-2 text-gray-600">Revenue Booking</p>
          </div>
          <div className="bg-white rounded-lg p-6 flex-1 shadow mx-2">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-bold">
                {totalService.toLocaleString() === "0"
                  ? 0
                  : totalService.toLocaleString()}{" "}
                vnd
              </h4>
              <FaMoneyCheckAlt className="text-3xl text-green-500" />
            </div>
            <p className="mt-2 text-gray-600">Revenue Service</p>
          </div>
        </div>
      </div>
      <div className="my-8">
        <h4 className="font-bold text-lg mb-4">
          BarChart Status Of Booking In Year {year ? year : "2024"}
        </h4>
        <div className="flex justify-center">
          <BarChart width={1100} height={250} data={allBookingByYear}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="Month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="confirm" fill="#82ca9d" />
            <Bar dataKey="cancel" fill="red" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
