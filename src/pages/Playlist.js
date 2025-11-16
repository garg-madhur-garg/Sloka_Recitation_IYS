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
  IonCheckbox,
  useIonViewDidEnter,
} from "@ionic/react";
import { trash, arrowUp, arrowDown, add} from "ionicons/icons";
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
  const [currentPlayingSongId, setCurrentPlayingSongId] = useState(null);
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
    // If this playlist is currently playing, check if the currently playing song was removed
    if (playingPlaylistId === updatedPlaylist.id && currentPlayingSongId) {
      const songStillExists = updatedPlaylist.songs && updatedPlaylist.songs.some(s => s.id === currentPlayingSongId);
      if (!songStillExists) {
        // Currently playing song was deleted, stop playback
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
          setCurrentAudio(null);
        }
        setPlayingPlaylistId(null);
        setCurrentPlayingSongId(null);
      }
    }
    
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
    // Stop audio if this playlist is currently playing
    if (playingPlaylistId === playlistId) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
      setPlayingPlaylistId(null);
    }
    
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
      setCurrentPlayingSongId(null);
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
      const playlistIdRef = playlist.id; // Capture playlist ID for closure
      const playNext = async () => {
        // Get current playlist to check songs - use playlists state
        const currentPlaylist = playlists.find(p => p.id === playlistIdRef);
        if (!currentPlaylist || !currentPlaylist.songs || currentPlaylist.songs.length === 0) {
          setPlayingPlaylistId(null);
          setCurrentPlayingSongId(null);
          if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setCurrentAudio(null);
          }
          return;
        }
        
        if (index >= currentPlaylist.songs.length) {
          index = 0; // loop back
        }
        try {
          const song = currentPlaylist.songs[index];
          if (!song) {
            setPlayingPlaylistId(null);
            setCurrentPlayingSongId(null);
            if (currentAudio) {
              currentAudio.pause();
              currentAudio.currentTime = 0;
              setCurrentAudio(null);
            }
            return;
          }
          
          setCurrentPlayingSongId(song.id);
          
          // Load audio from filesystem if needed
          let playableUri = song.audioUri;
          if (audioStorage.isFileSystemPath(song.audioUri)) {
            playableUri = await audioStorage.loadAudio(song.audioUri);
            if (!playableUri) {
              console.error("Failed to load audio from filesystem");
              setPlayingPlaylistId(null);
              setCurrentPlayingSongId(null);
              return;
            }
          }
          
          const audio = new Audio(playableUri);
          setCurrentAudio(audio);
          audio.play().catch((err) => {
            console.error(err);
            setPlayingPlaylistId(null);
            setCurrentPlayingSongId(null);
          });
          audio.onended = () => {
            index++;
            playNext();
          };
        } catch (error) {
          console.error("Error playing song:", error);
          setPlayingPlaylistId(null);
          setCurrentPlayingSongId(null);
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
  const [showAddSlokasModal, setShowAddSlokasModal] = useState(false);
  const [allSlokas, setAllSlokas] = useState([]);
  const [selectedSlokas, setSelectedSlokas] = useState([]);

  useEffect(() => {
    setName(playlist.name);
    setSongs(playlist.songs);
  }, [playlist]);

  // Load all slokas when add slokas modal opens
  useEffect(() => {
    if (showAddSlokasModal) {
      const loadSlokas = async () => {
        const slokas = await dataManager.getSlokas();
        console.log("Loaded slokas for add modal:", slokas);
        // Filter out slokas that are already in the playlist
        const existingSlokaIds = songs.map(s => s.id);
        const availableSlokas = slokas.filter(s => !existingSlokaIds.includes(s.id));
        console.log("Available slokas after filtering:", availableSlokas);
        setAllSlokas(availableSlokas);
        setSelectedSlokas([]);
      };
      loadSlokas();
    }
  }, [showAddSlokasModal, songs]);

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

  // Toggle sloka selection for adding to playlist
  const toggleSlokaSelection = (slokaId) => {
    setSelectedSlokas(prev => {
      if (prev.includes(slokaId)) {
        return prev.filter(id => id !== slokaId);
      } else {
        return [...prev, slokaId];
      }
    });
  };

  // Add selected slokas to playlist
  const addSelectedSlokas = () => {
    if (selectedSlokas.length === 0) {
      notificationService.showError('Please select at least one sloka to add');
      return;
    }

    const slokasToAdd = allSlokas.filter(s => selectedSlokas.includes(s.id));
    const updatedSongs = [...songs, ...slokasToAdd];
    setSongs(updatedSongs);
    setShowAddSlokasModal(false);
    setSelectedSlokas([]);
    notificationService.showSuccess(`${slokasToAdd.length} sloka(s) added to playlist`);
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
        <IonButton expand="block" color="secondary" onClick={() => setShowAddSlokasModal(true)}>
          <IonIcon slot="start" icon={add} />
          Add Slokas
        </IonButton>
        <IonList>
          {songs.map((song, index) => (
            <IonItem key={song.id}>
              <IonLabel style={{ color: "Black" }}>{song.title}</IonLabel>
              {index > 0 && (
                <IonButton onClick={() => moveSongUp(index)}>
                  <IonIcon slot="icon-only" icon={arrowUp} />
                </IonButton>
              )}
              {index < songs.length - 1 && (
                <IonButton onClick={() => moveSongDown(index)}>
                  <IonIcon slot="icon-only" icon={arrowDown} />
                </IonButton>
              )}
              <IonButton color="danger" onClick={() => deleteSong(song.id)}>
                <IonIcon slot="icon-only" icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {/* Modal for adding slokas */}
        <IonModal isOpen={showAddSlokasModal} onDidDismiss={() => setShowAddSlokasModal(false)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle style={{ color: "#FFFFFF" }}>Add Slokas to Playlist</IonTitle>
              <IonButton slot="end" onClick={() => setShowAddSlokasModal(false)}>
                Close
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding" style={{ background: "#121212" }}>
            {allSlokas.length === 0 ? (
              <IonText color="medium" style={{ display: "block", textAlign: "center", marginTop: "20px" }}>
                No slokas available to add. All slokas are already in this playlist.
              </IonText>
            ) : (
              <>
                <IonList>
                  {allSlokas.map((sloka) => {
                    console.log("Rendering sloka:", sloka);
                    return (
                      <IonItem 
                        key={sloka.id} 
                        lines="full"
                        style={{ 
                          background: "#1E1E1E", 
                          marginBottom: "4px",
                          "--color": "white",
                          "--background": "#1E1E1E"
                        }}
                      >
                        <IonCheckbox
                          checked={selectedSlokas.includes(sloka.id)}
                          onIonChange={() => toggleSlokaSelection(sloka.id)}
                          slot="start"
                        />
                        <IonLabel style={{ color: "white", fontSize: "16px" }}>
                          {sloka.title || sloka.name || "Untitled Sloka"}
                        </IonLabel>
                      </IonItem>
                    );
                  })}
                </IonList>
                <IonButton expand="block" color="primary" onClick={addSelectedSlokas} style={{ marginTop: "20px" }}>
                  Add Selected Slokas ({selectedSlokas.length})
                </IonButton>
              </>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </>
  );
};

export default Playlist;
