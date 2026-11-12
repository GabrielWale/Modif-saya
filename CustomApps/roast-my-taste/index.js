const {
	React: react,
	React: { useState, useEffect },
} = Spicetify;

function render() {
	return react.createElement(RoastMyTasteApp);
}

const ROAST_TEMPLATES = {
	pedas: [
		"Lagu '{title}' dari {artist}? Fix, kamu tipe orang yang kalau lagi sedih bukannya tidur malah bikin skenario palsu sambil natap langit-langit kamar.",
		"Ngedengerin {artist} di jam segini? Jujur aja, siapa yang habis nge-ghosting kamu sampai selera musikmu turun drastis begini?",
		"Playlist kamu bau-baunya kombinasi antara 'pura-pura bahagia di tongkrongan' sama 'nangis di pojokan kamar mandi'. Apalagi pas muter '{title}'.",
		"Seriusan muter '{title}'? Bahkan algoritma Spotify aja bingung mau ngasih rekomendasi lagu atau nomor psikolog buat kamu.",
		"Kalau '{title}' dari {artist} jadi kepribadian, itu kepribadian orang yang bilang 'aku gapapa kok' padahal aslinya udah siap nulis thread curhat 25 tweet.",
		"Selera musikmu kayak nasi goreng tanpa garam: kelihatannya rame, tapi sebenernya hambar dan penuh kenangan masa lalu yang belum selesai.",
	],
	savage: [
		"ALARM RED FLAG BUNYI KERAS! Muter '{title}' ({artist}) itu bukti sah kalau kamu gampang baper sama orang yang cuma ngasih bare minimum!",
		"Tolong volume '{title}' dikecilin dikit, kasihan tetangga kalau tahu selera musikmu masih terjebak di fase gagal move on tahun 2019!",
		"Dengerin {artist} terus-terusan nggak bakal bikin dia tiba-tiba nge-chat 'aku kangen kamu'. Sadar bestie, bangun!",
		"Spotify Wrapped kamu tahun ini kayaknya nggak usah di-share ke IG Story deh, malu sama '{title}' yang udah kamu repeat 50 kali diam-diam.",
		"Kombinasi {artist} + '{title}' = 99% jamet elit, 1% pura-pura indie biar kelihatan estetik di depan gebetan.",
	],
	receh: [
		"Muter '{title}' dari {artist} berasa jadi tokoh utama sinetron Indosiar yang lagi jalan kaki kehujanan sambil bawa map lamaran kerja.",
		"Vibe lagu '{title}' ini cocok banget didengerin sambil ngaduk kopi saset yang gulanya lupa dituang: pahit tapi tetep diseruput.",
		"Kata {artist}, makasih udah muter '{title}', royalti Rp 12 perak dari kamu sangat membantu beli gorengan sore ini.",
		"Lagu '{title}' ini ibarat martabak manis keju susu: awalnya enak, lama-lama bikin eneg kalau diputer seharian!",
	],
};

const DIAGNOSA_LIST = [
	{ badge: "Stadium 4 Bucin Kronis", aura: "-4500 Aura (Gampang Kena Ghosting)" },
	{ badge: "Indie Senja Kesiangan", aura: "+200 Aura (Tapi Dompet Tipis)" },
	{ badge: "Jamet Terselubung", aura: "-999 Aura (Suka Joget Diam-Diam)" },
	{ badge: "Overthinking Juara Nasional", aura: "-1200 Aura (Kurang Tidur)" },
	{ badge: "Sok Cool Padahal Galau", aura: "+50 Aura (Menolak Sadar)" },
	{ badge: "CEO Badut Tongkrongan", aura: "-7777 Aura (Bucin Tak Terbalas)" },
];

function hashString(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return Math.abs(h);
}

function getCurrentTrackData() {
	const data = Spicetify.Player?.data || {};
	const item = data.item || data.track || {};
	const meta = item.metadata || {};
	const title = item.name || meta.title || "Lagu Misterius (Belum Muter Lagu)";
	const artist =
		item.artists?.[0]?.name ||
		meta.artist_name ||
		"Artis Ghoib";
	const album = item.album?.name || meta.album_title || "Album Kenangan";
	const image =
		item.images?.[0]?.url ||
		meta.image_xlarge_url ||
		meta.image_url ||
		"";
	return { title, artist, album, image };
}

function RoastMyTasteApp() {
	const [level, setLevel] = useState("pedas");
	const [track, setTrack] = useState(getCurrentTrackData);
	const [seed, setSeed] = useState(0);

	useEffect(() => {
		const onSongChange = () => {
			setTrack(getCurrentTrackData());
			setSeed((s) => s + 1);
		};
		Spicetify.Player?.addEventListener?.("songchange", onSongChange);
		return () => {
			Spicetify.Player?.removeEventListener?.("songchange", onSongChange);
		};
	}, []);

	const baseHash = hashString(`${track.title}-${track.artist}-${level}-${seed}`);
	const templates = ROAST_TEMPLATES[level] || ROAST_TEMPLATES.pedas;
	const roastText = templates[baseHash % templates.length]
		.replaceAll("{title}", track.title)
		.replaceAll("{artist}", track.artist);

	const diagnosa = DIAGNOSA_LIST[baseHash % DIAGNOSA_LIST.length];
	const bucinScore = 40 + (baseHash % 60);
	const jametScore = 25 + ((baseHash >> 3) % 75);
	const galauScore = 35 + ((baseHash >> 5) % 65);
	const redFlagScore = Math.min(100, Math.round((bucinScore + galauScore) / 1.8));

	const copyRoast = () => {
		const summary = `🔥 ROAST SPOTIFY-KU 🔥\nLagu: ${track.title} - ${track.artist}\nVonis: ${diagnosa.badge}\n"${roastText}"\nSkor Bucin: ${bucinScore}% | Red Flag: ${redFlagScore}%`;
		Spicetify.Platform?.ClipboardAPI?.copy?.(summary);
		Spicetify.showNotification("Hasil roast berhasil disalin! Siap pamer kehancuran selera musikmu 🔥");
	};

	return react.createElement(
		"div",
		{ className: "roast-app-container" },
		react.createElement(
			"div",
			{ className: "roast-hero" },
			react.createElement(
				"div",
				null,
				react.createElement("h1", { className: "roast-hero-title" }, "🔥 Roast Musikku (Hakim Selera Lagu)"),
				react.createElement(
					"p",
					{ className: "roast-hero-sub" },
					"Mesin penghancur harga diri berdasarkan lagu yang lagi kamu dengerin sekarang."
				)
			),
			react.createElement(
				"div",
				{ className: "roast-level-group" },
				["receh", "pedas", "savage"].map((lvl) =>
					react.createElement(
						"button",
						{
							key: lvl,
							className: `roast-btn ${level === lvl ? "active" : ""}`,
							onClick: () => setLevel(lvl),
						},
						lvl === "receh" ? "🌶️ Level Receh" : lvl === "pedas" ? "🌶️🌶️ Level Pedas" : "💀 Level Savage"
					)
				)
			)
		),
		react.createElement(
			"div",
			{ className: "roast-grid" },
			react.createElement(
				"div",
				{ className: "roast-card" },
				react.createElement("h3", null, "🎯 Barang Bukti Saat Ini"),
				react.createElement(
					"div",
					{ className: "roast-track-box" },
					track.image
						? react.createElement("img", {
								className: "roast-cover",
								src: track.image.startsWith("spotify:image:")
									? `https://i.scdn.co/image/${track.image.replace("spotify:image:", "")}`
									: track.image,
								alt: track.title,
						  })
						: react.createElement(
								"div",
								{
									className: "roast-cover",
									style: { display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" },
								},
								"💿"
						  ),
					react.createElement(
						"div",
						null,
						react.createElement("div", { className: "roast-track-title" }, track.title),
						react.createElement("div", { className: "roast-track-artist" }, `${track.artist} • ${track.album}`),
						react.createElement("span", { className: "roast-badge" }, diagnosa.badge)
					)
				),
				react.createElement("div", { className: "roast-quote-box" }, `"${roastText}"`),
				react.createElement(
					"div",
					{ className: "roast-actions" },
					react.createElement(
						"button",
						{
							className: "roast-btn active",
							onClick: () => {
								setTrack(getCurrentTrackData());
								setSeed((s) => s + 1);
							},
						},
						"🔄 Roast Ulang Lebih Parah"
					),
					react.createElement(
						"button",
						{
							className: "roast-btn",
							onClick: copyRoast,
						},
						"📋 Copy Hasil Roast"
					)
				)
			),
			react.createElement(
				"div",
				{ className: "roast-card" },
				react.createElement("h3", null, "📊 Statistik Kerusakan Selera"),
				[
					{ label: "Tingkat Kebucinan & Gagal Move On", val: bucinScore, color: "#ff4500" },
					{ label: "Potensi Jamet Terselubung", val: jametScore, color: "#ffb703" },
					{ label: "Indeks Galau Tengah Malam", val: galauScore, color: "#8ecae6" },
					{ label: "Level Red Flag Musik", val: redFlagScore, color: "#e63946" },
				].map((m) =>
					react.createElement(
						"div",
						{ className: "roast-meter-row", key: m.label },
						react.createElement(
							"div",
							{ className: "roast-meter-label" },
							react.createElement("span", null, m.label),
							react.createElement("span", null, `${m.val}%`)
						),
						react.createElement(
							"div",
							{ className: "roast-meter-bar" },
							react.createElement("div", {
								className: "roast-meter-fill",
								style: { width: `${m.val}%`, backgroundColor: m.color },
							})
						)
					)
				),
				react.createElement(
					"div",
					{ className: "roast-cert", style: { marginTop: "18px" } },
					react.createElement("div", { style: { fontSize: "12px", opacity: 0.7 } }, "SERTIFIKAT RESMI KOMISI PENYIARAN TONGKRONGAN"),
					react.createElement("div", { style: { fontSize: "18px", fontWeight: 800, margin: "6px 0" } }, diagnosa.aura),
					react.createElement("div", { className: "roast-cert-stamp" }, "TERVERIFIKASI BADUT")
				)
			)
		)
	);
}
