const {
	React: react,
	React: { useState, useEffect },
} = Spicetify;

function render() {
	return react.createElement(SoundboardWarkopApp);
}

let audioCtx = null;
function getAudioCtx() {
	if (!audioCtx) {
		const Ctx = window.AudioContext || window.webkitAudioContext;
		audioCtx = new Ctx();
	}
	if (audioCtx.state === "suspended") {
		audioCtx.resume();
	}
	return audioCtx;
}

function playSynthEffect(type) {
	const ctx = getAudioCtx();
	const now = ctx.currentTime;

	if (type === "airhorn") {
		const freqs = [390, 466.16, 587.33];
		for (const f of freqs) {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();
			osc.type = "sawtooth";
			osc.frequency.setValueAtTime(f * 0.92, now);
			osc.frequency.linearRampToValueAtTime(f, now + 0.06);
			gain.gain.setValueAtTime(0.18, now);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
			osc.connect(gain).connect(ctx.destination);
			osc.start(now);
			osc.stop(now + 0.56);
		}
	} else if (type === "vineboom") {
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(135, now);
		osc.frequency.exponentialRampToValueAtTime(28, now + 0.65);
		gain.gain.setValueAtTime(0.75, now);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
		osc.connect(gain).connect(ctx.destination);
		osc.start(now);
		osc.stop(now + 0.72);
	} else if (type === "badumtss") {
		const playHit = (freq, start, dur) => {
			const osc = ctx.createOscillator();
			const g = ctx.createGain();
			osc.type = "triangle";
			osc.frequency.setValueAtTime(freq, start);
			osc.frequency.exponentialRampToValueAtTime(45, start + dur);
			g.gain.setValueAtTime(0.5, start);
			g.gain.exponentialRampToValueAtTime(0.001, start + dur);
			osc.connect(g).connect(ctx.destination);
			osc.start(start);
			osc.stop(start + dur);
		};
		playHit(130, now, 0.14);
		playHit(95, now + 0.16, 0.16);
		// Cymbal noise
		const bufferSize = ctx.sampleRate * 0.35;
		const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
		const noise = ctx.createBufferSource();
		noise.buffer = buffer;
		const g = ctx.createGain();
		g.gain.setValueAtTime(0.25, now + 0.34);
		g.gain.exponentialRampToValueAtTime(0.001, now + 0.68);
		noise.connect(g).connect(ctx.destination);
		noise.start(now + 0.34);
	} else if (type === "sadtrombone") {
		const notes = [293.66, 277.18, 261.63, 246.94];
		notes.forEach((freq, idx) => {
			const osc = ctx.createOscillator();
			const g = ctx.createGain();
			osc.type = "sawtooth";
			const st = now + idx * 0.22;
			const dur = idx === 3 ? 0.5 : 0.2;
			osc.frequency.setValueAtTime(freq, st);
			if (idx === 3) osc.frequency.linearRampToValueAtTime(freq - 25, st + dur);
			g.gain.setValueAtTime(0.2, st);
			g.gain.exponentialRampToValueAtTime(0.001, st + dur);
			osc.connect(g).connect(ctx.destination);
			osc.start(st);
			osc.stop(st + dur);
		});
	} else if (type === "siren") {
		const osc = ctx.createOscillator();
		const g = ctx.createGain();
		osc.type = "square";
		osc.frequency.setValueAtTime(480, now);
		osc.frequency.linearRampToValueAtTime(880, now + 0.25);
		osc.frequency.linearRampToValueAtTime(480, now + 0.5);
		osc.frequency.linearRampToValueAtTime(880, now + 0.75);
		g.gain.setValueAtTime(0.18, now);
		g.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
		osc.connect(g).connect(ctx.destination);
		osc.start(now);
		osc.stop(now + 0.82);
	} else if (type === "toktok") {
		[620, 780, 620].forEach((freq, i) => {
			const osc = ctx.createOscillator();
			const g = ctx.createGain();
			osc.type = "sine";
			const st = now + i * 0.09;
			osc.frequency.setValueAtTime(freq, st);
			g.gain.setValueAtTime(0.35, st);
			g.gain.exponentialRampToValueAtTime(0.001, st + 0.07);
			osc.connect(g).connect(ctx.destination);
			osc.start(st);
			osc.stop(st + 0.08);
		});
	} else if (type === "levelup") {
		[523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
			const osc = ctx.createOscillator();
			const g = ctx.createGain();
			osc.type = "triangle";
			const st = now + i * 0.08;
			osc.frequency.setValueAtTime(freq, st);
			g.gain.setValueAtTime(0.3, st);
			g.gain.exponentialRampToValueAtTime(0.001, st + 0.14);
			osc.connect(g).connect(ctx.destination);
			osc.start(st);
			osc.stop(st + 0.15);
		});
	} else if (type === "sensor") {
		const osc = ctx.createOscillator();
		const g = ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(1000, now);
		g.gain.setValueAtTime(0.35, now);
		g.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
		osc.connect(g).connect(ctx.destination);
		osc.start(now);
		osc.stop(now + 0.46);
	}
}

const PADS = [
	{ id: "airhorn", emoji: "📯", title: "Trompet DJ Kota", sub: "Telolet Bikin Kaget" },
	{ id: "vineboom", emoji: "🗿", title: "Vine Boom Bass", sub: "Efek Curiga Maksimal" },
	{ id: "badumtss", emoji: "🥁", title: "Ba Dum Tss!", sub: "Buat Joke Bapak-Bapak" },
	{ id: "sadtrombone", emoji: "🎺", title: "Womp Womp Gagal", sub: "Pas Ditolak Gebetan" },
	{ id: "siren", emoji: "🚨", title: "Sirine Razia Bucin", sub: "Wiu Wiu Tangkap Badut" },
	{ id: "toktok", emoji: "🍜", title: "Ketokan Tukang Bakso", sub: "Auto Bikin Laper Tengah Malam" },
	{ id: "levelup", emoji: "🪙", title: "Koin Hoki Masuk", sub: "Suara Gajian Cair" },
	{ id: "sensor", emoji: "🤬", title: "BEEP Sensor TV", sub: "Sensor Omongan Kasar" },
];

function SoundboardWarkopApp() {
	const [jedagJedug, setJedagJedug] = useState(() => document.body.classList.contains("spicetify-jedag-jedug"));
	const [hitCount, setHitCount] = useState(0);

	useEffect(() => {
		if (jedagJedug) {
			document.body.classList.add("spicetify-jedag-jedug");
		} else {
			document.body.classList.remove("spicetify-jedag-jedug");
		}
	}, [jedagJedug]);

	const triggerPad = (pad) => {
		playSynthEffect(pad.id);
		setHitCount((c) => c + 1);
	};

	return react.createElement(
		"div",
		{ className: "warkop-container" },
		react.createElement(
			"div",
			{ className: "warkop-header" },
			react.createElement(
				"div",
				null,
				react.createElement(
					"h1",
					{ style: { fontSize: "28px", fontWeight: 800, margin: "0 0 6px" } },
					"📯 Soundboard Warkop & Meja DJ Tongkrongan"
				),
				react.createElement(
					"p",
					{ style: { margin: 0, fontSize: "14px", opacity: 0.8 } },
					`Pencet tombol buat ngerusuhin lagu yang lagi jalan! Total keributan: ${hitCount}x`
				)
			),
			react.createElement(
				"button",
				{
					className: `warkop-party-btn ${jedagJedug ? "active" : ""}`,
					onClick: () => {
						setJedagJedug((v) => !v);
						playSynthEffect("airhorn");
					},
				},
				jedagJedug ? "🛑 Matikan Mode Jedag-Jedug" : "🪩 Aktifkan Mode Layar Jedag-Jedug!"
			)
		),
		react.createElement(
			"div",
			{ className: "warkop-pad-grid" },
			PADS.map((pad) =>
				react.createElement(
					"button",
					{
						key: pad.id,
						className: "warkop-pad",
						onClick: () => triggerPad(pad),
					},
					react.createElement("div", { className: "warkop-pad-emoji" }, pad.emoji),
					react.createElement("div", { className: "warkop-pad-title" }, pad.title),
					react.createElement("div", { className: "warkop-pad-sub" }, pad.sub)
				)
			)
		)
	);
}
