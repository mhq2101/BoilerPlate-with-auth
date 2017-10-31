/* --------------- ACTIONS --------------- */
const ADD_REMOTE = 'ADD_REMOTE'

/* --------------- ACTION CREATORS --------------- */
export const addRemote = (remote) => {
  return {
    type: ADD_REMOTE,
    remote
    
  };
};
 
/* --------------- REDUCER --------------- */

export default function reducer(state = [], action) {
  switch (action.type) {
    case ADD_REMOTE:
      return state.concat([action.remote])
    default:
      return state;
  }
}
