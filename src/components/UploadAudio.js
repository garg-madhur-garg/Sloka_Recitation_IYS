import React, { useRef, useState } from "react";
import { IonButton, IonText, IonSpinner } from "@ionic/react";

const UploadAudio = (props) => {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

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
      
      // Validate file size (limit to 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert('File size too large. Please select a file smaller than 50MB.');
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
        setIsUploading(true);
        try {
          // Pass both URI and original filename - make it async
          await props.saveSloka(fileToUpload.uri, file.name);
          if (props.setTitle) props.setTitle("");
          if (props.setSlokaText) props.setSlokaText("");
        } catch (error) {
          console.error("Error saving sloka:", error);
        } finally {
          setIsUploading(false);
        }
      }
      
      // Reset input so same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <IonButton 
        expand="block" 
        color="primary" 
        onClick={pickDocument}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <IonSpinner name="crescent" style={{ marginRight: "8px" }} />
            Uploading...
          </>
        ) : (
          "📤 Upload"
        )}
      </IonButton>
      {isUploading && (
        <IonText color="primary" style={{ fontSize: "12px", display: "block", textAlign: "center", marginTop: "4px" }}>
          Please wait, uploading audio file...
        </IonText>
      )}
      {!isUploading && (
        <IonText color="medium" style={{ fontSize: "12px", display: "block", textAlign: "center", marginTop: "4px" }}>
          Max upload limit: 50MB
        </IonText>
      )}
      <input
        type="file"
        accept="audio/*"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </>
  );
};

export default UploadAudio;
