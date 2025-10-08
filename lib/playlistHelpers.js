import { compositeStorage } from './compositeStorage';

export const playlistHelpers = {
  async getPlaylist() {
    return await compositeStorage.getPlaylist();
  },

  async addToPlaylist(anime) {
    return await compositeStorage.addToPlaylist(anime);
  },

  async removeFromPlaylist(malId) {
    return await compositeStorage.removeFromPlaylist(malId);
  },

  async isInPlaylist(malId) {
    return await compositeStorage.isInPlaylist(malId);
  },

  async clearPlaylist() {
    return await compositeStorage.clearPlaylist();
  },

  async getStorageInfo() {
    return compositeStorage.getStorageInfo();
  }
};