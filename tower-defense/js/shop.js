window.ShopSystem = class ShopSystem {
  constructor() {
    this.items = GameConfig.ECONOMY.shopItems;
    this.purchases = {};
  }

  getItems(tab) {
    if (tab === '推荐') return this.items;
    if (tab === '礼包') return this.items.filter(i => ['chest', 'monthly'].includes(i.id));
    if (tab === '资源') return this.items.filter(i => ['energy_potion', 'gold_bag', 'sweep'].includes(i.id));
    if (tab === '皮肤') return this.items.filter(i => i.id === 'skin');
    return this.items;
  }

  canAfford(item, gold, gems) {
    return item.currency === 'gem' ? gems >= item.price : gold >= item.price;
  }

  purchase(itemId, gold, gems) {
    let item = this.items.find(i => i.id === itemId);
    if (!item) return { success: false, msg: '商品不存在' };
    if (!this.canAfford(item, gold, gems)) return { success: false, msg: '资源不足' };
    this.purchases[itemId] = (this.purchases[itemId] || 0) + 1;
    let cost = item.price;
    let currency = item.currency;
    return { success: true, cost, currency, item };
  }
};
