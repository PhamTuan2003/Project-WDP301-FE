import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { canelBooking } from "../../../services/ApiServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaRegStickyNote, FaSave, FaTimes } from "react-icons/fa";

const ModalReasonCompany = (props) => {
  const { showModalReason, setShowModalReason, idCancel } = props;
  const idCompany = useSelector((state) => state?.account?.idCompany);

  const handleClose = () => {
    setShowModalReason(false);
    setReason("");
  };
  const [reason, setReason] = useState("");

  const handleCancelBooking = async () => {
    if (!reason) {
      toast.error("Input Not Empty");
    } else {
      let res = await canelBooking(idCompany, idCancel, reason.trim());
      if (res && res.data && res.data.data === true) {
        toast.success("Cancel Booking Successfully");
        await props.getBooking();
        handleClose();
      } else {
        toast.error("Cancel Fail");
      }
    }
  };

  return (
    <div>
      <Modal show={showModalReason} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-red-50 rounded-t-2xl">
          <Modal.Title>
            <div className="flex items-center gap-2 text-red-700 font-bold text-lg">
              <FaRegStickyNote className="text-2xl" /> Reason Booking
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          <div>
            <label
              className="flex items-center gap-2 font-semibold mb-1"
              htmlFor="reason"
            >
              <FaRegStickyNote className="text-red-500" /> Reason Cancel Booking
            </label>
            <textarea
              id="reason"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              style={{ minHeight: "100px" }}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason Cancel Booking"
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-red-50 rounded-b-2xl flex gap-2">
          <button
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            type="button"
          >
            <FaTimes /> Close
          </button>
          <button
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleCancelBooking}
            type="button"
          >
            <FaSave /> Send
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalReasonCompany;
