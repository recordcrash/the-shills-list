export default class Shill {
  constructor(props) {
    this.id = props.id || 0;
    this.name = props.name || 'Shill';
    this.description = props.description || '';
    this.author = props.author || '';
    this.amount = props.amount || 0;
    this.hours = props.hours || 0;
    this.link = props.link || '';
    this.linkText = props.linktext || '';
    this.image = Shill.getImage(props);
    this.likes = props.likes || 0;
    this.readers = props.readers || 0;
    this.shortname = props.shortname || 'S';
    this.tags = Shill.getTags(props);
    try {
      this.props = JSON.parse(props.props);
    } catch (e) {
      this.props = {};
    }
    this.artList = this.props.art ? this.props.art : [];
  }

  static getImage(props) {
    // image can come as a comma separate list of images, or not contain commas, check if a comma exists
    if (!props.image) return [];
    if (props.image.includes(',')) {
      return props.image.split(',');
    } else {
      return [props.image];
    }
  }

  static getTags(props) {
    if (!props.tags) return [];
    if (props.tags.includes(',')) {
      return props.tags.split(',');
    }
    return [props.tags];
  }

  static toInstanceList(shillList) {
    return shillList.map((el) => new Shill(el));
  }

  timeString() {
    let localTime = this.hours * 6; // Let's assume people put 4 hours into a long shill a day at most
    if (localTime > 1437) return `${Math.trunc(localTime / 720)} months`;
    if (localTime > 719) return `${Math.trunc(localTime / 720)} month`;
    if (localTime > 333) return `${Math.trunc(localTime / 168)} weeks`;
    if (localTime > 167) return `${Math.trunc(localTime / 168)} week`;
    if (localTime > 47) return `${Math.trunc(localTime / 24)} days`;
    localTime = this.hours; // Readjust for small quantities
    if (localTime > 23) return `${Math.trunc(localTime / 24)} day`;
    if (localTime > 1) return `${localTime} hours`;
    return `${localTime} hour`;
  }

  timeInvestmentString() {
    if (this.hours === 1) return '1 hour';
    if (this.hours < 5) return `${this.hours} hours`;
    return `${this.hours} hours (${this.timeString()})`;
  }

  hasSingleImage() {
    return this.image.length < 2;
  }

  cardGradient() {
    if (this.props && this.props.light) return 'to bottom, black, transparent 60%, transparent';
    return '';
  }

  hasNoArt() {
    return this.artList.length < 1;
  }

  pageTitle() {
    return `${this.name} - The Shills List`;
  }
}
