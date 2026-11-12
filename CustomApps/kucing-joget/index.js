const {
	React: react,
	React: { useState, useEffect },
} = Spicetify;

function render() {
	return react.createElement(KucingJogetApp);
}

const CELOTEHAN_KUCING = [
	"Meong! Lagu '{title}' enak juga buat goyang kepala sambil nyari ikan asin 🐟",
	"Hadeh majikan muter '{title}' lagi, pasti lagi kangen seseorang yang nggak kangen balik ya? 😼",
	"Kasih Whiskas dulu dong bos, baru aku semangat joget ngikutin lagu {artist}!",
	"Kalau lagu '{title}' ini diputer sekali lagi, aku cakar sofa ruang tamu nih! 🐾",
	"Asik juga beat-nya {artist}, berasa jadi kucing klub malam di Kemang! 🕶️🐱",
];

function getNowPlaying() {
	const item = Spicetify.Player?.data?.item || Spicetify.Player?.data?.track || {};
	const meta = item.metadata || {};
	return {
		title: item.name || meta.title || "Sepi Tanpa Musik",
		artist: item.artists?.[0]?.name || meta.artist_name || "Majikan Pelit",
		isPlaying: !Spicetify.Player?.data?.isPaused,
	};
}

function KucingJogetApp() {
	const [song, setSong] = useState(getNowPlaying);
	const [kenyang, setKenyang] = useState(() => Number(localStorage.getItem("kucing:kenyang") || 75));
	const [level, setLevel] = useState(() => Number(localStorage.getItem("kucing:level") || 1));
	const [turbo, setTurbo] = useState(false);
	const [quoteIdx, setQuoteIdx] = useState(0);

	useEffect(() => {
		const update = () => {
			setSong(getNowPlaying());
			setQuoteIdx((i) => (i + 1) % CELOTEHAN_KUCING.length);
		};
		Spicetify.Player?.addEventListener?.("songchange", update);
		Spicetify.Player?.addEventListener?.("onplaypause", update);
		return () => {
			Spicetify.Player?.removeEventListener?.("songchange", update);
			Spicetify.Player?.removeEventListener?.("onplaypause", update);
		};
	}, []);

	const kasihWhiskas = () => {
		const nextKenyang = Math.min(100, kenyang + 15);
		const nextLevel = nextKenyang === 100 ? level + 1 : level;
		setKenyang(nextKenyang);
		setLevel(nextLevel);
		localStorage.setItem("kucing:kenyang", String(nextKenyang));
		localStorage.setItem("kucing:level", String(nextLevel));
		Spicetify.showNotification("🐟 Nyam nyam! Meng Oren makin semangat joget!");
	};

	const elusKucing = () => {
		setQuoteIdx((i) => (i + 1) % CELOTEHAN_KUCING.length);
		Spicetify.showNotification("🐾 Purrrr... Meng Oren senang dielus!");
	};

	const rawQuote = CELOTEHAN_KUCING[quoteIdx % CELOTEHAN_KUCING.length]
		.replaceAll("{title}", song.title)
		.replaceAll("{artist}", song.artist);

	return react.createElement(
		"div",
		{ className: "kucing-container" },
		react.createElement(
			"div",
			{ className: "kucing-stage" },
			react.createElement("div", { className: "kucing-speech" }, `"${rawQuote}"`),
			react.createElement("br"),
			react.createElement(
				"div",
				{
					className: `kucing-avatar ${turbo ? "turbo" : song.isPlaying ? "dancing" : ""}`,
				},
				turbo ? "🕶️🐱🔥" : song.isPlaying ? "🐱🎶" : "😿💤"
			),
			react.createElement(
				"h2",
				{ style: { margin: "8px 0 4px", fontWeight: 800 } },
				`Meng Oren Djoget (Level ${level})`
			),
			react.createElement(
				"p",
				{ style: { margin: "0 0 18px", opacity: 0.8, fontSize: "14px" } },
				song.isPlaying
					? `Lagi asik goyang dengerin: ${song.title} — ${song.artist}`
					: "Musik lagi di-pause, Meng Oren langsung molor!"
			),
			react.createElement(
				"div",
				{ className: "kucing-btn-row" },
				react.createElement(
					"button",
					{ className: "kucing-btn", onClick: kasihWhiskas },
					"🐟 Kasih Ikan Asin / Whiskas"
				),
				react.createElement(
					"button",
					{ className: "kucing-btn", onClick: elusKucing },
					"✋ Elus Kepala Meng"
				),
				react.createElement(
					"button",
					{
						className: "kucing-btn",
						onClick: () => setTurbo((t) => !t),
					},
					turbo ? "🛑 Stop Mode Kucing Kesurupan" : "⚡ Mode Joget Kesurupan (Turbo)"
				)
			)
		),
		react.createElement(
			"div",
			{ className: "kucing-stats-grid" },
			react.createElement(
				"div",
				{ className: "kucing-stat-card" },
				react.createElement("div", { style: { fontSize: "12px", opacity: 0.7 } }, "TINGKAT KENYANG"),
				react.createElement("div", { style: { fontSize: "24px", fontWeight: 800, marginTop: "4px" } }, `${kenyang}%`)
			),
			react.createElement(
				"div",
				{ className: "kucing-stat-card" },
				react.createElement("div", { style: { fontSize: "12px", opacity: 0.7 } }, "LEVEL KEBARBARAN OREN"),
				react.createElement("div", { style: { fontSize: "24px", fontWeight: 800, marginTop: "4px" } }, `Lv. ${level}`)
			),
			react.createElement(
				"div",
				{ className: "kucing-stat-card" },
				react.createElement("div", { style: { fontSize: "12px", opacity: 0.7 } }, "STATUS GOYANG"),
				react.createElement(
					"div",
					{ style: { fontSize: "20px", fontWeight: 800, marginTop: "4px" } },
					turbo ? "🔥 Goyang Patah Pinggang" : song.isPlaying ? "💃 Santuy Bergoyang" : "😴 Tidur Pulas"
				)
			)
		)
	);
}
