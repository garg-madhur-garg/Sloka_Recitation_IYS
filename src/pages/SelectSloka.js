
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
  IonCol 
} from '@ionic/react';
import { Storage } from '@capacitor/storage';
import { useHistory } from 'react-router-dom';

const SelectSloka = () => {
  const [slokas, setSlokas] = useState([]);
  const [selectedSlokas, setSelectedSlokas] = useState([]); // store sloka ids
  const [isPlaying, setIsPlaying] = useState(false);
  // Additional states for playback (if needed)
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentAudio, setCurrentAudio] = useState(null);
  
  const history = useHistory();

  // Load saved slokas from Storage when the page loads
  useEffect(() => {
    const loadSlokas = async () => {
      const { value } = await Storage.get({ key: 'slokas' });
      if (value) {
        const parsed = JSON.parse(value);
        setSlokas(parsed);
      }
    };
    loadSlokas();
  }, []);

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

  // Handler for "Create a Playlist" button:
  const createPlaylist = async () => {
    // Filter out the selected slokas from the full list
    const selectedList = slokas.filter(s => selectedSlokas.includes(s.id));
    if (selectedList.length === 0) {
      alert('Please select at least one sloka.');
      return;
    }
    const newPlaylist = {
      id: Date.now().toString(),
      name: `Playlist ${new Date().toLocaleString()}`,
      songs: selectedList
    };

    // Retrieve any existing playlists from Storage
    const { value } = await Storage.get({ key: 'playlists' });
    let playlists = value ? JSON.parse(value) : [];
    playlists.push(newPlaylist);
    await Storage.set({ key: 'playlists', value: JSON.stringify(playlists) });

    alert('Playlist created successfully!');
    // Navigate to the Playlist page (assumes your route is '/playlist')
    history.push('/playlist');
  };

  // Playback functionality (optional)
  const togglePlayback = () => {
    if (isPlaying) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
      setIsPlaying(false);
    } else {
      const selectedList = slokas.filter(s => selectedSlokas.includes(s.id));
      if (selectedList.length === 0){
        alert('Please select at least one sloka.');
        return;
      } 
      setIsPlaying(true);
      setCurrentPlaylistIndex(0);
      playCurrentSloka(selectedList, 0);
    }
  };

  const playCurrentSloka = (selectedList, index) => {
    const currentSloka = selectedList[index];
    if (!currentSloka) return;
    const audio = new Audio();
    audio.src = currentSloka.audioUri;
    audio.loop = false; // We manage looping manually
    setCurrentAudio(audio);
    audio.play().catch(err => console.error("Playback error:", err));
    audio.onended = () => {
      let nextIndex = index + 1;
      if (nextIndex >= selectedList.length) nextIndex = 0;
      setCurrentPlaylistIndex(nextIndex);
      playCurrentSloka(selectedList, nextIndex);
    };
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Select Slokas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {slokas.map(sloka => (
            <IonItem key={sloka.id} lines="full">
              <IonCheckbox 
                slot="start" 
                checked={selectedSlokas.includes(sloka.id)}
                onIonChange={() => toggleSelect(sloka.id)}
              />
              <IonLabel>{sloka.title}</IonLabel>
            </IonItem>
          ))}
        </IonList>
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
      </IonContent>
    </IonPage>
  );
};

export default SelectSloka;

