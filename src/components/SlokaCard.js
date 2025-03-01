import React, { useState, useEffect } from 'react';
import { IonCard, IonCardContent, IonText, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const SlokaCard = ({ sloka, serialNo, onDelete, currentPlayingId, onPlay }) => {
  const [sound, setSound] = useState(null);
  const history = useHistory();
  const isPlaying = currentPlayingId === sloka.id;

  const playAudio = async () => {
    try {
      if (isPlaying) {
        await stopAudio();
        return;
      }
      if (currentPlayingId) {
        onPlay(null);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      onPlay(sloka.id);
      const newSound = new Audio(sloka.audioUri);
      newSound.loop = true;
      setSound(newSound);
      await newSound.play();
    } catch (error) {
      console.error('Playback failed', error);
    }
  };

  const stopAudio = async () => {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      setSound(null);
    }
    onPlay(null);
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.pause();
      }
    };
  }, [sound]);

  useEffect(() => {
    if (!isPlaying && sound) {
      stopAudio();
    }
  }, [isPlaying]);

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
