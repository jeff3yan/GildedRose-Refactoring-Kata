import { expect } from 'chai';
import { GildedRose } from '@/gilded-rose';
import { Item } from '@/types';

describe('Gilded Rose', () => {
  context('Normal items', () => {
    context('given sellIn date = 0, quality degrades by 2', () => {
      let item: Item;
      let originalSellIn: number = 0;
      let originalQuality: number = 5;
      beforeEach(() => {
        item = new Item('Random', originalSellIn, originalQuality);
      });

      it('should decrease in quality by 2', () => {
        const gildedRose = new GildedRose([item]);
        const [{ quality }] = gildedRose.updateQuality();
        expect(quality).to.equal(originalQuality - 2);
      });
    });

    context('given sellIn date > 0, quality degrades by 1', () => {
      let item: Item;
      let originalSellIn: number = 5;
      let originalQuality: number = 5;
      beforeEach(() => {
        item = new Item('Random', originalSellIn, originalQuality);
      });

      it('should decrease in quality by 1', () => {
        const gildedRose = new GildedRose([item]);
        const [{ quality }] = gildedRose.updateQuality();
        expect(quality).to.equal(originalQuality - 1);
      });
    });
  });

  context('Aged Brie', () => {
    let item: Item;
    beforeEach(() => {
      item = new Item('Aged Brie', 0, 0);
    });

    it('should increase in quality the older it gets', () => {
      const gildedRose = new GildedRose([item]);
      const [{ quality: quality1 }] = gildedRose.updateQuality();
      expect(quality1).to.be.greaterThan(0);
      const [{ quality: quality2 }] = gildedRose.updateQuality();
      expect(quality2).to.be.greaterThan(quality1);
    });
  });

  context('Thresholds',() => {
    it('should never have negative quality', () => {
      const gildedRose = new GildedRose([new Item('foo', 0, 0)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).to.be.greaterThanOrEqual(0);
    });

    it('should never have quality > 50', () => {
      const gildedRose = new GildedRose([new Item('foo', 0, 50)]);
      const items = gildedRose.updateQuality();
      expect(items[0].quality).to.be.lessThanOrEqual(50);
    });
  });

  context('Sulfuras', () => {
    let item: Item;
    let originalSellIn: number = 0;
    let originalQuality: number = 50;
    beforeEach(() => {
      item = new Item('Sulfuras, Hand of Ragnaros', originalSellIn, originalQuality);
    });

    it('should not change the sellIn date', () => {
      const gildedRose = new GildedRose([item]);
      const [{ sellIn }] = gildedRose.updateQuality();
      expect(sellIn).to.equal(originalSellIn);
    });

    it('should not change the quality', () => {
      const gildedRose = new GildedRose([item]);
      const [{ quality }] = gildedRose.updateQuality();
      expect(quality).to.equal(originalQuality);
    });
  });

  context('Backstage passes', () => {
    context('given sellIn > 10',() => {
      let item: Item;
      let originalSellIn: number = 11;
      let originalQuality: number = 10;
      beforeEach(() => {
        item = new Item('Backstage passes to a TAFKAL80ETC concert', originalSellIn, originalQuality);
      });

      it('should increase in quality by 1', () => {
        const gildedRose = new GildedRose([item]);
        const [{ quality }] = gildedRose.updateQuality();
        expect(quality).to.equal(originalQuality + 1);
      });
    });

    context('given sellIn > 5 and sellIn <= 10', () => {
      for (let originalSellIn = 10; originalSellIn > 5; originalSellIn--) {
        context(`given sellIn = ${originalSellIn}`, () => {
          let item: Item;
          let originalQuality: number = 10;
          beforeEach(() => {
            item = new Item('Backstage passes to a TAFKAL80ETC concert', originalSellIn, originalQuality);
          });

          it('should increase in quality by 2', () => {
            const gildedRose = new GildedRose([item]);
            const [{ quality }] = gildedRose.updateQuality();
            expect(quality).to.equal(originalQuality + 2);
          });
        });
      }
    });

    context('given sellIn <= 5 and sellIn >= 0', () => {
      for (let originalSellIn = 5; originalSellIn > 0; originalSellIn--) {
        context(`given sellIn = ${originalSellIn}`, () => {
          let item: Item;
          let originalQuality: number = 10;
          beforeEach(() => {
            item = new Item('Backstage passes to a TAFKAL80ETC concert', originalSellIn, originalQuality);
          });

          it('should increase in quality by 3', () => {
            const gildedRose = new GildedRose([item]);
            const [{ quality }] = gildedRose.updateQuality();
            expect(quality).to.equal(originalQuality + 3);
          });
        });
      }
    });

    context('given sellIn <= 0', () => {
      let item: Item;
      let originalSellIn: number = 0;
      let originalQuality: number = 10;
      beforeEach(() => {
        item = new Item('Backstage passes to a TAFKAL80ETC concert', originalSellIn, originalQuality);
      });

      it('should set quality = 0', () => {
        const gildedRose = new GildedRose([item]);
        const [{ quality }] = gildedRose.updateQuality();
        expect(quality).to.equal(0);
      });
    });
  });
});