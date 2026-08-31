/* 有点意思工具盒 - localStorage 存储封装 */

const FT = window.FT || {};
FT.storage = {
  get(key, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? defaultValue : JSON.parse(raw);
    } catch (e) {
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  todayKey(prefix) {
    const today = new Date().toISOString().slice(0, 10);
    return `${prefix}:${today}`;
  },
  // 获取按日计数的值，自动跨天清零
  getDailyCount(keyBase) {
    const today = new Date().toISOString().slice(0, 10);
    const data = this.get(keyBase, { date: today, count: 0 });
    if (data.date !== today) {
      return { date: today, count: 0 };
    }
    return data;
  },
  addDailyCount(keyBase, amount = 1) {
    const data = this.getDailyCount(keyBase);
    data.count += amount;
    this.set(keyBase, data);
    return data.count;
  },
  getTotalCount(key) {
    return this.get(key, 0);
  },
  addTotalCount(key, amount = 1) {
    const total = this.getTotalCount(key) + amount;
    this.set(key, total);
    return total;
  },
  getDatePart() {
    return new Date().toISOString().slice(0, 10);
  },
};

window.FT = FT;
