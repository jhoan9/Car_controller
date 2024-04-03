import { useEffect, useState } from "react";


let recognition: any = null;
if("webkitSpeechRecognition" in window){
    //recognition = new any();
    recognition.continuous = true;
    recognition.lang = 'es-ES';
}

interface CapturedText {
    id: number;
    text: string;
    timestamp: number;
}

const UseSpeechRecognition = () => {
    const [text, setText] = useState("");
    const [textList, setTextList] = useState<CapturedText[]>([]);
    const [isListening, setIslistening] = useState(false);

    useEffect(() => {

        if(!recognition)return;
        recognition.onresult = (event: any) => {
            console.log("on Result event: ", event);
            const newText = event.results[0][0].transcript;
            const newCapturedText: CapturedText = {
                id: Date.now(), 
                text: newText,
                timestamp: Date.now()
            };
            setText(newText);
            setTextList(prevList => [...prevList, newCapturedText]);
            recognition.stop();
            setIslistening(false);
        }
    }, [])

    const startListening = () => {
        setText('');
        setIslistening(true);
        recognition.start();
    }

    const stopoListening = () => {
        setIslistening(false);
        recognition.stop();
    }

    return{
        text,
        textList,
        isListening,
        startListening,
        stopoListening,
        hasRecognitionSupport: !!recognition
    }
};


export default UseSpeechRecognition;