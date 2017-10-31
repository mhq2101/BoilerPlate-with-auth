// ACTIONS
const SET_CONNECTION_STATUS = 'SET_CONNECTION_STATUS';

// ACTION CREATOR
const setConnectionStatus = status => ({ type: SET_CONNECTION_STATUS, status });

export const setMicConnection = status => dispatch => {
	dispatch(setConnectionStatus(status));
};

export default function (state = false, action) {
	switch (action.type) {
		case SET_CONNECTION_STATUS:
			return action.status;
		default:
			return state;
	}
}
