import axios from "axios";
import * as bookingActions from "../actions/bookingActions";

// Copy các async action booking từ asyncActions.js vào đây
// Ví dụ:
export const fetchRoomsAndSchedules =
  (yachtId, scheduleId) => async (dispatch) => {
    dispatch(bookingActions.fetchRoomsRequest());
    try {
      const [roomsResponse, schedulesResponse] = await Promise.all([
        axios.get("http://localhost:9999/api/v1/rooms", {
          params: { yachtId, scheduleId },
        }),
        axios.get(`http://localhost:9999/api/v1/yachts/${yachtId}/schedules`),
      ]);
      dispatch(
        bookingActions.fetchRoomsSuccess(
          roomsResponse.data.data.rooms,
          schedulesResponse.data.data
        )
      );
    } catch (error) {
      dispatch(bookingActions.fetchRoomsFailure(error.message));
    }
  };
// ... (Các async action booking khác sẽ được thêm tiếp vào file này)
