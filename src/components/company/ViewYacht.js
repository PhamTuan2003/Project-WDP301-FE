import React, { useEffect, useState } from "react";
import { Button, FormControl, FormGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { RiShipLine } from "react-icons/ri";
import { FaLocationDot } from "react-icons/fa6";
import "./ViewYacht.scss";
import ReactPaginate from "react-paginate";
import "./Company.scss";
import { FaCirclePlus } from "react-icons/fa6";
import ModalCreateYacht from "./Modal/ModalCreateYacht";
import {
  deleteYacht,
  getAllLocation,
  getYachtByIdCompany,
  getYachtType,
} from "../../services/ApiServices";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const ViewYacht = () => {
  const navigate = useNavigate();
  const [isShowModal, setIsShowModal] = useState(false);
  const idCompany = useSelector((state) => state?.account?.idCompany);
  const [yachtType, setYachtType] = useState([]);
  const [yacht, setYacht] = useState([]);

  const [searchYacht, setSearchYacht] = useState("");
  const [filteredYachts, setFilteredYachts] = useState([]);
  const [location, setLocation] = useState([]);

  const [filterLocation, setFilterLocation] = useState("");
  const [filterYachtType, setFilterYachtType] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    listYacht();
    getLocation();
    getTypeYacht();
  }, []);
  useEffect(() => {
    filterAndPaginateYachts();
  }, [searchYacht, filterLocation, filterYachtType, currentPage, yacht]);

  const listYacht = async () => {
    let res = await getYachtByIdCompany(idCompany);
    if (res && res.data && res.data.data) {
      setYacht(res.data.data);
      setFilteredYachts(res.data.data);
    } else {
      toast.info("Please Adding New Yacht");
    }
  };

  const handleDeleteYacht = async (id, name) => {
    let confirm;
    if (!name) {
      confirm = window.confirm(`You Want To Show Yacht`);
    } else {
      confirm = window.confirm(`Delete Yacht With Name: ${name}`);
    }
    if (confirm) {
      let res = await deleteYacht(id);
      if (res.data.data === true) {
        toast.success("Successfully");
        listYacht();
        setCurrentPage((prevPage) => {
          const maxPage = Math.ceil((yacht.length - 1) / itemsPerPage) - 1;
          return prevPage > maxPage ? maxPage : prevPage;
        });
      } else {
        toast.error("Delete Fail");
      }
    }
  };

  const getLocation = async () => {
    let res = await getAllLocation();
    if (res && res.data && res.data.data) {
      setLocation(res.data.data);
    }
  };

  const getTypeYacht = async () => {
    let res = await getYachtType();
    if (res && res.data && res.data.data) {
      setYachtType(res.data.data);
    }
  };

  const handlePageChange = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const filterAndPaginateYachts = () => {
    const filtered = yacht
      .filter((y) =>
        y.name.toLowerCase().includes(searchYacht.toLowerCase().trim())
      )
      .filter((y) =>
        filterLocation === "0"
          ? y
          : y.location.idLocation.includes(filterLocation)
      )
      .filter((y) =>
        filterYachtType === "0"
          ? y
          : y.yachtType.idYachtType.includes(filterYachtType)
      );

    setFilteredYachts(filtered);
  };

  const displayedYachts = filteredYachts.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div>
          <select
            className="rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(event) => setFilterLocation(event.target.value)}
          >
            <option value="0">All Location</option>
            {location &&
              location.length > 0 &&
              location.map((location) => (
                <option key={location.idLocation} value={location.idLocation}>
                  {location.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <select
            className="rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={(event) => setFilterYachtType(event.target.value)}
          >
            <option value="0">All Yacht Type</option>
            {yachtType &&
              yachtType.length > 0 &&
              yachtType.map((type) => (
                <option key={type.idYachtType} value={type.idYachtType}>
                  {type.starRanking} Sao
                </option>
              ))}
          </select>
        </div>
        <div className="flex-1">
          <input
            className="w-72 rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Search"
            type="text"
            value={searchYacht}
            onChange={(event) => setSearchYacht(event.target.value)}
          />
        </div>
        <button
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-xl shadow transition"
          onClick={() => setIsShowModal(true)}
        >
          <FaCirclePlus className="text-xl" />
          Add New Yacht
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedYachts.map((yacht) => (
          <div
            key={yacht.idYacht}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition p-5 flex flex-col gap-4"
          >
            <div className="flex gap-4 items-center">
              <img
                className="w-28 h-28 object-cover rounded-xl border-2 border-green-400 shadow"
                src={yacht.image}
                alt={yacht.name}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-green-600 font-semibold text-sm mb-1">
                  <FaLocationDot />
                  <span>{yacht.location.name}</span>
                </div>
                <div className="font-bold text-lg mb-1">{yacht.name}</div>
                <div className="text-gray-500 text-sm flex items-center gap-2">
                  <RiShipLine />
                  Hạ Thủy {yacht.launch} - Tàu Vỏ {yacht.hullBody}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-end mt-2">
              {yacht.exist === 1 ? (
                <>
                  <button
                    className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium px-3 py-1 rounded-lg transition flex items-center gap-1 text-sm"
                    onClick={() =>
                      navigate(`/manage-services-yacht/${yacht.idYacht}`)
                    }
                  >
                    <i className="feather-check-circle" />
                    Manage Services
                  </button>
                  <button
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium px-3 py-1 rounded-lg transition flex items-center gap-1 text-sm"
                    onClick={() =>
                      navigate(`/manage-schedule/${yacht.idYacht}`)
                    }
                  >
                    <i className="feather-calendar" />
                    Manage Schedule
                  </button>
                  <button
                    className="bg-green-100 text-green-700 hover:bg-green-200 font-medium px-3 py-1 rounded-lg transition flex items-center gap-1 text-sm"
                    onClick={() => navigate(`/manage-yacht/${yacht.idYacht}`)}
                  >
                    <i className="feather-check-circle" />
                    Manage Yacht
                  </button>
                  <button
                    className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-medium px-3 py-1 rounded-lg transition flex items-center gap-1 text-sm"
                    onClick={() => navigate(`/manage-room/${yacht.idYacht}`)}
                  >
                    <i className="feather-home" />
                    Manage Room
                  </button>
                  <button
                    className="bg-red-100 text-red-700 hover:bg-red-200 font-medium px-3 py-1 rounded-lg transition flex items-center gap-1 text-sm"
                    onClick={() => handleDeleteYacht(yacht.idYacht, yacht.name)}
                  >
                    <i className="feather-trash" />
                    Hidden Yacht
                  </button>
                </>
              ) : (
                <button
                  className="bg-green-100 text-green-700 hover:bg-green-200 font-medium px-3 py-1 rounded-lg transition flex items-center gap-1 text-sm"
                  onClick={() => handleDeleteYacht(yacht.idYacht)}
                >
                  <i className="feather-eye" />
                  Show Yacht
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <ReactPaginate
          nextLabel="Next >"
          onPageChange={handlePageChange}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={Math.ceil(filteredYachts.length / itemsPerPage)}
          previousLabel="< Prev"
          pageClassName="inline-block mx-1"
          pageLinkClassName="rounded-full px-3 py-1 bg-white border border-gray-300 hover:bg-green-100 transition"
          previousClassName="inline-block mx-1"
          previousLinkClassName="rounded-full px-3 py-1 bg-white border border-gray-300 hover:bg-green-100 transition"
          nextClassName="inline-block mx-1"
          nextLinkClassName="rounded-full px-3 py-1 bg-white border border-gray-300 hover:bg-green-100 transition"
          breakLabel="..."
          breakClassName="inline-block mx-1"
          breakLinkClassName="rounded-full px-3 py-1 bg-white border border-gray-300"
          containerClassName="flex"
          activeClassName="bg-green-500 text-white border-green-500"
          renderOnZeroPageCount={null}
        />
      </div>
      <ModalCreateYacht
        show={isShowModal}
        setShow={setIsShowModal}
        idCompany={idCompany}
        listYacht={listYacht}
        location={location}
      />
    </div>
  );
};

export default ViewYacht;
