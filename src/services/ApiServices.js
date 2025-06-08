import axios from '../utils/axiosClient';

export const deleteYacht = (idYacht) => {
    return axios.delete(`/api/companies/yacht/delete/${idYacht}`)
}

export const getAllLocation = () => {
    return axios.get('/api/companies/getAllLocation');
}

export const getYachtByIdCompany = (idCompany) => {
    return axios.get(`/api/customer/yacht/findByCompany/${idCompany}`)
}

export const getYachtType = () => {
    return axios.get('/api/companies/getYachtType')
}

export const getFeedbackCompany = (idCompany) => {
    return axios.get(`/api/companies/feedBackByIdCompany/${idCompany}`)
}

export const confirmBooking = (idCompany, idBookingOrder) => {
    return axios.put(`/api/companies/${idCompany}/confirm/${idBookingOrder}`)
}

export const getBookingByAmount = (idCompany, min, max) => {
    return axios.get(`/api/companies/bookingOrders/range/${idCompany}`, {
        params: {
            min: min,
            max: max
        }
    })
}

export const getBookingOrder = (idCompany) => {
    return axios.get(`/api/companies/bookingOrders/${idCompany}`);
}

export const getProfileCompany = (idCompany) => {
    return axios.get(`/api/companies/profiles/${idCompany}`);
}

export const deleteYachtImage = (idImage) => {
    return axios.delete(`/api/companies/yacht/deleteImage/${idImage}`);
}

export const getYachtImage = (idYacht) => {
    return axios.get(`/api/companies/yacht/image/${idYacht}`);
}

export const createServiceYacht = (idYacht, service, price) => {
    const data = new FormData();
    data.append('service', service);
    data.append('price', price);
    return axios.post(`/api/companies/addServiceForYacht/${idYacht}`, data)
}

export const deleteServiceYacht = (idYacht, idService) => {
    return axios.delete(`/api/companies/deleteYachtService/${idYacht}/${idService}`);
}

export const getServiceByYacht = (yachtId) => {
    return axios.get(`api/customer/getServiceByYacht/${yachtId}`)
}

export const createScheduleYacht = (yachtId, startDate, endDate) => {
    const data = new FormData();
    data.append('startDate', startDate);
    data.append('endDate', endDate);
    return axios.post(`/api/companies/addSchedule/${yachtId}`, data)
}

export const deleteScheduleYacht = (yachtId, scheduleId) => {
    return axios.delete(`/api/companies/deleteSchedule/${yachtId}/${scheduleId}`)
}

export const getScheduleYacht = (yachtId) => {
    return axios.get(`/api/companies/getScheduleByYacht/${yachtId}`);
}

export const getAllRoomByYacht = (idYacht) => {
    return axios.get(`/api/companies/getRoomByYacht/${idYacht}`);
}

export const getAllRoomTypeCompany = (yachtId) => {
    return axios.get(`/api/companies/roomType/getAllRoomType/${yachtId}`);
}

export const updateYacht = (idYacht, name, image, hullBody, description, rule, itinerary, idYachtType, idLocation) => {
    const data = new FormData();
    data.append('name', name);
    data.append('image', image);
    data.append('hullBody', hullBody);
    data.append('description', description);
    data.append('rule', rule);
    data.append('itinerary', itinerary);
    data.append('idYachtType', idYachtType);
    data.append('idLocation', idLocation);
    return axios.put(`/api/companies/yacht/updateYacht/${idYacht}`, data)
}

export const exportBookingOrder = (idCompany, year, month) => {
    return axios.get(`/api/companies/exportBooking/excel/${idCompany}`, {
        params: {
            month: '7',
            year: '2024'
        },
        responseType: 'blob'// Để xử lý dữ liệu dưới dạng binary
    });

} 

export const getAllBooking = (idCompany, month, year) => {
    return axios.get(`/api/companies/allBooking/${idCompany}`, {
        params: {
            month: month,
            year: year
        }
    })
}

export const getBookingByYear = (idCompany, year) => {
    return axios.get(`/api/companies/bookingByYear/${idCompany}`, {
        params: {
            year: year
        }
    })
}

export const getStatisticBooking = (idCompany, month, year) => {

    return axios.get(`/api/companies/statistic/booking/${idCompany}`, {
        params: {
            month: month,
            year: year
        }
    })
}

export const getStatisticService = (idCompany, month, year) => {
    return axios.get(`/api/companies/statistic/service/${idCompany}`, {
        params: {
            month: month,
            year: year
        }
    })
}

export const upadteServiceYacht = (idYacht, idService, service, price) => {
    const data = new FormData();
    data.append('service', service);
    data.append('price', price);
    return axios.put(`/api/companies/updateYachtService/${idYacht}/${idService}`, data)
}

export const updateScheduleYacht = (yachtId, scheduleId, startDate, endDate) => {
    const data = new FormData();
    data.append('startDate', startDate);
    data.append('endDate', endDate);
    return axios.put(`/api/companies/updateSchedule/${yachtId}/${scheduleId}`, data)
}

export const updateRoomType = (roomTypeId, price, type, utilities) => {
    const data = new FormData();
    data.append('price', price);
    data.append('type', type);
    data.append('utilities', utilities);
    return axios.put(`/api/companies/roomType/updateRoomType/${roomTypeId}`, data);
}

export const updateRoom = (roomId, description, roomName, avatar) => {
    const data = new FormData();
    data.append('description', description);
    data.append('roomName', roomName);
    data.append('avatar', avatar);

    return axios.put(`/api/companies/room/updateRoom/${roomId}`, data)
}

export const updateProfileCompany = (idCompany, name, address, logo) => {
    const data = new FormData();
    data.append('name', name)
    data.append('address', address)
    data.append('logo', logo)
    return axios.put(`/api/companies/profile/${idCompany}`, data)
}

export const updateYachtImage = (idImage, image) => {
    const data = new FormData();
    data.append('image', image)
    return axios.put(`/api/companies/yacht/updateImage/${idImage}`, data);
}

export const updateImageRoom = (idImage, image) => {
    const data = new FormData();
    data.append('image', image);
    return axios.put(`/api/companies/roomImage/updateImage/${idImage}`, data)
}

export const createRoomType = (price, type, utilities, yachtId) => {
    const data = new FormData();
    data.append('price', price);
    data.append('type', type);
    data.append('utilities', utilities);
    return axios.post(`/api/companies/roomType/addRoomType/${yachtId}`, data);
}

export const deleteRoomType = (roomTypeId) => {
    return axios.delete(`/api/companies/roomType/deleteRoomType/${roomTypeId}`);
}

export const canelBooking = (idCompany, idBookingOrder, reason) => {
    const data = new FormData();
    data.append('reason', reason);
    return axios.put(`/api/companies/${idCompany}/cancel/${idBookingOrder}`, data)
}

export const createImageRoom = (idRoom, image) => {
    const data = new FormData();
    data.append('image', image);
    return axios.post(`/api/companies/roomImage/insertImage/${idRoom}`, data);
}

export const deleteImageRoom = (idImage) => {
    return axios.delete(`/api/companies/roomImage/deleteImage/${idImage}`);
}

export const getImageByRoom = (roomId) => {
    return axios.get(`/api/companies/roomImage/getAllImageByIdRoom/${roomId}`)
}

export const createYacht = (idCompany, name, image, launch, hullBody, description, rule, itinerary, idYachtType, idLocation) => {
    const data = new FormData()
    data.append('name', name);
    data.append('image', image);
    data.append('launch', launch);
    data.append('hullBody', hullBody);
    data.append('description', description);
    data.append('rule', rule);
    data.append('itinerary', itinerary);
    data.append('idYachtType', idYachtType);
    data.append('idLocation', idLocation);
    return axios.post(`/api/companies/yacht/insertYacht/${idCompany}`, data);
}

export const createRoom = (roomName, area, description, roomType, avatar, idYacht) => {
    const data = new FormData();
    data.append('roomName', roomName)
    data.append('area', area)
    data.append('description', description)
    data.append('idRoomType', roomType)
    data.append('avatar', avatar)
    return axios.post(`/api/companies/room/addRoom/${idYacht}`, data);
}

export const createYachtImage = (idYacht, image) => {
    const data = new FormData();
    data.append('image', image);
    return axios.post(`/api/companies/yacht/addImage/${idYacht}`, data);
}

export const changePasswordCompany = (idCompany, oldPassword, newPassword, confirmPassword) => {
    const data = new FormData()
    data.append('oldPassword', oldPassword)
    data.append('newPassword', newPassword)
    data.append('confirmPassword', confirmPassword)
    return axios.put(`/api/companies/profiles/changePassword/${idCompany}`, data)
}