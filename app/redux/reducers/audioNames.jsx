/* --------------- ACTIONS --------------- */
const ADD_NAME = 'ADD_NAME'

/* --------------- ACTION CREATORS --------------- */
export const addName = (name) => {
  return {
    type: ADD_NAME,
    name
    
  };
};





/* --------------- REDUCER --------------- */

export default function reducer(state = [], action) {
  switch (action.type) {
    case ADD_NAME:
      return state.concat([action.name])
    default:
      return state;
  }
}
