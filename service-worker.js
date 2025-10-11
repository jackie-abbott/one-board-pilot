<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- Keep this so search engines don’t index while you test -->
  <meta name="robots" content="noindex,nofollow">
  <link rel="manifest" href="manifest.webmanifest">
  <!-- Match the new navy background -->
  <meta name="theme-color" content="#0a1a2f">

  <!-- Service worker -->
  <script>
    if ("serviceWorker" in navigator) {
      addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
    }
  </script>

  <!-- Favicons -->
  <link rel="icon" type="image/png" sizes="32x32" href="icon-192.png">
  <link rel="apple-touch-icon" href="icon-192.png">

  <title>One-Board Pilot</title>
  <meta name="description" content="A tiny, single-file site to run the One-Board routine (weekly wins + one action). No PHI." />
  <style>
    :root{
      --bg:#0a1a2f;          /* deep navy (Option A base) */
      --card:#0b1f35;        /* lighter navy card for contrast */
      --ink:#e6f0ff;         /* very light ink */
      --muted:#c7d5e5;       /* cool slate text */
      --accent:#2bb3b1;      /* teal (primary) */
      --accent-2:#2a91b1;    /* blue-teal (secondary) */
      --warn:#f59e0b;        /* amber */
      --danger:#dc2626;      /* red */
      --border:#1f2f46;      /* dark border */
      --border-strong:#274160;/* stronger border */
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;color:var(--ink);font:16px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
      /* Option A: navy base with subtle teal glow */
      background:
        radial-gradient(1200px 600px at 12% -10%, rgba(43,179,177,.14), transparent 55%),
        radial-gradient(800px 400px at 95% 0, rgba(43,179,177,.08), transparent 60%),
        var(--bg);
    }
    .wrap{max-width:1100px;margin:0 auto;padding:16px}
    header{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:12px}
    h1{font-size:20px;margin:0;font-weight:700;letter-spacing:.3px}
    h2.kicker{margin:0 0 8px 0;font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}
    .card{
      background:var(--card);
      border:1px solid var(--border-strong);
      border-radius:16px;padding:16px;
      box-shadow:0 1px 2px rgba(0,0,0,.25)
    }
    .grid{display:grid;gap:12px}
    @media(min-width:900px){
      .grid-cols{grid-template-columns:2fr 1fr}
      .grid-low{grid-template-columns:2fr 1fr}
    }
    label{display:block;font-size:12px;color:var(--muted);margin-bottom:6px}
    input[type="text"], input[type="date"], textarea{
      width:100%;border:1px solid var(--border-strong);border-radius:10px;background:#0b1f35;color:var(--ink);padding:10px 12px
    }
    input[type="text"]:focus, input[type="date"]:focus, textarea:focus{
      outline:none;border-color:var(--accent);box-shadow:0 0 0 2px rgba(43,179,177,.25)
    }
    textarea{min-height:64px;resize:vertical}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .btn{
      display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border-strong);
      background:#0b1f35;color:var(--ink);padding:10px 14px;border-radius:10px;cursor:pointer
    }
    .btn:hover{border-color:#3a5575}
    /* Lighter Median Method blue "Proof" button */
    .btn.good{
      background:linear-gradient(180deg,#4f9cff,#2a91b1);
      border-color:#2a91b1;color:#fff;
    }
    .btn.ghost{background:transparent;border-color:transparent;color:var(--ink)}
    .pill{
      display:inline-flex;align-items:center;gap:6px;font-size:12px;border:1px solid var(--border);
      border-radius:999px;padding:6px 10px;color:var(--muted);background:#0b1f35
    }
    .stack{display:flex;flex-wrap:wrap;gap:8px}
    .muted{color:var(--muted)}
    .wins li{margin:6px 0}
    footer{margin-top:12px;color:var(--muted);font-size:12px;text-align:center}
    button:disabled, input:disabled, textarea:disabled, select:disabled{opacity:.6; cursor:not-allowed}

    /* Print-friendly one-pager */
    @media print{
      body{ background:#fff; color:#000; }
      .wrap{ max-width:7.5in; }
      header{ margin-bottom:8px; }
      .card{ background:#fff; border:1px solid #ccc; box-shadow:none; }
      .kicker{ color:#000 !important; }
      input, textarea{ border:none; padding:0; background:#fff; color:#000; }
      .btn, .pill, footer{ display:none !important; } /* hide chrome/buttons */
      .grid, .grid-cols, .grid-low{ gap:8px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>One-Board Pilot</h1>
      <div class="stack">
        <span class="pill">Week of <input id="weekOf" type="date" aria-label="Week Of" /></span>
        <span class="pill">Scribe today
          <select id="scribe" aria-label="Scribe today">
            <option>Charge AM</option>
            <option>Charge PM</option>
            <option>Room 1</option>
            <option>Room 2</option>
            <option>Float</option>
          </select>
        </span>
        <button class="btn" id="copyBtn" title="Copy a ready-to-paste weekly update">Copy Weekly Update</button>
        <button class="btn ghost" id="resetBtn" title="Clear everything for a fresh week">Reset Week</button>
        <button class="btn" id="printBtn" title="Print a one-page poster">Print Poster</button>
        <button class="btn" id="shareBtn" title="Share or copy the link">Share Link</button>
        <button class="btn" id="exportBtn" title="Download current week data">Export</button>
        <button class="btn ghost" id="importBtn" title="Load saved data">Import</button>
        <button class="btn ghost" id="clearBtn"  title="Erase local data on this device">Clear Data</button>
        <button class="btn ghost" id="lockBtn"  title="Lock/unlock kiosk">Lock</button>
        <input id="filePick" type="file" accept="application/json" style="display:none">
      </div>
    </header>

    <!-- Weekly rhythm reminder -->
    <div class="pill" style="margin-bottom:10px;background:#0b1f35;border-color:var(--border-strong)">
      Mon: set One Action • All week: add Signals • Fri: 3–5 wins, stamp Proof, post & print
    </div>

    <div class="grid grid-cols">
      <!-- Left column -->
      <section class="card">
        <h2 class="kicker">Signals — (3 short lines max)</h2>
        <div class="row">
          <div>
            <label for="signal1">Communication</label>
            <input id="signal1" type="text" placeholder="e.g., Morning update late; add 8:30a post" />
          </
