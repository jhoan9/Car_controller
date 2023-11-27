import React from "react";
import { IonLoading } from "@ionic/react";

interface LoadingWrapperProps {
    loading: boolean;
  }

const Loading: React.FC<LoadingWrapperProps> = ({loading}) => {
    return(
        <IonLoading
            isOpen={loading}
            message={"Loading..."}
            duration={10000}
        />
    );
};

export default Loading;
