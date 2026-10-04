// "Telephone hold music" generated in the browser: no audio files, no copyright.
// A tinny tarantella loop (Web Audio API) interrupted by a synthetic waiter voice (Web Speech API).

// [note, length in eighth notes]. An original tune: replace freely (e.g. with a public-domain score).
const MELODY: [string, number][] = [
  ["E5", 1],
  ["A4", 1],
  ["A4", 1],
  ["C5", 1],
  ["B4", 1],
  ["A4", 1],
  ["E5", 1],
  ["A4", 1],
  ["A4", 1],
  ["C5", 1],
  ["B4", 1],
  ["A4", 1],
  ["F5", 1],
  ["E5", 1],
  ["D5", 1],
  ["C5", 1],
  ["B4", 1],
  ["A4", 1],
  ["G#4", 1],
  ["B4", 1],
  ["E5", 1],
  ["E5", 3],
  ["D5", 1],
  ["G4", 1],
  ["G4", 1],
  ["B4", 1],
  ["A4", 1],
  ["G4", 1],
  ["C5", 1],
  ["E5", 1],
  ["G5", 1],
  ["E5", 1],
  ["C5", 1],
  ["E5", 1],
  ["D5", 1],
  ["C5", 1],
  ["B4", 1],
  ["A4", 1],
  ["G#4", 1],
  ["B4", 1],
  ["A4", 3],
  ["REST", 3],
];

const EIGHTH = 0.16; // seconds per eighth note (fast, like a tarantella)
const VOLUME = 0.05;
const DUCKED_VOLUME = 0.012; // music volume while the waiter is talking

const PHRASES = [
  "Your call is important to us. The chef is currently tasting the sauce.",
  "Please stay on the line. Your recipe is being lost as we speak.",
  "All our chefs are busy pretending to cook. Please hold.",
  "Thank you for your patience. Your position in the queue is: forty-two.",
  "This call may be recorded and laughed at for training purposes.",
  "The chef will be with you shortly. Shortly is a relative concept.",
];

const NOTE_INDEX: Record<string, number> = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

// "A4" -> 440 Hz, "G#4" -> 415.3 Hz (equal temperament)
function noteToFrequency(note: string): number {
  const match = /^([A-G]#?)(\d)$/.exec(note);
  if (!match) throw new Error(`Invalid note: ${note}`);
  const midi = (Number(match[2]) + 1) * 12 + NOTE_INDEX[match[1]];
  return 440 * Math.pow(2, (midi - 69) / 12);
}

let phraseIndex = Math.floor(Math.random() * PHRASES.length);
function nextPhrase(): string {
  phraseIndex = (phraseIndex + 1) % PHRASES.length;
  return PHRASES[phraseIndex];
}

// One AudioContext for the whole page: mobile browsers only let it start inside a user gesture,
// so it is created/resumed by unlockAudio() on the tap, then reused by every wait.
let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedCtx || sharedCtx.state === "closed") {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    sharedCtx = new Ctor();
  }
  return sharedCtx;
}

// Call this synchronously inside a click/tap handler (before any await or setTimeout).
export function unlockAudio(): void {
  try {
    const ctx = getAudioContext();
    void ctx.resume();
    // A one-sample silent buffer: the classic trick to wake up audio on iOS
    const source = ctx.createBufferSource();
    source.buffer = ctx.createBuffer(1, 1, 22050);
    source.connect(ctx.destination);
    source.start(0);
    // Speech synthesis also needs its first utterance inside the gesture
    const synth = window.speechSynthesis;
    if (synth) {
      const silent = new SpeechSynthesisUtterance(" ");
      silent.volume = 0;
      synth.speak(silent);
    }
  } catch {
    // Audio is a bonus: never break the app because of it
  }
}

export interface HoldMusic {
  stop: () => void;
  setMuted: (muted: boolean) => void;
}

export function startHoldMusic(initiallyMuted = false): HoldMusic {
  const ctx = getAudioContext();
  void ctx.resume();

  // Signal chain: oscillators -> telephone band-pass (highpass + lowpass) -> master volume
  const master = ctx.createGain();
  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 400;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 2200;
  highpass.connect(lowpass).connect(master).connect(ctx.destination);

  let muted = initiallyMuted;
  let ducked = false;
  let stopped = false;
  const timers: ReturnType<typeof setTimeout>[] = [];

  const applyVolume = () => {
    const target = muted ? 0 : ducked ? DUCKED_VOLUME : VOLUME;
    master.gain.setTargetAtTime(target, ctx.currentTime, 0.08);
  };
  master.gain.value = muted ? 0 : VOLUME;

  // Schedule one full pass of the melody, then queue the next one just before it ends
  const scheduleLoop = (startAt: number) => {
    let t = startAt;
    for (const [note, length] of MELODY) {
      const duration = length * EIGHTH;
      if (note !== "REST") {
        const osc = ctx.createOscillator();
        const envelope = ctx.createGain();
        osc.type = "square"; // buzzy, cheap-keyboard sound
        osc.frequency.value = noteToFrequency(note);
        envelope.gain.setValueAtTime(0, t);
        envelope.gain.linearRampToValueAtTime(1, t + 0.01);
        envelope.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.9);
        osc.connect(envelope).connect(highpass);
        osc.start(t);
        osc.stop(t + duration);
      }
      t += duration;
    }
    const msUntilNext = (t - ctx.currentTime - 0.2) * 1000;
    timers.push(setTimeout(() => !stopped && scheduleLoop(t), msUntilNext));
  };
  scheduleLoop(ctx.currentTime + 0.05);

  // The waiter interrupts every few seconds; the music ducks while he talks
  const synth =
    typeof window !== "undefined" ? window.speechSynthesis : undefined;
  const speak = () => {
    if (stopped || !synth || muted) return;
    const utterance = new SpeechSynthesisUtterance(nextPhrase());
    const voice = synth.getVoices().find((v) => v.lang.startsWith("en"));
    if (voice) utterance.voice = voice;
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    utterance.pitch = 0.8;
    utterance.onstart = () => {
      ducked = true;
      applyVolume();
    };
    utterance.onend = utterance.onerror = () => {
      ducked = false;
      applyVolume();
    };
    synth.speak(utterance);
  };
  timers.push(setTimeout(speak, 1500));
  timers.push(setTimeout(speak, 6500));

  return {
    stop: () => {
      if (stopped) return;
      stopped = true;
      timers.forEach(clearTimeout);
      synth?.cancel();
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.05); // short fade-out, no click
      setTimeout(() => master.disconnect(), 300); // keep the shared context for the next wait
    },
    setMuted: (value: boolean) => {
      muted = value;
      if (muted) synth?.cancel();
      applyVolume();
    },
  };
}
