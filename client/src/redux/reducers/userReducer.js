// src/redux/reducers/userReducer.js
const initialState = {
    currentUser: null,
  };
  
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_USER":
        return {
          ...state,
          currentUser: {
            ...action.payload,
            isAdmin: action.payload.email === "fahadchaudhary2040@gmail.com", // Set isAdmin based on email
          },
        };
      default:
        return state;
    }
  };
  
  export default userReducer;
  