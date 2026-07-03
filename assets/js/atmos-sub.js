// ASMAX JAPAN — ATMOSサブページ共有スクリプト(pages/ 配下から読み込む前提)
// ヘッダー/フッターの自動挿入 + スクロールリビール

const HEADER = `
<header class="hd">
  <div class="bar">
    <a href="../index.html"><img src="../assets/ASMAX_LOGO_WHITE.svg" alt="ASMAX JAPAN"></a>
    <nav class="en">
      <a href="products.html">PRODUCT</a>
      <a href="brand.html">ABOUT</a>
      <a href="mode.html">TECHNOLOGY</a>
      <a href="support.html">SUPPORT</a>
      <a href="news.html">NEWS</a>
      <a href="stores.html">SHOP</a>
      <a href="contact.html">CONTACT</a>
      <a href="https://www.customjapan.net/cart?site=asmax" class="cart-ic" aria-label="カート"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.6"/><circle cx="17.5" cy="20" r="1.6"/><path d="M2.5 3.5h2.6l2.5 12h10.2l2.7-8.5H6.1"/></svg></a>
    </nav>
  </div>
</header>`;

const FOOTER = `
<div class="cols">
  <a href="../index.html"><img src="../assets/ASMAX_LOGO_WHITE.svg" alt="ASMAX JAPAN"></a>
  <nav class="fn">
    <div><b>PRODUCTS</b>
      <a href="../shop/f1-pro.html">F1 Pro</a>
      <a href="../shop/eva-r.html">EVA R モデル</a>
      <a href="../shop/s2.html">S2</a>
      <a href="products.html">全商品一覧</a>
      <a href="accessories.html">アクセサリー・セット</a>
    </div>
    <div><b>TECHNOLOGY</b>
      <a href="mode.html">ASMAXモード</a>
      <a href="app.html">ASMAX WORLDアプリ</a>
      <a href="brand.html">ブランドストーリー</a>
      <a href="eva-r-special.html">EVA R スペシャル</a>
    </div>
    <div><b>SUPPORT</b>
      <a href="support.html">サポート・ヘルプ</a>
      <a href="stores.html">取扱店舗</a>
      <a href="news.html">お知らせ</a>
      <a href="contact.html">お問い合わせ</a>
    </div>
    <div><b>LEGAL</b>
      <a href="legal.html">特定商取引法に基づく表記</a>
      <a href="privacy.html">プライバシーポリシー</a>
      <a href="shipping.html">配送・返品・保証</a>
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

const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.18 });
document.querySelectorAll('.rv').forEach((el) => io.observe(el));
