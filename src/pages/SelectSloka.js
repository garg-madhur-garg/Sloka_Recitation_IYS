import React, { useState, useEffect } from 'react';
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonList, 
  IonItem, 
  IonLabel, 
  IonCheckbox, 
  IonButton, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonText,
  IonFooter
} from '@ionic/react';
import { useIonViewDidEnter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import CustomAlert from '../components/CustomAlert';
import dataManager from '../services/DataManager';
import notificationService from '../services/NotificationService';
import audioManager from '../services/AudioManager';
import audioStorage from '../services/AudioStorage';

const SelectSloka = () => {
  const [slokas, setSlokas] = useState([]);
  const [selectedSlokas, setSelectedSlokas] = useState([]); // Store selected sloka IDs
  const [isPlaying, setIsPlaying] = useState(false);
  const [, setCurrentPlaylistIndex] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const history = useHistory();

  // Function to load slokas from Storage
  const loadSlokas = async () => {
    try {
      const slokas = await dataManager.getSlokas();
      setSlokas(slokas);
    } catch (error) {
      console.error("Error loading slokas from Storage", error);
      notificationService.showError('Failed to load slokas');
    }
  };

  // Load slokas when view is entered (refreshes automatically when navigating to this tab)
  useIonViewDidEnter(() => {
    loadSlokas();
  });

  // Stop local audio when AudioManager starts playing
  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      if (state.isPlaying && state.currentAudioId) {
        // AudioManager is playing, stop local audio
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          setCurrentAudio(null);
        }
        setIsPlaying(false);
      }
    });
    return unsubscribe;
  }, [currentAudio]);

  // Toggle checkbox selection
  const toggleSelect = (id) => {
    setSelectedSlokas(prev => {
      if (prev.includes(id)) {
        return prev.filter(sid => sid !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Create Playlist Function
  const createPlaylist = async () => {

    const selectedList = slokas.filter(s => selectedSlokas.includes(s.id));

    if (selectedList.length === 0) {
      setAlertMessage('Please select at least one sloka.');
      setAlertVisible(true);
      return;
    }

    const newPlaylist = {
      id: Date.now().toString(),
      name: `Playlist ${new Date().toLocaleString()}`,
      songs: selectedList
    };

    const success = await dataManager.addPlaylist(newPlaylist);
    if (success) {
      notificationService.showSuccess('Playlist created successfully!');
    } else {
      notificationService.showError('Failed to create playlist');
      return;
    }
    // Clear all selected slokas (uncheck all checkboxes)
  setSelectedSlokas([]);
    history.push('/playlist');
  };

  // Playback functionality
  const togglePlayback = () => {
    if (isPlaying) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
      setIsPlaying(false);
    } else {
      // Stop any audio playing from AudioManager (e.g., from HomePage)
      audioManager.stopAudio();
      
      const selectedList = slokas.filter(s => selectedSlokas.includes(s.id));
      if (selectedList.length === 0) {
        setAlertMessage('Please select at least one sloka.');
        setAlertVisible(true);
        return;
      }
      setIsPlaying(true);
      setCurrentPlaylistIndex(0);
      playCurrentSloka(selectedList, 0);
    }
  };

  // Function to Play Sloka
  const playCurrentSloka = async (selectedList, index) => {
    const currentSloka = selectedList[index];
    if (!currentSloka) return;

    try {
      // Load audio from filesystem if needed
      let playableUri = currentSloka.audioUri;
      if (audioStorage.isFileSystemPath(currentSloka.audioUri)) {
        playableUri = await audioStorage.loadAudio(currentSloka.audioUri);
        if (!playableUri) {
          console.error("Failed to load audio from filesystem");
          setIsPlaying(false);
          return;
        }
      }

      const audio = new Audio(playableUri);
      audio.loop = false;
      setCurrentAudio(audio);

      audio.play().catch(err => {
        console.error("Playback error:", err);
        setIsPlaying(false);
      });
      audio.onended = () => {
        let nextIndex = index + 1;
        if (nextIndex >= selectedList.length) nextIndex = 0;
        setCurrentPlaylistIndex(nextIndex);
        playCurrentSloka(selectedList, nextIndex);
      };
    } catch (error) {
      console.error("Error playing sloka:", error);
      setIsPlaying(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle className="header-title">Select Slokas</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding dark-bg" style={{ background: "#121212" }}>
        {slokas.length === 0 ? (
          <IonText color="medium" style={{ textAlign: "center", display: "block", marginTop: "20px" }}>
            No slokas available. Please add slokas from Home Page.
          </IonText>
        ) : (
          <IonList>
            {slokas.map(sloka => (
              <IonItem key={sloka.id} lines="full">
                <IonCheckbox 
                  slot="start" 
                  checked={selectedSlokas.includes(sloka.id)}
                  onIonChange={() => toggleSelect(sloka.id)}
                />
                <IonLabel style={{ color: "Black" }}>{sloka.title}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
      </IonContent>

      {/* Sticky Footer */}
      <IonFooter>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton expand="block" onClick={createPlaylist}>
                  Create a Playlist
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton 
                  expand="block" 
                  color={isPlaying ? 'danger' : 'primary'} 
                  onClick={togglePlayback}
                >
                  {isPlaying ? 'Stop' : 'Play Selected Slokas'}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>

      <CustomAlert
        visible={alertVisible}
        title="Notification"
        message={alertMessage}
        buttons={[
          {
            text: "OK",
            onClick: () => setAlertVisible(false),
          },
        ]}
      />
    </IonPage>
  );

};

export default SelectSloka;
