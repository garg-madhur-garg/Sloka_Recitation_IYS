import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
} from '@ionic/react';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const FileReadWrite = () => {
  // State for file content and the read result
  const [content, setContent] = useState('');
  const [readContent, setReadContent] = useState('');

  // Define a file name to use (stored in the Documents directory)
  const fileName = 'example.txt';

  // Function to write file content to the device
  const writeFile = async () => {
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: content,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      console.log('File written successfully');
    } catch (error) {
      console.error('Error writing file:', error);
    }
  };

  // Function to read file content from the device
  const readFile = async () => {
    try {
      const result = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      setReadContent(result.data);
      console.log('File read successfully');
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>File Read/Write</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Enter Text to Save</IonLabel>
          <IonInput
            value={content}
            onIonChange={(e) => setContent(e.detail.value)}
            placeholder="Type something..."
          />
        </IonItem>
        <IonButton expand="block" onClick={writeFile} style={{ marginTop: '20px' }}>
          Write File
        </IonButton>
        <IonButton expand="block" onClick={readFile} style={{ marginTop: '20px' }}>
          Read File
        </IonButton>
        {readContent && (
          <div style={{ marginTop: '20px' }}>
            <h2>File Content:</h2>
            <p>{readContent}</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default FileReadWrite;
