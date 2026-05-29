window.SocialSystem = class SocialSystem {
  constructor() {
    this.friends = [
      { id: 1, name: '森林守卫', avatar: '🧝', online: true, lastSeen: null, level: 25 },
      { id: 2, name: '暗夜猎手', avatar: '🧛', online: true, lastSeen: null, level: 30 },
      { id: 3, name: '火焰法师', avatar: '🧙', online: false, lastSeen: '3小时前', level: 22 },
      { id: 4, name: '钢铁堡垒', avatar: '🤖', online: false, lastSeen: '昨天', level: 18 }
    ];
    this.leaderboard = this._generateLeaderboard();
  }

  _generateLeaderboard() {
    let names = ['觉醒者', '暗影之王', '雷霆泰坦', '冰霜女巫', '炎魔领主', '森林守护', '圣光骑士', '毒蛇女王', '机械大师', '暗夜猎手'];
    return names.map((name, i) => ({
      rank: i + 1,
      name,
      score: 5000 - i * 300 + Math.floor(Math.random() * 200),
      level: 30 - i
    }));
  }

  getFriends() { return this.friends; }
  getOnlineFriends() { return this.friends.filter(f => f.online); }
  getLeaderboard() { return this.leaderboard; }

  addFriend(name) {
    this.friends.push({ id: Date.now(), name, avatar: '🤖', online: false, lastSeen: '刚刚', level: 1 });
  }

  sendEnergy(friendId) {
    let friend = this.friends.find(f => f.id === friendId);
    return friend ? { success: true, msg: `已向${friend.name}赠送体力` } : { success: false, msg: '好友不存在' };
  }

  challengeFriend(friendId) {
    let friend = this.friends.find(f => f.id === friendId);
    return friend ? { success: true, msg: `已向${friend.name}发起约战` } : { success: false, msg: '好友不存在' };
  }

  shareResult(result) {
    return { success: true, msg: '分享成功' };
  }
};
