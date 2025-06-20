import { useEffect, useState } from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { FaCirclePlus, FaLocationDot } from "react-icons/fa6";
import { RiShipLine } from "react-icons/ri";
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteYacht, getAllLocation, getYachtByIdCompany, getYachtType } from '../../services/ApiServices';
import './Company.scss';
import ModalCreateYacht from './Modal/ModalCreateYacht';
import './ViewYacht.scss';
const ViewYacht = () => {
    const navigate = useNavigate();
    const [isShowModal, setIsShowModal] = useState(false);
    const idCompany = useSelector(state => state.account.account.idCompany);
    const [yachtType, setYachtType] = useState([]);
    const [yacht, setYacht] = useState([]);

    const [searchYacht, setSearchYacht] = useState('');
    const [filteredYachts, setFilteredYachts] = useState([]);
    const [location, setLocation] = useState([]);

    const [filterLocation, setFilterLocation] = useState('');
    const [filterYachtType, setFilterYachtType] = useState('')

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;

    useEffect(() => {
        listYacht();
        getLocation();
        getTypeYacht();
    }, [])
    useEffect(() => {
        filterAndPaginateYachts();
    }, [searchYacht, filterLocation, filterYachtType, currentPage, yacht]);

    const listYacht = async () => {
        let res = await getYachtByIdCompany(idCompany);
        if (res && res.data && res.data.data) {
            setYacht(res.data.data);
            setFilteredYachts(res.data.data);
        } else {
            toast.info('Please Adding New Yacht');
        }
    }

    const handleDeleteYacht = async (id, name) => {
        let confirm;
        if (!name) {
            confirm = window.confirm(`You Want To Show Yacht`)
        } else {
            confirm = window.confirm(`Delete Yacht With Name: ${name}`)
        }
        if (confirm) {
            let res = await deleteYacht(id);
            if (res.data.data === true) {
                toast.success('Successfully');
                listYacht();
                setCurrentPage(prevPage => {
                    const maxPage = Math.ceil((yacht.length - 1) / itemsPerPage) - 1;
                    return prevPage > maxPage ? maxPage : prevPage;
                });
            } else {
                toast.error('Delete Fail')
            }
        }
    }

    const getLocation = async () => {
        let res = await getAllLocation();
        if (res && res.data) {
            setLocation(res.data);
        }
    }

    const getTypeYacht = async () => {
        let res = await getYachtType();
        if (res && res.data) {
            setYachtType(res.data)
        }
    }

    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected);
    };

    const filterAndPaginateYachts = () => {
        const filtered = yacht
            .filter(y => y.name.toLowerCase().includes(searchYacht.toLowerCase().trim()))
            .filter(y => filterLocation === '0' ? y : y.location.idLocation.includes(filterLocation))
            .filter(y => filterYachtType === '0' ? y : y.yachtType.idYachtType.includes(filterYachtType))


        setFilteredYachts(filtered);
    };

    const displayedYachts = filteredYachts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    return (
        <div className='view-yacht-container'>
            <div className='row my-4 mx-1'>

                <Button className='col-2 btn btn-success' onClick={() => setIsShowModal(true)}><FaCirclePlus style={{ marginRight: 8, marginBottom: 5 }} />Add New Yacht</Button>

                <FormGroup className='col-2'>
                    <Form.Select onChange={event => setFilterLocation(event.target.value)}>
                        <option value='0'>All Location</option>
                        {
                            location && location.length > 0 && location.map((location) =>
                                <option key={location._id} value={location._id}>{location.name}</option>
                            )
                        }
                    </Form.Select>
                </FormGroup>
                <FormGroup className='col-2'>
                    <Form.Select onChange={event => setFilterYachtType(event.target.value)}>
                        <option value='0'>All Yacht Type</option>
                        {
                            yachtType && yachtType.length > 0 && yachtType.map((type) =>
                                <option key={type._id} value={type._id}>{type.starRanking} Sao</option>
                            )
                        }
                    </Form.Select>
                </FormGroup>
                <FormGroup className='col-4 d-flex'>
                    <FormControl
                        placeholder='Search'
                        type='text'
                        value={searchYacht}
                        onChange={(event) => setSearchYacht(event.target.value)}
                    />
                </FormGroup>


            </div>

            <div className='row container'>
                <div className="col-xl-12">
                    {
                        displayedYachts.map((yacht) =>
                            <div key={yacht.idYacht} className="card mb-4 order-list">
                                <div className="gold-members p-4">

                                    <div className="media">

                                        <img className="mr-4" src={yacht.image} alt="Generic placeholder" />

                                        <div className="media-body">
                                            <div className='card-content'>
                                                <div className='location'><FaLocationDot />{yacht.location.name}</div>
                                                <div className='name'>{yacht.name}</div>
                                                <div> <RiShipLine /> Hạ Thủy {yacht.launch} - Tàu Vỏ {yacht.hullBody}  </div>

                                            </div>
                                            <div className='action d-flex'>
                                                <p className="mb-0 text-dark text-dark pt-2"><span className="text-dark font-weight-bold"></span>
                                                </p>
                                                <div className="float-right">

                                                    {
                                                        yacht.exist === 1
                                                            ?
                                                            <>
                                                                <Button className="btn btn-sm btn-infor" onClick={() => navigate(`/manage-services-yacht/${yacht.idYacht}`)}><i className="feather-check-circle" />Manage Services Yacht</Button>
                                                                <Button className="btn btn-sm btn-light" onClick={() => navigate(`/manage-schedule/${yacht.idYacht}`)}><i className="feather-trash" /> Manage Schedule </Button>
                                                                <Button className="btn btn-sm btn-success" onClick={() => navigate(`/manage-yacht/${yacht.idYacht}`)}><i className="feather-check-circle" />Manage Yacht</Button>
                                                                <Button className="btn btn-sm btn-warning" onClick={() => navigate(`/manage-room/${yacht.idYacht}`)}><i className="feather-trash" /> Manage Room </Button>
                                                                <Button className="btn btn-sm btn-danger" onClick={() => handleDeleteYacht(yacht.idYacht, yacht.name)}><i className="feather-trash" /> Hidden Yacht </Button>
                                                            </>
                                                            :
                                                            <Button className="btn btn-sm btn-success" onClick={() => handleDeleteYacht(yacht.idYacht)}><i className="feather-trash" /> Show Yacht </Button>

                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>

            </div>

            <div className='page'>
                <ReactPaginate
                    nextLabel="Next >"
                    onPageChange={handlePageChange}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={Math.ceil(filteredYachts.length / itemsPerPage)}
                    previousLabel="< Prev"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
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