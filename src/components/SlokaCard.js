import React, { useState, useEffect } from 'react';
import { IonCard, IonCardContent, IonText, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import audioManager from '../services/AudioManager';

const SlokaCard = ({ sloka, serialNo, onDelete, currentPlayingId, onPlay }) => {
  const [, setAudioState] = useState({ currentAudioId: null, isPlaying: false });
  const history = useHistory();
  const isPlaying = audioManager.isPlaying(sloka.id);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe(setAudioState);
    return unsubscribe;
  }, []);

  const playAudio = async () => {
    if (isPlaying) {
      audioManager.stopAudio();
      onPlay(null);
    } else {
      const success = await audioManager.playAudio(sloka.audioUri, sloka.id);
      if (success) {
        onPlay(sloka.id);
      }
    }
  };

  return (
    <IonCard className="sloka-card" style={{ backgroundColor: "#1E1E1E", borderRadius: "8px", marginBottom: "8px"}}>
      <IonCardContent style={{ display: "flex", alignItems: "center", padding: "12px" }}>
        <IonText style={{ width: "30px", fontSize: "18px", color: "#BB86FC" }}>
          {serialNo}.
        </IonText>
        <div
          style={{ flex: 1, margin: "0 12px", cursor: "pointer" }}
          onClick={() => history.push("/home/slokaDetail", { sloka })}
        >
          <IonText color="light">
            <h3 style={{ margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "white", fontSize: "16px" }}>
              {sloka.title}
            </h3>
          </IonText>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <IonButton size="small" color={isPlaying ? "danger" : "primary"} onClick={playAudio}>
            <IonText>{isPlaying ? "⏹" : "▶"}</IonText>
          </IonButton>
          <IonButton size="small" color="danger" onClick={onDelete}>
            <IonText>🗑</IonText>
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default SlokaCard;
