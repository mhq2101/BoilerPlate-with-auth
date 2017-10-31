/* --------------- ACTIONS --------------- */
const SET_CURRENT = 'SET_CURRENT'

/* --------------- ACTION CREATORS --------------- */
export const setCurrent = (current) => {
  return {
    type: SET_CURRENT,
    current
    
  };
};




/* --------------- REDUCER --------------- */

export default function reducer(state = 0, action) {
  switch (action.type) {
    case SET_CURRENT:
      return action.current
    default:
      return state;
  }
}
