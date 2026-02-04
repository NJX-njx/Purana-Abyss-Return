export const sizes = { width: 1440, height: 720 };

export let canvas_game = null;
export let canvas_ui = null;
export let ctx_game = null;
export let ctx_ui = null;
let viewportEl = null;

export function getCanvasResources() {
    if (typeof document === 'undefined') return null;
    if (!canvas_game) canvas_game = document.getElementById('game-canvas');
    if (!canvas_ui) canvas_ui = document.getElementById('ui-canvas');
    if (!canvas_game || !canvas_ui) return null;
    if (!ctx_game) ctx_game = canvas_game.getContext('2d');
    if (!ctx_ui) ctx_ui = canvas_ui.getContext('2d');
    if (!viewportEl) viewportEl = document.querySelector('.game-viewport');
    if (!ctx_game || !ctx_ui) return null;
    return { canvas_game, canvas_ui, ctx_game, ctx_ui, viewportEl };
}

/**
 * Sync canvas internal pixel buffer size with the CSS display size.
 * Handles devicePixelRatio for crisp rendering and applies visual transform
 * to game canvas to emulate the original 80px left offset in design.
 */
export function setupCanvasResize() {
    const resources = getCanvasResources();
    if (!resources) return () => {};
    const { canvas_game, canvas_ui, ctx_game, ctx_ui, viewportEl } = resources;

    function resizeOnce() {
        if (!viewportEl) return;

        const dpr = window.devicePixelRatio || 1;
        const designWidth = sizes.width;
        const designHeight = sizes.height;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scale = Math.min(viewportWidth / designWidth, viewportHeight / designHeight) || 1;
        const offsetX = (viewportWidth - designWidth * scale) / 2;
        const offsetY = (viewportHeight - designHeight * scale) / 2;

        // 同步视窗的平移与缩放，使游戏区域始终居中显示
        viewportEl.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

        // 更新 Canvas 的像素缓冲尺寸，确保在高 DPI 屏幕上保持清晰
        const targetWidth = Math.max(1, Math.round(designWidth * dpr));
        const targetHeight = Math.max(1, Math.round(designHeight * dpr));
        if (canvas_game.width !== targetWidth || canvas_game.height !== targetHeight) {
            canvas_game.width = targetWidth;
            canvas_game.height = targetHeight;
        }
        if (canvas_ui.width !== targetWidth || canvas_ui.height !== targetHeight) {
            canvas_ui.width = targetWidth;
            canvas_ui.height = targetHeight;
        }

        ctx_game.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx_ui.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx_game.imageSmoothingEnabled = false;
        ctx_ui.imageSmoothingEnabled = false;

        // 视觉上右移游戏画面，给左侧 UI（血条）保留空间
        const offset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--game-offset')) || 80;
        canvas_game.style.transform = `translateX(${offset}px)`;
        canvas_ui.style.transform = 'translateZ(0)';
        canvas_game.style.transformOrigin = '0 0';
        canvas_ui.style.transformOrigin = '0 0';

        document.documentElement.style.setProperty('--viewport-scale', scale.toString());
        document.documentElement.style.setProperty('--viewport-offset-x', `${offsetX}px`);
        document.documentElement.style.setProperty('--viewport-offset-y', `${offsetY}px`);
    }

    // debounce resize
    let resizeTimer = null;
    function onResize() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resizeOnce();
            resizeTimer = null;
        }, 50);
    }

    // initial
    resizeOnce();
    window.addEventListener('resize', onResize);
    // also observe fullscreen change because fullscreen might change CSS sizes
    ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'].forEach(ev => {
        window.addEventListener(ev, onResize);
    });

    return () => {
        window.removeEventListener('resize', onResize);
        ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'].forEach(ev => {
            window.removeEventListener(ev, onResize);
        });
    };
}
export function drawSprite(ctx, image, x, y, width, height, facing = 1) {
    ctx.save();

    if (facing === -1) {
        // 左翻转
        ctx.translate(x + width, y);
        ctx.scale(-1, 1);
        ctx.drawImage(image, 0, 0, width, height);
    } else {
        // 正常绘制
        ctx.drawImage(image, x, y, width, height);
    }

    ctx.restore();
}
