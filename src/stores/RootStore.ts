import { AuthStore } from './AuthStore';
import { UIStore } from './UIStore';

export class RootStore {
  auth: AuthStore;
  ui: UIStore;

  constructor() {
    this.auth = new AuthStore();
    this.ui = new UIStore();
  }
}
