import React, { useEffect, useState } from "react";
import { Modal, Col, Form, Row, Button } from "react-bootstrap";
import { FcPlus } from "react-icons/fc";
import { createRoom } from "../../../services/ApiServices";
import { toast } from "react-toastify";
import _ from "lodash";
import { set } from "nprogress";
import {
  FaRegEdit,
  FaSave,
  FaTimes,
  FaDoorOpen,
  FaRulerCombined,
  FaList,
  FaRegStickyNote,
  FaRegImage,
} from "react-icons/fa";

const ModalCreateRoom = (props) => {
  const {
    show,
    setIsShowModalCreateRoom,
    idYacht,
    listRoomType,
    fetchRoomType,
    getAllRoom,
  } = props;
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [area, setArea] = useState(0);
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState("");

  useEffect(() => {
    fetchRoomType();
    if (show) {
      if (_.isEmpty(listRoomType)) {
        toast.warning("Please create room type before creating room");
      } else {
        setRoomType(listRoomType[0]?.idRoomType);
      }
    }
  }, [show]);

  const handleClose = () => {
    setIsShowModalCreateRoom(false);
    resetForm();
  };

  const resetForm = () => {
    setRoomName("");
    setArea("");
    setDescription("");
    setRoomType(listRoomType[0]?.idRoomType);
    setPreviewImage("");
    setImage("");
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName || !area || !description || !roomType || !image) {
      toast.error("Please fill in all fields");
    } else if (area < 0) {
      toast.error("Area cannot be a negative number");
    } else {
      const res = await createRoom(
        roomName.trim(),
        area,
        description.trim(),
        roomType,
        image,
        idYacht
      );
      if (res?.data?.data) {
        toast.success("Create Successfully");
        handleClose();
        await getAllRoom();
      } else {
        toast.error("Create Fail");
      }
    }
  };

  return (
    <Modal
      size="xl"
      show={show}
      onHide={handleClose}
      backdrop="static"
      className="modal-add-new-yacht"
      autoFocus
      centered
    >
      <Modal.Header closeButton className="bg-blue-50 rounded-t-2xl">
        <Modal.Title>
          <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
            <FaRegEdit className="text-2xl" /> Add New Room
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-gray-50">
        <form className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                className="flex items-center gap-2 font-semibold mb-1"
                htmlFor="roomName"
              >
                <FaDoorOpen className="text-blue-500" /> Room Name
              </label>
              <input
                id="roomName"
                type="text"
                value={roomName}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label
                className="flex items-center gap-2 font-semibold mb-1"
                htmlFor="area"
              >
                <FaRulerCombined className="text-blue-500" /> Area (m²)
              </label>
              <input
                id="area"
                type="number"
                placeholder="Enter area in m²"
                value={area}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label
                className="flex items-center gap-2 font-semibold mb-1"
                htmlFor="roomType"
              >
                <FaList className="text-blue-500" /> Room Type
              </label>
              <select
                id="roomType"
                value={roomType}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setRoomType(e.target.value)}
              >
                {listRoomType.map((type) => (
                  <option key={type.idRoomType} value={type.idRoomType}>
                    {type.type}
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
              <FaRegStickyNote className="text-blue-500" /> Description
            </label>
            <textarea
              id="description"
              value={description}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ minHeight: "100px" }}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label
              className="flex items-center gap-2 font-semibold mb-1 cursor-pointer"
              htmlFor="labelUpload"
            >
              <FaRegImage className="text-blue-500" /> Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              hidden
              id="labelUpload"
              onChange={handleUploadImage}
            />
            <div className="flex items-center gap-4 mt-2">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-xl border-2 border-blue-400 shadow"
                />
              ) : (
                <span className="text-gray-400">Preview Avatar</span>
              )}
            </div>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="bg-blue-50 rounded-b-2xl flex gap-2">
        <button
          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
          onClick={handleClose}
          type="button"
        >
          <FaTimes /> Close
        </button>
        <button
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          onClick={handleCreateRoom}
          type="button"
        >
          <FaSave /> Save
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreateRoom;
