// Storage untuk IndexedDB
const indexedDBHelpers = {
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("AnimePlaylistDB", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("playlist")) {
          db.createObjectStore("playlist", { keyPath: "mal_id" });
        }
      };
    });
  },

  async getPlaylist() {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["playlist"], "readonly");
        const store = transaction.objectStore("playlist");
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });
    } catch (error) {
      console.error("IndexedDB get error:", error);
      return [];
    }
  },

  async savePlaylist(playlist) {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["playlist"], "readwrite");
        const store = transaction.objectStore("playlist");

        // Clear existing data
        store.clear();

        // Add all items
        playlist.forEach((anime) => {
          store.add(anime);
        });

        transaction.oncomplete = () => resolve(true);
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error("IndexedDB save error:", error);
      return false;
    }
  },

  async addToPlaylist(anime) {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["playlist"], "readwrite");
        const store = transaction.objectStore("playlist");
        const request = store.add(anime);

        request.onsuccess = () => resolve(true);
        request.onerror = () => {
          // Handle duplicate key error
          if (request.error.name === "ConstraintError") {
            resolve(false); // Already exists
          } else {
            reject(request.error);
          }
        };
      });
    } catch (error) {
      console.error("IndexedDB add error:", error);
      return false;
    }
  },

  async removeFromPlaylist(malId) {
    try {
      const db = await this.openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(["playlist"], "readwrite");
        const store = transaction.objectStore("playlist");
        const request = store.delete(malId);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("IndexedDB remove error:", error);
      return false;
    }
  },
};

// Storage untuk localStorage (optimized)
const localStorageHelpers = {
  getPlaylist() {
    try {
      const stored = localStorage.getItem("anime-playlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  savePlaylist(playlist) {
    try {
      const compressed = this.compressData(playlist);
      localStorage.setItem("anime-playlist", JSON.stringify(compressed));
      return true;
    } catch (error) {
      console.error("localStorage save error:", error);
      return false;
    }
  },

  compressData(data) {
    return data.map((item) => ({
      mal_id: item.mal_id,
      title: item.title,
      images: {
        jpg: {
          image_url: item.images?.jpg?.image_url || "",
          small_image_url: item.images?.jpg?.small_image_url || "",
        },
      },
      type: item.type,
      episodes: item.episodes,
      score: item.score,
      genres: item.genres || [],
      members: item.members,
      year: item.year,
      status: item.status,
    }));
  },
};

// Composite Storage Manager
export class CompositeStorage {
  constructor() {
    this.storagePriority = ["indexedDB", "localStorage"];
    this.activeStorage = null;
    this.supportedStorages = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return this.activeStorage;

    // Test semua storage methods
    const tests = await Promise.allSettled([
      this.testIndexedDB(),
      this.testLocalStorage(),
    ]);

    this.supportedStorages = this.storagePriority.filter(
      (_, index) => tests[index].status === "fulfilled" && tests[index].value
    );

    this.activeStorage = this.supportedStorages[0] || "localStorage";
    this.initialized = true;

    console.log(`✅ Active storage: ${this.activeStorage}`);
    console.log(`📦 Supported: ${this.supportedStorages.join(", ")}`);

    return this.activeStorage;
  }

  async testIndexedDB() {
    try {
      await indexedDBHelpers.openDB();
      return true;
    } catch {
      return false;
    }
  }

  testLocalStorage() {
    try {
      const test = "test";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  async getPlaylist() {
    await this.initialize();

    // Coba dari semua supported storages
    for (const storageType of this.supportedStorages) {
      try {
        let data = [];

        switch (storageType) {
          case "indexedDB":
            data = await indexedDBHelpers.getPlaylist();
            break;
          case "localStorage":
            data = localStorageHelpers.getPlaylist();
            break;
        }

        if (data && data.length > 0) {
          console.log(`📥 Loaded from ${storageType}: ${data.length} items`);
          return data;
        }
      } catch (error) {
        console.warn(`Failed to load from ${storageType}:`, error);
      }
    }

    return [];
  }

  async savePlaylist(playlist) {
    await this.initialize();
    let success = false;

    // Simpan ke semua supported storages
    for (const storageType of this.supportedStorages) {
      try {
        let result = false;

        switch (storageType) {
          case "indexedDB":
            result = await indexedDBHelpers.savePlaylist(playlist);
            break;
          case "localStorage":
            result = localStorageHelpers.savePlaylist(playlist);
            break;
        }

        if (result) {
          console.log(`💾 Saved to ${storageType}: ${playlist.length} items`);
          success = true;
        }
      } catch (error) {
        console.warn(`Failed to save to ${storageType}:`, error);
      }
    }

    return success;
  }

  async addToPlaylist(anime) {
    const playlist = await this.getPlaylist();
    const exists = playlist.some((item) => item.mal_id === anime.mal_id);

    if (!exists) {
      const newPlaylist = [...playlist, anime];

      // Batasi maksimal 200 item
      if (newPlaylist.length > 200) {
        newPlaylist.shift();
      }

      return await this.savePlaylist(newPlaylist);
    }

    return false;
  }

  async removeFromPlaylist(malId) {
    const playlist = await this.getPlaylist();
    const newPlaylist = playlist.filter((item) => item.mal_id !== malId);
    return await this.savePlaylist(newPlaylist);
  }

  async isInPlaylist(malId) {
    const playlist = await this.getPlaylist();
    return playlist.some((item) => item.mal_id === malId);
  }

  async clearPlaylist() {
    await this.initialize();
    let success = false;

    for (const storageType of this.supportedStorages) {
      try {
        switch (storageType) {
          case "indexedDB":
            await indexedDBHelpers.savePlaylist([]);
            break;
          case "localStorage":
            localStorage.removeItem("anime-playlist");
            break;
        }
        console.log(`🗑️ Cleared ${storageType}`);
        success = true;
      } catch (error) {
        console.warn(`Failed to clear ${storageType}:`, error);
      }
    }

    return success;
  }

  getStorageInfo() {
    return {
      active: this.activeStorage,
      supported: this.supportedStorages,
    };
  }
}

// Export singleton instance
export const compositeStorage = new CompositeStorage();
