import { useEffect, useState } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import ModalUpdateProfile from './Modal/ModalUpdateProfile';
// import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfileCompany } from '../../services/ApiServices';
import ModalChangePassCompany from './Modal/ModalChangePassCompany';

const ProfileCompany = () => {

    // const idCompany = useSelector(state => state.account.account.idCompany);
    const idCompany = "682ab2c581f0fd7069e74058";

    const [isShowModal, setIsShowModal] = useState(false);
    const [profile, setProfile] = useState({});
    const [showModalChangePass, setShowModalChangePass] = useState(false)

    const handleClose = () => {
        setIsShowModal(false);
        setShowModalChangePass(false)
    }

    useEffect(() => {
        getProfile();
    }, [])

    const getProfile = async () => {
        let res = await getProfileCompany(idCompany);
        if (res && res.data) {
            setProfile(res.data);
        }
    }

    return (

        <div>
            <section >
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-lg-6 mb-4 mb-lg-0">
                            <div className="card mb-3" style={{ borderRadius: '.5rem' }}>
                                <div className="row g-0">
                                    <div className="col-md-4 gradient-custom text-center" style={{ borderTopLeftRadius: '.3rem', borderBottomLeftRadius: '.3rem' }}>
                                        <img src={profile.logo} alt='logo' className="img-fluid my-5" style={{ width: 80 }} />

                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body p-4">
                                            <h6>Information</h6>
                                            <hr className="mt-0 mb-4" />
                                            <div className="row pt-1">
                                                <div className="col-6 mb-3">
                                                    <h6>Email</h6>
                                                    <p className="text-muted">{profile.email}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Address</h6>
                                                    <p className="text-muted">{profile.address}</p>
                                                </div>

                                            </div>
                                            <h6>Name</h6>
                                            <hr className="mt-0 mb-4" />
                                            <div className="row pt-1">
                                                <div className="col-9 mb-2">
                                                    {profile.name}
                                                </div>
                                                <div className="col-3 mb-3">

                                                </div>
                                            </div>
                                            <ButtonGroup>
                                                <Button onClick={() => setIsShowModal(true)} className='btn btn-primary'>Edit</Button>
                                            </ButtonGroup>
                                            <Link onClick={() => setShowModalChangePass(true)} className='mx-3'>Change Password</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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