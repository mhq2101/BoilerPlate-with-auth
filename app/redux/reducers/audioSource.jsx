/* --------------- ACTIONS --------------- */
const SET_SOURCE = 'SET_SOURCE'

/* --------------- ACTION CREATORS --------------- */
export const setSource = (source) => {
  return {
    type: SET_SOURCE,
    source
    
  };
};





/* --------------- REDUCER --------------- */

export default function reducer(state = null, action) {
  switch (action.type) {
    case SET_SOURCE:
      return action.source
    default:
      return state;
  }
}
