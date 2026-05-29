if (typeof wx === 'undefined') {
  window.wx = {
    getSystemInfoSync() {
      return {
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        pixelRatio: window.devicePixelRatio || 1,
        platform: 'devtools',
        SDKVersion: '3.0.0',
        brand: 'browser',
        model: 'pc',
        system: 'web'
      };
    },
    setStorageSync(key, value) {
      try { localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)); } catch (e) {}
    },
    getStorageSync(key) {
      try { let v = localStorage.getItem(key); try { return JSON.parse(v); } catch (e) { return v || ''; } } catch (e) { return ''; }
    },
    removeStorageSync(key) {
      try { localStorage.removeItem(key); } catch (e) {}
    },
    clearStorageSync() {
      try { localStorage.clear(); } catch (e) {}
    },
    showToast(obj) {
      let msg = typeof obj === 'string' ? obj : (obj.title || '');
      if (window.gameApp && window.gameApp.ui) window.gameApp.ui.showToast(msg);
    },
    showModal(obj) {
      if (obj.success) obj.success({ confirm: true, cancel: false });
    },
    showLoading() {},
    hideLoading() {},
    navigateToMiniProgram() {},
    shareAppMessage() {},
    onShareAppMessage() {},
    showShareMenu() {},
    createBannerAd() { return { show() {}, hide() {}, destroy() {}, onResize() {}, onError() {} }; },
    createRewardedVideoAd() {
      let ad = {
        _loaded: true,
        show() { return new Promise((resolve) => { setTimeout(() => { if (ad.onClose) ad.onClose({ isEnded: true }); resolve(); }, 2000); }); },
        load() { return Promise.resolve(); },
        onClose: null,
        onError: null,
        onLoad: null
      };
      return ad;
    },
    createInterstitialAd() { return { show() {}, hide() {}, destroy() {} }; },
    vibrateShort() { if (navigator.vibrate) navigator.vibrate(15); },
    vibrateLong() { if (navigator.vibrate) navigator.vibrate(100); },
    getNetworkType(obj) { if (obj.success) obj.success({ networkType: 'wifi' }); },
    onNetworkStatusChange() {},
    login(obj) { if (obj && obj.success) obj.success({ code: 'mock_login_code' }); },
    getUserProfile(obj) { if (obj && obj.success) obj.success({ userInfo: { nickName: '觉醒者', avatarUrl: '', gender: 0, city: '', province: '', country: '', language: 'zh_CN' } }); },
    getUserInfo(obj) { if (obj && obj.success) obj.success({ userInfo: { nickName: '觉醒者', avatarUrl: '' } }); },
    getSetting(obj) { if (obj && obj.success) obj.success({ authSetting: { 'scope.userInfo': true } }); },
    openSetting() {},
    authorize() {},
    createOpenSettingButton() { return null; },
    getLaunchOptionsSync() { return { scene: 1001, query: {}, referrerInfo: {} }; },
    onShow() {},
    onHide() {},
    offShow() {},
    offHide() {},
    exitMiniProgram() {},
    loadSubpackage(obj) { if (obj && obj.success) obj.success({}); },
    createWorker() { return null; },
    getPerformance() { return { now: () => performance.now() }; },
    nextTick(fn) { setTimeout(fn, 0); },
    canvasGetImageData() {},
    canvasToTempFilePath() {},
    createCanvas() { return document.createElement('canvas'); },
    createSelectorQuery() {
      return {
        select() { return { boundingClientRect(cb) { cb({ width: 0, height: 0, top: 0, left: 0 }); } }; },
        exec() {}
      };
    },
    getMenuButtonBoundingClientRect() { return { width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 }; }
  };
}

window.WXCompat = {
  isWechat: typeof wx !== 'undefined' && wx.getSystemInfoSync,
  getSystemInfo() { return wx.getSystemInfoSync(); },
  getScreenWidth() { return wx.getSystemInfoSync().windowWidth; },
  getScreenHeight() { return wx.getSystemInfoSync().windowHeight; },
  getPixelRatio() { return wx.getSystemInfoSync().pixelRatio; },
  vibrate(type) { type === 'long' ? wx.vibrateLong() : wx.vibrateShort(); },
  showAd(type) {
    return new Promise((resolve) => {
      if (type === 'rewarded') {
        let ad = wx.createRewardedVideoAd({ adUnitId: 'mock_ad_unit' });
        ad.onClose = (res) => { resolve(res.isEnded); };
        ad.show().catch(() => { resolve(true); });
      } else {
        resolve(false);
      }
    });
  },
  share(title, imageUrl) {
    wx.shareAppMessage({ title: title || '塔防觉醒 - 来一起战斗吧！', imageUrl: imageUrl || '' });
  }
};
