/**
 * scroll-effects.js — 合并后的滚动/视差/进度/返回顶部统一驱动
 *
 * 优化目标：
 *  - 全站滚动监听从「多个独立 scroll + 各自 rAF」合并为「一个 scroll 回调 + 一个 rAF」，
 *    减少主线程上滚动帧的重复排队与 layout 触发。
 *  - ReadingProgress / BackToTop / HeroParallax 共享同一份滚动进度计算，
 *    一次 scroll 事件只跑一轮 rAF。
 *  - MouseGlow 不再用 offsetWidth/offsetHeight（每次 mousemove 都强制同步回流），
 *    改用固定半尺寸直算，只走合成器 transform。
 */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var progressBar = null;
  var progressNum = null;
  var backToTop = null;
  var hero = null;
  var heroLayer = null;
  var glow = null;
  var glowTicking = false;
  var glowIdleTimer = null;
  var scrollTicking = false;
  // 光斑固定尺寸：w-72 h-72 = 288px，取整避免强制回流读取 offsetWidth/offsetHeight
  var GLOW_HALF = 144;

  function queryDom() {
    progressBar = document.getElementById("reading-progress-bar");
    progressNum = document.getElementById("reading-progress-num");
    backToTop = document.getElementById("back-to-top");
    hero = document.querySelector(".hero-section");
    heroLayer = document.querySelector(".hero-parallax");
    glow = document.getElementById("mouse-glow");

    // reduced-motion 时隐藏百分比数字（保留细条）
    if (progressNum && reduce) progressNum.style.display = "none";

    // 初始隐藏返回顶部按钮（避免 FOUC 闪出）
    if (backToTop && !backToTop.classList.contains("invisible")) {
      backToTop.classList.add("opacity-0", "invisible");
    }
  }

  function updateScroll() {
    scrollTicking = false;
    var doc = document.documentElement;
    var y = window.scrollY;
    var total = doc.scrollHeight - window.innerHeight;

    // 阅读进度条 + 百分比
    if (progressBar || progressNum) {
      var pct = total > 0 ? Math.min(100, Math.max(0, (y / total) * 100)) : 0;
      if (progressBar) progressBar.style.width = pct + "%";
      if (progressNum && !reduce) progressNum.textContent = Math.round(pct) + "%";
    }

    // 返回顶部按钮显隐
    if (backToTop) {
      var show = y > 400;
      backToTop.classList.toggle("opacity-100", show);
      backToTop.classList.toggle("visible", show);
      backToTop.classList.toggle("opacity-0", !show);
      backToTop.classList.toggle("invisible", !show);
    }

    // Hero 视差（只动背景装饰层，绝不动正文；reduced-motion 时跳过）
    if (hero && heroLayer && !reduce) {
      var layer1 = heroLayer.querySelector(".hp-layer-1");
      var layer2 = heroLayer.querySelector(".hp-layer-2");
      var stars = heroLayer.querySelector(".hp-stars");
      var mega = heroLayer.querySelector(".hp-mega-name");
      if (layer1 && layer2 && stars && mega) {
        var rect = hero.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top <= window.innerHeight) {
          var vh = window.innerHeight;
          var progress = (rect.top + rect.height / 2 - vh / 2) / (vh + rect.height);
          layer1.style.transform = "translate3d(" + (progress * -56).toFixed(1) + "px," + (progress * -30).toFixed(1) + "px,0)";
          layer2.style.transform = "translate3d(" + (progress * 64).toFixed(1) + "px," + (progress * 36).toFixed(1) + "px,0)";
          stars.style.transform = "translate3d(0," + (progress * 26).toFixed(1) + "px,0)";
          mega.style.transform = "translate3d(0," + (progress * -42).toFixed(1) + "px,0)";
        }
      }
    }
  }

  function requestScrollUpdate() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(updateScroll);
  }

  function positionGlow(e) {
    if (!glow) return;
    glow.style.transform = "translate3d(" + (e.clientX - GLOW_HALF) + "px," + (e.clientY - GLOW_HALF) + "px,0)";
    glow.classList.add("opacity-100");
    glowTicking = false;
    clearTimeout(glowIdleTimer);
    glowIdleTimer = setTimeout(function () {
      glow.classList.remove("opacity-100");
    }, 2000);
  }

  function bindMouseGlow() {
    if (!glow || reduce) return;
    document.addEventListener("mousemove", function (e) {
      if (glowTicking) return;
      glowTicking = true;
      requestAnimationFrame(function () {
        positionGlow(e);
      });
    });
    document.addEventListener("mouseleave", function () {
      if (!glow) return;
      glow.classList.remove("opacity-100");
      clearTimeout(glowIdleTimer);
    });
  }

  function init() {
    queryDom();
    updateScroll();
    bindMouseGlow();
  }

  // 唯一的全局 scroll 监听（合并：进度条 / 返回顶部 / Hero 视差）
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });

  // Astro View Transitions：页面 swap 后 DOM 引用失效，重新获取并重算
  document.addEventListener("astro:page-load", init);

  init();
})();
