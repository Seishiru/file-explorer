// preload.js (safe: exposes prompt as window.electronAPI.prompt — no top-level overrides)
const { contextBridge, ipcRenderer, shell } = require("electron");
const fs = require("fs");
const path = require("path");

// startup log
try {
  console.log(`[preload] loaded: ${__filename}`);
} catch (e) {}

/* ---------------------------
   prompt UI (DOM overlay)
   Exposed as electronAPI.prompt (async)
   --------------------------- */
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showDomPrompt(message = "", defaultValue = "") {
  return new Promise((resolve) => {
    try {
      if (document.getElementById("__electron_prompt_overlay__")) {
        resolve(null);
        return;
      }

      const overlay = document.createElement("div");
      overlay.id = "__electron_prompt_overlay__";
      overlay.style.position = "fixed";
      overlay.style.left = "0";
      overlay.style.top = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.zIndex = "999999";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.background = "rgba(0,0,0,0.35)";
      overlay.innerHTML = `
        <div id="__electron_prompt_box__" style="
            width: 420px;
            max-width: 90%;
            background: #fff;
            border-radius: 8px;
            padding: 14px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
          ">
          <div style="margin-bottom:8px; color:#111; font-size:14px;">${escapeHtml(
            message
          )}</div>
          <input id="__electron_prompt_input__" value="${escapeHtml(defaultValue)}" style="
            width:100%;
            padding:8px 10px;
            font-size:14px;
            box-sizing:border-box;
            margin-bottom:10px;
          " />
          <div style="display:flex; gap:8px; justify-content:flex-end;">
            <button id="__electron_prompt_cancel__" style="padding:6px 10px;">Cancel</button>
            <button id="__electron_prompt_ok__" style="padding:6px 10px;">OK</button>
          </div>
        </div>
      `;

      function cleanup() {
        try { overlay.remove(); } catch (e) {}
        window.removeEventListener("keydown", onKeyDown);
      }

      function onKeyDown(e) {
        if (e.key === "Escape") { cleanup(); resolve(null); }
        else if (e.key === "Enter") {
          const val = document.getElementById("__electron_prompt_input__").value;
          cleanup();
          resolve(val);
        }
      }

      overlay.querySelector("#__electron_prompt_ok__").addEventListener("click", () => {
        const val = document.getElementById("__electron_prompt_input__").value;
        cleanup(); resolve(val);
      });

      overlay.querySelector("#__electron_prompt_cancel__").addEventListener("click", () => {
        cleanup(); resolve(null);
      });

      document.documentElement.appendChild(overlay);
      const inputEl = document.getElementById("__electron_prompt_input__");
      try { inputEl.focus(); inputEl.select(); } catch (e) {}
      window.addEventListener("keydown", onKeyDown);
    } catch (err) {
      console.error("[preload] showDomPrompt error:", err);
      resolve(null);
    }
  });
}

/* ---------------------------
   filesystem helpers
   --------------------------- */
function getFolderContents(folderPath) {
  try {
    if (!folderPath || !fs.existsSync(folderPath)) {
      console.warn(`[preload] getFolderContents: path does not exist: ${folderPath}`);
      return [];
    }
    const stat = fs.statSync(folderPath);
    if (!stat.isDirectory()) {
      console.warn(`[preload] getFolderContents: not a directory: ${folderPath}`);
      return [];
    }
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });
    const result = entries.map((dirent) => {
      const name = dirent.name;
      const fullPath = path.join(folderPath, name);
      let stats;
      try { stats = fs.statSync(fullPath); } catch (err) {
        console.error(`[preload] stat failed for ${fullPath}:`, err);
        stats = { isDirectory: () => dirent.isDirectory(), isFile: () => dirent.isFile(), size: 0, mtime: null };
      }
      return {
        id: fullPath,
        name,
        path: fullPath,
        type: stats.isDirectory() ? "folder" : "file",
        size: stats.isFile() ? stats.size : undefined,
        modified: stats.mtime ? stats.mtime.toISOString() : null,
        children: stats.isDirectory() ? [] : undefined,
      };
    });
    console.log(`[preload] read ${result.length} items from: ${folderPath}`);
    return result;
  } catch (err) {
    console.error(`[preload] getFolderContents error for ${folderPath}:`, err);
    return [];
  }
}

/* ---------------------------
   expose electronAPI (no collisions)
   --------------------------- */
contextBridge.exposeInMainWorld("electronAPI", {
  // prompt exposed here (async)
  prompt: async (message, defaultValue) => await showDomPrompt(message, defaultValue),

  // folder picker (main)
  selectFolder: () => ipcRenderer.invoke("select-folder"),

  // read folder (sync in preload)
  readFolder: (folderPath) => getFolderContents(folderPath),

  // open file
  openPath: async (filePath) => {
    try {
      const res = await shell.openPath(filePath);
      if (res) console.warn(`[preload] shell.openPath returned message: ${res}`);
      return res;
    } catch (err) {
      console.error(`[preload] openPath error for ${filePath}:`, err);
      return err.message || String(err);
    }
  },

  // show in folder
  showItemInFolder: async (filePath) => {
    try {
      const ok = shell.showItemInFolder(filePath);
      console.log(`[preload] showItemInFolder(${filePath}) => ${ok}`);
      return ok;
    } catch (err) {
      console.error(`[preload] showItemInFolder error for ${filePath}:`, err);
      return false;
    }
  },

  // debug
  debugLog: (message) => {
    try { console.log(`[renderer -> preload] ${message}`); } catch (e) {}
  },
});
