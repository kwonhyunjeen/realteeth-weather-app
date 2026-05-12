interface StorageDriver {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

class InMemoryStorage implements StorageDriver {
  private readonly storage = new Map<string, string>();

  getItem(key: string) {
    return this.storage.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.storage.set(key, value);
  }

  removeItem(key: string) {
    this.storage.delete(key);
  }

  clear() {
    this.storage.clear();
  }
}

export class SafeLocalStorage {
  private readonly storage: StorageDriver;

  constructor(storage: StorageDriver) {
    this.storage = storage;
  }

  getItem(key: string) {
    const item = this.storage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as unknown;
    } catch {
      return null;
    }
  }

  setItem(key: string, value: unknown) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.storage.clear();
  }

  static isAvailable() {
    // 쿠키 차단 등의 이유로 localStorage를 사용할 수 없는 경우 검증
    const key = `is-local-storage-available:${Math.random().toString(36).slice(2)}`;
    try {
      localStorage.setItem(key, 'true');
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
}

const localStorageAvailable = SafeLocalStorage.isAvailable();
if (!localStorageAvailable) console.error('Local storage is not available.');

export const safeLocalStorage = new SafeLocalStorage(localStorageAvailable ? localStorage : new InMemoryStorage());
