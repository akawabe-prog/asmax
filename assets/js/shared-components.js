/**
 * ASMAX JAPAN — Shared Header & Footer Components
 * 全ページ共通のヘッダー・フッターを動的に挿入する
 *
 * Usage:
 *   <div id="site-header"></div>   ← ヘッダー挿入先
 *   <div id="site-footer"></div>   ← フッター挿入先
 *   <script src="assets/js/shared-components.js"></script>
 *
 *   product/ 配下のページでは:
 *   <script>window.__asmax_base = '../';</script>
 *   <script src="../assets/js/shared-components.js"></script>
 */

(function () {
  'use strict';

  // Detect base path (root vs product/ subfolder)
  const base = window.__asmax_base || '';

  // ──────────────────────────────────────────
  // HEADER
  // ──────────────────────────────────────────
  const headerHTML = `
  <header class="site-header">
    <div class="site-header-inner">
      <a class="logo-mark" href="${base}index.html#top" aria-label="ASMAX JAPAN">
        <img src="${base}assets/ASMAX_LOGO_WHITE.svg" alt="ASMAX JAPAN" loading="eager">
      </a>

      <nav class="site-nav" aria-label="グローバルナビゲーション">
        <div class="nav-item">
          <a href="${base}index.html#lineup" aria-haspopup="true">Products</a>
          <div class="product-dropdown" aria-label="Products submenu">
            <a href="${base}product/detail-eva-r-unit01.html">Future1(EVA Rモデル)</a>
            <a href="${base}product/detail-f1-pro.html">F1 Pro</a>
            <a href="${base}product/detail-s2.html">S2</a>
          </div>
        </div>
        <a href="${base}about.html">About</a>
        <a href="${base}cloudtalk-mode.html">CloudTalk</a>
        <a href="${base}stores.html">Shop</a>
        <a href="/contact">Contact</a>
      </nav>

      <div class="header-actions">
        <a class="cart-icon" href="/cart?site=asmax" aria-label="カート">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        </a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-drawer" aria-label="メニューを開閉">
          <span></span>
        </button>
      </div>
    </div>

    <div class="mobile-drawer" id="mobile-drawer">
      <div class="container">
        <div class="mobile-products">
          <div class="mobile-products-label">Products</div>
          <a href="${base}product/detail-eva-r-unit01.html">Future1(EVA Rモデル)</a>
          <a href="${base}product/detail-f1-pro.html">F1 Pro</a>
          <a href="${base}product/detail-s2.html">S2</a>
        </div>
        <a href="${base}about.html">About</a>
        <a href="${base}cloudtalk-mode.html">CloudTalk</a>
        <a href="${base}stores.html">Shop</a>
        <a href="/contact">Contact</a>
      </div>
    </div>
  </header>`;

  // ──────────────────────────────────────────
  // FOOTER
  // ──────────────────────────────────────────
  const footerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo-mark" href="${base}index.html#top" aria-label="ASMAX JAPAN">
            <img src="${base}assets/ASMAX_LOGO_WHITE.svg" alt="ASMAX JAPAN" loading="lazy">
          </a>
          <p>日本総代理店 ASMAX JAPAN 公式サイト。正規品・日本語サポート・2年間保証。</p>
        </div>

        <div>
          <div class="footer-title">Products</div>
          <div class="footer-column">
            <a href="${base}product/detail-eva-r-unit01.html">EVA R 初号機</a>
            <a href="${base}product/detail-eva-r-unit02.html">EVA R 2号機</a>
            <a href="${base}product/f1-pro.html">F1 Pro</a>
            <a href="${base}product/s2.html">S2</a>
          </div>
        </div>

        <div>
          <div class="footer-title">Brand</div>
          <div class="footer-column">
            <a href="${base}about.html">About ASMAX</a>
            <a href="/news">News</a>
            <a href="${base}stores.html">Partner</a>
            <a href="/affiliate">Affiliate</a>
          </div>
        </div>

        <div>
          <div class="footer-title">Support</div>
          <div class="footer-column">
            <a href="/support">FAQ</a>
            <a href="/contact">Contact</a>
            <a href="#">User Manual</a>
            <a href="#">ASMAXWorld App</a>
            <a href="#">延長保証</a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <span>&copy; 2026 ASMAX JAPAN. All rights reserved.<br>日本総代理店：カスタムジャパン</span>
        <span>
          <a href="#">特定商取引法に基づく表記</a> /
          <a href="#">プライバシーポリシー</a> /
          <a href="#">利用規約</a>
        </span>
      </div>
    </div>
  </footer>`;

  // ──────────────────────────────────────────
  // INSERT
  // ──────────────────────────────────────────
  const headerSlot = document.getElementById('site-header');
  const footerSlot = document.getElementById('site-footer');

  if (headerSlot) headerSlot.outerHTML = headerHTML;
  if (footerSlot) footerSlot.outerHTML = footerHTML;

  // ──────────────────────────────────────────
  // HEADER SCROLL EFFECT
  // ──────────────────────────────────────────
  const siteHeader = document.querySelector('.site-header');
  const heroSection = document.querySelector('.hero, .detail-hero, [data-header-sentinel]');

  if (siteHeader && heroSection) {
    const headerObs = new IntersectionObserver(([entry]) => {
      siteHeader.classList.toggle('scrolled', !entry.isIntersecting);
    }, { threshold: 0 });
    headerObs.observe(heroSection);
  } else if (siteHeader) {
    // No hero section — always show scrolled state
    siteHeader.classList.add('scrolled');
  }

  // ──────────────────────────────────────────
  // MOBILE DRAWER TOGGLE
  // ──────────────────────────────────────────
  const menuToggle = document.querySelector('.menu-toggle');
  const drawer = document.getElementById('mobile-drawer');

  if (menuToggle && drawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      drawer.classList.toggle('open', !isOpen);
      document.body.classList.toggle('drawer-open', !isOpen);
    });
  }
})();
