declare global {
  interface Window {
    kiraDesktop?: {
      isDesktop: boolean;
      getVersion?: () => Promise<string>;
      openLogs?: () => Promise<string>;
      selectAudioFile?: () => Promise<string | null>;
      loadAudioFile?: () => Promise<{ path: string; base64: string; ext: string; size?: number; durationSec?: number } | null>;
      checkFile?: (path: string) => Promise<boolean>;
    };
  }
}

export {};
