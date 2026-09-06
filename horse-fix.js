"use strict";
(()=>{
  const baseScene = sceneSVG;

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "mobile-clean.css?v=12";
  document.head.appendChild(css);

  const addUnique = (list, items) => {
    for (const item of items) if (!list.some(x => x.id === item.id)) list.push(item);
  };

  // Expand the wardrobe without changing existing saves.
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
      <g fill="none" stroke="${wrap}" stroke-width="12" stroke-linecap="round">
        <path d="M614 350L613 374"/><path d="M657 351L656 374"/>
        <path d="M773 350L771 374"/><path d="M821 347L824 372"/>
      </g>`;

    const bow = accessory === "none" ? "" : `
      <g transform="translate(531 181)">
        <circle r="8" fill="${accessory}"/>
        <path d="M-4 5l-10 14 13-6zM4 5l10 14-13-6z" fill="${accessory}"/>
      </g>`;

    return `<g class="pony-v12">
      <ellipse cx="705" cy="397" rx="183" ry="17" fill="rgba(0,0,0,.08)"/>

      <!-- slimmer Welsh body -->
      <path d="M600 244C649 222 724 219 785 231C827 239 850 259 853 285C856 310 839 330 807 342C772 355 718 358 660 351C614 346 583 334 569 311C555 289 560 265 578 252C584 248 591 246 600 244Z"
            fill="${body}" stroke="rgba(0,0,0,.16)" stroke-width="2.4"/>

      <!-- neck -->
      <path d="M617 255C603 226 584 199 559 178C539 161 518 155 498 163C479 171 470 188 473 207C476 227 490 243 511 251C532 259 553 254 572 241C590 229 604 235 617 255Z"
            fill="${body}" stroke="rgba(0,0,0,.16)" stroke-width="2.4"/>

      <!-- head and muzzle -->
      <path d="M516 166C497 158 477 160 462 173C449 184 444 199 447 215C449 228 457 239 468 247L448 254C433 259 425 270 429 280C433 292 448 296 465 290L490 281C508 274 521 260 528 242C535 222 536 199 530 182C528 174 523 169 516 166Z"
            fill="${body}" stroke="rgba(0,0,0,.14)" stroke-width="2.2"/>
      <path d="M448 254C435 258 427 268 430 278C434 287 446 291 461 287L479 281C475 268 465 258 451 254Z" fill="#ecdac0"/>

      <!-- ears -->
      <path d="M474 170l-6-34 21 27M503 166l8-31 13 35" fill="${body}" stroke="rgba(0,0,0,.15)" stroke-width="2"/>

      <!-- blaze, mane, eye -->
      <path d="M480 173C475 194 469 214 463 237C460 248 458 260 459 270" fill="none" stroke="#faf7f0" stroke-width="7" stroke-linecap="round"/>
      <path d="M523 163C551 176 579 207 596 244" fill="none" stroke="${mane}" stroke-width="14" stroke-linecap="round"/>
      <circle cx="486" cy="195" r="4.2" fill="#1f1b18"/>
      <circle cx="439" cy="272" r="2.5" fill="rgba(47,39,30,.55)"/>
      <path d="M440 284q13 3 27-2" stroke="rgba(47,39,30,.34)" stroke-width="2.3" fill="none"/>

      <!-- correctly placed bridle / halter geometry -->
      <g fill="none" stroke="${bridle}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M466 180C482 174 501 176 516 187"/>
        <path d="M493 176C487 198 484 222 486 248"/>
        <path d="M438 262C453 256 471 258 487 267"/>
        <path d="M484 225C499 229 511 238 517 250"/>
      </g>
      <circle cx="487" cy="264" r="3" fill="${hardware}"/>

      <!-- saddle pad and saddle follow the topline -->
      <path d="M620 244C659 229 710 228 753 241C763 245 765 253 759 263C716 255 672 257 632 274C617 267 611 253 620 244Z"
            fill="${pad.value}" stroke="${pad.trim}" stroke-width="4"/>
      <path d="M652 236C686 225 727 230 758 247C757 264 744 277 720 282C691 288 661 280 642 263C637 250 640 241 652 236Z" fill="#684936"/>
      <path d="M675 248C693 256 712 259 735 256" fill="none" stroke="#4f3528" stroke-width="4" stroke-linecap="round"/>

      <!-- legs: leaner, with gear aligned to lower legs -->
      <g fill="none" stroke="${body}" stroke-width="16" stroke-linecap="round">
        <path d="M619 334L614 391"/><path d="M661 338L657 391"/>
        <path d="M781 337L772 391"/><path d="M815 330L826 390"/>
      </g>
      ${wraps}
      <g fill="none" stroke="${hoof}" stroke-width="10" stroke-linecap="round">
        <path d="M605 393h20"/><path d="M648 393h20"/><path d="M762 393h20"/><path d="M817 392h20"/>
      </g>

      <!-- tail -->
      <path d="M843 252C872 260 890 279 891 303C892 327 880 349 860 368C867 344 867 324 860 306C854 290 844 278 833 271"
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

  function openStableView(){
    tab = "horse";
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
      document.getElementById("legendPeek")?.remove();
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
      btn.onclick = openStableView;
      hero.appendChild(btn);
    }

    const open = document.getElementById("openStable");
    if (open){ open.textContent = "Öppna stallet"; open.onclick = openStableView; }
    const nav = document.getElementById("stableBtn");
    if (nav){ nav.textContent = "🐴 Stallet"; nav.onclick = openStableView; }
  }

  // Increasing one-time reward when a new level is cleared.
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
