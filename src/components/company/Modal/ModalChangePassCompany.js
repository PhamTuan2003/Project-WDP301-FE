import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FormControl, FormGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { changePasswordCompany } from "../../../services/ApiServices";
import { useSelector } from "react-redux";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaSave, FaTimes } from "react-icons/fa";

const ModalChangePassCompany = (props) => {
  const { show, handleClose } = props;
  const idCompany = useSelector((state) => state?.account?.idCompany);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
    } else if (newPassword.length < 8) {
      toast.error("New Password must be at least 8 charaters");
    } else {
      let res = await changePasswordCompany(
        idCompany,
        oldPassword.trim(),
        newPassword.trim(),
        confirmPassword.trim()
      );

      if (res && res.data && res.data.data === "400") {
        toast.error("Old password incorrect");
      } else if (res && res.data && res.data.data === "999") {
        toast.error("New password not matched confirm password");
      } else {
        toast.success("Change Password Succesfully");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        handleClose();
      }
    }
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-yellow-50 rounded-t-2xl">
          <Modal.Title>
            <div className="flex items-center gap-2 text-yellow-700 font-bold text-lg">
              <RiLockPasswordLine className="text-2xl" /> Change Password
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-gray-50">
          <form className="space-y-4">
            <div>
              <label
                className="flex items-center gap-2 font-semibold mb-1"
                htmlFor="oldPassword"
              >
                <RiLockPasswordLine className="text-yellow-500" /> Old Password
              </label>
              <div className="relative">
                <input
                  id="oldPassword"
                  type="password"
                  value={oldPassword}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                className="flex items-center gap-2 font-semibold mb-1"
                htmlFor="newPassword"
              >
                <RiLockPasswordLine className="text-yellow-500" /> New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <div>
              <label
                className="flex items-center gap-2 font-semibold mb-1"
                htmlFor="confirmPassword"
              >
                <RiLockPasswordLine className="text-yellow-500" /> Confirm New
                Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword1 ? "text" : "password"}
                  value={confirmPassword}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl text-gray-400"
                  onClick={() => setShowPassword1(!showPassword1)}
                >
                  {showPassword1 ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer className="bg-yellow-50 rounded-b-2xl flex gap-2">
          <button
            className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleClose}
            type="button"
          >
            <FaTimes /> Cancel
          </button>
          <button
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg transition"
            onClick={handleChangePassword}
            type="button"
          >
            <FaSave /> Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModalChangePassCompany;
