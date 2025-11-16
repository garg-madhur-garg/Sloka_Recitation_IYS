class AudioManager {
  constructor() {
    this.currentAudio = null;
    this.currentAudioId = null;
    this.listeners = new Set();
  }

  // Subscribe to audio state changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of state changes
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        currentAudioId: this.currentAudioId,
        isPlaying: this.currentAudio && !this.currentAudio.paused
      });
    });
  }

  // Play audio with proper cleanup
  async playAudio(audioUri, audioId) {
    try {
      // Stop current audio if playing
      if (this.currentAudio) {
        this.stopAudio();
      }

      // Create new audio instance
      this.currentAudio = new Audio(audioUri);
      this.currentAudioId = audioId;
      
      // Set up event listeners
      this.currentAudio.addEventListener('ended', () => {
        this.stopAudio();
      });

      this.currentAudio.addEventListener('error', (error) => {
        console.error('Audio playback error:', error);
        this.stopAudio();
      });

      // Play the audio
      await this.currentAudio.play();
      this.notifyListeners();
      
      return true;
    } catch (error) {
      console.error('Failed to play audio:', error);
      this.stopAudio();
      return false;
    }
  }

  // Stop current audio
  stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.currentAudioId = null;
    this.notifyListeners();
  }

  // Check if specific audio is playing
  isPlaying(audioId) {
    return this.currentAudioId === audioId && this.currentAudio && !this.currentAudio.paused;
  }

  // Cleanup all resources
  cleanup() {
    this.stopAudio();
    this.listeners.clear();
  }
}

// Create singleton instance
const audioManager = new AudioManager();

export default audioManager;
