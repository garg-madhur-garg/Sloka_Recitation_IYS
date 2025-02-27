import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonInput, 
  IonTextarea, 
  IonButton, 
  IonText,
  IonBackButton,
  IonButtons
} from '@ionic/react';
import { Storage } from '@capacitor/storage';
import { useHistory, useLocation } from 'react-router-dom';
import CustomAlert from '../components/CustomAlert';
import UploadAudio from '../components/UploadAudio';

const SlokaDetail = () => {
  const history = useHistory();
  const location = useLocation();

  // Retrieve the sloka passed in state; if missing, navigate back.
  const initialSloka = location.state && location.state.sloka ? location.state.sloka : null;
  useEffect(() => {
    if (!initialSloka) {
      // alert("No sloka provided");
      // history.goBack();
    }
  }, [initialSloka, history]);

  // Hide the tab bar on this page.
  useEffect(() => {
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar) {
      tabBar.style.display = 'none';
    }
    return () => {
      if (tabBar) {
        tabBar.style.display = '';
      }
    };
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(initialSloka ? initialSloka.title : '');
  const [editedText, setEditedText] = useState(initialSloka ? initialSloka.text : '');
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(initialSloka ? initialSloka.audioUri : '');
  const [alertVisible, setAlertVisible] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio playback using HTML5 Audio API
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

  // Start recording using MediaRecorder API
  const startRecording = async () => {
    if (!validateFields()) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const uri = URL.createObjectURL(blob);
        setAudioUri(uri);
        setRecording(null);
      };
      recorder.start();
      setRecording(recorder);
    } catch (err) {
      console.log("Error in startRecording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      recording.stop();
      // onstop handler will update audioUri and reset recording state.
    } catch (err) {
      console.log("Error in stopRecording", err);
      setRecording(null);
    }
  };

  // Save changes using Capacitor Storage
  const saveChanges = async () => {
    const updatedSloka = {
      ...initialSloka,
      title: editedTitle,
      text: editedText,
      audioUri: audioUri,
    };

    const { value } = await Storage.get({ key: 'slokas' });
    let slokas = value ? JSON.parse(value) : [];
    slokas = slokas.map(item => item.id === initialSloka.id ? updatedSloka : item);
    await Storage.set({ key: 'slokas', value: JSON.stringify(slokas) });
    history.goBack();
  };

  const validateFields = () => {
    if (!editedTitle || !editedText) {
      setAlertVisible(true);
      return false;
    }
    return true;
  };

  const handleEditToggle = async () => {
    if (!validateFields()) return;
    if (isEditing) {
      await saveChanges();
    } else {
      if (sound) {
        sound.pause();
        sound.currentTime = 0;
        setSound(null);
        setIsPlaying(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const UploadAudioComponent = () => {
    if (!isEditing) return null;
    return <UploadAudio setAudioUri={setAudioUri} validateFields={validateFields} />;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recording) {
        recording.stop();
      }
    };
  }, [recording]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.pause();
      }
    };
  }, [sound]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>Sloka Detail</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ background: '#121212' }}>
        {isEditing ? (
          <IonInput
            value={editedTitle}
            placeholder="Title"
            onIonChange={e => setEditedTitle(e.detail.value)}
            clearInput
            className="ion-margin-bottom"
          />
        ) : (
          <IonText className="ion-text-center" color="primary" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            {initialSloka ? initialSloka.title : ''}
          </IonText>
        )}

        {isEditing ? (
          <IonTextarea
            value={editedText}
            placeholder="Sloka Text"
            onIonChange={e => setEditedText(e.detail.value)}
            autoGrow
            className="ion-margin-bottom"
            style={{ height: '200px' }}
          />
        ) : (
          <IonText className="ion-text-center" color="light" style={{ fontSize: '18px', marginBottom: '30px' }}>
            {initialSloka ? initialSloka.text : ''}
          </IonText>
        )}

        <div className="ion-margin-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {isEditing ? (
            <IonButton 
              expand="block"
              color={recording ? 'danger' : 'primary'}
              onClick={recording ? stopRecording : startRecording}
            >
              {recording ? '⏹ Stop Recording' : '🎤 Record Audio'}
            </IonButton>
          ) : (
            <IonButton 
              expand="block"
              color={isPlaying ? 'danger' : 'primary'}
              onClick={handlePlayback}
            >
              {isPlaying ? '⏹ Stop' : '▶ Play Loop'}
            </IonButton>
          )}
          <UploadAudioComponent />
          <IonButton 
            expand="block"
            color="secondary"
            onClick={handleEditToggle}
          >
            {isEditing ? '💾 Save' : '✏️ Edit'}
          </IonButton>
        </div>

        <CustomAlert
          visible={alertVisible}
          title="Missing Fields"
          message="Please fill all fields"
          buttons={[
            {
              text: 'OK',
              onClick: () => setAlertVisible(false),
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default SlokaDetail;


