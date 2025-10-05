import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import {VoiceRecorder} from 'capacitor-voice-recorder';
import CustomAlert from "../components/CustomAlert";
import UploadAudio from "../components/UploadAudio";
import dataManager from "../services/DataManager";
import notificationService from "../services/NotificationService";

const AddSloka = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [slokaText, setSlokaText] = useState("");
  const [, setAudioUri] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("NONE")

  

  const validateFields = () => {
    const trimmedTitle = title.trim();
    const trimmedText = slokaText.trim();
    if (!trimmedTitle || !trimmedText) {
      setAlertVisible(true);
      return false;
    }
    return true;
  };

  // Start recording using native VoiceRecorder
  const startRecording = async () => {
    console.log("startRecording called");
    if (!validateFields()) {
      console.log("Validation failed");
      return;
    }
    
    console.log("Starting native recording");
    try {
      // Request permission first
      const permission = await VoiceRecorder.requestAudioRecordingPermission();
      console.log("Permission result:", permission);
      
      if (permission.value === true) {
        // Check if device can record
        const canRecord = await VoiceRecorder.canDeviceVoiceRecord();
        console.log("Can record result:", canRecord);
        
        if (canRecord.value === true) {
          // Start recording
          const result = await VoiceRecorder.startRecording();
          console.log("Recording started:", result);
          setRecordingStatus('RECORDING');
        } else {
          console.error("Device cannot record voice");
          alert("Device cannot record voice");
        }
      } else {
        console.error("Microphone permission not granted");
        alert("Microphone permission not granted");
      }
    } catch (e) {
      console.error("Error starting native recording", e);
      alert("Error starting recording: " + e.message);
    }
  };

  function base64ToBlobUrl(base64Data, contentType = "audio/mp3") {
    // Decode base64 string
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    // Create a Uint8Array from the byte numbers
    const byteArray = new Uint8Array(byteNumbers);
    
    // Create a Blob from the Uint8Array
    const blob = new Blob([byteArray], { type: contentType });
    
    // Generate and return a Blob URL
    return URL.createObjectURL(blob);
  }

  const stopRecording = () => {
    console.log("stopRecording called");
    console.log("Stopping native recording");
    
    VoiceRecorder.stopRecording()
      .then((result) => {
        console.log("Recording stopped:", result);
        let uri = base64ToBlobUrl(result.value.recordDataBase64);
        setAudioUri(uri);
        saveSloka(uri);
        setRecordingStatus('NONE');
      })
      .catch((error) => {
        console.error("Error stopping recording:", error);
        alert("Error stopping recording: " + error.message);
        setRecordingStatus('NONE');
      });
  };

  const saveSloka = async (audioUri) => {
    const newSloka = {
      id: Date.now().toString(),
      title,
      text: slokaText,
      audioUri,
    };
    
    const success = await dataManager.addSloka(newSloka);
    if (success) {
      notificationService.showSuccess('Sloka saved successfully!');
      setTitle("");
      setSlokaText("");
      history.goBack();
    } else {
      notificationService.showError('Failed to save sloka. Please try again.');
    }
  };

  return (
    <IonPage className="dark-bg">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="header-title">Add Sloka</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        className="ion-padding dark-bg"
        style={{ background: "#121212" }}
      >
        <IonInput
          placeholder="Sloka Verse"
          value={title}
          onIonInput={(e) => setTitle(e.detail.value || "")}
          clearInput
          style={{
            marginBottom: "12px",
            background: "#FFFFFF",
            color: "#000000",
            padding: "12px",
            borderRadius: "6px",
            borderBottom: "0.5px solid grey",
          }}
        />
        <IonTextarea
          placeholder="Sloka"
          value={slokaText}
          onIonInput={(e) => setSlokaText(e.detail.value || "")}
          autoGrow
          style={{
            marginBottom: "12px",
            background: "#FFFFFF",
            color: "#000000",
            padding: "0",
            borderRadius: "6px",
            borderBottom: "0.5px solid grey",
          }}
        />
        <IonButton
          expand="block"
          color={recordingStatus==='RECORDING'? "danger" : "primary"}
          onClick={recordingStatus==='RECORDING' ? stopRecording : startRecording}
          style={{ marginBottom: "8px" }}
        >
          {recordingStatus==='RECORDING' ? "Stop" : "🎤 Record"}
        </IonButton>
        <UploadAudio
          validateFields={validateFields}
          setAudioUri={setAudioUri}
          saveSloka={saveSloka}
          setTitle={setTitle}
          setSlokaText={setSlokaText}
        />
        <CustomAlert
          visible={alertVisible}
          title="Missing Fields"
          message="Please fill all fields"
          buttons={[
            {
              text: "OK",
              onClick: () => setAlertVisible(false),
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default AddSloka;
