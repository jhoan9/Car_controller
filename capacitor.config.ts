import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'car.controller.app',
  appName: 'Car Controller',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: 'Scanning...',
        cancel: "Cancel",
        availableDevices: "Available devices",
        noDeviceFound: "No device found"
      }
    },
    CapacitorHttp: {
      enabled: true,
    },
  }
};

export default config;
