import {
   // Componentes Ionic UI
  IonAlert,
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
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";

import microphoneStart from "./mic-outline.svg"; // Icono para iniciar grabación
import microphoneEnd from "./mic-off-outline.svg"; // Icono para detener grabación
import martillo from "./martillo.jpg"; // Imagen del martillo de Thor

import { useEffect, useState } from "react";
import { RecordingData, VoiceRecorder } from "capacitor-voice-recorder"; // Plugin de grabación de voz para Capacitor
import { ref, set, update } from "firebase/database"; // Firebase para almacenar datos
import { database } from "../../Database/config"; // Configuración de la base de datos de Firebase
import CryptoJS from "crypto-js"; // Librería para encriptación (opcional)

// Interfaces para definir la estructura de los datos
interface dataText {
  id: number;
  text: string; // Texto transcrito
}

interface dataB64 {
  id: number;
  base64: string; // Audio en formato Base64
}

interface speechToText {
  config: {
    encoding: string; // Codificación del audio
    sampleRateHertz: number; // Frecuencia de muestreo
    languageCode: string; // Idioma del reconocimiento
  };
  audio: {
    content: string; // Audio en formato Base64
  };
}

const Hammer: React.FC = () => {
    // Estados para controlar la grabación y visualización
    const [isRecording, setIsRecording] = useState(false); // Indica si se está grabando
    const [audioBlob, setAudioBlob] = useState<RecordingData | null>(null); // Objeto con los datos de grabación
    const [audioBlobs, setAudioBlobs] = useState<RecordingData[]>([]); // Lista de objetos de grabación
    const [textList, setListText] = useState<dataText[]>([]); // Lista de textos transcritos
    const listCommand = ["encender", "1", "soy digno"]; // Lista de comandos posibles
    const [comandVoz, setComandVoz] = useState(false); // Indica si se activó el comando por voz
    const [stateButtonOff, setStateButtonOff] = useState("1"); // Valor inicial del segmento para "No Soy Digno"
    const [stateButtonOn, setStateButtonOn] = useState("0"); // Valor inicial del segmento para "Soy Digno"
    const [showAlert, setShowAlert] = useState(false); // Indica si se muestra la alerta de permisos

  // Referencia a la base de datos de Firebase
  const dbRef = ref(database, "comando"); // Referencia al nodo "comando"

  // Función para controlar la grabación (iniciar/detener)
  const controllerRecord = async () => {
    console.log("controllerRecord ", isRecording);
    if (isRecording) {
      await endRecord(); // Detener grabación
    } else {
      await startRecord(); // Iniciar grabación
    }
  };

  /**
 * Función asincrónica para consumir la API de Google Speech-to-Text.
 * Desencripta la clave API, realiza una solicitud a la API de Google y maneja la respuesta.
 * @param {dataB64} base64Audio Objeto que contiene el audio en formato Base64.
 */
const consumeApiGoogle = async (base64Audio: dataB64) => {
  // Clave secreta para desencriptar la clave API (¡reemplace con su propia clave secreta!)
  const secretKey = "key.api.1.asdf.jklnfsfadaffadafq";

  // Desencriptar la clave API
  var bytes = CryptoJS.AES.decrypt(
      "U2FsdGVkX1/8DPA/1aOLDVk9wgjfHQ/3lONC2BhqcLxy2p0Pv1fNKiwi48RLZQ61LCbx/RxwJ9qtFJ4Astn5zg==",
      secretKey
  );
  var key = bytes.toString(CryptoJS.enc.Utf8);
  try {
      const apiKey = key; // Clave API obtenida después de desencriptar

      // Configuración de la solicitud a la API de Google Speech-to-Text
      const req: speechToText = {
          config: {
              encoding: "WEBM_OPUS", // Formato de codificación del audio
              sampleRateHertz: 48000, // Frecuencia de muestreo del audio
              languageCode: "es-ES", // Código de idioma del audio
          },
          audio: { content: base64Audio.base64 }, // Contenido del audio en formato Base64
      };

      // Registrar información de la solicitud y datos del audio
      console.log("request base 64", base64Audio);
      console.log("Req .. ", JSON.stringify(req));

      // Realizar la solicitud POST a la API de Google Speech-to-Text
      const response = await fetch(
          `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
          {
              method: "POST", // Método de la solicitud
              body: JSON.stringify(req), // Cuerpo de la solicitud con datos de audio
          }
      );

      // Registrar la respuesta de la API
      console.log("jsonResponse 1 ", JSON.stringify(response));

      // Parsear la respuesta JSON de la API
      const jsonResponse = await response.json();

      // Extraer el texto reconocido del audio (si existe)
      const answer = jsonResponse?.results?.[0]?.alternatives?.[0]?.transcript || "";
      console.log("Response estructurada " + answer);

      // Actualizar la lista de textos transcritos
      setListText((prevTextList) => [
          ...prevTextList,
          { id: Date.now(), text: answer },
      ]);

      // Enviar el comando reconocido a la función addComand
      addComand(answer);

      // Enviar un mensaje de actualización a la base de datos Firebase después de 1 segundo (opcional)
      setTimeout(() => {
          let data = {
              message: 0, // Valor del mensaje (modificar según necesidades)
          };
          update(dbRef, data);
      }, 1000);
  } catch (error) {
      // Manejar errores en caso de fallo en la solicitud
      console.error("Error al realizar la solicitud:", error);
  }
};


 /**
 * Función asincrónica para iniciar la grabación de audio.
 * Solicita permiso de grabación de audio, inicia la grabación y actualiza el estado de grabación.
 */
const startRecord = async () => {
  try {
      // Solicitar permiso de grabación de audio
      const permission = await VoiceRecorder.requestAudioRecordingPermission();

      // Verificar si el permiso fue denegado
      if (!permission.value) {
          // Mostrar alerta si el permiso fue denegado
          setShowAlert(true);
          return;
      }

      // Iniciar la grabación de audio
      await VoiceRecorder.startRecording();

      // Actualizar el estado de grabación
      setIsRecording(true);
  } catch (error) {
      // Manejar errores en caso de fallo al iniciar la grabación
      console.error("Error al iniciar la grabación:", error);
  }
};

  

  /**
 * Función asincrónica para detener la grabación de audio.
 * Detiene la grabación, actualiza el estado de grabación y envía el audio grabado para procesamiento.
 */
const endRecord = async () => {
  try {
      // Detener la grabación de audio y obtener los datos grabados
      const recordingData = await VoiceRecorder.stopRecording();

      // Registrar en la consola que la grabación se detuvo
      console.log("Recording stopped:", recordingData.value.mimeType);

      // Almacenar los datos de grabación en el estado de audioBlob
      setAudioBlob(recordingData);

      // Extraer el contenido Base64 del audio grabado
      const inputBase64 = recordingData.value.recordDataBase64;

      // Crear un objeto con el contenido Base64 del audio
      const audioEncrypt: dataB64 = {
          id: Date.now(), // ID único basado en la fecha y hora actual
          base64: inputBase64 // Contenido Base64 del audio grabado
      };

      // Almacenar los datos de audio grabado en el estado audioBlobs
      setAudioBlobs((prevAudioBlobs) => [...prevAudioBlobs, recordingData]);

      // Actualizar el estado de grabación a falso (grabación finalizada)
      setIsRecording(false);

      // Enviar el audio grabado para su procesamiento mediante la API de Google Speech-to-Text
      consumeApiGoogle(audioEncrypt);
  } catch (error) {
      // Manejar errores en caso de fallo al detener la grabación
      console.error("Error stopping recording:", error);
  }
};


  /**
 * Función para alternar entre el modo de comando por voz y el modo de comando por botón.
 * Cambia el estado de `comandVoz` entre verdadero y falso.
 */
const activeComand = () => {
  setComandVoz(!comandVoz);
};

/**
* Función para agregar un comando recibido.
* @param {string} command El comando recibido.
* Si el comando está incluido en la lista de comandos definida previamente, envía un mensaje de estado al servidor.
*/
const addComand = (command: string) => {
  // Verificar si el comando recibido está incluido en la lista de comandos definida previamente
  if (listCommand.includes(command)) {
      // Preparar un objeto de datos para enviar al servidor
      const data = {
          message: 1, // Mensaje de activación (1 para activar, 0 para desactivar)
      };

      // Actualizar la base de datos con el mensaje de activación
      update(dbRef, data);

      // Establecer el estado del botón de encendido en "1" (activo)
      setStateButtonOn("1");

      // Establecer el estado del botón de apagado en "0" (inactivo)
      setStateButtonOff("0");

      // Esperar 5 segundos y luego enviar un mensaje de desactivación al servidor
      setTimeout(() => {
          // Preparar un nuevo objeto de datos para enviar al servidor
          const data = {
              message: 0, // Mensaje de desactivación (0 para desactivar)
          };

          // Actualizar la base de datos con el mensaje de desactivación
          update(dbRef, data);

          // Restablecer el estado del botón de encendido a "0" (inactivo)
          setStateButtonOff("1");

          // Restablecer el estado del botón de apagado a "0" (inactivo)
          setStateButtonOn("0");
      }, 5000); // 5000 milisegundos (5 segundos) de espera

      // Manejar errores (si los hay)
      try {
          // Aquí puedes incluir código adicional para manejar los comandos recibidos
      } catch (error) {
          // Manejar errores (por ejemplo, si ocurre un error al procesar el comando)
          console.log("error ", error);
      }
  }
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Thor's Hammer</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonCard>
        <img alt="thor's hammer" src={martillo} />
        <IonCardHeader>
          <IonCardTitle></IonCardTitle>
          <IonCardSubtitle>Activar Comando por {comandVoz ? "botón" : "voz"}</IonCardSubtitle>
        </IonCardHeader>

        <IonToggle onClick={activeComand}>
        </IonToggle>
      </IonCard>
      <IonContent>

        <IonCardContent>
          {comandVoz ? (<>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Comando Con Voz</IonCardTitle>
                <IonCardSubtitle>Graba tu voz aqui</IonCardSubtitle>
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
                {showAlert && (
                  <IonAlert
                    isOpen={showAlert} // Add isOpen property with value of showAlert
                    header="Mic Permissions Required"
                    message="The app needs microphone access to record your voice. Please grant permission in your settings."
                    buttons={['Settings', 'Cancel']}
                    onDidDismiss={() => setShowAlert(false)} // Hide alert on dismiss
                  />
                )}

              </IonCardContent>
            </IonCard>
          </>) : (<>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Comando Con Boton</IonCardTitle>
                <IonCardSubtitle>Activa el comando</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                <IonSegment value={stateButtonOff}>
                  <IonSegmentButton onClick={() => addComand("0")} value={stateButtonOff}>
                    <IonLabel>No Soy Digno</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton onClick={() => addComand("1")} value={stateButtonOn}>
                    <IonLabel>Soy Digno</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonCardContent>
            </IonCard>
          </>)}
        </IonCardContent>
      </IonContent>
    </IonPage>
  );
};

export default Hammer;
