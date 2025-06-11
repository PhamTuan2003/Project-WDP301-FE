// === IMAGE REDUCER ===
const imageInitialState = {
  images: [{ src: "./images/yacht-8.jpg", alt: "Default Yacht Image" }],
  currentIndex: 0,
  isHovering: false,
  loading: false,
  error: null,
};

const imageReducer = (state = imageInitialState, action) => {
  switch (action.type) {
    case "FETCH_IMAGES_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_IMAGES_SUCCESS":
      return {
        ...state,
        loading: false,
        images: action.payload,
        currentIndex: 0,
      };
    case "FETCH_IMAGES_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "SET_CURRENT_IMAGE_INDEX":
      return { ...state, currentIndex: action.payload };
    case "NEXT_SLIDE":
      return {
        ...state,
        currentIndex:
          state.currentIndex === state.images.length - 1
            ? 0
            : state.currentIndex + 1,
      };
    case "PREV_SLIDE":
      return {
        ...state,
        currentIndex:
          state.currentIndex === 0
            ? state.images.length - 1
            : state.currentIndex - 1,
      };
    case "SET_IMAGE_HOVERING":
      return { ...state, isHovering: action.payload };
    default:
      return state;
  }
};

export default imageReducer;
