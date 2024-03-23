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
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import microphoneStart from "./mic-outline.svg";
import microphoneEnd from "./mic-off-outline.svg";
import { useEffect, useState } from "react";
import { RecordingData, VoiceRecorder } from "capacitor-voice-recorder";

const Hammer: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [countSeconds, setCountSeconds] = useState<number>(0);
  const [audioBlob, setAudioBlob] = useState<RecordingData | null>(null);

  useEffect(() => {
    setCountSeconds(countSeconds + 1);
    console.log("startRecord ", countSeconds);
  }, []);

  const controllerRecord = async () => {
    console.log("controllerRecord ", isRecording);
    if (isRecording) {
      await endRecord();
    } else {
      await startRecord();
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
      const recordingData: RecordingData = await VoiceRecorder.stopRecording();
      console.log("Recording stopped:", recordingData);
      setAudioBlob(recordingData);
      setIsRecording(false);
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  };

  const playAudio = () => {
    if (audioBlob) {
      try {
        // Decodificar el base64 y convertirlo en un ArrayBuffer
        const binaryData = atob(audioBlob.value.recordDataBase64);
        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryData.length; i++) {
          uint8Array[i] = binaryData.charCodeAt(i);
        }
  
        // Crear un Blob a partir del ArrayBuffer
        const blob = new Blob([arrayBuffer], { type: audioBlob.value.mimeType });
  
        // Crear URL de objeto y reproducir audio
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.play();
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl); // Liberar recursos después de reproducir
        };
      } catch (error) {
        console.error("Error playing audio:", error);
      }
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
              {isRecording && <progress value={countSeconds} max={100} />}
              <IonButton onClick={playAudio}>Reproducir grabación</IonButton>
            </IonCardContent>
          </IonCard>
        </IonCardContent>
      </IonContent>
    </IonPage>
  );
};

export default Hammer;
