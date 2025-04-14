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
import { Storage } from "@capacitor/storage";
import { useHistory, useLocation } from "react-router-dom";
import { isPlatform } from "@ionic/react";
import CustomAlert from "../components/CustomAlert";
import { VoiceRecorder } from "capacitor-voice-recorder";

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
  const [mediaRecorder, setMediaRecorder] = useState(null); // for web recording

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

  // Start recording audio
  const startRecording = async () => {
    if (!validateFields()) return;
    if (isPlatform("hybrid")) {
      try {
        // Start native recording using VoiceRecorder
        VoiceRecorder.canDeviceVoiceRecord().then((result) => console.log(result.value));
        VoiceRecorder.startRecording()
          .then((result) => console.log(result, "start"))
          .catch((error) => console.log(error));

        VoiceRecorder.getCurrentStatus()
          .then((result) => {
            console.log(result.status);
            setRecording("RECORDING");
          })
          .catch((error) => console.log(error));
      } catch (e) {
        console.error("Error starting native recording", e);
      }
    } else {
      // Web recording using MediaRecorder
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks = [];
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const uri = URL.createObjectURL(blob);
          setAudioUri(uri);
          stream.getTracks().forEach((track) => track.stop());
        };
        recorder.start();
        setMediaRecorder(recorder);
        setRecording("RECORDING");
      } catch (error) {
        console.error("Error starting web recording", error);
      }
    }
  };

  const stopRecording = async () => {
    if (isPlatform("hybrid")) {
      try {
        await VoiceRecorder.stopRecording()
          .then((result) => {
            console.log(result);
            // Convert base64 voice data to a Blob URL
            const uri = base64ToBlobUrl(result.value.recordDataBase64);
            console.log(uri);
            setAudioUri(uri);
            // Do not call save changes here—only update state.
            setRecording("NONE");
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.error("Error stopping native recording", error);
      }
    } else {
      // For web recording, if mediaRecorder exists the onstop callback (set in startRecording)
      // has already updated the audioUri.
      if (mediaRecorder) {
        mediaRecorder.stop();
        setMediaRecorder(null);
      }
      // Set recording to "NONE" to update the button text.
      setRecording("NONE");
    }
  };
  

  // Save changes to the current sloka (update the existing record)
  const saveChanges = async () => {
    const updatedSloka = {
      ...initialSloka,
      title: editedTitle,
      text: editedText,
      audioUri: audioUri,
    };

    const { value } = await Storage.get({ key: "slokas" });
    let slokas = value ? JSON.parse(value) : [];
    slokas = slokas.map((item) =>
      item.id === initialSloka.id ? updatedSloka : item
    );
    await Storage.set({ key: "slokas", value: JSON.stringify(slokas) });

    // Reset fields and navigate back
    setEditedTitle("");
    setEditedText("");
    setAudioUri("");
    history.goBack();
  };

  // Cleanup: stop recording if component unmounts.
  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
      if (sound) {
        sound.pause();
      }
    };
  }, [mediaRecorder, sound]);

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
            onIonChange={(e) => setEditedTitle(e.detail.value)}
            clearInput
            className="ion-margin-bottom"
          />
        </IonItemDivider>
        <IonItemDivider>
          <IonTextarea
            value={editedText}
            placeholder="Sloka Text"
            onIonChange={(e) => setEditedText(e.detail.value)}
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
