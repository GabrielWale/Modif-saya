const {
	React: react,
	React: { useState, useEffect },
} = Spicetify;

function render() {
	return react.createElement(DukunLaguApp);
}

const TAROT_JODOH = [
	{
		card: "The Ghosting Knight",
		icon: "👻",
		ramalan: "Aura lagu ini nunjukkin gebetanmu sebenarnya online, cuma lagi males bales chat kamu aja. Sabar ya.",
	},
	{
		card: "The Friendzone Empress",
		icon: "🤡",
		ramalan: "Mbah liat dari frekuensi bass-nya, kamu cuma dianggap 'temen curhat yang baik'. Jangan baper dulu!",
	},
	{
		card: "The Stalker Moon",
		icon: "🕵️",
		ramalan: "Ada yang diam-diam ngintip IG Story dan playlist Spotify kamu malam ini, tapi gengsi mau nyapa duluan.",
	},
	{
		card: "Two of Seblak",
		icon: "🍜",
		ramalan: "Jodohmu makin deket kalau kamu sering keluar beli jajanan malam. Jangan ngurung diri sambil muter lagu galau terus!",
	},
	{
		card: "King of Bare Minimum",
		icon: "🚩",
		ramalan: "Waspada! Lagu yang kamu putar mengundang makhluk manis di awal tapi menghilang pas lagi sayang-sayangnya.",
	},
];

const TAROT_DOMPET = [
	{
		card: "Wheel of Tanggal Tua",
		icon: "💸",
		ramalan: "Getaran treble lagu ini menandakan saldo rekeningmu butuh pertolongan pertama. Tahan checkout keranjang oren!",
	},
	{
		card: "Ace of Traktiran",
		icon: "🍕",
		ramalan: "Ada pertanda rejeki nomplok atau minimal ditraktir kopi susu sama temen tongkrongan dalam 3 hari ke depan.",
	},
	{
		card: "The Impulse Buyer",
		icon: "🛒",
		ramalan: "Jangan buka aplikasi belanja sambil dengerin lagu ini! Khodam konsumtifmu lagi kuat-kuatnya.",
	},
	{
		card: "Hermit of Indomie",
		icon: "🍜",
		ramalan: "Keuangan lagi mode bertahan hidup, tapi tenang: akhir bulan masih aman sentosa asal nggak nongkrong di kafe mahal.",
	},
];

const TAROT_KHODAM = [
	{
		card: "Khodam Macan Ngantuk",
		icon: "🐯",
		ramalan: "Khodam pendamping playlist-mu hari ini adalah Macan Ngantuk: galak kalau lapar, tapi rebahan nomor satu.",
	},
	{
		card: "Khodam Kucing Oren",
		icon: "🐈",
		ramalan: "Energi kamu lagi barbar dan random banget kayak Kucing Oren. Cocok buat ngerjain tugas mepet deadline!",
	},
	{
		card: "Khodam Kipas Angin Cosmos",
		icon: "🌀",
		ramalan: "Kepala lagi muter-muter kebanyakan pikiran, tapi tetap berusaha kelihatan adem di depan orang lain.",
	},
	{
		card: "Khodam Tuyul Indie",
		icon: "🕶️",
		ramalan: "Suka tiba-tiba ngilang dari grup chat dan baru muncul pas bahas gosip atau konser musik.",
	},
];

function getTrackInfo() {
	const item = Spicetify.Player?.data?.item || Spicetify.Player?.data?.track || {};
	const meta = item.metadata || {};
	return {
		title: item.name || meta.title || "Hening Tanpa Lagu",
		artist: item.artists?.[0]?.name || meta.artist_name || "Alam Ghoib",
	};
}

function DukunLaguApp() {
	const [track, setTrack] = useState(getTrackInfo);
	const [roll, setRoll] = useState(0);
	const [menyanCount, setMenyanCount] = useState(1);

	useEffect(() => {
		const update = () => {
			setTrack(getTrackInfo());
			setRoll((r) => r + 1);
		};
		Spicetify.Player?.addEventListener?.("songchange", update);
		return () => Spicetify.Player?.removeEventListener?.("songchange", update);
	}, []);

	const seed = (track.title.length * 13 + track.artist.length * 7 + roll * 31 + menyanCount * 17) >>> 0;
	const jodoh = TAROT_JODOH[seed % TAROT_JODOH.length];
	const dompet = TAROT_DOMPET[(seed >> 2) % TAROT_DOMPET.length];
	const khodam = TAROT_KHODAM[(seed >> 4) % TAROT_KHODAM.length];

	const semburDoaShuffle = () => {
		Spicetify.Player?.setShuffle?.(true);
		Spicetify.Player?.next?.();
		setRoll((r) => r + 1);
		Spicetify.showNotification("💦 Fuhh! Lagu telah disembur Ki Joko Spotify, mengganti ke lagu pembawa hoki!");
	};

	const bakarMenyan = () => {
		setMenyanCount((c) => c + 1);
		Spicetify.showNotification(`🪔 Menyan ke-${menyanCount + 1} dibakar! Penerawangan batin dipertajam...`);
	};

	return react.createElement(
		"div",
		{ className: "dukun-container" },
		react.createElement(
			"div",
			{ className: "dukun-banner" },
			react.createElement(
				"div",
				null,
				react.createElement("h1", { className: "dukun-title" }, "🔮 Praktek Ki Joko Spotify (Dukun Lagu)"),
				react.createElement(
					"p",
					{ className: "dukun-subtitle" },
					`Menerawang nasib, jodoh, & khodam dari frekuensi lagu: "${track.title}" — ${track.artist}`
				)
			),
			react.createElement(
				"div",
				{ style: { display: "flex", gap: "10px", flexWrap: "wrap" } },
				react.createElement(
					"button",
					{ className: "dukun-btn", onClick: bakarMenyan },
					`🪔 Bakar Menyan (${menyanCount}x)`
				),
				react.createElement(
					"button",
					{ className: "dukun-btn secondary", onClick: semburDoaShuffle },
					"💦 Sembur Air Doa (Gacha Lagu)"
				)
			)
		),
		react.createElement(
			"div",
			{ className: "dukun-grid" },
			react.createElement(
				"div",
				{ className: "dukun-tarot-card" },
				react.createElement("div", { className: "dukun-tarot-icon" }, jodoh.icon),
				react.createElement("div", { style: { fontSize: "11px", opacity: 0.7 } }, "TERAWANGAN ASMARA & JODOH"),
				react.createElement("div", { className: "dukun-tarot-name" }, jodoh.card),
				react.createElement("div", { className: "dukun-tarot-desc" }, jodoh.ramalan)
			),
			react.createElement(
				"div",
				{ className: "dukun-tarot-card" },
				react.createElement("div", { className: "dukun-tarot-icon" }, dompet.icon),
				react.createElement("div", { style: { fontSize: "11px", opacity: 0.7 } }, "TERAWANGAN DOMPET & REJEKI"),
				react.createElement("div", { className: "dukun-tarot-name" }, dompet.card),
				react.createElement("div", { className: "dukun-tarot-desc" }, dompet.ramalan)
			),
			react.createElement(
				"div",
				{ className: "dukun-tarot-card" },
				react.createElement("div", { className: "dukun-tarot-icon" }, khodam.icon),
				react.createElement("div", { style: { fontSize: "11px", opacity: 0.7 } }, "CEK KHODAM PENDAMPING"),
				react.createElement("div", { className: "dukun-tarot-name" }, khodam.card),
				react.createElement("div", { className: "dukun-tarot-desc" }, khodam.ramalan)
			)
		),
		react.createElement(
			"div",
			{ className: "dukun-mantra-box" },
			react.createElement(
				"div",
				null,
				react.createElement("div", { style: { fontWeight: 800, fontSize: "15px", marginBottom: "4px" } }, "📜 Pantangan Hari Ini dari Mbah:"),
				react.createElement(
					"div",
					{ style: { fontSize: "13.5px", opacity: 0.85 } },
					"Dilarang keras nge-chat mantan di atas jam 11 malam sambil dengerin lagu akustik atau pop galau!"
				)
			),
			react.createElement(
				"button",
				{
					className: "dukun-btn",
					onClick: () => {
						const text = `🔮 RAMALAN KI JOKO SPOTIFY 🔮\nLagu: ${track.title} - ${track.artist}\n❤️ Asmara: ${jodoh.card} (${jodoh.ramalan})\n💸 Dompet: ${dompet.card}\n🐯 Khodam: ${khodam.card}`;
						Spicetify.Platform?.ClipboardAPI?.copy?.(text);
						Spicetify.showNotification("Ramalan berhasil disalin ke clipboard!");
					},
				},
				"📋 Salin Hasil Terawangan"
			)
		)
	);
}
