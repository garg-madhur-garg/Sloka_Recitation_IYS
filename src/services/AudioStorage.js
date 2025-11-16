import { Filesystem, Directory } from '@capacitor/filesystem';

class AudioStorage {
  // Base directory for storing audio files
  baseDir = 'sloka_audio';

  // Ensure base directory exists
  async ensureBaseDir() {
    try {
      await Filesystem.mkdir({
        path: this.baseDir,
        directory: Directory.Data,
        recursive: true
      });
    } catch (error) {
      // Directory might already exist, which is fine
      console.log('Base directory check:', error);
    }
  }

  // Save audio file from Blob URL or base64 to filesystem
  // fileName: optional - if provided, use it (for uploaded files). If not, use default naming (for recorded files)
  async saveAudio(audioUri, slokaId, fileName = null) {
    try {
      await this.ensureBaseDir();
      
      let base64Data;
      
      // If it's a Blob URL, fetch and convert to base64
      if (audioUri.startsWith('blob:')) {
        const response = await fetch(audioUri);
        const blob = await response.blob();
        base64Data = await this.blobToBase64(blob);
      } 
      // If it's already base64 with data URI, use it directly
      else if (audioUri.startsWith('data:audio')) {
        base64Data = audioUri.split(',')[1];
      }
      // If it's a base64 string without data URI prefix (direct base64 from recording)
      else if (typeof audioUri === 'string' && !audioUri.startsWith('blob:') && !audioUri.startsWith('file://') && audioUri.length > 100) {
        base64Data = audioUri;
      }
      else {
        // Assume it's already a file path
        return audioUri;
      }

      // Use provided fileName (for uploads) or default naming (for recordings)
      let finalFileName;
      if (fileName) {
        // Sanitize filename - remove path separators and keep only safe characters
        finalFileName = fileName.replace(/[/\\?%*:|"<>]/g, '_');
        // Ensure it has an extension
        if (!finalFileName.match(/\.[a-zA-Z0-9]+$/)) {
          finalFileName += '.m4a';
        }
      } else {
        // Default naming for recorded files
        finalFileName = `audio_${slokaId}.m4a`;
      }
      
      const filePath = `${this.baseDir}/${finalFileName}`;

      // Write file to filesystem
      await Filesystem.writeFile({
        path: filePath,
        data: base64Data,
        directory: Directory.Data,
        recursive: true
      });

      // Return the file path (we'll use a custom protocol to identify it)
      return `file://${filePath}`;
    } catch (error) {
      console.error('Error saving audio:', error);
      throw error;
    }
  }

  // Load audio file from filesystem and return as Blob URL
  async loadAudio(filePath) {
    try {
      // Extract the actual path from our custom protocol
      const actualPath = filePath.replace('file://', '');
      
      const result = await Filesystem.readFile({
        path: actualPath,
        directory: Directory.Data
      });

      // Convert base64 to Blob URL
      const base64Data = result.data;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'audio/m4a' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error loading audio:', error);
      // Return empty string if file doesn't exist
      return '';
    }
  }

  // Delete audio file from filesystem
  async deleteAudio(filePath) {
    try {
      const actualPath = filePath.replace('file://', '');
      await Filesystem.deleteFile({
        path: actualPath,
        directory: Directory.Data
      });
    } catch (error) {
      console.error('Error deleting audio:', error);
      // File might not exist, which is fine
    }
  }

  // Convert Blob to base64
  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Check if path is a filesystem path (not a Blob URL)
  isFileSystemPath(path) {
    return path && path.startsWith('file://');
  }
}

// Create singleton instance
const audioStorage = new AudioStorage();

export default audioStorage;

