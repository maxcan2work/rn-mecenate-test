import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';
import 'react-native-get-random-values';
import uuid from 'react-native-uuid';

const TOKEN_KEY = 'mecenate.auth_token';

export class AuthStore {
  token: string | null = null;
  isReady = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async init() {
    try {
      const stored = await AsyncStorage.getItem(TOKEN_KEY);
      if (stored) {
        runInAction(() => {
          this.token = stored;
          this.isReady = true;
        });
        return;
      }
      const fresh = uuid.v4() as string;
      await AsyncStorage.setItem(TOKEN_KEY, fresh);
      runInAction(() => {
        this.token = fresh;
        this.isReady = true;
      });
    } catch {
      const fallback = uuid.v4() as string;
      runInAction(() => {
        this.token = fallback;
        this.isReady = true;
      });
    }
  }

  async reset() {
    await AsyncStorage.removeItem(TOKEN_KEY);
    runInAction(() => {
      this.token = null;
      this.isReady = false;
    });
    await this.init();
  }
}
