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

      // Stop any currently playing audio first
      if (currentPlayingId) {
        onPlay(null);
        await new Promise(resolve => setTimeout(resolve, 200)); // small delay
      }

      onPlay(sloka.id);

      // Create a new Audio instance, set it to loop, and start playback
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.pause();
      }
    };
  }, [sound]);

  // Stop audio if this card is no longer marked as playing
  useEffect(() => {
    if (!isPlaying && sound) {
      stopAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <IonCard style={{ backgroundColor: '#292929', borderRadius: '8px', marginBottom: '8px' }}>
      <IonCardContent style={{ display: 'flex', alignItems: 'center', padding: '12px' }}>
        <IonText style={{ width: '30px', fontSize: '18px', color: "#0054e9" }}>
          {serialNo}.
        </IonText>

        <div
          style={{ flex: 1, margin: '0 12px', cursor: 'pointer' }}
          onClick={() => history.push('/home/slokaDetail', { sloka })}
        >
          <IonText color="light">
            <h3
              style={{
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: 'white',
                fontSize: '16px',
              }}
            >
              {sloka.title}
            </h3>
          </IonText>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <IonButton size="small" color={isPlaying ? 'danger' : 'primary'} shape="round" onClick={playAudio}>
            <IonText>{isPlaying ? '⏹' : '▶'}</IonText>
          </IonButton>
          <IonButton size="small" color="danger" shape="round" onClick={onDelete}>
            <IonText>🗑</IonText>
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default SlokaCard;


