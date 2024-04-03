import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPage,
} from "@ionic/react";
import {
  BleClient,
  BleDevice,
  BleService,
} from "@capacitor-community/bluetooth-le";
import { Capacitor } from "@capacitor/core";
import Loading from "../../components/Loading";
import TopBar from "../../components/TopBar";
import DeviceList from "../../components/DeviceLis";
import "./BluetoothEsp.scss";
import arrowUp from "./up.svg";
import arrowDown from "./down.svg";
import arrowLeft from "./left.svg";
import arrowRight from "./right.svg";
import stop from "./stop.svg";

type DataType = { chx: string; type: string; bin?: string; ascii?: string };

const connectionConfig = {
  timeout: 10000, // tiempo de espera de 10 segundos
};

const BleTest: React.FC = () => {
  const [isNative, setIsNative] = useState(false);
  const [optionalService, setOptionalService] = useState("");
  const [prefixFilter, setPrefixFilter] = useState("");
  const [devices, setDevices] = useState<BleDevice[]>([]);
  const [services, setServices] = useState<BleService[]>([]);
  const [selectedDevice, setSelectedDevice] = useState({} as BleDevice);
  const [selectedService, setSelectedService] = useState<any>({});
  const [message, setMessage] = useState("BlueTooth No Habilitado");
  const [isBtEnabled, setIsBtEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [data, setData] = useState<DataType[]>([]);
  const [isAutonomo, setIsAutonomo] = useState(true);
  const [response, setResponse] = useState<string>();

  let stringTemperatura = "Temperatura (C): [TEMP]Cº";

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    getBtStatus();
  }, []);

  const getBtStatus = async () => {
    try {
      await BleClient.initialize();
      let isBtEnabled = await BleClient.isEnabled();
      setIsBtEnabled(isBtEnabled);
      if (!isBtEnabled) {
        setMessage("BT not enabled, or not supported!");
      }
    } catch (e) {
      console.log(e, "Bluetooth Unavailable");
    }
  };
  const scanBt = async () => {
    try {
      setDevices([]);
      setSelectedDevice({} as BleDevice);
      setData([]);
      setServices([]);
      setMessage("Scanning...");
      await BleClient.initialize();
      const devicesList = await BleClient.requestDevice({
        services: [],
        optionalServices: optionalService ? [optionalService] : [],
        namePrefix: prefixFilter ? prefixFilter : "",
      });
      setDevices([devicesList]);
      connectBt(devicesList);
    } catch (e) {
      console.log(e, "Scan Error");
    }
  };

  const connectBt = async (device: BleDevice) => {
    try {
      setMessage("Connecting...");
      setServices([]);
      setLoading(true);
      setData([]);
      setSelectedDevice(device);
      await BleClient.initialize();
      await BleClient.disconnect(selectedDevice.deviceId);
      await BleClient.connect(
        selectedDevice.deviceId,
        (id) => console.log(`Device ${id} disconnected!`),
        connectionConfig
      );
      await BleClient.getServices(selectedDevice.deviceId).then((srv) => {
        if (srv[0]) {
          setMessage("Connected");
          setServices(srv);
          setLoading(false);
          setIsConnected(true);
        } else {
          setMessage("No Services Found");
          setLoading(false);
          setIsConnected(false);
        }
      });
    } catch (e) {
      catchError(e, "Cannot Connect Error");
      console.log(e, "Cannot Connect Error");
    }
  };

  const autonomo = (enabled: string) => {
    if (enabled === "8") {
      setIsAutonomo(true);
      sendMessage(enabled);
    } else {
      setIsAutonomo(false);
      sendMessage(enabled);
    }
  };

  const sendMessage = async (data: string) => {
    const slctDvc = selectedDevice.deviceId;

    const dataString = data;
    const dataBuffer = new ArrayBuffer(dataString.length);
    const dtView = new DataView(dataBuffer);

    for (let i = 0; i < dataString.length; i++) {
      dtView.setUint8(i, dataString.charCodeAt(i));
    }

    let uno = "";
    let dos = "";

    try {
      for (let index = 0; index < services.length; index++) {
        uno = services[index].uuid;
        if (services[index].characteristics[0].properties.write) {
          console.log(
            "tHIS IS A WINNER " + services[index].characteristics[0].uuid
          );
          dos = services[index].characteristics[0].uuid;
          break;
        }
      }

      await BleClient.write(slctDvc, uno, dos, dtView);
      if (data === "5") {
        let value = await BleClient.read(slctDvc, uno, dos);
        const decoder = new TextDecoder("utf-8");
        const text: string = decoder.decode(value);
        defineDateTemperature(text);
      }
    } catch (error) {
      catchError(error, "No se pudo enviar el mensaje");
    }
  };

  const defineDateTemperature = (text: string) => {
    const currentDate: Date = new Date();

    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1; // Los meses comienzan desde 0, por lo que se suma 1
    const day: number = currentDate.getDate();

    const hour: number = currentDate.getHours();
    const minute: number = currentDate.getMinutes();
    const second: number = currentDate.getSeconds();

    const date: string =
      hour + ":" + minute + ":" + second + "|" + day + "/" + month + "/" + year;
    stringTemperatura = stringTemperatura.replace("[TEMP]", text);

    const currentTemp: string = stringTemperatura + "   " + date;
    setResponse(currentTemp);
  };

  const selectService = async (service: any) => {
    try {
      setData([]);
      setSelectedService(service);
      setShowTerminal(true);
    } catch (e) {
      console.log(e, "Select Service Error");
    }
  };

  const closeTerminal = async () => {
    try {
      setLoading(false);
      setShowTerminal(false);
    } catch (e) {
      console.log(e, "Error");
    }
  };

  const reset = async () => {
    try {
      await BleClient.initialize();
      setData([]);
      setDevices([]);
      setSelectedDevice({} as BleDevice);
      setServices([]);
      setPrefixFilter(localStorage.getItem("prefix") || "");
      setOptionalService(localStorage.getItem("optionalService") || "");
      setIsConnected(false);
      setLoading(false);
      getBtStatus();
    } catch (e) {
      console.log(e, "Cannot Disconnect Error");
    }
  };

  const catchError = (e: any, message: string) => {
    setMessage(message);
    setLoading(false);
    console.error(e);
  };

  useEffect(() => {
    const prefixFilter = localStorage.getItem("prefix");
    const optionalService = localStorage.getItem("optionalService");
    if (prefixFilter) {
      setPrefixFilter(prefixFilter);
    }
    if (optionalService) {
      setOptionalService(optionalService);
    }
    getBtStatus();
  }, []);

  const [intervalId, setIntervalId] = useState<number>();

  const handlePressDown = (press: string) => {
    const itvrl: any = setInterval(() => {
      sendMessage(press);
    }, 100);

    setIntervalId(itvrl);
  };

  const handlePressUp = () => {
    clearInterval(intervalId);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <TopBar
          isBtEnabled={isBtEnabled}
          scanBt={() => scanBt()}
          reset={() => reset()}
        />
        <DeviceList
          isNative={isNative}
          message={message}
          isBtEnabled={isBtEnabled}
          devices={devices}
          connectBt={(device) => connectBt(device)}
        />
        <Loading loading={loading} />
        {isConnected ? (
          <IonCard>
            <IonButton onClick={() => autonomo("8")}>Automatico</IonButton>
            <IonButton onClick={() => autonomo("9")}>Manual</IonButton>
          </IonCard>
        ) : (
          ""
        )}
        {isAutonomo ? (
          ""
        ) : (
          <IonCard>
            <IonCardContent>
              <div className="wrapper">
                <div className="wrapper-buttons left">
                  <div className="arrow left">
                    <IonIcon
                      onPointerDown={() => sendMessage("3")}
                      onPointerUp={handlePressUp}
                      className="button"
                      icon={arrowLeft}
                    ></IonIcon>
                  </div>
                  <div className="arrow down">
                    <IonIcon
                      onPointerDown={() => sendMessage("4")}
                      onPointerUp={handlePressUp}
                      className="button"
                      icon={arrowDown}
                    ></IonIcon>
                  </div>
                </div>
                <div className="center-button">
                  <IonIcon
                    onPointerDown={() => sendMessage("0")}
                    onPointerUp={handlePressUp}
                    className="center"
                    icon={stop}
                  ></IonIcon>
                </div>
                <div className="wrapper-buttons right">
                  <div className="arrow up">
                    <IonIcon
                      onPointerDown={() => sendMessage("1")}
                      onPointerUp={handlePressUp}
                      className="button"
                      icon={arrowUp}
                    ></IonIcon>
                  </div>
                  <div className="arrow right">
                    <IonIcon
                      onPointerDown={() => sendMessage("2")}
                      onPointerUp={handlePressUp}
                      className="button"
                      icon={arrowRight}
                    ></IonIcon>
                  </div>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        )}
        <IonCard>
          <IonCardContent>
            {isConnected ? (
              <>
                <IonButton onClick={() => sendMessage("5")}>
                  Temperatura
                </IonButton>
                <br />
                <IonCardTitle>{response}</IonCardTitle>
              </>
            ) : (
              ""
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};
export default BleTest;
