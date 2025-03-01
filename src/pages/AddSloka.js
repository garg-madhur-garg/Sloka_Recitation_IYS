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
  isPlatform,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Storage } from "@capacitor/storage";
import CustomAlert from "../components/CustomAlert";
import UploadAudio from "../components/UploadAudio";

const AddSloka = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [slokaText, setSlokaText] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null); // for web recording
  const [audioUri, setAudioUri] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);

  // const validateFields = () => {
  //   const trimmedTitle = title.trim();
  // const trimmedSlokaText = slokaText.trim();
  //   console.log("Title:", title);
  //   console.log("Sloka Text:", slokaText);
  //   if (!title || !slokaText) {
  //     setAlertVisible(true);
  //     return false;
  //   }
  //   return true;
  // };

  const validateFields = () => {
    const trimmedTitle = title.trim();
    const trimmedText = slokaText.trim();
    if (!trimmedTitle || !trimmedText) {
      setAlertVisible(true);
      return false;
    }
    return true;
  };

  // Start recording: use native Media Capture on hybrid and MediaRecorder on web
  const startRecording = async () => {
    // if (document.activeElement instanceof HTMLElement) {
    //   document.activeElement.blur();
    // }
    if (!validateFields()) return;
    if (isPlatform("hybrid")) {
      try {
        // Use Cordova Media Capture plugin
        // This function is available after installing cordova-plugin-media-capture:
        // npm install cordova-plugin-media-capture && npx cap sync
        window.navigator.device.capture.captureAudio(
          (mediaFiles) => {
            // On success, use the first captured file's local URL
            const file = mediaFiles[0];
            // file.fullPath or file.localURL may be available depending on the platform
            const uri = file.fullPath || file.localURL;
            setAudioUri(uri);

            saveSloka(uri);
          },
          (error) => {
            console.error("Error capturing audio", error);
          },
          { limit: 1, duration: 60 }
        );
      } catch (e) {
        console.error("Error starting native recording", e);
      }
    } else {
      // Web recording using MediaRecorder
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
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
          await saveSloka(uri);
          stream.getTracks().forEach((track) => track.stop());
        };
        recorder.start();
        setMediaRecorder(recorder);
      } catch (error) {
        console.error("Error starting web recording", error);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
  };

  const saveSloka = async (audioUri) => {
    const newSloka = {
      id: Date.now().toString(),
      title,
      text: slokaText,
      audioUri,
    };
    const { value } = await Storage.get({ key: "slokas" });
    const slokas = value ? JSON.parse(value) : [];
    slokas.push(newSloka);
    await Storage.set({ key: "slokas", value: JSON.stringify(slokas) });
    setTitle("");
    setSlokaText("");
    history.goBack();
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
          // onIonInput={(e) => setTitle(e.detail.value || "")}
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
          // onIonInput={(e) => setSlokaText(e.detail.value || "")}
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
          color={mediaRecorder ? "danger" : "primary"}
          onClick={mediaRecorder ? stopRecording : startRecording}
          style={{ marginBottom: "8px" }}
        >
          {mediaRecorder ? "Stop" : "🎤 Record"}
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
