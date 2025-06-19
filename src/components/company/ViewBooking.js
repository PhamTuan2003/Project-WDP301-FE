import React, { useEffect, useState } from "react";
import { Button, Form, FormControl, FormGroup } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  canelBooking,
  confirmBooking,
  getBookingByAmount,
  getBookingOrder,
} from "../../services/ApiServices";
import "./Company.scss";

import { Link } from "react-router-dom";
import ModalViewDetailBooking from "./ModalViewDetailBooking";
import ModalReasonCompany from "./Modal/ModalReasonCompany";

const ViewBooking = () => {
  const idCompany = useSelector((state) => state?.account?.idCompany);
  const [listBooking, setListBooking] = useState([]);
  const [isShowModalViewBooking, setIsShowModalViewBooking] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [filterBooking, setFilterBooking] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);

  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  const [bookingDetail, setBookingDetail] = useState({});

  const [showModalReason, setShowModalReason] = useState(false);
  const [idCancel, setIdCancel] = useState("");
  useEffect(() => {
    getBooking();
  }, []);

  useEffect(() => {
    filterAndPaginateBooking();
  }, [listBooking, filterSearch, currentPage, filterStatus]);

  const formatDate = (dateTimeString) => {
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1; // Months are 0-indexed
    const year = dateTime.getFullYear();

    // Pad single digit minutes with leading zero
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${formattedMinutes} ${day}/${month}/${year}`;
  };

  const getBooking = async () => {
    if (!idCompany) {
      toast.error("Company ID not found. Please log in again.");
      return;
    }
    let res = await getBookingOrder(idCompany);
    if (res && res.data && res.data.data) {
      const sortedBookings = res.data.data.sort(
        (a, b) => new Date(b.bookingTime) - new Date(a.bookingTime)
      );
      setListBooking(sortedBookings);
    } else toast.error("Not Found Booking");
  };

  const handleViewDetailBooking = (booking) => {
    setIsShowModalViewBooking(true);
    setBookingDetail(booking);
  };

  const handleConfrimBooking = async (idBooking) => {
    let res = await confirmBooking(idCompany, idBooking);
    if (res && res.data && res.data.data === true) {
      toast.success("Confimed Booking Successfully");
      getBooking();
    } else {
      toast.error("Confirm Fail");
    }
  };

  const handleCancelBooking = async (idBooking) => {
    setIdCancel(idBooking);
    setShowModalReason(true);
  };

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const filterAndPaginateBooking = () => {
    const filtered = listBooking
      .filter((b) =>
        b.customerDTO.fullName
          .toLowerCase()
          .includes(filterSearch.toLowerCase().trim())
      )
      .filter((b) =>
        filterStatus === "0" ? b : b.status.includes(filterStatus)
      );

    setFilterBooking(filtered);
  };

  const displayedBooking = filterBooking.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleFilterByAmount = async () => {
    let res = await getBookingByAmount(idCompany, min, max);
    if (res && res.data && res.data.data) {
      setListBooking(res.data.data);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800">Booking</h2>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4 my-6">
          <input
            className="border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Name Customer"
            onChange={(e) => setFilterSearch(e.target.value)}
            type="text"
          />
          <select
            className="border rounded-xl px-1 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(event) => setFilterStatus(event.target.value)}
          >
            <option value="0">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Decliled">Decliled</option>
          </select>
          <input
            className="border rounded-xl px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Min Amount"
            onChange={(e) => setMin(e.target.value)}
            type="number"
          />
          <input
            className="border rounded-xl px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Max Amount"
            onChange={(e) => setMax(e.target.value)}
            type="number"
          />
          <button
            onClick={handleFilterByAmount}
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-xl shadow"
          >
            Search Amount
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {displayedBooking &&
            displayedBooking.map((booking) => (
              <div
                key={booking.idBooking}
                className="bg-white rounded-xl-lg shadow p-6 flex flex-col gap-2 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold">
                    {formatDate(booking.bookingTime)}
                  </span>
                  <span
                    className={`font-bold ${
                      booking.status === "Pending"
                        ? "text-orange-500"
                        : booking.status === "Confirmed"
                        ? "text-green-600"
                        : booking.status === "Cancelled"
                        ? "text-red-500"
                        : "text-gray-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {booking.customerDTO.fullName}
                </div>
                <div className="text-gray-600">
                  {booking.yachtName}, Amount:{" "}
                  <span className="font-semibold text-blue-600">
                    {booking.amount.toLocaleString()} VNĐ
                  </span>
                </div>
                <div className="text-gray-600">
                  Schedule: {formatDate(booking.schedule.startDate)} -{" "}
                  {formatDate(booking.schedule.endDate)}
                </div>
                <div className="text-gray-600">
                  Requirement: {booking.requirement}
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleViewDetailBooking(booking)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-xl"
                  >
                    View Detail
                  </button>
                  {booking.status === "Pending" && (
                    <>
                      <button
                        onClick={() => handleConfrimBooking(booking.idBooking)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-xl"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.idBooking)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-xl"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-center mt-6">
          <ReactPaginate
            nextLabel="Next >"
            onPageChange={handlePageChange}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={Math.ceil(filterBooking.length / itemsPerPage)}
            previousLabel="< Prev"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="flex gap-2"
            activeClassName="bg-blue-500 text-white rounded-xl"
            renderOnZeroPageCount={null}
          />
        </div>
        <ModalViewDetailBooking
          show={isShowModalViewBooking}
          setIsShowModalViewBooking={setIsShowModalViewBooking}
          bookingDetail={bookingDetail}
        />
        <ModalReasonCompany
          showModalReason={showModalReason}
          setShowModalReason={setShowModalReason}
          idCancel={idCancel}
          getBooking={getBooking}
        />
      </div>
    </div>
  );
};

export default ViewBooking;
