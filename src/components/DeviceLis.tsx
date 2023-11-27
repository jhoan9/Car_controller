import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { bluetoothSharp } from "ionicons/icons";

interface DevicesListProps {
  message: string;
  isBtEnabled: boolean;
  isNative: boolean;
  devices: { deviceId: string; name?: string }[];
  connectBt: (device: { deviceId: string; name?: string }) => void;
}

const DeviceList: React.FC<DevicesListProps> = ({
  message,
  isBtEnabled,
  isNative,
  devices,
  connectBt,
}) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonToolbar>
          <IonTitle slot="end">{message}</IonTitle>
          {isBtEnabled || message === "Error" ? (
            <IonIcon slot="end" color="warning" icon={bluetoothSharp} />
          ) : (
            <IonIcon slot="end" color="danger" icon={bluetoothSharp} />
          )}
        </IonToolbar>
        {!isNative && (
          <IonLabel color="danger">
            Web Bluetooth is experimental on this platform.
            <a
              rel="noreferrer"
              target="_blank"
              href="https://github.com/WebBluetoothCG/web-bluetooth/blob/main/implementation-status.md"
            >
              See here
            </a>
          </IonLabel>
        )}
      </IonCardHeader>
      <IonCardContent>
        <IonList>
          {devices.map((device) => {
            return (
              <IonItem
                button
                key={device.deviceId}
                onClick={() => connectBt(device)}
              >
                {device.name ? (
                  <IonLabel>{device.name}</IonLabel>
                ) : (
                  <IonLabel>{device.deviceId}</IonLabel>
                )}
              </IonItem>
            );
          })}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default DeviceList;
