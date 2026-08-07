// ASMAX JAPAN — ATMOSサブページ共有スクリプト(pages/ 配下から読み込む前提)
// ヘッダー/フッターの自動挿入 + スクロールリビール

const HEADER = `
<header class="hd">
  <div class="bar">
    <a href="/" class="brand"><img src="/assets/ASMAX_LOGO_WHITE.svg" alt="ASMAX JAPAN"><span class="brand-sub">国内正規取扱店<br>Custom Japan</span></a>
    <nav class="en">
      <div class="nav-drop">
        <a href="/pages/products">PRODUCT<span class="caret">▼</span></a>
        <div class="drop"><div class="drop-in">
          <a href="/shop/f1-pro.html"><img src="/assets/products/29159413/thumb.jpg" alt="ASMAX Pro"><span><b>ASMAX PRO</b><i>フラッグシップ</i></span></a>
          <a href="/shop/eva-r.html"><img src="/assets/products/29200252/thumb.jpg" alt="EVA RACING MODEL"><span><b>EVA RACING MODEL</b><i>EVANGELION RACING</i></span></a>
          <a href="/shop/s2.html"><img src="/assets/products/29159437/thumb.jpg" alt="ASMAX Standard"><span><b>ASMAX Standard</b><i>41g エントリー</i></span></a>
          <a class="all" href="/pages/products"><b>全商品一覧</b><b>→</b></a>
        </div></div>
      </div>
      <a href="/pages/brand">ABOUT</a>
      <a href="/pages/mode">TECHNOLOGY</a>
      <a href="/pages/support">SUPPORT</a>
      <a href="/pages/news">NEWS</a>
      <a href="/pages/stores">SHOP</a>
      <a href="/pages/contact">CONTACT</a>
      <a href="https://www.customjapan.net/cart?site=asmax" class="cart-ic" aria-label="カート"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.6"/><circle cx="17.5" cy="20" r="1.6"/><path d="M2.5 3.5h2.6l2.5 12h10.2l2.7-8.5H6.1"/></svg></a>
    </nav>
  </div>
</header>`;

const FOOTER = `
<div class="cols">
  <a href="/"><img src="/assets/ASMAX_LOGO_WHITE.svg" alt="ASMAX JAPAN"></a>
  <nav class="fn">
    <div><b>PRODUCTS</b>
      <a href="/shop/f1-pro.html">ASMAX Pro</a>
      <a href="/shop/eva-r.html">EVA RACING MODEL</a>
      <a href="/shop/s2.html">ASMAX Standard</a>
      <a href="/pages/products">全商品一覧</a>
      <a href="/pages/accessories">アクセサリー・セット</a>
    </div>
    <div><b>TECHNOLOGY</b>
      <a href="/pages/mode">ASMAXモード</a>
      <a href="/pages/app">ASMAX WORLDアプリ</a>
      <a href="/pages/brand">ブランドストーリー</a>
      <a href="/pages/eva-r-special">EVA RACING スペシャル</a>
    </div>
    <div><b>SUPPORT</b>
      <a href="/pages/support">サポート・ヘルプ</a>
      <a href="/pages/stores">取扱店舗</a>
      <a href="/pages/news">お知らせ</a>
      <a href="/pages/contact">お問い合わせ</a>
    </div>
    <div><b>LEGAL</b>
      <a href="/pages/legal">特定商取引法に基づく表記</a>
      <a href="/pages/privacy">プライバシーポリシー</a>
      <a href="/pages/terms">ご利用規約</a>
      <a href="/pages/shipping">配送・返品・保証</a>
    </div>
  </nav>
</div>
<div class="base">
  <p class="lic" data-lic></p>
  <p class="cp">© ASMAX JAPAN / CUSTOM JAPAN Co., Ltd.</p>
</div>`;

document.body.insertAdjacentHTML('afterbegin', HEADER);
const foot = document.querySelector('footer');
if (foot) {
  foot.innerHTML = FOOTER;
  const lic = foot.querySelector('[data-lic]');
  if (document.body.dataset.lic) lic.textContent = document.body.dataset.lic; else lic.remove();
}

// リビール要素に役割クラスを自動付与
document.querySelectorAll('.rv').forEach((el) => {
  const HEAD = 'h1,h2,.t,.m';
  if (el.matches('img,video,.vis,.pk,.iv-wrap,.posters,.units,.shop-photos,.eva-photos,.mosaic')) el.classList.add('is-vis');
  else if (el.matches('.tile,.value,.mode-card,.eco-cell,.store,.p-tile,.unit,.era-row,.numbers div,.nov .tile')) el.classList.add('is-card');
  else if (el.matches(HEAD) || el.querySelector(HEAD)) el.classList.add('is-head');
  else if (el.matches('.bs-ch,.sec-head,.fno,.eyebrow')) el.classList.add('is-head');
});

const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.18 });
document.querySelectorAll('.rv').forEach((el) => io.observe(el));
