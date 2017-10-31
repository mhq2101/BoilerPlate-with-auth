// ACTIONS
const SET_MUSIC_STATUS = 'SET_MUSIC_STATUS';

// ACTION CREATOR
const setMusicStatus = status => ({ type: SET_MUSIC_STATUS, status });

export const setMusicPlaying = status => dispatch => {
	dispatch(setMusicStatus(status));
};

export default function (state = false, action) {
	switch (action.type) {
		case SET_MUSIC_STATUS:
			return action.status;
		default:
			return state;
	}
}
