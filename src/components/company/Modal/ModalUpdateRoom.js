import React, { useEffect } from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { FcPlus } from "react-icons/fc";
import _ from 'lodash';
import { updateRoom } from '../../../services/ApiServices';
import { toast } from 'react-toastify';



const ModalUpdateRoom = (props) => {
    const { show, setIsShowModalUpdateRoom, dataUpdateRoom } = props;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('')


    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    useEffect(() => {
        if (!_.isEmpty(dataUpdateRoom)) {
            setName(dataUpdateRoom.name);
            setDescription(dataUpdateRoom.description);
            setPreviewImage(dataUpdateRoom.avatar)
        }
    }, [dataUpdateRoom])


    const handelUploadImageRoom = (event) => {
        if (event.target.files[0] && event.target && event.target.files) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    }

    const handleClose = () => {
        setIsShowModalUpdateRoom(false);
    }

    const handleUpdateRoom = async () => {
        if (!name || !description) {
            toast.error("Please fill in all fields")
        } else {
            let res = await updateRoom(dataUpdateRoom.idRoom, description.trim(), name.trim(), image)
            if (res && res.data.data === true) {
                toast.success("Update Successfully")
                handleClose();
                await props.getAllRoom();
            } else {
                toast.error('Update Fail')
            }
        }
    }


    return (
        <div>
            <Modal size='xl' show={show} onHide={handleClose} autoFocus>
                <Modal.Header closeButton>
                    <Modal.Title>Update Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder='Name room'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>
                        </Row>

                        <FloatingLabel controlId="floatingTextarea2" label="Description">
                            <Form.Control
                                as="textarea"
                                style={{ height: '100px' }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}

                            />
                        </FloatingLabel>
                        <div className='col-mad-12 my-3'>
                            <label style={{ width: 'fit-content' }} className='form-label label-upload' htmlFor='labelUpload'> <FcPlus /> Upload File IMAGE</label>
                            <input
                                type='file'
                                accept='image/*'
                                hidden id='labelUpload'
                                name='image'
                                onChange={(event) => handelUploadImageRoom(event)}
                            />
                        </div>
                        <div className='col-md-12 img-preview'>
                            {previewImage ?
                                <img src={previewImage} />
                                :
                                <span>Preview Avatar</span>
                            }
                        </div>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateRoom}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ModalUpdateRoom;