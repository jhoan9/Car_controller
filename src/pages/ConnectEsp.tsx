import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const ConnectEsp: React.FC = () => {
  const [actived, setActived] = useState(false);

  const [errorMessage, setErrorMessage] = useState(false);

  const sendMessageHttp = async (data: string) => {
    await fetch('http://192.168.80.93' + "/" + data).then((response) => {
      console.log(" This is a response " + response)
    })
  }

  async function getDataFromESP32(state: string) {
    try {
      await axios.create({
        baseURL: "http://192.168.80.93",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
      const response = await axios.get("http://192.168.80.93/" + state);

      console.log("AAAAA******* " + response.headers);

      //console.log("This is a" + response.get("http://192.168.80.93/"+state));
      setErrorMessage(false);
    } catch (error) {
      console.error("This is a " + error);
      setErrorMessage(true);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Conectar a Esp32</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonButton onClick={() => {sendMessageHttp("hello")}}>Here</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ConnectEsp;
