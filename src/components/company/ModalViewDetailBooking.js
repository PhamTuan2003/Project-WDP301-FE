import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
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
                        {bookingDetail.consultationData?.requestedRooms && bookingDetail.consultationData.requestedRooms.length > 0 ? (
                            bookingDetail.consultationData.requestedRooms.map((room, index) => (
                                <li key={index}>
                                    <b>{room.roomId?.name}</b> - {room.roomId?.description} (x{room.quantity})<br />
                                    <b>Loại phòng:</b> {room.roomId?.roomTypeId?.type} | <b>Tiện ích:</b> {room.roomId?.roomTypeId?.utility}<br />
                                    <img src={room.roomId?.avatar} alt="" width={100} />
                                </li>
                            ))
                        ) : (
                            <p>No rooms booked.</p>
                        )}
                    </ul>

                    <h5>Services</h5>
                    <ul>
                        {bookingDetail.consultationData?.requestServices && bookingDetail.consultationData.requestServices.length > 0 ? (
                            bookingDetail.consultationData.requestServices.map((service, index) => (
                                <li key={index}>
                                    {service.serviceId?.serviceName} - Price: {service.serviceId?.price?.toLocaleString()} (x{service.quantity})
                                </li>
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