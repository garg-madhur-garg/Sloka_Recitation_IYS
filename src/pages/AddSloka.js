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
import {VoiceRecorder} from 'capacitor-voice-recorder';
import CustomAlert from "../components/CustomAlert";
import UploadAudio from "../components/UploadAudio";

const AddSloka = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [slokaText, setSlokaText] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null); // for web recording
  const [audioUri, setAudioUri] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("NONE")

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

  async function requestMicPermission() {
    const permission = await VoiceRecorder.requestAudioRecordingPermission();
  
    if (permission.value === true) {
      // Permission granted — start recording
      await VoiceRecorder.startRecording();
    } else {
      console.log('Microphone permission not granted');
    }
  }

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
    requestMicPermission()
    // if (document.activeElement instanceof HTMLElement) {
    //   document.activeElement.blur();
    // }
    if (!validateFields()) return;
    if (isPlatform("hybrid")) {
      try {
        // Use Cordova Media Capture plugin
        // This function is available after installing cordova-plugin-media-capture:
        // npm install cordova-plugin-media-capture && npx cap sync
        
        
        // window.navigator.device.capture.captureAudio(
        //   (mediaFiles) => {
        //     // On success, use the first captured file's local URL
        //     const file = mediaFiles[0];
        //     // file.fullPath or file.localURL may be available depending on the platform
        //     const uri = file.fullPath || file.localURL;
        //     setAudioUri(uri);

        //     saveSloka(uri);
        //   },
        //   (error) => {
        //     console.error("Error capturing audio", error);
        //   },
        //   { limit: 1, duration: 60 }
        // );

        VoiceRecorder.canDeviceVoiceRecord().then((result) => console.log(result.value));

        VoiceRecorder.startRecording()
          .then((result) => console.log(result, 'start'))
          .catch((error) => console.log(error));

          VoiceRecorder.getCurrentStatus()
          .then((result) => {
            console.log(result.status);
            setRecordingStatus('RECORDING')
          })
          .catch(error => console.log(error));

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
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
    }
    VoiceRecorder.stopRecording()
    .then((result) => {
      console.log(result);
      // const audioRef = new Audio(`data:${result.value.mimeType};base64,${result.value.recordDataBase64}`)
      
      let uri =base64ToBlobUrl(result.value.recordDataBase64)
      console.log(uri);
      setAudioUri(uri);
      saveSloka(uri);
      
      setRecordingStatus('NONE');
    })
    .catch((error) => console.log(error));
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
          color={mediaRecorder || recordingStatus=='RECORDING'? "danger" : "primary"}
          onClick={mediaRecorder || recordingStatus=='RECORDING' ? stopRecording : startRecording}
          style={{ marginBottom: "8px" }}
        >
          {mediaRecorder || recordingStatus=='RECORDING' ? "Stop" : "🎤 Record"}
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
