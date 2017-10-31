/* --------------- ACTIONS --------------- */
const SET_STREAM_SOURCE = 'SET_STREAM_SOURCE'

/* --------------- ACTION CREATORS --------------- */
export const setStreamSource = (streamSource) => {
  return {
    type: SET_STREAM_SOURCE,
    streamSource
    
  };
};





/* --------------- REDUCER --------------- */

export default function reducer(state = null, action) {
  switch (action.type) {
    case SET_STREAM_SOURCE:
      return action.streamSource
    default:
      return state;
  }
}
