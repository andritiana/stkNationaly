import { inject, Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage?: Storage;
  storage!: Promise<Storage>;

  constructor() {
    void this.init();
  }

  private init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    this.storage = this._storage
    ? Promise.resolve(this._storage)
    : inject(Storage).create();
  }

  get<V = unknown>(key: string): Promise<V> {
    return this.storage.then(s => s.get(key) as Promise<V>);
  }

  set<V = unknown>(key: string, value: V): Promise<V> {
    return this.storage.then(s => s.set(key, value) as Promise<V>);
  }
}
