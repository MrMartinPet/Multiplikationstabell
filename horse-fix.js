"use strict";
(() => {
  const originalSceneSVG = sceneSVG;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "mobile-clean.css?v=10";
  document.head.appendChild(link);

  function firstPonySVG(){
    const pad = hv("pad");
    const wraps = hv("wraps");
    const bridle = hv("bridle");
    const accessory = hv("accessory");
    const maneColor = "#f8f4ec";
    const bodyColor = "#dcc19a";
    const muzzleColor = "#ecdac0";
    const hoofColor = "#6a513c";
    const wrapsColor = wraps.value === "transparent" ? "none" : wraps.value;

    const accessoryShape = accessory.value === "none" ? "" : `
      <g transform="translate(548 145)">
        <circle r="10" fill="${accessory.value}" stroke="rgba(0,0,0,.15)" stroke-width="1.5"/>
        <path d="M-6 7 L-16 23 L-2 16 Z" fill="${accessory.value}"/>
        <path d="M6 7 L16 23 L2 16 Z" fill="${accessory.value}"/>
      </g>`;

    return `<g transform="translate(318 56)">
      <ellipse cx="380" cy="286" rx="170" ry="22" fill="rgba(0,0,0,.08)"/>
      <path d="M562 148 C521 123 465 119 430 141 C397 161 366 163 320 168 C280 172 236 194 216 226 C200 252 199 286 214 313 C230 342 260 355 306 356 L423 356 C458 356 486 345 500 326 C518 304 526 274 524 250 C523 233 527 222 539 212 C560 195 581 176 585 164 C588 156 580 151 562 148 Z" fill="${bodyColor}" stroke="rgba(0,0,0,.13)" stroke-width="2.5"/>
      <path d="M575 153 C542 147 513 153 490 176 C479 186 466 199 456 219 C465 221 474 222 486 220 C507 216 527 203 546 188 C562 176 575 166 583 161 C583 157 580 154 575 153 Z" fill="${bodyColor}" stroke="rgba(0,0,0,.08)" stroke-width="2"/>
      <path d="M570 170 C560 171 550 173 538 179 C528 184 520 192 512 205 C521 210 529 212 539 212 C550 212 561 209 569 204 C578 198 584 190 586 183 C586 176 579 170 570 170 Z" fill="${muzzleColor}"/>
      <path d="M553 136 L568 104 L580 142" fill="${bodyColor}" stroke="rgba(0,0,0,.13)" stroke-width="2" stroke-linejoin="round"/>
      <path d="M523 142 L531 109 L548 145" fill="${bodyColor}" stroke="rgba(0,0,0,.13)" stroke-width="2" stroke-linejoin="round"/>
      <path d="M475 166 C480 136 468 114 445 96 C420 77 392 71 373 72 C392 91 402 109 404 126 C392 112 374 103 352 100 C365 120 373 140 370 164 C392 170 417 171 452 170 Z" fill="${maneColor}" opacity="0.95"/>
      <path d="M411 208 C433 194 466 195 495 206 C500 211 495 218 490 223 C456 214 425 214 401 226 C391 221 397 212 411 208 Z" fill="${pad.value}" stroke="${pad.trim}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M430 205 C454 197 485 201 505 213 C502 233 487 248 462 252 C438 256 414 247 404 228 C406 216 415 210 430 205 Z" fill="#6b4a34" opacity="0.95"/>
      <path d="M447 202 L447 251" stroke="#5a3c2a" stroke-width="4" stroke-linecap="round"/>
      <path d="M492 215 C514 216 529 220 549 230" stroke="${bridle.value}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M551 194 C548 201 548 212 550 223" stroke="${bridle.value}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M528 184 C547 174 561 174 576 181" stroke="${bridle.value}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="548" cy="187" r="4.2" fill="#1f1b18"/>
      <path d="M566 198 Q576 203 584 204" stroke="rgba(47,39,30,.34)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M262 355 L258 246" stroke="${bodyColor}" stroke-width="20" stroke-linecap="round"/>
      <path d="M323 355 L319 250" stroke="${bodyColor}" stroke-width="20" stroke-linecap="round"/>
      <path d="M430 355 L438 248" stroke="${bodyColor}" stroke-width="20" stroke-linecap="round"/>
      <path d="M495 355 L504 246" stroke="${bodyColor}" stroke-width="20" stroke-linecap="round"/>
      ${wrapsColor !== "none" ? `
        <path d="M250 310 L268 310" stroke="${wrapsColor}" stroke-width="14" stroke-linecap="round"/>
        <path d="M311 312 L329 312" stroke="${wrapsColor}" stroke-width="14" stroke-linecap="round"/>
        <path d="M427 312 L446 312" stroke="${wrapsColor}" stroke-width="14" stroke-linecap="round"/>
        <path d="M494 312 L513 312" stroke="${wrapsColor}" stroke-width="14" stroke-linecap="round"/>
      ` : ""}
      <path d="M246 356 L274 356" stroke="${hoofColor}" stroke-width="12" stroke-linecap="round"/>
      <path d="M307 356 L335 356" stroke="${hoofColor}" stroke-width="12" stroke-linecap="round"/>
      <path d="M423 356 L451 356" stroke="${hoofColor}" stroke-width="12" stroke-linecap="round"/>
      <path d="M490 356 L518 356" stroke="${hoofColor}" stroke-width="12" stroke-linecap="round"/>
      <path d="M217 229 C195 212 181 195 178 179 C172 149 189 127 212 119" fill="none" stroke="${maneColor}" stroke-width="10" stroke-linecap="round"/>
      ${accessoryShape}
    </g>`;
  }

  sceneSVG = function(){
    const markup = originalSceneSVG();
    const template = document.createElement("template");
    template.innerHTML = markup.trim();
    const svg = template.content.firstElementChild;
    const groups = Array.from(svg.children).filter(el => el.tagName && el.tagName.toLowerCase() === "g");
    if(groups.length >= 2){
      const holder = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      holder.innerHTML = firstPonySVG();
      groups[1].replaceWith(holder.firstElementChild);
    }
    return svg.outerHTML;
  };

  function cleanStaticUI(){
    document.querySelector(".brand small")?.remove();
    document.querySelector("#home .heroTitle")?.remove();
    document.querySelectorAll("#home .head p, #home .summaryCard small, #stable .head p").forEach(el => el.remove());
    const legend = document.querySelector("#home .legendCallout");
    if(legend){
      const title = legend.querySelector("b");
      if(title) title.textContent = "💖 Legendary • låses upp på 8:an";
      legend.querySelector("small")?.remove();
      document.getElementById("legendPeek")?.remove();
    }
    document.querySelector("#stable .caption")?.remove();
    document.getElementById("saveStable")?.remove();
  }

  cleanStaticUI();
  if(typeof renderScene === "function") renderScene();
  if(typeof renderHome === "function") renderHome();
  if(typeof renderStable === "function") renderStable();
})();
