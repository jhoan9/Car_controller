import { IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonLabel, IonList, IonRow, IonTitle } from "@ionic/react";
import React from "react";

interface Props {
    services: { 
      uuid: string; 
      characteristics: { 
        uuid: string;
        properties: { 
          read: boolean; 
          notify: boolean; 
          write: boolean;
        }; 
      }[];
    }[];
    handleServiceSelect: (service: { uuid: string }) => void;
  }

const ServicesBlue: React.FC<Props> = ({
  services, 
  handleServiceSelect,
}) => {
    return(
        <IonList>
      {services.map((service) => {
        return (
          <IonCard
            button
            onClick={() => handleServiceSelect(service)}
            key={service.uuid}
          >
            <IonCardHeader>
              <IonLabel color="success" text-wrap>
                {service.uuid}
              </IonLabel>
            </IonCardHeader>
            <IonCardContent>
              {service.characteristics.map((chx) => {
                return (
                  <IonGrid key={chx.uuid}>
                    <IonRow className="ion-justify-content-center">
                      <IonCol size="12" size-xs>
                        <IonTitle color="primary" size="small" text-wrap>
                          {chx.uuid}
                        </IonTitle>
                      </IonCol>
                    </IonRow>
                    <IonRow className="ion-justify-content-center">
                      <IonCol size="12" size-xs>
                        <IonLabel
                          color={chx.properties.read ? "primary" : "medium"}
                        >
                          | read | 
                        </IonLabel>
                        <IonLabel
                          color={chx.properties.notify ? "primary" : "medium"}
                        >
                          | notify | 
                        </IonLabel>
                        <IonLabel
                          color={chx.properties.write ? "primary" : "medium"}
                        >
                          | write |
                        </IonLabel>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                );
              })}
            </IonCardContent>
          </IonCard>
        );
      })}
    </IonList>
    );
};

export default ServicesBlue;
