import React, { useState, useEffect, useRef } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonModal,
  IonInput,
  IonText,
  IonIcon,
  useIonViewDidEnter,
} from "@ionic/react";
import { trash, arrowUp, arrowDown} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";
import dataManager from "../services/DataManager";
import notificationService from "../services/NotificationService";
import audioManager from "../services/AudioManager";
import audioStorage from "../services/AudioStorage";

const Playlist = () => {
  // Playlists structure: array of { id, name, songs: [ { id, title, audioUri } ] }
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Playback state
  const [playingPlaylistId, setPlayingPlaylistId] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const history = useHistory();
  const modalInputRef = useRef(null);
  const saveModelRef = useRef(null);

  // Load playlists when page becomes active
  useIonViewDidEnter(() => {
    const loadPlaylists = async () => {
      const playlists = await dataManager.getPlaylists();
      setPlaylists(playlists);
    };
    loadPlaylists();
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
        setPlayingPlaylistId(null);
      }
    });
    return unsubscribe;
  }, [currentAudio]);


  // Navigate to create a new playlist page
  const addPlaylist = () => {
    history.push("/selectSloka");
  };

  // Open modal for editing a playlist
  const openPlaylist = (playlist) => {
    setIsModalOpen(false);
    if (saveModelRef.current) {
      saveModelRef.current.focus();
    }
    setSelectedPlaylist(playlist);
    setIsModalOpen(true);
  };

  // Update a specific playlist in storage
  const updatePlaylist = async (updatedPlaylist) => {
    const success = await dataManager.updatePlaylist(updatedPlaylist);
    if (success) {
      const updated = playlists.map((pl) =>
        pl.id === updatedPlaylist.id ? updatedPlaylist : pl
      );
      setPlaylists(updated);
      setSelectedPlaylist(updatedPlaylist);
    }
  };


  // Delete a playlist
  const deletePlaylist = async (playlistId) => {
    const success = await dataManager.deletePlaylist(playlistId);
    if (success) {
      const updated = playlists.filter((pl) => pl.id !== playlistId);
      setPlaylists(updated);
      notificationService.showSuccess('Playlist deleted successfully');
    } else {
      notificationService.showError('Failed to delete playlist');
    }
    setIsModalOpen(false);
  };

  // Main page: Play button logic for each playlist
  const playPlaylistFromList = (playlist) => {
    if (playingPlaylistId === playlist.id) {
      // Already playing; stop it
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
      setPlayingPlaylistId(null);
    } else {
      // Stop any existing playback (including AudioManager audio)
      audioManager.stopAudio();
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
      if (!playlist.songs || playlist.songs.length === 0) {
        setAlertMessage("No songs in this playlist.");
        setAlertVisible(true);
        return;
      }
      setPlayingPlaylistId(playlist.id);
      let index = 0;
      const playNext = async () => {
        if (index >= playlist.songs.length) {
          index = 0; // loop back
        }
        try {
          const song = playlist.songs[index];
          // Load audio from filesystem if needed
          let playableUri = song.audioUri;
          if (audioStorage.isFileSystemPath(song.audioUri)) {
            playableUri = await audioStorage.loadAudio(song.audioUri);
            if (!playableUri) {
              console.error("Failed to load audio from filesystem");
              setPlayingPlaylistId(null);
              return;
            }
          }
          
          const audio = new Audio(playableUri);
          setCurrentAudio(audio);
          audio.play().catch((err) => {
            console.error(err);
            setPlayingPlaylistId(null);
          });
          audio.onended = () => {
            index++;
            playNext();
          };
        } catch (error) {
          console.error("Error playing song:", error);
          setPlayingPlaylistId(null);
        }
      };
      playNext();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ color: "#FFFFFF" }}>Playlist Manager</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ background: "#121212" }}>
        <IonButton expand="block" onClick={addPlaylist}>
          Add New Playlist
        </IonButton>
        <IonList>
          {playlists.map((pl) => (
            <IonItem key={pl.id} button onClick={() => openPlaylist(pl)}>
              <IonLabel style={{ color: "Black" }}>{pl.name}</IonLabel>
              <IonButton
                // color="primary"
                color={playingPlaylistId === pl.id ? "danger" : "primary"}
                fill="solid"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  playPlaylistFromList(pl);
                }}
              >
                 <IonText>{playingPlaylistId === pl.id ? "⏹" : "▶"}</IonText>
                {/* <IonIcon
                  slot="icon-only"
                  color={playingPlaylistId === pl.id ? "danger" : "primary"}
                  size="large"
                  // icon={playingPlaylistId === pl.id ? stopOutline : playOutline}
                /> */}
              </IonButton>
              <IonButton
                color="danger"
                slot="end"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePlaylist(pl.id);
                }}
              >
                {/* <IonIcon slot="icon-only" icon={trashOutline} size="large" aria-hidden="true"/> */}
                <IonText>🗑</IonText>
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {/* Modal for editing a playlist */}
        {/* <IonModal
          isOpen={isModalOpen}
          onDidDismiss={() => {
            setIsModalOpen(false);
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }}
        > */}

        <IonModal
          isOpen={isModalOpen}
          onWillDismiss={async () => {
            // Optionally call refresh before the modal fully closes
            // await refreshPlaylists();
          }}
          onDidDismiss={async () => {
            setIsModalOpen(false);
            // Force refresh from Storage after modal dismissal
            // await refreshPlaylists();
          }}
        >
          {selectedPlaylist && (
            <PlaylistDetail
              playlist={selectedPlaylist}
              updatePlaylist={updatePlaylist}
              deletePlaylist={deletePlaylist}  // Pass the delete function here
              closeModal={() => setIsModalOpen(false)}
              modalInputRef={modalInputRef}
              saveModelRef={saveModelRef}
            />
          )}
        </IonModal>

        {/* <IonModal
          isOpen={isModalOpen}
          onDidDismiss={async () => {
            setIsModalOpen(false);
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
            const { value } = await Preferences.get({ key: "playlists" });
            if (value) {
              setPlaylists(JSON.parse(value)); // 🔥 Force Refresh from Storage
            }
          }}
        >
          {selectedPlaylist && (
            <PlaylistDetail
              playlist={selectedPlaylist}
              updatePlaylist={updatePlaylist}
              closeModal={() => setIsModalOpen(false)}
              modalInputRef={modalInputRef}
              saveModelRef={saveModelRef}
            />
          )}
        </IonModal> */}

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
      </IonContent>
    </IonPage>
  );
};

const PlaylistDetail = ({
  playlist,
  updatePlaylist,
  closeModal,
  modalInputRef,
  saveModelRef,
  deletePlaylist
}) => {
  const [name, setName] = useState(playlist.name);
  const [songs, setSongs] = useState(playlist.songs);

  useEffect(() => {
    setName(playlist.name);
    setSongs(playlist.songs);
  }, [playlist]);

  const saveChanges = () => {
    // Force blur to ensure that any pending input is committed to state
    // if (document.activeElement instanceof HTMLElement) {
    //   document.activeElement.blur();
    // }
    if (songs.length === 0) {
      // If no songs remain, delete the playlist.
      deletePlaylist(playlist.id);
    } else {
      const updated = { ...playlist, name, songs };
      updatePlaylist(updated);
    }
    

    setTimeout(() => {
      closeModal(); // This gives React a small breath to re-render before closing
    }, 10);
  };

  // For demonstration: add a dummy song
  // const addSong = () => {
  //   const newSong = {
  //     id: Date.now().toString(),
  //     title: `Song ${songs.length + 1}`,
  //     audioUri: "https://example.com/audio.mp3",
  //   };
  //   setSongs([...songs, newSong]);
  // };

  const deleteSong = (songId) => {
    const updatedSongs = songs.filter((s) => s.id !== songId);
    setSongs(updatedSongs);
  };

         const moveSongUp = (index) => {
           if (index === 0) return;
    const newSongs = [...songs];
    [newSongs[index - 1], newSongs[index]] = [
      newSongs[index],
      newSongs[index - 1],
    ];
    setSongs(newSongs);
  };

  const moveSongDown = (index) => {
    if (index === songs.length - 1) return;
    const newSongs = [...songs];
    [newSongs[index], newSongs[index + 1]] = [
      newSongs[index + 1],
      newSongs[index],
    ];
    setSongs(newSongs);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle style={{ color: "#FFFFFF" }}>Edit Playlist</IonTitle>
          <IonButton slot="end" onClick={closeModal}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ background: "#121212" }}>
        {/* <IonItemDivider>
          <IonLabel>Playlist Name</IonLabel>
        </IonItemDivider> */}
        <IonItem>
          <IonInput
            value={name}
            placeholder="Playlist Name"
            onIonInput={(e) => setName(e.detail.value)}
            ref={modalInputRef}
          />
        </IonItem>
        <IonButton expand="block" onClick={saveChanges} >
          Save
        </IonButton>
        {/* <IonItemDivider>
          <IonLabel>Songs</IonLabel>
        </IonItemDivider> */}
        {/* <IonButton expand="block" onClick={addSong}>
          <IonIcon slot="start" icon={add} />
          Add Song
        </IonButton> */}
        <IonList>
          {songs.map((song, index) => (
            <IonItem key={song.id}>
              <IonLabel style={{ color: "Black" }}>{song.title}</IonLabel>
              <IonButton onClick={() => moveSongUp(index)}>
                <IonIcon slot="icon-only" icon={arrowUp} />
              </IonButton>
              <IonButton onClick={() => moveSongDown(index)}>
                <IonIcon slot="icon-only" icon={arrowDown} />
              </IonButton>
              <IonButton color="danger" onClick={() => deleteSong(song.id)}>
                <IonIcon slot="icon-only" icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </>
  );
};

export default Playlist;
