import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Accordion, Button } from 'react-bootstrap';
import { createRoomType, deleteRoomType, getAllRoomTypeCompany } from '../../../services/ApiServices';
import { toast } from 'react-toastify';
import { GoArrowDown, GoArrowUp } from 'react-icons/go';
import ReactPaginate from 'react-paginate';
import ModalUpdateRoomType from './ModalUpdateRoomType';

const ModalRoomType = (props) => {
    const { show, setIsShowModalRoomType, idYacht } = props;

    const [isShowModalUpdateRoomType, setIsShowModalUpdateRoomType] = useState(false);
    const [price, setPrice] = useState(0);
    const [type, setType] = useState('');
    const [utilities, setUtilities] = useState('');

    const handleClose = () => {
        setPrice('');
        setType('');
        setUtilities('');
        setIsShowModalRoomType(false)
    }

    const handleCreateRoomType = async () => {
        if (price === 0 || !type || !utilities) {
            toast.error('Please fill in all fields')
        } else if (price < 0) {
            toast.error('Price not Negative number')
        } else {
            if (roomType.find(t => t.type === type.trim())) {
                toast.error('Room Type Is Exits');
                return;
            } else {
                let res = await createRoomType(price, type.trim(), utilities.trim(), idYacht);
                if (res && res.data.data === true) {
                    toast.success('Create Successfully')
                    await getRoomType()
                    handleClose()
                } else {
                    toast.error('Create Fail')
                }
            }
        }
    }


    const [dataUpdate, setDataUpdate] = useState([]);
    const [roomType, setRoomType] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;

    useEffect(() => {
        getRoomType();
    }, [])


    const getRoomType = async () => {
        let res = await getAllRoomTypeCompany(idYacht);
        if (res && res.data.data) {
            setRoomType(res.data.data);
        } else {
            toast.info('Not Found Room Type');
        }
    }

    const handleUpdateRoomType = (type) => {
        setIsShowModalUpdateRoomType(true);
        setDataUpdate(type);
    }

    const handleDeleteRoomType = async (type) => {
        if (window.confirm(`You Want To Delete Room Type ${type.utilities}`)) {
            let res = await deleteRoomType(type.idRoomType);
            if (res && res.data && res.data.data === true) {
                toast.success('Delete Successfully');
                getRoomType();
                setCurrentPage(prevPage => {
                    const newLength = roomType.length - 1;
                    const maxPage = Math.ceil(newLength / itemsPerPage) - 1;
                    return prevPage > maxPage ? maxPage : prevPage;
                });
            } else {
                toast.error('Delete Fail');
            }
        }

    }

    const handleSortByPriceDown = () => {
        const newList = [...roomType].sort((a, b) => a.price - b.price);
        setRoomType(newList);
    }


    const handleSortByPriceUp = () => {
        const newList = [...roomType].sort((a, b) => b.price - a.price);
        setRoomType(newList);
    }
    const handlePageChange = (selectedItem) => {
        setCurrentPage(selectedItem.selected);
    }

    const displayedRoomTypes = roomType.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                className='modal-add-new-yacht'
                size='xl'
                autoFocus

            >
                <Modal.Header closeButton>
                    <Modal.Title>Manage Room Type</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Create Roomtype</Accordion.Header>
                            <Accordion.Body>
                                <Form>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} >
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                onChange={event => setPrice(event.target.value)}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} >
                                            <Form.Label>Type</Form.Label>
                                            <Form.Control
                                                type="text"
                                                onChange={event => setType(event.target.value)}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} >
                                            <Form.Label>Utilities</Form.Label>
                                            <Form.Control
                                                type="text"
                                                onChange={event => setUtilities(event.target.value)}
                                            />
                                        </Form.Group>
                                    </Row>

                                </Form>
                                <Button onClick={() => handleCreateRoomType()}>Create</Button>

                            </Accordion.Body>
                        </Accordion.Item>

                    </Accordion>

                    <div className='container'>
                        <div className='my-4'>

                        </div>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th scope="col">
                                        Price
                                        <GoArrowDown onClick={handleSortByPriceDown} style={{ cursor: 'pointer' }} />
                                        <GoArrowUp onClick={handleSortByPriceUp} style={{ cursor: 'pointer' }} />
                                    </th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Utilities</th>
                                    <th className='text-center' scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    displayedRoomTypes && displayedRoomTypes.length > 0 && displayedRoomTypes.map((type) =>
                                        <tr key={type.idRoomType}>
                                            <td>{type.price.toLocaleString()}</td>
                                            <td>{type.type}</td>
                                            <td>{type.utilities}</td>
                                            <td>
                                                <div className='d-flex' style={{ gap: 20, justifyContent: 'center' }}>
                                                    <Button onClick={() => handleUpdateRoomType(type)} className='btn btn-warning'>Update</Button>
                                                    <Button onClick={() => handleDeleteRoomType(type)} className='btn btn-danger'>Delete</Button>
                                                </div>
                                            </td>

                                        </tr>
                                    )
                                }


                            </tbody>
                        </table>
                        <div className='page'>
                            <ReactPaginate
                                nextLabel="Next >"
                                onPageChange={handlePageChange}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={Math.ceil(roomType.length / itemsPerPage)}
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

                        <ModalUpdateRoomType
                            show={isShowModalUpdateRoomType}
                            setIsShowModalUpdateRoomType={setIsShowModalUpdateRoomType}
                            dataUpdate={dataUpdate}
                            getRoomType={getRoomType}

                        />
                    </div>
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

export default ModalRoomType;