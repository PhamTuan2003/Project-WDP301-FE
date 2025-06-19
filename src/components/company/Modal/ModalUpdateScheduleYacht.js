import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import { Form, FormControl } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import { updateScheduleYacht } from "../../../services/ApiServices";
import _ from "lodash";
import { toast } from "react-toastify";
import { FaCalendarAlt, FaSave, FaTimes } from "react-icons/fa";

const ModalUpdateScheduleYacht = (props) => {
  const { show, handleClose, scheduleUpdate, yachtId } = props;
  const [getStartDate, setStartDate] = useState("");
  const [getEndDate, setEndDate] = useState("");

  useEffect(() => {
    if (!_.isEmpty(scheduleUpdate)) {
      setStartDate(scheduleUpdate.getStartDate);
      setEndDate(scheduleUpdate.getEndDate);
    }
  }, [scheduleUpdate]);

  const handleUpdateScheduleYacht = async () => {
    if (!getStartDate || !getEndDate) {
      toast.error("Start date or End date is empty");
      return;
    }

    const now = Date.now();
    if (new Date(getStartDate).getTime() <= now) {
      toast.error("Start date must before " + formatDateTime(now));
      return;
    }

    //check start date is before end date
    if (new Date(getStartDate).getTime() >= new Date(getEndDate).getTime()) {
      toast.error("Start date must be before End date");
      return;
    }

    let res = await updateScheduleYacht(
      yachtId.idYacht,
      scheduleUpdate.idSchedule,
      getStartDate,
      getEndDate
    );
    if (res && res.data.data === true) {
      toast.success("Updated schedule successfully");
      setStartDate("");
      setEndDate("");
      handleClose();
      await props.getScheduleYacht();
    } else {
      toast.error("Update failure");
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero indexed
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  return (
    <div>
      <Modal size="xl" show={show} onHide={handleClose} autoFocus centered>
        <Modal.Header closeButton className="bg-orange-50 rounded-t-2xl">
          <Modal.Title>
            <div className="flex items-center gap-2 text-orange-700 font-bold text-lg">
              <FaCalendarAlt className="text-2xl" /> Edit Schedule
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          <form className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="startDate"
                >
                  <FaCalendarAlt className="text-orange-500" /> Start date
                </label>
                <input
                  id="startDate"
                  type="datetime-local"
                  value={getStartDate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="endDate"
                >
                  <FaCalendarAlt className="text-orange-500" /> End date
                </label>
                <input
                  id="endDate"
                  type="datetime-local"
                  value={getEndDate}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="bg-orange-50 rounded-b-2xl flex gap-2">
          <button
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            type="button"
          >
            <FaTimes /> Close
          </button>
          <button
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleUpdateScheduleYacht}
            type="button"
          >
            <FaSave /> Save
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdateScheduleYacht;
