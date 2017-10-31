/* --------------- ACTIONS --------------- */
const SET_TIME = 'SET_TIME'

/* --------------- ACTION CREATORS --------------- */
export const setTime = (time) => {
  return {
    type: SET_TIME,
    time
    
  };
};

/* --------------- REDUCER --------------- */

export default function reducer(state = 0, action) {
  switch (action.type) {
    case SET_TIME:
      return action.time
    default:
      return state;
  }
}
