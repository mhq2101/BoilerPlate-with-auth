/* --------------- ACTIONS --------------- */
const SET_DROP = 'SET_DROP'

/* --------------- ACTION CREATORS --------------- */
export const setDrop = (drop) => {
  return {
    type: SET_DROP,
    drop
    
  };
};





/* --------------- REDUCER --------------- */

export default function reducer(state = true, action) {
  switch (action.type) {
    case SET_DROP:
      return action.drop
    default:
      return state;
  }
}
