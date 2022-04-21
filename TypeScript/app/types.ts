export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

interface DegradationFunction {
  (time: number, quality: number): number;
}

interface IQualifiedItem {
  name: string;
  sellIn: number;
  quality: number;

  degrade: DegradationFunction;
  tick(): void;
}

const DefaultDegradation: DegradationFunction = (time: number, quality: number) => {
  let delta = -1;

  if (time <= 0)
    delta = -2;

  return Math.max(quality + delta, 0);
}

export class QualifiedItem implements IQualifiedItem {
  name: string;
  sellIn: number;
  quality: number;
  degrade: DegradationFunction;

  constructor(name, sellIn, quality, degrade = DefaultDegradation) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
    this.degrade = degrade;
  }

  tick() {
    this.quality = this.degrade(this.sellIn, this.quality);
    this.sellIn--;
  }
}

const BackstagePassDegradation: DegradationFunction = (time: number, quality: number) => {
  if (time <= 0)
    return 0;

  if (time <= 10 && time > 5)
    return quality + 2;

  if (time <= 5 && time > 0)
    return quality + 3;

  return quality + 1;
}

class BackstagePassItem extends QualifiedItem {
  constructor(name, sellIn, quality) {
    super(name, sellIn, quality, BackstagePassDegradation);
  }
}

const SulfurasDegradation: DegradationFunction = (time: number, quality: number) => {
  return quality;
}

class SulfurasItem extends QualifiedItem {
  constructor(name, sellIn, quality) {
    super(name, sellIn, quality, SulfurasDegradation);
  }

  tick() {
    this.quality = this.degrade(this.sellIn, this.quality);
  }
}

const AgedBrieDegradation: DegradationFunction = (time: number, quality: number) => {
  return quality + 1;
}

class AgedBrieItem extends QualifiedItem {
  constructor(name, sellIn, quality) {
    super(name, sellIn, quality, AgedBrieDegradation);
  }
}

export function ItemFactory(item: Item): IQualifiedItem {
  const { name, sellIn, quality } = item;

  if (name === 'Backstage passes to a TAFKAL80ETC concert')
    return new BackstagePassItem(name, sellIn, quality);
  else if (name === 'Sulfuras, Hand of Ragnaros')
    return new SulfurasItem(name, sellIn, quality);
  else if (name === 'Aged Brie')
    return new AgedBrieItem(name, sellIn, quality);

  return new QualifiedItem(name, sellIn, quality);
}