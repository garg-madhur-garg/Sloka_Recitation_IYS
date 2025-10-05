import { toastController } from '@ionic/core';

class NotificationService {
  constructor() {
    this.toast = null;
  }

  // Show success message
  async showSuccess(message, duration = 3000) {
    this.toast = await toastController.create({
      message: message,
      duration: duration,
      color: 'success',
      position: 'bottom'
    });
    this.toast.present();
  }

  // Show error message
  async showError(message, duration = 4000) {
    this.toast = await toastController.create({
      message: message,
      duration: duration,
      color: 'danger',
      position: 'bottom'
    });
    this.toast.present();
  }

  // Show warning message
  async showWarning(message, duration = 3000) {
    this.toast = await toastController.create({
      message: message,
      duration: duration,
      color: 'warning',
      position: 'bottom'
    });
    this.toast.present();
  }

  // Show info message
  async showInfo(message, duration = 3000) {
    this.toast = await toastController.create({
      message: message,
      duration: duration,
      color: 'primary',
      position: 'bottom'
    });
    this.toast.present();
  }

  // Dismiss current toast
  dismiss() {
    if (this.toast) {
      this.toast.dismiss();
      this.toast = null;
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
