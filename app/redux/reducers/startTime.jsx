/* --------------- ACTIONS --------------- */
const SET_START = 'SET_START'

/* --------------- ACTION CREATORS --------------- */
export const setStart = (start) => {
  return {
    type: SET_START,
    start
    
  };
};

/* --------------- REDUCER --------------- */

export default function reducer(state = 0, action) {
  switch (action.type) {
    case SET_START:
      return action.start
    default:
      return state;
  }
}
