import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import _ from "lodash";
import { updateRoomType } from "../../../services/ApiServices";
import {
  FaTag,
  FaMoneyBill,
  FaList,
  FaSave,
  FaTimes,
  FaRegEdit,
} from "react-icons/fa";

const ModalUpdateRoomType = (props) => {
  const { show, setIsShowModalUpdateRoomType, dataUpdate } = props;
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [utilities, setUtilities] = useState("");

  const handleClose = () => {
    setIsShowModalUpdateRoomType(false);
  };
  useEffect(() => {
    if (!_.isEmpty(dataUpdate)) {
      setPrice(dataUpdate.price);
      setType(dataUpdate.type);
      setUtilities(dataUpdate.utilities);
    }
  }, [dataUpdate]);

  const handleUpdateRoomType = async () => {
    if (!price || !type || !utilities) {
      toast.error("Please fill in all fields");
    } else {
      let res = await updateRoomType(
        dataUpdate.idRoomType,
        price,
        type,
        utilities.trim()
      );
      if (res && res.data.data === true) {
        toast.success("Update Successfully");
        handleClose();
        await props.getRoomType();
      } else {
        toast.error("Update Fail");
      }
    }
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        className="modal-add-new-yacht"
        autoFocus
        centered
      >
        <Modal.Header closeButton className="bg-purple-50 rounded-t-2xl">
          <Modal.Title>
            <div className="flex items-center gap-2 text-purple-700 font-bold text-lg">
              <FaTag className="text-2xl" /> Update Room Type
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          <form className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="price"
                >
                  <FaMoneyBill className="text-purple-500" /> Price
                </label>
                <input
                  id="price"
                  type="text"
                  value={price}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="type"
                >
                  <FaList className="text-purple-500" /> Type
                </label>
                <input
                  id="type"
                  type="text"
                  value={type}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  onChange={(event) => setType(event.target.value)}
                />
              </div>
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="utilities"
                >
                  <FaRegEdit className="text-purple-500" /> Utilities
                </label>
                <input
                  id="utilities"
                  type="text"
                  value={utilities}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  onChange={(event) => setUtilities(event.target.value)}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="bg-purple-50 rounded-b-2xl flex gap-2">
          <button
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            type="button"
          >
            <FaTimes /> Close
          </button>
          <button
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleUpdateRoomType}
            type="button"
          >
            <FaSave /> Save
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdateRoomType;
