/* 有点意思工具盒 - 通用工具函数 */

const FT = window.FT || {};

FT.toast = (function () {
  let el = null;
  let timer = null;
  return function (msg, duration = 2000) {
    if (!el) {
      el = document.createElement('div');
      el.className = 'ft-toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('show'), duration);
  };
})();

FT.modal = (function () {
  let overlay = null;
  function ensure() {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'ft-modal-overlay';
      document.body.appendChild(overlay);
    }
    return overlay;
  }
  return {
    show(options = {}) {
      const { title = '', content = '', confirmText = '确定', cancelText = '取消', onConfirm, onCancel, showCancel = true } = options;
      const o = ensure();
      o.innerHTML = `
        <div class="ft-modal">
          <div class="ft-modal-title">${title}</div>
          <div class="ft-modal-body" style="color:var(--ft-text-secondary);font-size:14px;line-height:1.7;text-align:center;">${content}</div>
          <div class="ft-modal-actions">
            ${showCancel ? `<button class="ft-btn ft-btn-secondary ft-modal-cancel">${cancelText}</button>` : ''}
            <button class="ft-btn ft-btn-primary ft-modal-confirm">${confirmText}</button>
          </div>
        </div>
      `;
      requestAnimationFrame(() => o.classList.add('show'));
      o.onclick = (e) => {
        if (e.target === o) this.close();
      };
      const confirmBtn = o.querySelector('.ft-modal-confirm');
      const cancelBtn = o.querySelector('.ft-modal-cancel');
      confirmBtn.onclick = () => {
        this.close();
        if (typeof onConfirm === 'function') onConfirm();
      };
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          this.close();
          if (typeof onCancel === 'function') onCancel();
        };
      }
    },
    close() {
      if (overlay) overlay.classList.remove('show');
    },
    prompt(options = {}) {
      const { title = '', placeholder = '请输入', defaultValue = '', confirmText = '保存', cancelText = '取消', onConfirm, onCancel } = options;
      const o = ensure();
      o.innerHTML = `
        <div class="ft-modal">
          <div class="ft-modal-title">${title}</div>
          <div class="ft-modal-body" style="margin:12px 0;">
            <input type="text" class="ft-input ft-modal-input" placeholder="${placeholder}" value="${FT.escapeHtml(defaultValue)}">
          </div>
          <div class="ft-modal-actions">
            <button class="ft-btn ft-btn-secondary ft-modal-cancel">${cancelText}</button>
            <button class="ft-btn ft-btn-primary ft-modal-confirm">${confirmText}</button>
          </div>
        </div>
      `;
      requestAnimationFrame(() => {
        o.classList.add('show');
        const input = o.querySelector('.ft-modal-input');
        if (input) input.focus();
      });
      o.onclick = (e) => {
        if (e.target === o) this.close();
      };
      const confirmBtn = o.querySelector('.ft-modal-confirm');
      const cancelBtn = o.querySelector('.ft-modal-cancel');
      const inputEl = o.querySelector('.ft-modal-input');
      const submit = () => {
        const value = inputEl.value.trim();
        if (!value) return;
        this.close();
        if (typeof onConfirm === 'function') onConfirm(value);
      };
      confirmBtn.onclick = submit;
      inputEl.onkeydown = (e) => {
        if (e.key === 'Enter') submit();
      };
      cancelBtn.onclick = () => {
        this.close();
        if (typeof onCancel === 'function') onCancel();
      };
    },
  };
})();

FT.escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

FT.copyText = async function (text) {
  try {
    await navigator.clipboard.writeText(text);
    FT.toast('已复制');
    return true;
  } catch (err) {
    FT.toast('复制失败');
    return false;
  }
};

FT.countUp = function (element, start, end, duration = 800) {
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(start + (end - start) * ease);
    element.textContent = value.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
};

FT.shareCanvas = function (title, lines = []) {
  const canvas = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = 750 * dpr;
  canvas.height = 1334 * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  // 背景
  const grad = ctx.createLinearGradient(0, 0, 750, 1334);
  grad.addColorStop(0, '#FFF8E7');
  grad.addColorStop(0.5, '#F1F8E9');
  grad.addColorStop(1, '#E0F7FA');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 750, 1334);

  // 装饰圆点
  const colors = ['#FFB74D', '#4DB6AC', '#FFB3C6', '#B2DFDB', '#FFE0B2'];
  for (let i = 0; i < 18; i++) {
    ctx.fillStyle = colors[i % colors.length] + '33';
    ctx.beginPath();
    ctx.arc(Math.random() * 750, Math.random() * 1334, 6 + Math.random() * 18, 0, Math.PI * 2);
    ctx.fill();
  }

  // 标题
  ctx.fillStyle = '#475569';
  ctx.font = '600 36px "Noto Sans SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 375, 160);

  // 分隔线
  ctx.strokeStyle = 'rgba(203,213,225,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(220, 190);
  ctx.lineTo(530, 190);
  ctx.stroke();

  // 内容行
  ctx.textAlign = 'center';
  let y = 360;
  lines.forEach((line, idx) => {
    if (idx === 0 && lines.length > 1) {
      ctx.font = '800 72px "Baloo 2", sans-serif';
      ctx.fillStyle = '#FF9800';
    } else {
      ctx.font = '500 32px "Noto Sans SC", sans-serif';
      ctx.fillStyle = '#475569';
    }
    ctx.fillText(line, 375, y);
    y += (idx === 0 ? 90 : 60);
  });

  // 小程序码占位
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(275, 980, 200, 200, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(203,213,225,0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '24px "Noto Sans SC", sans-serif';
  ctx.fillText('小程序码', 375, 1095);

  // 水印
  ctx.fillStyle = '#94a3b8';
  ctx.font = '26px "Baloo 2", "Noto Sans SC", sans-serif';
  ctx.fillText('有点意思工具盒', 375, 1260);

  return canvas;
};

FT.shareImage = function (title, lines = []) {
  const canvas = FT.shareCanvas(title, lines);
  const dataUrl = canvas.toDataURL('image/png');
  const modal = document.createElement('div');
  modal.className = 'ft-modal-overlay show';
  modal.style.cssText = 'padding:20px;z-index:300;';
  modal.innerHTML = `
    <div class="ft-modal" style="max-width:340px;padding:16px;">
      <div class="ft-modal-title" style="font-size:16px;margin-bottom:10px;">分享卡片</div>
      <img src="${dataUrl}" style="width:100%;border-radius:12px;display:block;margin-bottom:14px;box-shadow:0 6px 20px rgba(0,0,0,.12);">
      <div class="ft-modal-actions">
        <button class="ft-btn ft-btn-secondary ft-modal-close">关闭</button>
        <button class="ft-btn ft-btn-primary ft-modal-download">保存图片</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
  modal.querySelector('.ft-modal-close').onclick = () => modal.remove();
  modal.querySelector('.ft-modal-download').onclick = () => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'fun-toolbox-share.png';
    a.click();
    FT.toast('已生成分享图片');
  };
};

FT.formatNumber = (n) => n.toLocaleString('zh-CN');

FT.debounce = (fn, wait = 200) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

window.FT = FT;
