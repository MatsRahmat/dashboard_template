export class LocalStorageService {
    static setItem<T>(key: string, value: T): void {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    static getItem<T>(key: string): T | null {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) as T : null;
    }

    static removeItem(key: string): void {
        window.localStorage.removeItem(key);
    }

    static clear(): void {
        window.localStorage.clear();
    }
}