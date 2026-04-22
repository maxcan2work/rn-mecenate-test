import { makeAutoObservable } from 'mobx';
import type { Tier } from '@/api/types';

export class UIStore {
  tierFilter: Tier | null = null;
  simulateError = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setTierFilter(tier: Tier | null) {
    this.tierFilter = tier;
  }

  toggleSimulateError() {
    this.simulateError = !this.simulateError;
  }
}
