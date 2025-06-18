import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import { FcPlus } from "react-icons/fc";
import { toast } from "react-toastify";
import { updateImageRoom } from "../../../services/ApiServices";
import { FaRegImage, FaSave, FaTimes } from "react-icons/fa";

const ModalUpdateImageRoom = (props) => {
  const { show, setIsShowModalUpdateImage, imageUpdate } = props;
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const handleClose = () => {
    setIsShowModalUpdateImage(false);
    setImage("");
    setPreviewImage("");
  };
  useEffect(() => {
    setPreviewImage(imageUpdate);
  }, [imageUpdate]);

  const handelUpdateImageRoom = (event) => {
    if (event.target.files[0] && event.target && event.target.files) {
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
      setImage(event.target.files[0]);
    }
  };
  const handleUpdateImageRoom = async () => {
    let res = await updateImageRoom(imageUpdate, image);
    if (res && res.data.data === true) {
      toast.success("Update Image Successfully");
      handleClose();
      await props.getImageRoomById();
    } else {
      toast.error("Update ImageRoom Fail");
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
        <Modal.Header closeButton className="bg-indigo-50 rounded-t-2xl">
          <Modal.Title>
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-lg">
              <FaRegImage className="text-2xl" /> Update Room Image
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          <div>
            <label
              className="flex items-center gap-2 font-semibold mb-1 cursor-pointer"
              htmlFor="labelUpdateImageRoom"
            >
              <FaRegImage className="text-indigo-500" /> Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              hidden
              id="labelUpdateImageRoom"
              name="image"
              onChange={(event) => handelUpdateImageRoom(event)}
            />
            <div className="flex items-center gap-4 mt-2">
              {previewImage ? (
                <img
                  src={previewImage}
                  className="w-20 h-20 object-cover rounded-xl border-2 border-indigo-400 shadow"
                />
              ) : (
                <span className="text-gray-400">Preview Avatar</span>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="bg-indigo-50 rounded-b-2xl flex gap-2">
          <button
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            type="button"
          >
            <FaTimes /> Close
          </button>
          <button
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleUpdateImageRoom}
            type="button"
          >
            <FaSave /> Save
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdateImageRoom;
