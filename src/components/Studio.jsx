import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Copy,
  Download,
  Eraser,
  ImagePlus,
  Loader2,
  PackagePlus,
  RotateCcw,
  Share2,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import {
  STICKER_SIZE,
  canvasToBlob,
  downloadBlob,
  exportWhatsAppSticker,
  fileToDataURL,
  loadImage,
  loadPack,
  renderSticker,
  savePack,
  shareFiles,
  transparencyRatio,
} from "../sticker/engine";

const DEFAULTS = {
  fit: "cover",
  shape: "auto",
  outline: 14,
  outlineColor: "#ffffff",
  bgRemove: true,
  bgTolerance: 48,
  top: "",
  bottom: "",
  fontScale: 1,
  textColor: "#ffffff",
  flipH: false,
  rotation: 0,
};

function sampleSticker(emoji) {
  // Transparent background so it imports as a real sticker, not a photo
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const x = c.getContext("2d");
  x.font = "360px serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillText(emoji, 256, 290);
  return c.toDataURL("image/png");
}

const SAMPLES = [{ emoji: "🤪" }, { emoji: "💀" }, { emoji: "🔥" }, { emoji: "😭" }];

function Btn({ children, onClick, primary, ghost, disabled, small }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-40 ${
        small ? "px-4 py-2.5 text-sm" : "px-5 py-3.5 text-[15px]"
      } ${
        primary
          ? "bg-[#25D366] text-[#04150b] shadow-[0_8px_30px_-8px_rgba(37,211,102,0.7)] hover:scale-[1.02]"
          : ghost
            ? "glass hover:bg-white/10"
            : "bg-white/10 hover:bg-white/15"
      }`}
    >
      {children}
    </button>
  );
}

function Seg({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
              value === o.value
                ? "bg-[#25D366] text-[#04150b]"
                : "bg-white/10 text-slate-200 hover:bg-white/15"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Studio() {
  const [src, setSrc] = useState(null); // dataURL of source
  const [img, setImg] = useState(null); // HTMLImageElement
  const [opts, setOpts] = useState(DEFAULTS);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [pack, setPack] = useState(() => loadPack());
  const [dragOver, setDragOver] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [waInfo, setWaInfo] = useState(null); // { sizeKB, transparent, withinLimit }
  const previewRef = useRef(null);
  const exportRef = useRef(null); // latest 512 canvas
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const set = (patch) => setOpts((o) => ({ ...o, ...patch }));

  // Load image element when src changes
  useEffect(() => {
    if (!src) {
      setImg(null);
      return;
    }
    let live = true;
    loadImage(src).then((im) => live && setImg(im));
    return () => {
      live = false;
    };
  }, [src]);

  // Live render
  const render = useCallback(async () => {
    if (!img || !previewRef.current) return;
    setBusy(true);
    try {
      const preview = await renderSticker(img, { ...opts, size: 360 });
      const pc = previewRef.current;
      pc.width = 360;
      pc.height = 360;
      pc.getContext("2d").clearRect(0, 0, 360, 360);
      pc.getContext("2d").drawImage(preview, 0, 0);
      exportRef.current = await renderSticker(img, { ...opts, size: STICKER_SIZE });
      // Live WhatsApp-readiness check on the real 512 export
      try {
        const probe = await canvasToBlob(exportRef.current, "image/webp", 0.85);
        setWaInfo({
          sizeKB: probe ? probe.size / 1024 : 0,
          transparent: transparencyRatio(exportRef.current) > 0.02,
          withinLimit: probe ? probe.size / 1024 <= 100 : false,
        });
      } catch {
        setWaInfo(null);
      }
    } finally {
      setBusy(false);
    }
  }, [img, opts]);

  useEffect(() => {
    const t = setTimeout(render, 60);
    return () => clearTimeout(t);
  }, [render]);

  useEffect(() => {
    savePack(pack);
  }, [pack]);

  // Paste support (PC power move)
  useEffect(() => {
    const onPaste = async (e) => {
      const f = [...(e.clipboardData?.files || [])].find((x) => x.type.startsWith("image/"));
      if (f) {
        setStatus("Pasted! Cooking your sticker…");
        setSrc(await fileToDataURL(f));
        setStatus("");
      }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  const pickFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setStatus("That file isn't an image — try a JPG/PNG/WebP.");
      return;
    }
    setStatus("Loading…");
    setSrc(await fileToDataURL(file));
    setStatus("");
  };

  const flash = (msg) => {
    setStatus(msg);
    setTimeout(() => setStatus(""), 2600);
  };

  const addToPack = async () => {
    if (!img) return;
    setBusy(true);
    try {
      const { blob } = await exportWhatsAppSticker(img, opts);
      if (!blob) return flash("Export failed — try again.");
      const url = await fileToDataURL(new File([blob], "sticker.webp", { type: "image/webp" }));
      const item = { id: Date.now(), url, at: new Date().toISOString() };
      setPack((p) => [item, ...p].slice(0, 30));
      flash("Added to pack! Keep cooking 👇");
    } finally {
      setBusy(false);
    }
  };

  const downloadOne = async (type) => {
    if (!img) return;
    setBusy(true);
    try {
      if (type === "png") {
        const canvas = await renderSticker(img, { ...opts, size: STICKER_SIZE });
        const blob = await canvasToBlob(canvas, "image/png");
        downloadBlob(blob, `stickme-${Date.now()}.png`);
        flash("Downloaded HD PNG (for editing — packs need WebP)");
      } else {
        const { blob, sizeKB } = await exportWhatsAppSticker(img, opts);
        downloadBlob(blob, `stickme-${Date.now()}.webp`);
        flash(`Downloaded real sticker — 512×512 WebP, ${Math.round(sizeKB)}KB ✅`);
      }
    } finally {
      setBusy(false);
    }
  };

  const copySticker = async () => {
    try {
      if (!exportRef.current || !window.ClipboardItem) return flash("Copy not supported here — use Download.");
      const blob = await canvasToBlob(exportRef.current, "image/png");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      flash("Copied! Paste it straight into WhatsApp Web 📋");
    } catch {
      flash("Copy blocked by browser — use Download instead.");
    }
  };

  const shareSticker = async () => {
    try {
      if (!img) return;
      // NOTE: phone share sheets send this as an image file — to get a true
      // sticker it must go through WhatsApp's Create / Add-to-pack flow below.
      const { blob } = await exportWhatsAppSticker(img, opts);
      const file = new File([blob], "stickme-sticker.webp", { type: "image/webp" });
      const r = await shareFiles([file]);
      if (r === "unsupported") flash("Share sheet unavailable — use Download sticker.");
    } catch {
      /* user cancelled */
    }
  };

  const downloadPackZip = async () => {
    if (!pack.length) return;
    flash("Zipping your pack…");
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (let i = 0; i < pack.length; i++) {
      const res = await fetch(pack[i].url);
      const blob = await res.blob();
      zip.file(`stickme-${String(i + 1).padStart(2, "0")}.webp`, blob);
    }
    const out = await zip.generateAsync({ type: "blob" });
    downloadBlob(out, "stickme-pack.zip");
    flash(`Pack downloaded — ${pack.length} stickers 🎉`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 lg:px-8">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <a href="#top" className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold hover:bg-white/10">
          <ArrowLeft size={16} aria-hidden="true" /> Back home
        </a>
        <p className="inline-flex items-center gap-2 rounded-full bg-[#25D366]/10 px-4 py-2 text-xs font-bold text-lime-300">
          <Sparkles size={14} aria-hidden="true" /> Web studio • free • no sign-up
        </p>
      </div>

      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        Sticker studio <span className="text-glow-gradient">— make it in seconds</span>
      </h1>
      <p className="mt-3 max-w-2xl text-slate-400">
        Upload a pic, auto-cut the background, slap on a caption, export WhatsApp-ready 512×512. Works on phone + PC.
      </p>

      {status && (
        <p role="status" className="mt-4 w-fit rounded-2xl bg-[#25D366]/15 px-5 py-3 text-sm font-bold text-lime-300">
          {status}
        </p>
      )}

      {!src ? (
        /* ---------- UPLOAD STATE ---------- */
        <div className="mt-8 grid gap-5 lg:grid-cols-5">
          <div
            role="button"
            tabIndex={0}
            aria-label="Upload an image to start"
            onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              pickFile(e.dataTransfer.files?.[0]);
            }}
            className={`cursor-pointer rounded-[2rem] border-2 border-dashed p-10 text-center transition-all sm:p-14 lg:col-span-3 ${
              dragOver ? "border-[#25D366] bg-[#25D366]/10 scale-[1.01]" : "glass hover:bg-white/[0.07]"
            }`}
          >
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[#25D366] to-lime-300 text-3xl text-[#04150b]">
              <ImagePlus aria-hidden="true" />
            </span>
            <p className="font-display mt-5 text-2xl font-bold">Drop a pic here, or tap to upload</p>
            <p className="mt-2 text-sm text-slate-400">JPG • PNG • WebP • Screenshots — or paste (Ctrl+V) on PC</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Btn primary small onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}>
                <Upload size={16} aria-hidden="true" /> Choose photo
              </Btn>
              <Btn ghost small onClick={(e) => { e.stopPropagation(); cameraRef.current?.click(); }}>
                <Camera size={16} aria-hidden="true" /> Use camera
              </Btn>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])} />
          </div>

          <div className="glass rounded-[2rem] p-7 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No pic handy? Try a sample</p>
            <div className="mt-4 grid grid-cols-4 gap-3 lg:grid-cols-2">
              {SAMPLES.map((s) => (
                <button
                  key={s.emoji}
                  type="button"
                  onClick={() => setSrc(sampleSticker(s.emoji))}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-transform hover:scale-105"
                  aria-label={`Try sample ${s.emoji}`}
                >
                  <span className="grid aspect-square place-items-center text-6xl">
                    {s.emoji}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-white/[0.04] p-4 text-sm leading-relaxed text-slate-400">
              <strong className="text-white">Pro tip:</strong> pics with a clear subject + plain background cut out cleanest. Screenshots of faces = elite sticker material.
            </div>
          </div>
        </div>
      ) : (
        /* ---------- EDITOR STATE ---------- */
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
          {/* preview */}
          <div className="lg:sticky lg:top-24">
            <div className="glass relative overflow-hidden rounded-[2rem] p-6 text-center sm:p-8">
              <div
                className="mx-auto grid place-items-center rounded-[1.6rem]"
                style={{
                  width: "min(100%, 380px)",
                  aspectRatio: "1",
                  backgroundImage: "linear-gradient(45deg, #1a2038 25%, transparent 25%), linear-gradient(-45deg, #1a2038 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a2038 75%), linear-gradient(-45deg, transparent 75%, #1a2038 75%)",
                  backgroundSize: "24px 24px",
                  backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0",
                  backgroundColor: "#0b0f1e",
                }}
              >
                <canvas ref={previewRef} width={360} height={360} className="h-auto w-full max-w-[360px]" aria-label="Sticker preview" role="img" />
              </div>
              {busy && (
                <p className="mt-3 inline-flex items-center gap-2 text-sm text-slate-400">
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" /> rendering…
                </p>
              )}
              {/* WhatsApp spec badge — this is what decides sticker vs photo */}
              {waInfo && (
                <div className="mx-auto mt-4 flex w-fit flex-wrap items-center justify-center gap-2 text-xs font-bold" role="status">
                  <span className="rounded-full bg-white/10 px-3 py-1.5">512×512</span>
                  <span className={`rounded-full px-3 py-1.5 ${waInfo.withinLimit ? "bg-[#25D366]/20 text-lime-300" : "bg-amber-400/20 text-amber-300"}`}>
                    {Math.round(waInfo.sizeKB)}KB {waInfo.withinLimit ? "✓" : "— auto-shrunk on download"}
                  </span>
                  <span className={`rounded-full px-3 py-1.5 ${waInfo.transparent ? "bg-[#25D366]/20 text-lime-300" : "bg-amber-400/20 text-amber-300"}`}>
                    {waInfo.transparent ? "transparent ✓ real sticker" : "no transparency ⚠ may send as photo"}
                  </span>
                </div>
              )}
              {!waInfo?.transparent && !busy && (
                <p className="mx-auto mt-3 max-w-sm text-[13px] leading-relaxed text-amber-300/90">
                  Tip: turn on <strong>Remove background</strong> so WhatsApp sees a sticker, not a square photo.
                </p>
              )}
              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <Btn primary small onClick={addToPack}><PackagePlus size={15} aria-hidden="true" /> Add to pack</Btn>
                <Btn small onClick={() => downloadOne("webp")}><Download size={15} aria-hidden="true" /> Sticker .webp</Btn>
                <Btn small onClick={() => downloadOne("png")}>HD .png</Btn>
                <Btn small onClick={shareSticker}><Share2 size={15} aria-hidden="true" /> Share</Btn>
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                <Btn ghost small onClick={copySticker}><Copy size={15} aria-hidden="true" /> Copy (paste into WA Web)</Btn>
                <Btn ghost small onClick={() => { setSrc(null); setOpts(DEFAULTS); }}><RotateCcw size={15} aria-hidden="true" /> New photo</Btn>
              </div>
            </div>
          </div>

          {/* controls */}
          <div className="space-y-5">
            <div className="glass rounded-3xl p-6">
              <p className="mb-3 flex items-center gap-2 font-bold"><Wand2 size={17} className="text-lime-300" aria-hidden="true" /> Cutout</p>
              <button
                type="button"
                role="switch"
                aria-checked={opts.bgRemove}
                onClick={() => set({ bgRemove: !opts.bgRemove })}
                className={`flex w-full items-center justify-between rounded-2xl px-5 py-3.5 font-bold transition-colors ${opts.bgRemove ? "bg-[#25D366] text-[#04150b]" : "bg-white/10"}`}
              >
                <span className="inline-flex items-center gap-2"><Eraser size={16} aria-hidden="true" /> Remove background</span>
                <span aria-hidden="true">{opts.bgRemove ? "ON" : "OFF"}</span>
              </button>
              {opts.bgRemove && (
                <label className="mt-4 block text-sm text-slate-300">
                  Cleanup strength: <strong>{opts.bgTolerance}</strong>
                  <input
                    type="range" min={20} max={110} value={opts.bgTolerance}
                    onChange={(e) => set({ bgTolerance: +e.target.value })}
                    className="mt-2 w-full accent-[#25D366]" aria-label="Background removal strength"
                  />
                </label>
              )}
            </div>

            <div className="glass space-y-5 rounded-3xl p-6">
              <Seg label="Photo fit" value={opts.fit} onChange={(v) => set({ fit: v })}
                options={[{ value: "cover", label: "Fill" }, { value: "contain", label: "Fit all" }]} />
              <Seg label="Shape" value={opts.shape} onChange={(v) => set({ shape: v })}
                options={[{ value: "auto", label: "Cutout" }, { value: "circle", label: "Circle" }, { value: "rounded", label: "Rounded" }]} />
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">White border: {opts.outline}px</p>
                <input type="range" min={0} max={28} value={opts.outline} onChange={(e) => set({ outline: +e.target.value })}
                  className="w-full accent-[#25D366]" aria-label="Border thickness" />
                <div className="mt-2 flex gap-2" role="group" aria-label="Border color">
                  {["#ffffff", "#facc15", "#ec4899", "#25D366", "#0b0f1a"].map((c) => (
                    <button key={c} type="button" aria-label={`Border ${c}`} aria-pressed={opts.outlineColor === c}
                      onClick={() => set({ outlineColor: c })}
                      className={`h-9 w-9 rounded-full border-2 transition-transform ${opts.outlineColor === c ? "scale-110 border-[#25D366]" : "border-white/20"}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn ghost small onClick={() => set({ flipH: !opts.flipH })}>{opts.flipH ? "Unflip" : "Flip ↕"}</Btn>
                <Btn ghost small onClick={() => set({ rotation: (opts.rotation + 90) % 360 })}>Rotate 90°</Btn>
                <Btn ghost small onClick={() => set({ rotation: 0, flipH: false })}>Reset pose</Btn>
              </div>
            </div>

            <div className="glass space-y-4 rounded-3xl p-6">
              <p className="font-bold">Meme captions</p>
              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-slate-300">Top text</span>
                <input value={opts.top} onChange={(e) => set({ top: e.target.value })} placeholder="POV: MONDAY AGAIN"
                  maxLength={42} className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#25D366] focus:outline-none" />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block font-semibold text-slate-300">Bottom text</span>
                <input value={opts.bottom} onChange={(e) => set({ bottom: e.target.value })} placeholder="bro 💀"
                  maxLength={42} className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-white placeholder:text-slate-500 focus:border-[#25D366] focus:outline-none" />
              </label>
              <label className="block text-sm text-slate-300">
                Text size: <strong>{Math.round(opts.fontScale * 100)}%</strong>
                <input type="range" min={0.6} max={1.6} step={0.1} value={opts.fontScale}
                  onChange={(e) => set({ fontScale: +e.target.value })} className="mt-2 w-full accent-[#25D366]" aria-label="Caption size" />
              </label>
              <div className="flex gap-2" role="group" aria-label="Caption color">
                {["#ffffff", "#facc15", "#25D366", "#ec4899", "#0b0f1a"].map((c) => (
                  <button key={c} type="button" aria-label={`Text ${c}`} aria-pressed={opts.textColor === c}
                    onClick={() => set({ textColor: c })}
                    className={`h-9 w-9 rounded-full border-2 transition-transform ${opts.textColor === c ? "scale-110 border-[#25D366]" : "border-white/20"}`}
                    style={{ background: c }} />
                ))}
              </div>
            </div>

            <button type="button" onClick={() => setShowHelp((v) => !v)} aria-expanded={showHelp}
              className="glass w-full rounded-3xl bg-[#25D366]/10 px-6 py-4 text-left font-bold hover:bg-[#25D366]/15">
              {showHelp ? "Hide" : "Show"}: get this INTO WhatsApp as a sticker (2 min) 👇
            </button>
            {showHelp && (
              <div className="glass space-y-5 rounded-3xl p-6 text-sm leading-relaxed text-slate-300">
                <p className="rounded-2xl bg-amber-400/10 px-4 py-3 text-[13px] text-amber-200">
                  Why this step exists: sending a file <em>to</em> a chat always arrives as a photo.
                  A sticker only happens when the file enters through WhatsApp's sticker doors below —
                  with a transparent background, 512×512, under 100KB (this studio exports exactly that ✅).
                </p>
                <div>
                  <p className="font-bold text-white">📱 Phone → into a real sticker pack (recommended)</p>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5">
                    <li>Hit <strong className="text-white">Sticker .webp → save to gallery/files</strong> (need 3+ stickers for a pack).</li>
                    <li>Open any WhatsApp chat → <strong className="text-white">sticker icon → Create → pick your saved file</strong> → send it.</li>
                    <li><strong className="text-white">Tap &amp; hold the sent sticker → Add to sticker pack → New</strong>, name it, Save. Done — it's a real sticker now.</li>
                    <li>Repeat: send each sticker → Add to sticker pack → same pack (up to 30).</li>
                  </ol>
                </div>
                <div>
                  <p className="font-bold text-white">💻 PC → send as a sticker on WhatsApp Web</p>
                  <ol className="mt-2 list-decimal space-y-1.5 pl-5">
                    <li>Hit <strong className="text-white">Copy</strong>, then paste (Ctrl+V) into WhatsApp Web — or download the .webp and drag it in.</li>
                    <li>Choose the <strong className="text-white">sticker / Create sticker</strong> option (not “photo”) before sending.</li>
                    <li>Sent stickers auto-save to your tray and sync to your phone.</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- PACK TRAY ---------- */}
      <section aria-label="Your sticker pack" className="mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Your pack {pack.length > 0 && <span className="text-lime-300">({pack.length})</span>}
          </h2>          {pack.length > 0 && (
            <div className="flex gap-2">
              <Btn ghost small onClick={downloadPackZip}><Download size={15} aria-hidden="true" /> ZIP pack</Btn>
              <Btn ghost small onClick={() => setPack([])}><Trash2 size={15} aria-hidden="true" /> Clear</Btn>
            </div>
          )}
        </div>
        {pack.length === 0 ? (
          <p className="glass mt-4 rounded-3xl p-8 text-center text-slate-400">
            Nothing here yet — make a sticker and hit <strong className="text-white">“Add to pack”</strong>. Your pack auto-saves in this browser.
          </p>
        ) : (
          <>
            <p className="mt-3 text-[13px] text-slate-400">
              Every file here is 512×512 WebP, under 100KB — exactly what WhatsApp's sticker-pack upload accepts.
              WhatsApp packs need 3–30 stickers.
            </p>
          <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {pack.map((s, i) => (
              <li key={s.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-2">
                <img src={s.url} alt={`Sticker ${i + 1}`} className="aspect-square w-full rounded-xl object-contain" loading="lazy" />
                <button
                  type="button" aria-label={`Delete sticker ${i + 1}`}
                  onClick={() => setPack((p) => p.filter((x) => x.id !== s.id))}
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/70 text-red-300 opacity-0 transition-opacity hover:bg-black group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          </>
        )}
      </section>
    </div>
  );
}
