import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { upadteServiceYacht } from "../../../services/ApiServices";
import _ from "lodash";
import { toast } from "react-toastify";
import { FaList, FaMoneyBill, FaSave, FaTimes } from "react-icons/fa";

const ModalUpdateServiceYacht = (props) => {
  const { show, handleClose, serviceUpdate, idYacht } = props;
  const [price, setPrice] = useState("");
  const [service, setService] = useState("");

  useEffect(() => {
    if (!_.isEmpty(serviceUpdate)) {
      setService(serviceUpdate.service);
      setPrice(serviceUpdate.price);
    }
  }, [serviceUpdate]);

  const handleUpdateServiceYacht = async () => {
    if (!service || !price) {
      toast.error("Please fill in all fields");
      return;
    } else {
      let res = await upadteServiceYacht(
        idYacht,
        serviceUpdate.idService,
        service.trim(),
        price
      );
      if (res && res.data.data === true) {
        toast.success("Update Successfully");
        setPrice("");
        setService("");
        handleClose();
        await props.getServiceYacht();
      } else {
        toast.error("Update Fail");
      }
    }
  };
  return (
    <div>
      <Modal size="xl" show={show} onHide={handleClose} autoFocus centered>
        <Modal.Header closeButton className="bg-pink-50 rounded-t-2xl">
          <Modal.Title>
            <div className="flex items-center gap-2 text-pink-700 font-bold text-lg">
              <FaList className="text-2xl" /> Update Service Yacht
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          <form className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="service"
                >
                  <FaList className="text-pink-500" /> Service
                </label>
                <input
                  id="service"
                  type="text"
                  value={service}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  onChange={(event) => setService(event.target.value)}
                />
              </div>
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="price"
                >
                  <FaMoneyBill className="text-pink-500" /> Price
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="bg-pink-50 rounded-b-2xl flex gap-2">
          <button
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            type="button"
          >
            <FaTimes /> Close
          </button>
          <button
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleUpdateServiceYacht}
            type="button"
          >
            <FaSave /> Save
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdateServiceYacht;
