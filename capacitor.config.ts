import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.madhur1600.SlokaRecitation",
  appName: "Sloka Recitation",
  webDir: "build",
  // server: {
  //   url: "http://192.168.210.246",
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
