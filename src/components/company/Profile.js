import React, { useEffect, useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import ModalUpdateProfile from "./Modal/ModalUpdateProfile";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getProfileCompany } from "../../services/ApiServices";
import ModalChangePassCompany from "./Modal/ModalChangePassCompany";
import { MdEmail } from "react-icons/md";
import { FaMapMarkerAlt, FaUserTie, FaEdit } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";

const ProfileCompany = () => {
  const idCompany = useSelector((state) => state?.account?.idCompany);

  const [isShowModal, setIsShowModal] = useState(false);
  const [profile, setProfile] = useState({});
  const [showModalChangePass, setShowModalChangePass] = useState(false);

  const handleClose = () => {
    setIsShowModal(false);
    setShowModalChangePass(false);
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    let res = await getProfileCompany(idCompany);
    if (res && res.data && res.data.data) {
      setProfile(res.data.data);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center gap-4">
          <img
            src={profile.logo}
            alt="logo"
            className="w-24 h-24 object-cover rounded-full border-4 border-green-400 shadow mb-2"
          />
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <MdEmail className="text-xl text-green-500" />
              <span className="font-semibold">Email:</span>
              <span className="text-gray-500">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaMapMarkerAlt className="text-xl text-green-500" />
              <span className="font-semibold">Address:</span>
              <span className="text-gray-500">{profile.address}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaUserTie className="text-xl text-green-500" />
              <span className="font-semibold">Name:</span>
              <span className="text-gray-500">{profile.name}</span>
            </div>
          </div>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setIsShowModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
            >
              <FaEdit />
              Edit
            </button>
            <button
              onClick={() => setShowModalChangePass(true)}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
            >
              <RiLockPasswordLine />
              Change Password
            </button>
          </div>
        </div>
      </div>
      <ModalUpdateProfile
        show={isShowModal}
        handleClose={handleClose}
        profile={profile}
        getProfile={getProfile}
      />
      <ModalChangePassCompany
        show={showModalChangePass}
        handleClose={handleClose}
      />
    </div>
  );
};

export default ProfileCompany;
