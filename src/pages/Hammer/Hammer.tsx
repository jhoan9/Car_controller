import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import microphoneStart from "./mic-outline.svg";
import microphoneEnd from "./mic-off-outline.svg";
import { useEffect, useState } from "react";
import { RecordingData, VoiceRecorder } from "capacitor-voice-recorder";
import { ref, update } from "firebase/database";
import { database } from "../../Database/config";
import CryptoJS from "crypto-js";

interface dataText {
  id: number;
  text: string;
}

const connectionConfig = {
  timeout: 10000, // tiempo de espera de 10 segundos
};

const Hammer: React.FC = () => {
  const [countSeconds, setCountSeconds] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<RecordingData | null>(null);
  const [audioBlobs, setAudioBlobs] = useState<RecordingData[]>([]);
  const [textList, setListText] = useState<dataText[]>([]);
  const [textCommand, setTextCommando] = useState(["apagar", "encender"]);

  const dbRef = ref(database, "comando"); // Update the "value" node

  useEffect(() => {}, []);

  const controllerRecord = () => {
    console.log("controllerRecord ", isRecording);
    if (isRecording) {
      endRecord();
    } else {
      setCountSeconds(0);
      startRecord();
    }
  };

  const consumeApiGoogle = async (id: string) => {
    const secretKey = "key.api.1.asdf.jklnfsfadaffadafq";
    // Decrypt
    var bytes  = CryptoJS.AES.decrypt('U2FsdGVkX1/8DPA/1aOLDVk9wgjfHQ/3lONC2BhqcLxy2p0Pv1fNKiwi48RLZQ61LCbx/RxwJ9qtFJ4Astn5zg==', secretKey);
    var key = bytes.toString(CryptoJS.enc.Utf8);
    try {
      const apiKey = key // Replace with your API key
      const HttpBody1 = JSON.stringify({
        config: {
          encoding: "ENCODING_UNSPECIFIED",
          sampleRateHertz: 48000,
          languageCode: "es-ES",
        },
        audio: { content: id },
      });
      console.log("HttpBody1 ", id);
      const response = await fetch(
        `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: HttpBody1,
        }
      );
      const jsonResponse = await response.json();
      const answer =
        jsonResponse?.results?.[0]?.alternatives?.[0]?.transcript || "";
      setListText((prevTextList) => [
        ...prevTextList,
        { id: Date.now(), text: answer },
      ]);
      addComand(answer);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const startRecord = async () => {
    try {
      await VoiceRecorder.requestAudioRecordingPermission();
      await VoiceRecorder.startRecording();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const endRecord = async () => {
    try {
      const recordingData = await VoiceRecorder.stopRecording();
      console.log("Recording stopped:", recordingData.value.mimeType);
      setAudioBlob(recordingData);
      consumeApiGoogle(recordingData.value.recordDataBase64);
      setAudioBlobs((prevAudioBlobs) => [...prevAudioBlobs, recordingData]);
      setIsRecording(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  /**
   *
   *
   *
   * BlueTooth
   *
   *
   */

  const addComand = (command: String) => {
    if (command == "apagar") {
      let data = {
        message: 0,
      };
      update(dbRef, data);
    } else if (command == "encender") {
      let data = {
        message: 1,
      };
      update(dbRef, data);
    }
    try {
    } catch (error) {
      console.log("error ", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Hammer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCardContent>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Grabar Voz</IonCardTitle>
              <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
            </IonCardHeader>

            <IonCardContent>
              <IonButton onClick={controllerRecord}>
                <IonIcon
                  icon={isRecording ? microphoneEnd : microphoneStart}
                ></IonIcon>
                {isRecording ? "Detener" : "Grabar"}
              </IonButton>
              {textList.map((index) => (
                <IonItem key={index.id}>{index.text}</IonItem>
              ))}
            </IonCardContent>
          </IonCard>
        </IonCardContent>
      </IonContent>
    </IonPage>
  );
};

export default Hammer;
