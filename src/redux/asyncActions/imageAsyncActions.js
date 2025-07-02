import axios from "axios";
import { fetchImagesRequest, fetchImagesSuccess, fetchImagesFailure } from "../actions/imageActions";

export const fetchYachtImages = (yachtId) => async (dispatch) => {
  dispatch(fetchImagesRequest());
  try {
    const response = await axios.get(`http://localhost:9999/api/v1/yachtImages/yacht/${yachtId}`);
    const images = response.data.data || [];
    const processedImages =
      images.length > 0
        ? images.map((url, idx) => ({
            src: url,
            alt: `Yacht image ${idx + 1}`,
          }))
        : [{ src: "./images/yacht-8.jpg", alt: "Default Image" }];
    dispatch(fetchImagesSuccess(processedImages));
  } catch (error) {
    dispatch(fetchImagesFailure(error.message));
    dispatch(fetchImagesSuccess([{ src: "./images/yacht-8.jpg", alt: "Default Image" }]));
  }
};
