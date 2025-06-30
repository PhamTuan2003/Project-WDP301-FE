import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Button } from 'react-bootstrap'
import { FcPlus } from "react-icons/fc";
import { createYacht, getYachtType } from '../../../services/ApiServices';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { useSelector } from 'react-redux';

const ModalCreateYacht = (props) => {
    const { show, setShow, location } = props;
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [yachtType, setYachtType] = useState([]);
    const idCompany = useSelector(state => state.account.account.idCompany)

    const initInforYacht = {
        name: '',
        hullBody: '',
        launch: '',
        itinerary: '',
        rule: '',
        description: '',
        location: '',
        yachtType: '',
    }


    useEffect(() => {
        getAllType()
    }, [])

    useEffect(() => {
        if (show && !_.isEmpty(location) && !_.isEmpty(yachtType)) {
            setData({
                ...initInforYacht,
                location: location ? location[0].idLocation : '',
                yachtType: yachtType ? yachtType[0].idYachtType : ''

            })
        }
    }, [show])

    const handleClose = () => {
        setShow(false)
        setPreviewImage('');
        setImage('');
        setData(initInforYacht);

    }

    const [data, setData] = useState(initInforYacht)

    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        }

        )

    }

    const handelUploadImage = (event) => {
        if (event.target.files[0] && event.target && event.target.files) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    }
    const handleCreateYacht = async () => {
        if (!data.name || !image || !data.launch || !data.hullBody || !data.description || !data.rule || !data.itinerary || !data.location || !data.yachtType) {
            toast.error("Please fill in all fields")
        } else {
            let res = await createYacht(idCompany, data.name.trim(), image, data.launch, data.hullBody.trim(), data.description.trim(), data.rule.trim(), data.itinerary.trim(), data.location, data.yachtType);
            if (res && res.data.data === true) {
                toast.success('Create Successfully');
                await props.listYacht();
                handleClose();
            } else {
                toast.error("Create Fail")
            }
        }

    }

    const getAllType = async () => {
        let res = await getYachtType();
        setYachtType(res.data.data)
    }


    return (
        <>
            <Modal size='xl'
                show={show}
                onHide={handleClose}
                backdrop="static"
                className='modal-add-new-yacht'
                autoFocus

            >
                <Modal.Header closeButton>
                    <Modal.Title>Add New Yacht</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} >
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    name='name'
                                    type="text"
                                    placeholder="Yacht Name "
                                    onChange={handleChange}
                                    value={data.name}
                                />
                            </Form.Group>

                            <Form.Group as={Col} >
                                <Form.Label>Hull-Body</Form.Label>
                                <Form.Control
                                    name='hullBody'
                                    type="text"
                                    placeholder="Hull-Body"
                                    onChange={handleChange}
                                    value={data.hullBody}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} >
                                <Form.Label>Launch</Form.Label>
                                <Form.Control
                                    name='launch'
                                    type="date"
                                    placeholder="Launch"
                                    onChange={handleChange}
                                    value={data.launch}
                                />
                            </Form.Group>

                            <Form.Group as={Col} >
                                <Form.Label>Itinerary</Form.Label>
                                <Form.Control
                                    name='itinerary'
                                    type="text"
                                    placeholder="Itinerary"
                                    onChange={handleChange}
                                    value={data.itinerary}
                                />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} >
                                <Form.Label>Rule</Form.Label>
                                <Form.Control
                                    name='rule'
                                    type="text"
                                    placeholder="Rule"
                                    onChange={handleChange}
                                    value={data.rule}
                                />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>Location</Form.Label>
                                <Form.Select onChange={handleChange} name='location'>
                                    {
                                        location && location.map((location) =>
                                            <option key={location.idLocation} value={location.idLocation}>{location.name}</option>
                                        )
                                    }

                                </Form.Select>
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>Yacht Type</Form.Label>
                                <Form.Select onChange={handleChange} name='yachtType'>
                                    {
                                        yachtType && yachtType.map((type) =>
                                            <option key={type.idYachtType} value={type.idYachtType}>{type.starRanking} Sao</option>
                                        )
                                    }


                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                name='description'
                                as="textarea"
                                placeholder="Description"
                                style={{ height: '100px' }}
                                onChange={handleChange}
                                value={data.description}
                            />
                        </Row>
                        <div className='col-mad-12'>
                            <label style={{ width: 'fit-content' }} className='form-label label-upload' htmlFor='labelUpload'> <FcPlus /> Upload File IMAGE</label>
                            <input
                                type='file'
                                accept='image/*'
                                hidden id='labelUpload'
                                name='image'
                                onChange={(event) => handelUploadImage(event)}
                            />
                        </div>
                        <div className='col-md-12 img-preview'>
                            {previewImage ?
                                <img src={previewImage} />
                                :
                                <span>Preview Avartar</span>
                            }
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreateYacht}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalCreateYacht;
