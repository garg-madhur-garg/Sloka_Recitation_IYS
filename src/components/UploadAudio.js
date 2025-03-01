import React, { useRef } from "react";
import { IonButton } from "@ionic/react";

const UploadAudio = (props) => {
  const inputRef = useRef(null);

  const pickDocument = async () => {
    // if (document.activeElement instanceof HTMLElement) {
    //   document.activeElement.blur();
    // }
    if (props.validateFields && !props.validateFields()) return;
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileToUpload = {
        name: file.name,
        size: file.size,
        uri: URL.createObjectURL(file),
        type: file.type,
      };
      if (props.setAudioUri) props.setAudioUri(fileToUpload.uri);
      if (props.saveSloka) {
        props.saveSloka(fileToUpload.uri);
        props.setTitle("");
        props.setSlokaText("");
      }
    }
  };

  return (
    <>
      <IonButton expand="block" color="primary" onClick={pickDocument}>
        📤 Upload
      </IonButton>
      <input
        type="file"
        accept="audio/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
};

export default UploadAudio;
