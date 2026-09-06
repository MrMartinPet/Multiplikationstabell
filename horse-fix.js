"use strict";
(()=>{
  const baseScene = sceneSVG;

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "mobile-clean.css?v=13";
  document.head.appendChild(css);

  const style = document.createElement("style");
  style.textContent = `
    #openStable{display:inline-flex!important}
    .stableHotspot{position:absolute;right:14px;bottom:14px;z-index:30;border:0;border-radius:18px;padding:10px 13px;background:rgba(255,250,244,.93);box-shadow:0 8px 24px rgba(60,40,20,.18);display:flex;align-items:center;gap:9px;color:#2c261f;font-weight:900;cursor:pointer}
    .stableHotspot .stableIcon{font-size:24px}.stableHotspot span{display:block;text-align:left}.stableHotspot small{display:block;font-size:10px;opacity:.68;margin-top:2px}
    [data-theme=dark] .stableHotspot{background:rgba(34,39,34,.94);color:#f5efe7}
    .wardrobeIntro{margin:0 0 10px;padding:12px 13px;border:1px solid var(--line);border-radius:16px;background:var(--surface2)}
    .wardrobeIntro b,.wardrobeIntro span{display:block}.wardrobeIntro span{margin-top:4px;font-size:12px;color:var(--muted);font-weight:750;line-height:1.35}
    @media(max-width:720px){.stableHotspot{right:10px;bottom:10px;padding:9px 11px}.stableHotspot .stableIcon{font-size:21px}.stableHotspot small{display:none}}
  `;
  document.head.appendChild(style);

  const addUnique = (list, items) => {
    for (const item of items) if (!list.some(x => x.id === item.id)) list.push(item);
  };

  addUnique(playerShop.hair,[
    i("hair5","Mörk kastanj","#3c2a23",24),
    i("hair6","Honungsblond","#c99650",28),
    i("hair7","Silverblond","#d8d3ca",34)
  ]);
  addUnique(playerShop.top,[
    i("top6","Vinröd ridjacka","#833f55",28),
    i("top7","Salviagrön jacka","#708f7b",32),
    i("top8","Marin tävlingströja","#364b6b",36),
    i("top9","Cream fleece","#d8c8ac",40),
    i("top10","Svart tävlingsjacka","#25272a",48)
  ]);
  addUnique(playerShop.bottom,[
    i("bottom6","Burgundy ridbyxa","#744155",26),
    i("bottom7","Mossgröna ridbyxor","#536b5b",30),
    i("bottom8","Vita tävlingsbyxor","#eee9e2",38),
    i("bottom9","Taupe ridbyxor","#88796c",42)
  ]);
  addUnique(playerShop.shoes,[
    i("shoes6","Mörkbruna stövlar","#4d3428",26),
    i("shoes7","Marina boots","#34445e",30),
    i("shoes8","Cream boots","#d5c5aa",35),
    i("shoes9","Svarta tävlingsstövlar","#111214",45)
  ]);

  addUnique(horseShop.pad,[
    ip("pad6","Marint schabrak","#425978","#d9c28a",28),
    ip("pad7","Vinrött schabrak","#8b455d","#e0b4c2",30),
    ip("pad8","Skogsgrönt schabrak","#526f5d","#c9d6c6",34),
    ip("pad9","Svart tävlingsschabrak","#26282b","#cfae67",42),
    ip("pad10","Pärlvit dressyr","#eeeae1","#b8a789",48)
  ]);
  addUnique(horseShop.wraps,[
    i("wrap5","Marina benskydd","#4f6687",24),
    i("wrap6","Vinröda benskydd","#8f5062",26),
    i("wrap7","Skogsgröna benskydd","#5f806b",30),
    i("wrap8","Svarta benskydd","#303237",34),
    i("wrap9","Pärlvita benskydd","#e9e4db",38)
  ]);
  addUnique(horseShop.bridle,[
    i("bridle6","Mörkbrunt läder","#4b3326",28),
    i("bridle7","Svart träns","#242120",32),
    i("bridle8","Burgundy träns","#754051",36),
    i("bridle9","Tävlingsbrunt träns","#5a3a29",42)
  ]);
  addUnique(horseShop.accessory,[
    i("acc5","Marin rosett","#526a90",18),
    i("acc6","Vinröd rosett","#984e65",20),
    i("acc7","Guldrosett","#d1a553",24),
    i("acc8","Vit tävlingsrosett","#eee8df",28)
  ]);

  function pony(){
    const pad = hv("pad");
    const wrap = hv("wraps").value;
    const bridle = hv("bridle").value;
    const accessory = hv("accessory").value;
    const body = "#dcc19a", mane = "#f7f3eb", hoof = "#604938", hardware = "#d7b66d";

    const wraps = wrap === "transparent" ? "" : `
      <g fill="none" stroke="${wrap}" stroke-width="10" stroke-linecap="round">
        <path d="M618 351L616 374"/><path d="M659 352L658 374"/>
        <path d="M774 350L772 374"/><path d="M818 348L822 372"/>
      </g>`;

    const bow = accessory === "none" ? "" : `
      <g transform="translate(518 176)">
        <circle r="8" fill="${accessory}"/>
        <path d="M-4 5l-10 14 13-6zM4 5l10 14-13-6z" fill="${accessory}"/>
      </g>`;

    return `<g class="pony-v13">
      <ellipse cx="704" cy="397" rx="176" ry="15" fill="rgba(0,0,0,.08)"/>

      <!-- slimmer body with a more natural Welsh topline -->
      <path d="M604 248C648 229 713 226 771 234C815 240 841 255 847 278C853 300 840 321 812 334C779 349 730 352 672 347C626 343 592 334 577 315C561 294 564 271 582 258C588 254 595 251 604 248Z"
            fill="${body}" stroke="rgba(0,0,0,.16)" stroke-width="2.3"/>
      <path d="M617 256C603 225 585 198 558 178C538 162 517 157 499 164C482 171 473 186 475 203C477 222 489 237 508 246C528 255 548 251 566 239C585 226 604 234 617 256Z"
            fill="${body}" stroke="rgba(0,0,0,.16)" stroke-width="2.3"/>

      <!-- refined head: narrower cheeks, longer muzzle -->
      <path d="M514 165C497 159 479 162 466 173C453 184 449 198 451 213C453 225 460 236 470 244L449 252C433 258 425 269 429 279C434 291 448 294 465 288L489 279C506 273 518 260 524 243C531 224 532 202 527 184C525 175 521 169 514 165Z"
            fill="${body}" stroke="rgba(0,0,0,.14)" stroke-width="2.1"/>
      <path d="M449 252C436 257 428 267 431 277C435 286 447 289 462 285L479 279C475 267 465 257 452 252Z" fill="#ecdac0"/>
      <path d="M474 169l-5-33 20 26M502 166l8-30 12 34" fill="${body}" stroke="rgba(0,0,0,.15)" stroke-width="2"/>
      <path d="M480 172C475 193 470 214 465 236C462 248 460 259 461 269" fill="none" stroke="#faf7f0" stroke-width="7" stroke-linecap="round"/>
      <path d="M522 163C548 176 575 205 592 242" fill="none" stroke="${mane}" stroke-width="13" stroke-linecap="round"/>
      <circle cx="486" cy="194" r="4" fill="#1f1b18"/>
      <circle cx="440" cy="271" r="2.4" fill="rgba(47,39,30,.55)"/>
      <path d="M440 282q12 3 26-2" stroke="rgba(47,39,30,.34)" stroke-width="2.2" fill="none"/>

      <!-- bridle follows anatomy: browband, cheekpiece, noseband, throatlash -->
      <g fill="none" stroke="${bridle}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M466 179C482 174 500 176 514 186"/>
        <path d="M493 176C488 197 486 220 487 246"/>
        <path d="M438 260C452 255 470 257 486 265"/>
        <path d="M487 226C500 230 511 238 517 248"/>
        <path d="M472 183C465 199 463 215 466 230"/>
      </g>
      <circle cx="487" cy="263" r="3" fill="${hardware}"/>

      <path d="M620 246C657 232 706 231 748 242C758 245 761 253 756 262C713 255 672 258 634 273C620 268 612 254 620 246Z"
            fill="${pad.value}" stroke="${pad.trim}" stroke-width="4"/>
      <path d="M651 238C684 228 724 232 753 248C752 264 740 275 717 280C690 286 661 279 644 263C639 251 641 242 651 238Z" fill="#684936"/>
      <path d="M673 249C692 257 711 259 733 256" fill="none" stroke="#4f3528" stroke-width="4" stroke-linecap="round"/>

      <!-- narrower legs -->
      <g fill="none" stroke="${body}" stroke-width="15" stroke-linecap="round">
        <path d="M620 334L616 391"/><path d="M662 337L658 391"/>
        <path d="M780 336L772 391"/><path d="M813 330L824 390"/>
      </g>
      ${wraps}
      <g fill="none" stroke="${hoof}" stroke-width="10" stroke-linecap="round">
        <path d="M607 393h19"/><path d="M649 393h19"/><path d="M763 393h19"/><path d="M816 392h20"/>
      </g>

      <path d="M837 253C865 261 883 280 884 302C885 325 873 347 855 365C862 342 862 323 855 306C849 291 840 279 829 272"
            fill="none" stroke="${mane}" stroke-width="13" stroke-linecap="round"/>
      ${bow}
    </g>`;
  }

  sceneSVG = function(){
    const t = document.createElement("template");
    t.innerHTML = baseScene().trim();
    const svg = t.content.firstElementChild;
    const groups = [...svg.children].filter(e => e.tagName?.toLowerCase() === "g");
    if (groups.length > 1){
      const holder = document.createElementNS("http://www.w3.org/2000/svg","svg");
      holder.innerHTML = pony();
      groups[1].replaceWith(holder.firstElementChild);
    }
    return svg.outerHTML;
  };

  function openStableView(nextTab="horse"){
    tab = nextTab;
    renderStable();
    show("stable");
  }

  function setupStableUI(){
    document.querySelector(".brand small")?.remove();
    document.querySelector("#home .heroTitle")?.remove();
    document.querySelectorAll("#home .head p,#home .summaryCard small").forEach(e=>e.remove());

    const stableP = document.querySelector("#stable .head p");
    if (stableP) stableP.textContent = "Garderob och utrustning. Köp, prova och byt saker på både spelaren och Ettan.";

    const callout = document.querySelector("#home .legendCallout");
    if (callout){
      const strong = callout.querySelector("b");
      if (strong) strong.textContent = "💖 Legendary • låses upp på nivå 8";
      callout.querySelector("small")?.remove();
      const peek = document.getElementById("legendPeek");
      if (peek){ peek.textContent = "Visa setet"; peek.onclick = ()=>openStableView("legend"); }
    }

    document.querySelector("#stable .caption")?.remove();
    document.getElementById("saveStable")?.remove();

    const tabs = document.querySelectorAll("#stable .tab");
    tabs.forEach(b=>{
      if (b.dataset.tab === "player") b.textContent = "👤 Karaktär";
      if (b.dataset.tab === "horse") b.textContent = "🐴 Ettan";
      if (b.dataset.tab === "legend") b.textContent = "💖 Legendary";
    });

    const tabsRow = document.querySelector("#stable .tabs");
    if (tabsRow && !document.querySelector("#wardrobeIntro")){
      tabsRow.insertAdjacentHTML("beforebegin",`<div id="wardrobeIntro" class="wardrobeIntro"><b>Garderob & utrustning</b><span>Köpta saker sparas automatiskt. Tryck på ett plagg eller en hästpryl för att köpa eller ta på den.</span></div>`);
    }

    const hero = document.querySelector("#home .hero");
    if (hero && !document.getElementById("stableHotspot")){
      const btn = document.createElement("button");
      btn.id = "stableHotspot";
      btn.className = "stableHotspot";
      btn.innerHTML = `<span class="stableIcon">🏠</span><span><b>Stallet</b><small>Garderob & utrustning</small></span>`;
      btn.onclick = ()=>openStableView("horse");
      hero.appendChild(btn);
    }

    const open = document.getElementById("openStable");
    if (open){ open.textContent = "Öppna stallet"; open.onclick = ()=>openStableView("horse"); }
    const nav = document.getElementById("stableBtn");
    if (nav){ nav.textContent = "🐴 Stallet"; nav.onclick = ()=>openStableView("horse"); }
  }

  const originalFinish = finish;
  finish = function(){
    const info = round ? {table:round.table, mode:round.mode, wasPassed:state.progress[round.table]?.passed} : null;
    originalFinish();
    if (!info || info.mode !== "challenge" || info.wasPassed || !state.progress[info.table]?.passed) return;
    const extra = 4 + info.table * 3;
    state.coins += extra;
    save();
    header();
    const resultCoins = document.getElementById("resCoins");
    if (resultCoins){
      const n = Number((resultCoins.textContent || "").replace(/[^0-9]/g,"")) || 0;
      resultCoins.textContent = `+${n + extra}`;
    }
    const resultSub = document.getElementById("resultSub");
    if (resultSub) resultSub.textContent += ` Nivåbonus: +${extra} mynt.`;
  };

  setupStableUI();
  renderScene?.();
  renderHome?.();
  renderStable?.();
})();