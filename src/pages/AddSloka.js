

import React, { useState } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonInput, 
  IonTextarea, 
  IonButton 
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Storage } from '@capacitor/storage';
import CustomAlert from '../components/CustomAlert';
import UploadAudio from '../components/UploadAudio';

const AddSloka = () => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [slokaText, setSlokaText] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);

  const validateFields = () => {
    if (!title || !slokaText) {
      setAlertVisible(true);
      return false;
    }
    return true;
  };

  const startRecording = async () => {
    if (!validateFields()) return;
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
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const uri = URL.createObjectURL(blob);
        setAudioUri(uri);
        await saveSloka(uri);
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error starting recording', error);
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
    const { value } = await Storage.get({ key: 'slokas' });
    const slokas = value ? JSON.parse(value) : [];
    slokas.push(newSloka);
    console.log("Saving slokas:", slokas); // <-- Debug: Check saved slokas
    await Storage.set({ key: 'slokas', value: JSON.stringify(slokas) });
    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Add Sloka</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonInput
          placeholder="Title"
          value={title}
          onIonChange={e => setTitle(e.detail.value)}
          clearInput
          style={{ marginBottom: '12px', background: 'white', color: 'black', padding: '12px', borderRadius: '6px'}}
        />
        <IonTextarea
          placeholder="Sloka Text"
          value={slokaText}
          onIonChange={e => setSlokaText(e.detail.value)}
          autoGrow
          style={{ marginBottom: '12px', background: 'white', color: 'black', padding: '12px', borderRadius: '6px' }}
        />
        <IonButton 
          expand="block" 
          color={mediaRecorder ? 'danger' : 'primary'} 
          onClick={mediaRecorder ? stopRecording : startRecording}
          style={{ marginBottom: '8px' }}
        >
          {mediaRecorder ? 'Stop Recording' : '🎤 Record Audio'}
        </IonButton>

        {/* UploadAudio handles file picking */}
        <UploadAudio 
          validateFields={validateFields} 
          setAudioUri={setAudioUri} 
          saveSloka={saveSloka} 
        />

        <CustomAlert
          visible={alertVisible}
          title="Missing Fields"
          message="Please fill all fields"
          buttons={[
            {
              text: 'OK',
              onPress: () => setAlertVisible(false),
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default AddSloka;

