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

import { SpeechRecognition } from "@capacitor-community/speech-recognition";

interface dataText {
  id: number;
  text: string;
}

const Hammer: React.FC = () => {
  const [countSeconds, setCountSeconds] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [text, setText] = useState("");
  const [listText, setListText] = useState<dataText[]>([]);

 /* useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRecording) {
      // Iniciar un intervalo que incremente countSeconds cada segundo
      intervalId = setInterval(() => {
        setCountSeconds((prevSeconds) => prevSeconds + 2);
      }, 1000);
    } else {
      // Limpiar el intervalo cuando no estás grabando audio
      if (intervalId) {
        clearInterval(intervalId);
        setCountSeconds(0);
      }
    }
    // Limpiar el intervalo cuando el componente se desmonta o isListening cambia
    return () => clearInterval(intervalId || undefined);
  }, [isRecording]);*/

  useEffect(() => {
    console.log("Lista de textos actualizada:", text);
  }, [text]);

  const controllerRecord = () => {
    if (isRecording) {
      endRecord();
    } else {
      setCountSeconds(0);
      startRecord();
    }
  };

  const startRecord = async () => {
    setIsRecording(true);
    startSpeechRecognition();
  };

  const endRecord = async () => {
    stopSpeechRecognition();
    setIsRecording(false);
  };

  const startSpeechRecognition = async () => {
    try {
      // Verificar si el reconocimiento de voz está disponible
      const available = await SpeechRecognition.available();
      if (!available) {
        console.log(
          "El reconocimiento de voz no está disponible en este dispositivo."
        );
        setText(
          "El reconocimiento de voz no está disponible en este dispositivo."
        );
        return;
      }

      // Iniciar el reconocimiento de voz
      await SpeechRecognition.start({
        language: "es-ES",
        partialResults: true,
        popup: false,
      });

      console.log("Reconocimiento de voz iniciado.");      

      // Escuchar los resultados parciales
      SpeechRecognition.addListener("partialResults", (data: any) => {
        console.log("Partial results: ...", data.value);
        const newText = data.value;
        setText(newText);
      });

      setTimeout(() => {}, 3000); // Retraso de 1 segundo (1000 milisegundos)

      const newCapturedText: dataText = {
        id: Date.now(),
        text: text
      };
      setListText((prev) => [...prev, newCapturedText]);
      console.log("Reconocimiento de voz iniciado.");
    } catch (error) {
      console.error("Error al iniciar el reconocimiento de voz:", error);
    }
  };

  const stopSpeechRecognition = async () => {
    try {
      // Detener el reconocimiento de voz
      await SpeechRecognition.stop();

      // Eliminar todos los listeners
      //SpeechRecognition.removeAllListeners();

      console.log("Reconocimiento de voz detenido.");
    } catch (error) {
      console.error("Error al detener el reconocimiento de voz:", error);
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
              {/*isRecording && <progress value={countSeconds} max={50} />*/}
              {<p>{text}</p>}
              {listText.map((index) => (
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
