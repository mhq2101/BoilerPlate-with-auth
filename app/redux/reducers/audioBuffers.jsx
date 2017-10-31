/* --------------- ACTIONS --------------- */
const ADD_BUFFER = 'ADD_BUFFER'

/* --------------- ACTION CREATORS --------------- */
export const addBuffer = (buffer) => {
  return {
    type: ADD_BUFFER,
    buffer
    
  };
};





/* --------------- REDUCER --------------- */

export default function reducer(state = [], action) {
  switch (action.type) {
    case ADD_BUFFER:
      return state.concat([action.buffer])
    default:
      return state;
  }
}
