import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonBackButton,
  IonButtons,
  IonItemDivider,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";
import { VoiceRecorder } from "capacitor-voice-recorder";
import dataManager from "../services/DataManager";
import notificationService from "../services/NotificationService";

// Helper: Convert base64 string to Blob URL
function base64ToBlobUrl(base64Data, contentType = "audio/mp3") {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });
  return URL.createObjectURL(blob);
}

const SlokaDetail = () => {
  const history = useHistory();
  const location = useLocation();
  // Retrieve the initial sloka from navigation state
  const initialSloka =
    location.state && location.state.sloka ? location.state.sloka : null;

  // Always in edit mode so we use separate states for inputs (editedTitle & editedText)
  const [editedTitle, setEditedTitle] = useState(initialSloka ? initialSloka.title : "");
  const [editedText, setEditedText] = useState(initialSloka ? initialSloka.text : "");
  const [recording, setRecording] = useState("NONE"); // "NONE" or "RECORDING"
  const [audioUri, setAudioUri] = useState(initialSloka ? initialSloka.audioUri : "");
  const [alertVisible, setAlertVisible] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Hide the tab bar on this page.
  useEffect(() => {
    const tabBar = document.querySelector("ion-tab-bar");
    if (tabBar) {
      tabBar.style.display = "none";
    }
    return () => {
      if (tabBar) {
        tabBar.style.display = "";
      }
    };
  }, []);

  // Handle audio playback using the HTML5 Audio API
  const handlePlayback = async () => {
    try {
      if (isPlaying) {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
          setSound(null);
        }
        setIsPlaying(false);
      } else {
        const newSound = new Audio();
        newSound.src = audioUri;
        newSound.loop = true;
        setSound(newSound);
        await newSound.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Playback failed", error);
    }
  };

  // Validate required text fields
  const validateFields = () => {
    if (!editedTitle || !editedText) {
      setAlertVisible(true);
      return false;
    }
    return true;
  };

  // Start recording audio using native VoiceRecorder
  const startRecording = async () => {
    console.log("startRecording called in SlokaDetail");
    if (!validateFields()) {
      console.log("Validation failed in SlokaDetail");
      return;
    }
    
    console.log("Starting native recording in SlokaDetail");
    try {
      // Request permission first
      const permission = await VoiceRecorder.requestAudioRecordingPermission();
      console.log("Permission result in SlokaDetail:", permission);
      
      if (permission.value === true) {
        // Check if device can record
        const canRecord = await VoiceRecorder.canDeviceVoiceRecord();
        console.log("Can record result in SlokaDetail:", canRecord);
        
        if (canRecord.value === true) {
          // Start recording
          const result = await VoiceRecorder.startRecording();
          console.log("Recording started in SlokaDetail:", result);
          setRecording("RECORDING");
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

  const stopRecording = async () => {
    console.log("stopRecording called in SlokaDetail");
    console.log("Stopping native recording in SlokaDetail");
    
    try {
      await VoiceRecorder.stopRecording()
        .then((result) => {
          console.log("Recording stopped in SlokaDetail:", result);
          // Convert base64 voice data to a Blob URL
          const uri = base64ToBlobUrl(result.value.recordDataBase64);
          setAudioUri(uri);
          setRecording("NONE");
        })
        .catch((error) => {
          console.error("Error stopping recording:", error);
          alert("Error stopping recording: " + error.message);
          setRecording("NONE");
        });
    } catch (error) {
      console.error("Error stopping native recording", error);
      alert("Error stopping recording: " + error.message);
      setRecording("NONE");
    }
  };
  

  // Save changes to the current sloka (update the existing record)
  const saveChanges = async () => {
    console.log("saveChanges called");
    console.log("initialSloka:", initialSloka);
    console.log("editedTitle:", editedTitle);
    console.log("editedText:", editedText);
    console.log("audioUri:", audioUri);
    
    if (!initialSloka || !initialSloka.id) {
      console.error("No initial sloka or ID found");
      notificationService.showError('Error: No sloka data found to update.');
      return;
    }

    const updatedSloka = {
      ...initialSloka,
      title: editedTitle.trim(),
      text: editedText.trim(),
      audioUri: audioUri,
    };

    console.log("updatedSloka:", updatedSloka);

    const success = await dataManager.updateSloka(updatedSloka);
    console.log("Update success:", success);
    
    if (success) {
      notificationService.showSuccess('Sloka updated successfully!');
      // Navigate back - HomePage will refresh automatically
      history.goBack();
    } else {
      notificationService.showError('Failed to update sloka. Please try again.');
    }
  };

  // Cleanup: stop recording if component unmounts.
  useEffect(() => {
    return () => {
      if (sound) {
        sound.pause();
      }
    };
  }, [sound]);

  return (
    <IonPage className="dark-bg">
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle className="header-title">Sloka Detail</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding dark-bg" style={{ background: "#121212" }}>
        <IonItemDivider>
          <IonInput
            value={editedTitle}
            placeholder="Sloka Title"
            onIonInput={(e) => {
              console.log("Title input changed:", e.detail.value);
              setEditedTitle(e.detail.value || "");
            }}
            clearInput
            className="ion-margin-bottom"
          />
        </IonItemDivider>
        <IonItemDivider>
          <IonTextarea
            value={editedText}
            placeholder="Sloka Text"
            onIonInput={(e) => {
              console.log("Text input changed:", e.detail.value);
              setEditedText(e.detail.value || "");
            }}
            autoGrow
            className="ion-margin-bottom"
            style={{ height: "200px" }}
          />
        </IonItemDivider>
        <div className="ion-margin-vertical" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Play Loop button (if audio is available) */}
          {audioUri && (
            <IonButton
              expand="block"
              color={isPlaying ? "danger" : "primary"}
              onClick={handlePlayback}
            >
              {isPlaying ? "⏹ Stop" : "▶ Play Loop"}
            </IonButton>
          )}

          {/* Record Audio button */}
          <IonButton
            expand="block"
            color={recording === "RECORDING" ? "danger" : "primary"}
            onClick={recording === "RECORDING" ? stopRecording : startRecording}
          >
            {recording === "RECORDING" ? "⏹ Stop Recording" : "🎤 Record Audio"}
          </IonButton>

          {/* Save button to update the current sloka */}
          <IonButton expand="block" color="secondary" onClick={saveChanges}>
            💾 Save
          </IonButton>
        </div>
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

export default SlokaDetail;
