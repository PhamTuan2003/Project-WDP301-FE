import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Button } from "react-bootstrap";
import { FcPlus } from "react-icons/fc";
import { createYacht, getYachtType } from "../../../services/ApiServices";
import { toast } from "react-toastify";
import _ from "lodash";
import { useSelector } from "react-redux";
import {
  FaRegEdit,
  FaSave,
  FaTimes,
  FaShip,
  FaRegStickyNote,
  FaRegImage,
  FaMapMarkerAlt,
  FaList,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";

const ModalCreateYacht = (props) => {
  const { show, setShow, location } = props;
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [yachtType, setYachtType] = useState([]);
  const idCompany = useSelector((state) => state?.account?.idCompany);

  const initInforYacht = {
    name: "",
    hullBody: "",
    launch: "",
    itinerary: "",
    rule: "",
    description: "",
    location: "",
    yachtType: "",
  };

  useEffect(() => {
    getAllType();
  }, []);

  useEffect(() => {
    if (show && !_.isEmpty(location) && !_.isEmpty(yachtType)) {
      setData({
        ...initInforYacht,
        location: location ? location[0].idLocation : "",
        yachtType: yachtType ? yachtType[0].idYachtType : "",
      });
    }
  }, [show]);

  const handleClose = () => {
    setShow(false);
    setPreviewImage("");
    setImage("");
    setData(initInforYacht);
  };

  const [data, setData] = useState(initInforYacht);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handelUploadImage = (event) => {
    if (event.target.files[0] && event.target && event.target.files) {
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
      setImage(event.target.files[0]);
    }
  };
  const handleCreateYacht = async () => {
    if (
      !data.name ||
      !image ||
      !data.launch ||
      !data.hullBody ||
      !data.description ||
      !data.rule ||
      !data.itinerary ||
      !data.location ||
      !data.yachtType
    ) {
      toast.error("Please fill in all fields");
    } else {
      let res = await createYacht(
        idCompany,
        data.name.trim(),
        image,
        data.launch,
        data.hullBody.trim(),
        data.description.trim(),
        data.rule.trim(),
        data.itinerary.trim(),
        data.location,
        data.yachtType
      );
      if (res && res.data.data === true) {
        toast.success("Create Successfully");
        await props.listYacht();
        handleClose();
      } else {
        toast.error("Create Fail");
      }
    }
  };

  const getAllType = async () => {
    let res = await getYachtType();
    setYachtType(res.data.data);
  };

  return (
    <>
      <Modal
        size="xl"
        show={show}
        onHide={handleClose}
        backdrop="static"
        className="modal-add-new-yacht"
        autoFocus
        centered
      >
        <Modal.Header closeButton className="bg-green-50 rounded-t-2xl">
          <Modal.Title>
            <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
              <FaShip className="text-2xl" /> Add New Yacht
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          <form className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="name"
                >
                  <FaShip className="text-green-500" /> Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Yacht Name"
                  value={data.name}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="hullBody"
                >
                  <FaClipboardList className="text-green-500" /> Hull-Body
                </label>
                <input
                  id="hullBody"
                  name="hullBody"
                  type="text"
                  placeholder="Hull-Body"
                  value={data.hullBody}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="launch"
                >
                  <FaCalendarAlt className="text-green-500" /> Launch
                </label>
                <input
                  id="launch"
                  name="launch"
                  type="date"
                  placeholder="Launch"
                  value={data.launch}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="itinerary"
                >
                  <FaList className="text-green-500" /> Itinerary
                </label>
                <input
                  id="itinerary"
                  name="itinerary"
                  type="text"
                  placeholder="Itinerary"
                  value={data.itinerary}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="rule"
                >
                  <FaClipboardList className="text-green-500" /> Rule
                </label>
                <input
                  id="rule"
                  name="rule"
                  type="text"
                  placeholder="Rule"
                  value={data.rule}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={handleChange}
                />
              </div>
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="location"
                >
                  <FaMapMarkerAlt className="text-green-500" /> Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={data.location}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={handleChange}
                >
                  {location &&
                    location.map((location) => (
                      <option
                        key={location.idLocation}
                        value={location.idLocation}
                      >
                        {location.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="yachtType"
                >
                  <FaList className="text-green-500" /> Yacht Type
                </label>
                <select
                  id="yachtType"
                  name="yachtType"
                  value={data.yachtType}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={handleChange}
                >
                  {yachtType &&
                    yachtType.map((type) => (
                      <option key={type.idYachtType} value={type.idYachtType}>
                        {type.starRanking} Sao
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div>
              <label
                className="flex items-center gap-2 font-semibold mb-1"
                htmlFor="description"
              >
                <FaRegStickyNote className="text-green-500" /> Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                value={data.description}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                style={{ minHeight: "100px" }}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                className="flex items-center gap-2 font-semibold mb-1 cursor-pointer"
                htmlFor="labelUpload"
              >
                <FaRegImage className="text-green-500" /> Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                hidden
                id="labelUpload"
                name="image"
                onChange={(event) => handelUploadImage(event)}
              />
              <div className="flex items-center gap-4 mt-2">
                {previewImage ? (
                  <img
                    src={previewImage}
                    className="w-20 h-20 object-cover rounded-xl border-2 border-green-400 shadow"
                  />
                ) : (
                  <span className="text-gray-400">Preview Avatar</span>
                )}
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="bg-green-50 rounded-b-2xl flex gap-2">
          <button
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            type="button"
          >
            <FaTimes /> Close
          </button>
          <button
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleCreateYacht}
            type="button"
          >
            <FaSave /> Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default ModalCreateYacht;
