import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.hiddenVault.SlokaRecitation",
  appName: "Sloka Recitation",
  webDir: "build",
  // Development server (uncomment for live reload during development)
  // server: {
  //   url: "http://192.168.0.62:3000",
  //   cleartext: true,
  // },
  plugins: {
    Preferences: {
      permissions: ["audio"]
    },
    Share: {
      permissions: ["photos", "audio"]
    },
    Filesystem: {
      permissions: ["storage"]
    }
  }
};

export default config;
