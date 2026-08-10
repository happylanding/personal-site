/**
 * scroll-effects.js — 合并后的滚动/视差/进度/返回顶部统一驱动
 *
 * 优化目标：
 *  - 全站滚动监听从「多个独立 scroll + 各自 rAF」合并为「一个 scroll 回调 + 一个 rAF」，
 *    减少主线程上滚动帧的重复排队与 layout 触发。
 *  - ReadingProgress / BackToTop / HeroParallax 共享同一份滚动进度计算，
 *    一次 scroll 事件只跑一轮 rAF。
 */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var progressBar = null;
  var progressNum = null;
  var backToTop = null;
  var hero = null;
  var heroLayer = null;
  var scrollTicking = false;

  function queryDom() {
    progressBar = document.getElementById("reading-progress-bar");
    progressNum = document.getElementById("reading-progress-num");
    backToTop = document.getElementById("back-to-top");
    hero = document.querySelector(".hero-section");
    heroLayer = document.querySelector(".hero-parallax");

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

  function init() {
    queryDom();
    updateScroll();

    // 返回顶部：点击平滑滚动回顶部（原实现只做了显隐，漏掉了 click 绑定）
    if (backToTop && !backToTop.__backToTopBound) {
      backToTop.__backToTopBound = true;
      backToTop.addEventListener("click", function () {
        var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
          window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      });
    }
  }

  // 唯一的全局 scroll 监听（合并：进度条 / 返回顶部 / Hero 视差）
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });

  // Astro View Transitions：页面 swap 后 DOM 引用失效，重新获取并重算
  document.addEventListener("astro:page-load", init);

  init();
})();
