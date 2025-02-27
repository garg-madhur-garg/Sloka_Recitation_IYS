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
  IonItemDivider,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  useIonViewDidEnter,
} from "@ionic/react";
import { Storage } from "@capacitor/storage";
import { add, trash, arrowUp, arrowDown, play } from "ionicons/icons";
import { useHistory } from "react-router-dom";

const Playlist = () => {
  // Playlists structure: array of { id, name, songs: [ { id, title, audioUri } ] }
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // For main page playback state
  const [playingPlaylistId, setPlayingPlaylistId] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  const history = useHistory();
  const modalInputRef = useRef(null);
  const saveModelRef = useRef(null);

  // Load playlists whenever the page becomes active
  useIonViewDidEnter(() => {
    const loadPlaylists = async () => {
      const { value } = await Storage.get({ key: "playlists" });
      if (value) {
        setPlaylists(JSON.parse(value));
      } else {
        setPlaylists([]);
      }
    };
    loadPlaylists();
  });

  // Save playlists to storage and update state
  const updatePlaylistsStorage = async (updated) => {
    setPlaylists(updated);
    await Storage.set({ key: "playlists", value: JSON.stringify(updated) });
  };

  // (Optional) Navigate to create a new playlist page (SelectSloka)
  const addPlaylist = () => {
    history.push("/selectSloka");
  };

  // Open modal for a selected playlist
  const openPlaylist = (playlist) => {
    setIsModalOpen(false);
    if (saveModelRef.current) {
      saveModelRef.current.focus();
    }
    setSelectedPlaylist(playlist);
    setIsModalOpen(true);
  };

  // Update a specific playlist in storage
  const updatePlaylist = (updatedPlaylist) => {
    const updated = playlists.map((pl) =>
      pl.id === updatedPlaylist.id ? updatedPlaylist : pl
    );
    updatePlaylistsStorage(updated);
    setSelectedPlaylist(updatedPlaylist);
  };

  // Delete a playlist (delete button in the main list)
  const deletePlaylist = (playlistId) => {
    const updated = playlists.filter((pl) => pl.id !== playlistId);
    updatePlaylistsStorage(updated);
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
      // Stop any existing playback
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }
      if (!playlist.songs || playlist.songs.length === 0) {
        alert("No songs in this playlist.");
        return;
      }
      setPlayingPlaylistId(playlist.id);
      let index = 0;
      const playNext = () => {
        if (index >= playlist.songs.length) {
          index = 0; // loop back
        }
        const audio = new Audio(playlist.songs[index].audioUri);
        setCurrentAudio(audio);
        audio.play().catch((err) => console.error(err));
        audio.onended = () => {
          index++;
          playNext();
        };
      };
      playNext();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Playlist Manager</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={addPlaylist}>
          Add New Playlist
        </IonButton>
        <IonList>
          {playlists.map((pl) => (
            <IonItem key={pl.id} button onClick={() => openPlaylist(pl)}>
              <IonLabel>{pl.name}</IonLabel>
              <IonButton
                fill="clear"
                onClick={(e) => {
                  e.stopPropagation();
                  playPlaylistFromList(pl);
                }}
              >
                <IonIcon slot="icon-only" icon={play} />
              </IonButton>
              <IonButton
                color="danger"
                slot="end"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePlaylist(pl.id);
                }}
              >
                <IonIcon slot="icon-only" icon={trash} />
              </IonButton>
            </IonItem>
          ))}
        </IonList>

        {/* Modal for editing a playlist */}
        <IonModal
          isOpen={isModalOpen}
          onDidDismiss={() => {
            setIsModalOpen(false);
            // Remove focus from the currently focused element
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
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
        </IonModal>
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
}) => {
  const [name, setName] = useState(playlist.name);
  const [songs, setSongs] = useState(playlist.songs);

  // Update local state if playlist prop changes
  useEffect(() => {
    setName(playlist.name);
    setSongs(playlist.songs);
  }, [playlist]);

  const saveChanges = () => {
    const updated = { ...playlist, name, songs };
    updatePlaylist(updated);
    closeModal();
  };

  // For demonstration: add a dummy song
  const addSong = () => {
    const newSong = {
      id: Date.now().toString(),
      title: `Song ${songs.length + 1}`,
      audioUri: "https://example.com/audio.mp3",
    };
    setSongs([...songs, newSong]);
  };

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
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Edit Playlist</IonTitle>
          <IonButton slot="end" onClick={closeModal}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItemDivider>
          <IonLabel>Playlist Name</IonLabel>
        </IonItemDivider>
        <IonItem>
          <IonInput
            value={name}
            placeholder="Playlist Name"
            onIonChange={(e) => setName(e.detail.value)}
            ref={modalInputRef}
          />
        </IonItem>
        <IonButton expand="block" onClick={saveChanges} ref={saveModelRef}>
          Save Changes
        </IonButton>
        <IonItemDivider>
          <IonLabel>Songs</IonLabel>
        </IonItemDivider>
        <IonButton expand="block" onClick={addSong}>
          <IonIcon slot="start" icon={add} />
          Add Song
        </IonButton>
        <IonList>
          {songs.map((song, index) => (
            <IonItem key={song.id}>
              <IonLabel>{song.title}</IonLabel>
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
    </IonPage>
  );
};

export default Playlist;


