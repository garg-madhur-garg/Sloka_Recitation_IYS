import { Preferences } from '@capacitor/preferences';

class DataManager {
  constructor() {
    this.listeners = new Set();
  }

  // Subscribe to data changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of data changes
  notifyListeners() {
    this.listeners.forEach(callback => callback());
  }

  // Sloka operations
  async getSlokas() {
    try {
      const { value } = await Preferences.get({ key: 'slokas' });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error loading slokas:', error);
      return [];
    }
  }

  async saveSlokas(slokas) {
    try {
      await Preferences.set({ key: 'slokas', value: JSON.stringify(slokas) });
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error saving slokas:', error);
      return false;
    }
  }

  async addSloka(sloka) {
    const slokas = await this.getSlokas();
    slokas.push(sloka);
    return await this.saveSlokas(slokas);
  }

  async updateSloka(updatedSloka) {
    const slokas = await this.getSlokas();
    const index = slokas.findIndex(s => s.id === updatedSloka.id);
    if (index !== -1) {
      slokas[index] = updatedSloka;
      return await this.saveSlokas(slokas);
    }
    return false;
  }

  async deleteSloka(slokaId) {
    const slokas = await this.getSlokas();
    const filteredSlokas = slokas.filter(s => s.id !== slokaId);
    return await this.saveSlokas(filteredSlokas);
  }

  // Playlist operations
  async getPlaylists() {
    try {
      const { value } = await Preferences.get({ key: 'playlists' });
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error loading playlists:', error);
      return [];
    }
  }

  async savePlaylists(playlists) {
    try {
      await Preferences.set({ key: 'playlists', value: JSON.stringify(playlists) });
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Error saving playlists:', error);
      return false;
    }
  }

  async addPlaylist(playlist) {
    const playlists = await this.getPlaylists();
    playlists.push(playlist);
    return await this.savePlaylists(playlists);
  }

  async updatePlaylist(updatedPlaylist) {
    const playlists = await this.getPlaylists();
    const index = playlists.findIndex(p => p.id === updatedPlaylist.id);
    if (index !== -1) {
      playlists[index] = updatedPlaylist;
      return await this.savePlaylists(playlists);
    }
    return false;
  }

  async deletePlaylist(playlistId) {
    const playlists = await this.getPlaylists();
    const filteredPlaylists = playlists.filter(p => p.id !== playlistId);
    return await this.savePlaylists(filteredPlaylists);
  }

  // Cleanup
  cleanup() {
    this.listeners.clear();
  }
}

// Create singleton instance
const dataManager = new DataManager();

export default dataManager;
