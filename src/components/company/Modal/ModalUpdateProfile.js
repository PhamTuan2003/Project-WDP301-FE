import React, { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import _ from "lodash";
import { useSelector } from "react-redux";
import { FcPlus } from "react-icons/fc";
import { updateProfileCompany } from "../../../services/ApiServices";
import { toast } from "react-toastify";
import { MdEmail } from "react-icons/md";
import {
  FaMapMarkerAlt,
  FaUserTie,
  FaRegImage,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const ModalUpdateProfile = (props) => {
  const { show, handleClose, profile } = props;
  const idCompany = useSelector((state) => state?.account?.idCompany);

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (!_.isEmpty(profile)) {
      setEmail(profile.email);
      setAddress(profile.address);
      setName(profile.name);
      setImage(profile.logo);
      setPreviewImage(profile.logo);
      setImage(profile.logo);
    }
  }, [profile]);

  const handelUploadImage = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    const url = event.target.value ? event.target.value : null;

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file);
    } else if (url) {
      setPreviewImage(url);
      setImage(url);
    }

    // if (event.target.files[0] && event.target && event.target.files) {
    //     setPreviewImage(URL.createObjectURL(event.target.files[0]));
    //     setImage(event.target.files[0]);
    // }
  };

  const handleUpdateProfile = async () => {
    if (!name || !address) {
      toast.error("Please fill in all fields");
    } else {
      let res = await updateProfileCompany(
        idCompany,
        name.trim(),
        address.trim(),
        image
      );
      if (res && res.data && res.data.data === true) {
        toast.success("Update Successfully");
        handleClose();
        await props.getProfile();
      } else {
        toast.error("Update Fail");
      }
    }
  };

  return (
    <div>
      <Modal size="xl" show={show} onHide={handleClose} autoFocus centered>
        <Modal.Header closeButton className="bg-green-50 rounded-t-2xl">
          <Modal.Title>
            <div className="flex items-center gap-2 text-green-700 font-bold text-lg">
              <FaRegImage className="text-2xl" /> Update Profile
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          <form className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="email"
                >
                  <MdEmail className="text-green-500" /> Email
                </label>
                <input
                  id="email"
                  disabled
                  value={email}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-gray-100 text-gray-500"
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="flex-1">
                <label
                  className="flex items-center gap-2 font-semibold mb-1"
                  htmlFor="address"
                >
                  <FaMapMarkerAlt className="text-green-500" /> Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                className="flex items-center gap-2 font-semibold mb-1"
                htmlFor="name"
              >
                <FaUserTie className="text-green-500" /> Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <label
                className="flex items-center gap-2 font-semibold mb-1 cursor-pointer"
                htmlFor="labelCreateImage"
              >
                <FaRegImage className="text-green-500" /> Upload Logo
              </label>
              <input
                type="file"
                accept="image/*"
                hidden
                id="labelCreateImage"
                name="image"
                onChange={(event) => handelUploadImage(event)}
              />
              <div className="flex items-center gap-4 mt-2">
                {previewImage ? (
                  <img
                    src={previewImage}
                    className="w-20 h-20 object-cover rounded-full border-2 border-green-400 shadow"
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
            onClick={handleUpdateProfile}
            type="button"
          >
            <FaSave /> Save
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalUpdateProfile;
