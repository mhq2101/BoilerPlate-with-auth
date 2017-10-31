const audioContext = new AudioContext();
const audioDest = new MediaStreamAudioDestinationNode(audioContext);
let gain = audioContext.createGain();
let eq1 = audioContext.createBiquadFilter();
let eq2 = audioContext.createBiquadFilter();
let eq3 = audioContext.createBiquadFilter();
let eq4 = audioContext.createBiquadFilter();
let eq5 = audioContext.createBiquadFilter();
let compressor = audioContext.createDynamicsCompressor();
let analyser = audioContext.createAnalyser();

let micGain = audioContext.createGain();
let micEq1 = audioContext.createBiquadFilter();
let micEq2 = audioContext.createBiquadFilter();
let micEq3 = audioContext.createBiquadFilter();
let micEq4 = audioContext.createBiquadFilter();
let micEq5 = audioContext.createBiquadFilter();
let micCompressor = audioContext.createDynamicsCompressor();

micEq1.type = 'lowshelf';
micEq1.frequency.value = 125;
micEq2.type = 'peaking';
micEq2.frequency.value = 60;
micEq2.Q.value = 2.5;
micEq3.type = 'peaking';
micEq3.frequency.value = 500;
micEq3.Q.value = 2.0;
micEq4.type = 'peaking';
micEq4.frequency.value = 2500;
micEq4.Q.value = 1.5;
micEq5.type = 'highshelf';
micEq5.frequency.value = 10000;

eq1.type = 'lowshelf';
eq1.frequency.value = 125;
eq2.type = 'peaking';
eq2.frequency.value = 60;
eq2.Q.value = 2.5;
eq3.type = 'peaking';
eq3.frequency.value = 500;
eq3.Q.value = 2.0;
eq4.type = 'peaking';
eq4.frequency.value = 2500;
eq4.Q.value = 1.5;
eq5.type = 'highshelf';
eq5.frequency.value = 10000;

let master = {
  compressor,
  eq1,
  eq2,
  eq3,
  eq4,
  eq5,
  analyser,
  gain
}

let micMaster = {
  micCompressor,
  micEq1,
  micEq2,
  micEq3,
  micEq4,
  micEq5,
  micGain
}

micCompressor.connect(micEq1);
micEq1.connect(micEq2);
micEq2.connect(micEq3);
micEq3.connect(micEq4);
micEq4.connect(micEq5);
micEq5.connect(micGain);
// micGain.connect(audioContext.destination);
micGain.connect(audioDest)


compressor.connect(eq1);
eq1.connect(eq2);
eq2.connect(eq3);
eq3.connect(eq4);
eq4.connect(eq5);
eq5.connect(analyser);
analyser.connect(gain);
gain.connect(audioContext.destination);

// gain.connect(audioDest);

const initialState = {
  audioContext,
  audioDest,
  master,
  micMaster

}
/* --------------- REDUCER --------------- */

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
