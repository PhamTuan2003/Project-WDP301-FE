import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap'
import _ from 'lodash';
const ModalViewDetailBooking = (props) => {
    const { show, setIsShowModalViewBooking, bookingDetail } = props;
    const [booking, setBooking] = useState({});

    const handleClose = () => {
        setIsShowModalViewBooking(false)
    }

    useEffect(() => {
        if (!_.isEmpty(bookingDetail) && show) {
            setBooking(bookingDetail);
        }
    }, [bookingDetail, show])



    return (
        <div>
            <Modal size='xl'
                show={show}
                onHide={handleClose}
                backdrop="static"
                className='modal-add-new-yacht'
                autoFocus

            >
                <Modal.Header closeButton>
                    <Modal.Title>Booking Detail</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <h5>Rooms</h5>
                    <ul>
                        {bookingDetail.rooms && bookingDetail.rooms.length > 0 ? (
                            bookingDetail.rooms.map((room, index) => (
                                <li key={index}>{room.name}</li>
                            ))
                        ) : (
                            <p>No rooms booked.</p>
                        )}
                    </ul>

                    <h5>Services</h5>
                    <ul>
                        {bookingDetail.services && bookingDetail.services.length > 0 ? (
                            bookingDetail.services.map((service, index) => (
                                <li key={index}> Service: {service.service} - Price: {service.price}</li>

                            ))
                        ) : (
                            <p>No services added.</p>
                        )}
                    </ul>
                    <h5>Reason</h5>
                    <ul>
                        {
                            <li > Reason: {bookingDetail.reason}</li>
                        }
                    </ul>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default ModalViewDetailBooking;