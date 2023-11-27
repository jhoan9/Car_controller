import { IonButton, IonCardContent, IonIcon } from "@ionic/react";
import { refreshOutline } from "ionicons/icons";
import React from "react";

interface TopBarProps {
    isBtEnabled: boolean;
    scanBt: () => void;
    reset: () => void;
  }

const TopBar: React.FC<TopBarProps> = ({
    isBtEnabled,
    scanBt,
    reset,
}) => {
    return(
        <IonCardContent>
            <IonButton
                disabled={!isBtEnabled}
                fill="outline"
                onClick={() => scanBt()}
            >
                Scan
            </IonButton>
            <IonButton
                onClick={() => reset()}
            >
                <IonIcon icon={refreshOutline}/>
            </IonButton>
        </IonCardContent>
    );
};

export default TopBar;
