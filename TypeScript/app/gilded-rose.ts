import { Item, QualifiedItem, ItemFactory } from './types';

export class GildedRose {
  items: Array<QualifiedItem>;

  constructor(items = [] as Array<Item>) {
    this.items = [];

    for (let i = 0; i < items.length; i++) {
      const qualifiedItem = ItemFactory(items[i]);
      this.items[i] = qualifiedItem;
    }
  }

  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].tick();
    }

    return this.items;
  }
}
