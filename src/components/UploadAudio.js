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
      console.log("File selected:", file.name, file.type, file.size);
      
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        alert('Please select an audio file.');
        return;
      }
      
      // Validate file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        alert('File size too large. Please select a file smaller than 10MB.');
        return;
      }
      
      const fileToUpload = {
        name: file.name,
        size: file.size,
        uri: URL.createObjectURL(file),
        type: file.type,
      };
      
      console.log("Created file object:", fileToUpload);
      
      if (props.setAudioUri) {
        props.setAudioUri(fileToUpload.uri, file.name);
      }
      
      // Only auto-save if saveSloka function is provided (for AddSloka page)
      if (props.saveSloka) {
        // Pass both URI and original filename
        props.saveSloka(fileToUpload.uri, file.name);
        if (props.setTitle) props.setTitle("");
        if (props.setSlokaText) props.setSlokaText("");
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
