import React, { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { FcPlus } from "react-icons/fc";
import _ from "lodash";
import { updateRoom } from "../../../services/ApiServices";
import { toast } from "react-toastify";
import {
  FaRegEdit,
  FaSave,
  FaTimes,
  FaDoorOpen,
  FaRegStickyNote,
  FaRegImage,
} from "react-icons/fa";

const ModalUpdateRoom = (props) => {
  const { show, setIsShowModalUpdateRoom, dataUpdateRoom } = props;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  useEffect(() => {
    if (!_.isEmpty(dataUpdateRoom)) {
      setName(dataUpdateRoom.name);
      setDescription(dataUpdateRoom.description);
      setPreviewImage(dataUpdateRoom.avatar);
    }
  }, [dataUpdateRoom]);

  const handelUploadImageRoom = (event) => {
    if (event.target.files[0] && event.target && event.target.files) {
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
      setImage(event.target.files[0]);
    }
  };

  const handleClose = () => {
    setIsShowModalUpdateRoom(false);
  };

  const handleUpdateRoom = async () => {
    if (!name || !description) {
      toast.error("Please fill in all fields");
    } else {
      let res = await updateRoom(
        dataUpdateRoom.idRoom,
        description.trim(),
        name.trim(),
        image
      );
      if (res && res.data.data === true) {
        toast.success("Update Successfully");
        handleClose();
        await props.getAllRoom();
      } else {
        toast.error("Update Fail");
      }
    }
  };

  return (
    <div>
      <Modal size="xl" show={show} onHide={handleClose} autoFocus centered>
        <Modal.Header closeButton className="bg-blue-50 rounded-t-2xl">
          <Modal.Title>
            <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
              <FaRegEdit className="text-2xl" /> Update Room
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          <form className="space-y-4">
            <div>
              <label
                className="flex items-center gap-2 font-semibold mb-1"
                htmlFor="name"
              >
                <FaDoorOpen className="text-blue-500" /> Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Name room"
                value={name}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setName(e.target.value)}
              />
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
                name="image"
                onChange={(event) => handelUploadImageRoom(event)}
              />
              <div className="flex items-center gap-4 mt-2">
                {previewImage ? (
                  <img
                    src={previewImage}
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
            onClick={handleUpdateRoom}
            type="button"
          >
            <FaSave /> Save
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdateRoom;
