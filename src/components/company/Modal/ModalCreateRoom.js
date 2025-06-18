import React, { useEffect, useState } from "react";
import { Modal, Col, Form, Row, Button } from "react-bootstrap";
import { FcPlus } from "react-icons/fc";
import { createRoom } from "../../../services/ApiServices";
import { toast } from "react-toastify";
import _ from "lodash";
import { set } from "nprogress";

const ModalCreateRoom = (props) => {
  const { show, setIsShowModalCreateRoom, idYacht, listRoomType, fetchRoomType, getAllRoom } = props;
  const [image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [area, setArea] = useState(0);
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState("");

  useEffect(() => {
    fetchRoomType();
    if (show) {
      if (_.isEmpty(listRoomType)) {
        toast.warning("Please create room type before creating room");
      } else {
        setRoomType(listRoomType[0]?.idRoomType);
      }
    }
  }, [show]);

  console.log("d", listRoomType);
  console.log("d2", roomType);

  const handleClose = () => {
    setIsShowModalCreateRoom(false);
    resetForm();
  };

  const resetForm = () => {
    setRoomName("");
    setArea("");
    setDescription("");
    setRoomType(listRoomType[0]?.idRoomType);
    setPreviewImage("");
    setImage("");
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file);
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName || !area || !description || !roomType || !image) {
      toast.error("Please fill in all fields");
    } else if (area < 0) {
      toast.error("Area cannot be a negative number");
    } else {
      const res = await createRoom(roomName.trim(), area, description.trim(), roomType, image, idYacht);
      if (res?.data?.data) {
        toast.success("Create Successfully");
        handleClose();
        await getAllRoom();
      } else {
        toast.error("Create Fail");
      }
    }
  };

  return (
    <Modal size="xl" show={show} onHide={handleClose} backdrop="static" className="modal-add-new-yacht" autoFocus>
      <Modal.Header closeButton>
        <Modal.Title>Add New Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Room Name</Form.Label>
              <Form.Control type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Area</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter area in m²"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Room Type</Form.Label>
              <Form.Select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                {listRoomType.map((type) => (
                  <option key={type.idRoomType} value={type.idRoomType}>
                    {type.type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              style={{ height: "100px" }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Row>

          <div className="col-md-12">
            <label style={{ width: "fit-content" }} className="form-label label-upload" htmlFor="labelUpload">
              <FcPlus /> Upload File IMAGE
            </label>
            <input type="file" accept="image/*" hidden id="labelUpload" onChange={handleUploadImage} />
          </div>

          <div className="col-md-12 img-preview">
            {previewImage ? <img src={previewImage} alt="Preview" /> : <span>Preview Avatar</span>}
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateRoom}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCreateRoom;
