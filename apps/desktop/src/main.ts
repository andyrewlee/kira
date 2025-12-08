import { app, BrowserWindow, shell, Menu, ipcMain, dialog, type MenuItemConstructorOptions } from "electron";
import path from "node:path";
import fs from "node:fs";
import http from "node:http";
import https from "node:https";
import mm from "music-metadata";

const isDev = process.env.NODE_ENV !== "production";
const DEV_URL = process.env.ELECTRON_DEV_URL || process.env.VITE_DEV_SERVER_URL || "http://localhost:5173";
const PROD_INDEX = path.join(__dirname, "../../web/dist/index.html");
const DESKTOP_QUERY = "desktop=1";
let mainWindow: BrowserWindow | null = null;

async function waitForDevServer(urlString: string, timeoutMs: number = 8000): Promise<boolean> {
  return new Promise((resolve) => {
    const url = new URL(urlString);
    const lib = url.protocol === "https:" ? https : http;
    const req = lib
      .get(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
          timeout: 2000,
        },
        (res) => {
          res.resume();
          resolve(res.statusCode !== undefined && res.statusCode >= 200 && res.statusCode < 500);
        }
      )
      .on("error", () => resolve(false));

    const timer = setTimeout(() => {
      req.destroy();
      resolve(false);
    }, timeoutMs);

    req.on("close", () => clearTimeout(timer));
  });
}

async function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow = win;

  const loadFileFallback = async () => {
    if (!fs.existsSync(PROD_INDEX)) {
      const msg = `Missing web build at ${PROD_INDEX}. Run "npm run build -w @kira/web" first.`;
      console.error(msg);
      win.loadURL(`data:text/plain,${encodeURIComponent(msg)}`);
      return;
    }
    try {
      await win.loadFile(PROD_INDEX, { query: { desktop: "1" } });
    } catch (err) {
      console.error("Failed to load local build", err);
    }
  };

  if (isDev) {
    const url = new URL(DEV_URL);
    url.searchParams.set("desktop", "1");
    const ready = await waitForDevServer(url.toString());
    if (ready) {
      await win.loadURL(url.toString());
    } else {
      console.warn(`Dev server not reachable at ${DEV_URL}, falling back to file build`);
      await loadFileFallback();
    }
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    await loadFileFallback();
  }

  win.webContents.on("did-fail-load", async (_e, code, desc) => {
    console.error("Renderer failed to load", code, desc);
    await loadFileFallback();
  });

  const safeOrigins = new Set<string>();
  if (!isDev) {
    safeOrigins.add("file:");
  } else {
    const origin = new URL(DEV_URL).origin;
    safeOrigins.add(origin);
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    const origin = new URL(url).origin;
    if (safeOrigins.has(origin)) {
      return { action: "allow" };
    }
    shell.openExternal(url);
    return { action: "deny" };
  });

  win.webContents.on("will-navigate", (event, url) => {
    const origin = new URL(url).origin;
    if (!safeOrigins.has(origin)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  return win;
}

function buildMenu() {
  const template: MenuItemConstructorOptions[] = [
    ...(process.platform === "darwin"
      ? [
          {
            label: app.name,
            submenu: [{ role: "about" }, { type: "separator" }, { role: "services" }, { type: "separator" }, { role: "hide" }, { role: "hideOthers" }, { role: "unhide" }, { type: "separator" }, { role: "quit" }],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [{ role: "quit" }],
    },
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: () => mainWindow?.reload(),
        },
        {
          label: "Force Reload",
          accelerator: "CmdOrCtrl+Shift+R",
          click: () => mainWindow?.webContents.reloadIgnoringCache(),
        },
        {
          label: "Toggle Developer Tools",
          accelerator: process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
          click: () => mainWindow?.webContents.toggleDevTools(),
        },
      ],
    },
    {
      role: "window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
    {
      role: "help",
      submenu: [
        {
          label: "Kira Docs",
          click: () => shell.openExternal("https://kira.example.com"),
        },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    buildMenu();
    createWindow();

    ipcMain.handle("kira:get-version", () => app.getVersion());
    ipcMain.handle("kira:open-logs", async () => {
      const logsDir = app.getPath("userData");
      await shell.openPath(logsDir);
      return logsDir;
    });
    ipcMain.handle("kira:check-file", async (_event, filePath: string) => {
      if (!filePath) return false;
      try {
        await fs.promises.access(filePath, fs.constants.R_OK);
        return true;
      } catch {
        return false;
      }
    });
    ipcMain.handle("kira:select-audio-file", async () => {
      const result = await dialog.showOpenDialog(mainWindow!, {
        title: "Select audio file",
        properties: ["openFile"],
        filters: [{ name: "Audio", extensions: ["mp3", "wav", "m4a", "flac"] }],
      });
      if (result.canceled || result.filePaths.length === 0) return null;
      return result.filePaths[0];
    });
    ipcMain.handle("kira:load-audio-file", async () => {
      const result = await dialog.showOpenDialog(mainWindow!, {
        title: "Load audio file",
        properties: ["openFile"],
        filters: [{ name: "Audio", extensions: ["mp3", "wav", "m4a", "flac"] }],
      });
      if (result.canceled || result.filePaths.length === 0) return null;
      const filePath = result.filePaths[0];
      try {
        await fs.promises.access(filePath, fs.constants.R_OK);
        const data = await fs.promises.readFile(filePath);
        const base64 = data.toString("base64");
        const ext = path.extname(filePath).replace(".", "").toLowerCase();
        let durationSec: number | undefined = undefined;
        try {
          const meta = await mm.parseBuffer(data, { mimeType: undefined, size: data.byteLength });
          durationSec = meta.format.duration;
        } catch (err) {
          console.warn("Failed to parse audio duration", err);
        }
        return { path: filePath, base64, ext, size: data.byteLength, durationSec };
      } catch (err) {
        console.error("Failed to read audio file", err);
        return null;
      }
    });
    ipcMain.handle("kira:load-audio-path", async (_event, filePath: string) => {
      if (!filePath) return null;
      try {
        await fs.promises.access(filePath, fs.constants.R_OK);
        const data = await fs.promises.readFile(filePath);
        const base64 = data.toString("base64");
        const ext = path.extname(filePath).replace(".", "").toLowerCase();
        let durationSec: number | undefined = undefined;
        try {
          const meta = await mm.parseBuffer(data, { mimeType: undefined, size: data.byteLength });
          durationSec = meta.format.duration;
        } catch (err) {
          console.warn("Failed to parse audio duration", err);
        }
        return { path: filePath, base64, ext, size: data.byteLength, durationSec };
      } catch (err) {
        console.error("Failed to read audio path", err);
        return null;
      }
    });
  });

  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
