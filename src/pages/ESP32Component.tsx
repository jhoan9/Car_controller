import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import { BluetoothSerial } from "@ionic-native/bluetooth-serial";
import {WifiWizard2} from "@ionic-native/wifi-wizard-2";

const ESP32Component: React.FC = () => {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [wifiConnected, setWifiConnected] = useState(false);

  useEffect(() => {
    BluetoothSerial.isEnabled().then((isEnabled) => {
      setBluetoothEnabled(isEnabled);
    });
    WifiWizard2.isWifiEnabled().then((isEnabled) => {
        setWifiEnabled(isEnabled);
    });
  }, []);

  const handleBluetoothConnect = async () => {
    try {
      await BluetoothSerial.connect("00:00:00:00:00:00");
      setBluetoothConnected(true);
      console.log("Connected to ESP32 via Bluetooth");
    } catch (error) {
      console.log("Error connecting to ESP32 via Bluetooth", error);
    }
  };

  const handleBluetoothDisconnect = async () => {
    try {
      await BluetoothSerial.disconnect();
      setBluetoothConnected(false);
      console.log("Disconnected from ESP32 via Bluetooth");
    } catch (error) {
      console.log("Error disconnecting from ESP32 via Bluetooth", error);
    }
  };

  const handleWifiConnect = async () => {
    try {
      //await Wifi.connect("MyWiFiNetwork", "MyPassword");
      await WifiWizard2.connect("301", true, "123456789");
      setWifiConnected(true);
      console.log("Connected to MyWiFiNetwork via Wi-Fi");
    } catch (error) {
      console.log("Error connecting to MyWiFiNetwork via Wi-Fi", error);
    }
  };

  const handleWifiDisconnect = async () => {
    try {
      await WifiWizard2.disconnect("MyWiFiNetwork");
      setWifiConnected(false);
      console.log("Disconnected from MyWiFiNetwork via Wi-Fi");
    } catch (error) {
      console.log("Error disconnecting from MyWiFiNetwork via Wi-Fi", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>ESP32 Component</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton
          disabled={!bluetoothEnabled}
          onClick={handleBluetoothConnect}
        >
          Connect to ESP32 via Bluetooth
        </IonButton>
        <IonButton
          disabled={!bluetoothConnected}
          onClick={handleBluetoothDisconnect}
        >
          Disconnect from ESP32 via Bluetooth
        </IonButton>
        <IonButton disabled={!wifiEnabled} onClick={handleWifiConnect}>
          Connect to MyWiFiNetwork via Wi-Fi
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ESP32Component;
