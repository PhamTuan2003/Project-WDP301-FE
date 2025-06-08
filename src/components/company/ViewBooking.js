import React, { useEffect, useState } from 'react';
import { Button, Form, FormControl, FormGroup } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { canelBooking, confirmBooking, getBookingByAmount, getBookingOrder } from '../../services/ApiServices';
import './Company.scss';

import { Link } from 'react-router-dom';
import ModalViewDetailBooking from './ModalViewDetailBooking';
import ModalReasonCompany from './Modal/ModalReasonCompany';

const ViewBooking = () => {
    const idCompany = useSelector(state => state.account.account.idCompany);
    const [listBooking, setListBooking] = useState([]);
    const [isShowModalViewBooking, setIsShowModalViewBooking] = useState(false);
    const [filterSearch, setFilterSearch] = useState('');
    const [filterBooking, setFilterBooking] = useState([]);
    const [filterStatus, setFilterStatus] = useState([]);

    const [min, setMin] = useState('');
    const [max, setMax] = useState('');

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;

    const [bookingDetail, setBookingDetail] = useState({})

    const [showModalReason, setShowModalReason] = useState(false);
    const [idCancel, setIdCancel] = useState('');
    useEffect(() => {
        getBooking();
    }, [])


    useEffect(() => {
        filterAndPaginateBooking();
    }, [listBooking, filterSearch, currentPage, filterStatus]);

    const formatDate = (dateTimeString) => {
        const dateTime = new Date(dateTimeString);
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1; // Months are 0-indexed
        const year = dateTime.getFullYear();

        // Pad single digit minutes with leading zero
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${hours}:${formattedMinutes} ${day}/${month}/${year}`;
    };


    const getBooking = async () => {
        let res = await getBookingOrder(idCompany);
        if (res && res.data && res.data.data) {
            const sortedBookings = res.data.data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
            setListBooking(sortedBookings);
        } else (
            toast.error('Not Found Booking')
        )
    }


    const handleViewDetailBooking = (booking) => {
        setIsShowModalViewBooking(true);
        setBookingDetail(booking);
    }



    const handleConfrimBooking = async (idBooking) => {
        let res = await confirmBooking(idCompany, idBooking);
        if (res && res.data && res.data.data === true) {
            toast.success('Confimed Booking Successfully')
            getBooking();
        } else {
            toast.error('Confirm Fail')
        }
    }

    const handleCancelBooking = async (idBooking) => {
        setIdCancel(idBooking);
        setShowModalReason(true);

    }

    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected);
    };

    const filterAndPaginateBooking = () => {
        const filtered = listBooking
            .filter(b => b.customerDTO.fullName.toLowerCase().includes(filterSearch.toLowerCase().trim()))
            .filter(b => filterStatus === '0' ? b : b.status.includes(filterStatus))

        setFilterBooking(filtered);
    };

    const displayedBooking = filterBooking.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handleFilterByAmount = async () => {
        let res = await getBookingByAmount(idCompany, min, max)
        if (res && res.data && res.data.data) {
            setListBooking(res.data.data)
        }
    }



    return (
        <div className='container'>

            <div className='row'>

                <div className='row my-4'>
                    <h2 className='col-2'>Booking</h2>
                    <FormGroup className='col-2 d-flex'>
                        <FormControl placeholder='Name Customer' onChange={e => setFilterSearch(e.target.value)} type='text' />
                    </FormGroup>
                    <FormGroup className='col-2'>
                        <Form.Select onChange={event => setFilterStatus(event.target.value)}>
                            <option value='0'>All Status</option>
                            <option value='Pending'>Pending</option>
                            <option value='Confirmed'>Confirmed</option>
                            <option value='Decliled'>Decliled</option>

                        </Form.Select>
                    </FormGroup>
                    <FormGroup className='col-2'>
                        <FormControl placeholder='Min Amount' onChange={e => setMin(e.target.value)} type='number' />
                    </FormGroup>
                    <FormGroup className='col-2'>
                        <FormControl placeholder='Max Amount' onChange={e => setMax(e.target.value)} type='number' />
                    </FormGroup>
                    <Button onClick={handleFilterByAmount} className='col btn btn-warning'>Search Amount</Button>
                </div>
                <div className='row container'>
                    <div className="col-xl-12">

                        {
                            displayedBooking && displayedBooking.map((booking) =>

                                <div style={{ cursor: 'pointer' }} key={booking.idBooking} className="card mb-4 order-list">
                                    <div className="gold-members p-4">

                                        <div className="media">

                                            <div className="media-body">
                                                <b >
                                                    <span className="float-right text-success">{formatDate(booking.bookingTime)}<i className="feather-check-circle text-success" /></span>
                                                </b>
                                                <h6 className="mb-3"><b href="#">
                                                </b><b className="text-dark">{booking.customerDTO.fullName}</b>
                                                </h6>
                                                <p className="text-black-50 mb-1"><i className="feather-map-pin" /> {booking.yachtName}, Amount: {booking.amount.toLocaleString()}VNĐ
                                                </p>
                                                <p className="text-black-50 mb-1"><i className="feather-list" /> Schedule - <i className="feather-clock ml-2" />
                                                    Start Date: {formatDate(booking.schedule.startDate)}, End Date: {formatDate(booking.schedule.endDate)} </p>
                                                <p className="text-black-50 mb-3"><i className="feather-list" /> Requirement: <i className="feather-clock ml-2" />{booking.requirement}</p>

                                                <hr />
                                                <div className='action d-flex'>
                                                    <p className="mb-0 text-dark text-dark pt-2">Status: <span style={{
                                                        color: booking.status === 'Pending' ? 'orange' :
                                                            (booking.status === 'Confirmed' ? 'green' :
                                                                (booking.status === 'Cancelled' ? 'red' : 'black'))
                                                    }} className=" font-weight-bold">{booking.status} </span>
                                                    </p>
                                                    <div className="float-right">
                                                        {
                                                            booking.status === 'Pending' ? (
                                                                <>
                                                                    <Link onClick={() => handleViewDetailBooking(booking)} className="btn btn-sm btn-warning"> View Detai </Link>
                                                                    <Link onClick={() => handleConfrimBooking(booking.idBooking)} className="btn btn-sm btn-success"> Confirm </Link>
                                                                    <Link onClick={() => handleCancelBooking(booking.idBooking)} className="btn btn-sm btn-danger"> Cancel</Link>
                                                                </>
                                                            )
                                                                :
                                                                <Link onClick={() => handleViewDetailBooking(booking)} className="btn btn-sm btn-warning"> View Detai </Link>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <div className='page'>
                            <ReactPaginate
                                nextLabel="Next >"
                                onPageChange={handlePageChange}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={Math.ceil(filterBooking.length / itemsPerPage)}
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

                    </div>

                </div>
                <ModalViewDetailBooking
                    show={isShowModalViewBooking}
                    setIsShowModalViewBooking={setIsShowModalViewBooking}
                    bookingDetail={bookingDetail}
                />

                <ModalReasonCompany
                    showModalReason={showModalReason}
                    setShowModalReason={setShowModalReason}
                    idCancel={idCancel}
                    getBooking={getBooking}
                />
            </div >




        </div>
    );
};

export default ViewBooking;