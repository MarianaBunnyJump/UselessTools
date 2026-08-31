/* 有点意思工具盒 - 主题切换 */

const FT = window.FT || {};

FT.theme = {
  palettes: [
    { id: 'warm', name: '暖色', icon: '🍑' },
    { id: 'mint', name: '薄荷', icon: '🌿' },
    { id: 'sakura', name: '樱花', icon: '🌸' },
    { id: 'dark', name: '深色', icon: '🌙' },
  ],
  current() {
    return localStorage.getItem('ft_theme') || 'warm';
  },
  apply(id) {
    const themeId = this.palettes.find(p => p.id === id) ? id : 'warm';
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('ft_theme', themeId);
    this.updateSwitcher();
  },
  init() {
    const saved = this.current();
    this.apply(saved);
    this.renderSwitcher();
    this.updateSwitcher();
  },
  renderSwitcher() {
    const containers = document.querySelectorAll('[data-theme-switcher]');
    containers.forEach(container => {
      if (container.dataset.rendered) return;
      container.dataset.rendered = 'true';
      container.classList.add('ft-theme-switcher');
      container.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        border-radius: 999px;
        background: var(--ft-card-bg);
        border: 1px solid var(--ft-card-border);
        box-shadow: var(--ft-card-shadow);
        cursor: pointer;
        font-size: 13px;
        font-weight: 600;
        user-select: none;
        color: var(--ft-text-primary);
      `;
      container.addEventListener('click', () => this.next());
    });
  },
  updateSwitcher() {
    const current = this.current();
    const palette = this.palettes.find(p => p.id === current);
    document.querySelectorAll('[data-theme-switcher]').forEach(el => {
      el.textContent = `${palette.icon} ${palette.name}`;
    });
  },
  next() {
    const current = this.current();
    const idx = this.palettes.findIndex(p => p.id === current);
    const next = this.palettes[(idx + 1) % this.palettes.length];
    this.apply(next.id);
    FT.toast?.(`已切换至 ${next.name} 主题`);
  },
};

window.FT = FT;
