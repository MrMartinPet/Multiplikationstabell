"use strict";
(() => {
  const originalSceneSVG = sceneSVG;

  function horseGroupSVG(){
    const pad = hv("pad");
    const wrap = hv("wraps").value;
    const bridle = hv("bridle").value;
    const acc = hv("accessory").value;
    const body = "#dcc19a";
    const bodyShade = "#c9aa7d";
    const muzzle = "#eedbc1";
    const mane = "#fbf7ef";
    const hoof = "#68503b";
    const wrapSvg = wrap === "transparent" ? "" : `
      <g stroke="${wrap}" stroke-width="13" stroke-linecap="round">
        <path d="M304 315h19"/><path d="M359 315h19"/>
        <path d="M472 314h19"/><path d="M525 312h19"/>
      </g>`;
    const accessory = acc === "none" ? "" : `
      <g transform="translate(222 108)">
        <circle r="10" fill="${acc}" stroke="rgba(0,0,0,.12)" stroke-width="1.5"/>
        <path d="M-6 7l-11 18 15-8zM6 7l11 18-15-8z" fill="${acc}"/>
      </g>`;

    return `<g transform="translate(300 18) scale(1.05)">
      <ellipse cx="390" cy="353" rx="180" ry="19" fill="rgba(0,0,0,.075)"/>

      <!-- slim standing body -->
      <path d="M286 176
               C330 157 397 153 453 163
               C501 171 536 190 552 221
               C564 245 558 272 541 292
               C520 317 487 326 441 326
               L323 326
               C284 326 254 316 237 296
               C219 275 216 244 227 220
               C239 196 258 184 286 176Z"
            fill="${body}" stroke="rgba(0,0,0,.14)" stroke-width="2.4"/>
      <path d="M263 193 C294 178 336 171 381 170 C351 184 329 201 315 224 C289 225 267 216 250 204Z" fill="${bodyShade}" opacity=".16"/>

      <!-- neck toward owner -->
      <path d="M296 191
               C271 173 255 151 245 128
               C235 104 218 94 199 99
               C180 103 169 122 175 143
               C181 164 197 184 217 205
               C234 223 247 244 252 268
               C269 267 286 258 298 244
               C310 230 313 209 296 191Z"
            fill="${body}" stroke="rgba(0,0,0,.14)" stroke-width="2.4"/>

      <!-- head, facing left toward owner -->
      <path d="M204 111
               C183 107 160 112 145 126
               C132 138 128 156 135 170
               C142 185 159 194 181 193
               C203 192 222 181 230 166
               C237 152 233 131 222 120
               C217 115 211 112 204 111Z"
            fill="${body}" stroke="rgba(0,0,0,.14)" stroke-width="2.2"/>
      <path d="M153 145
               C137 145 123 153 119 165
               C115 178 124 188 140 191
               C155 194 171 188 181 178
               C176 161 166 150 153 145Z"
            fill="${muzzle}"/>

      <!-- ears -->
      <path d="M188 114 L184 78 Q188 70 195 79 L205 116Z" fill="${body}" stroke="rgba(0,0,0,.13)" stroke-width="2"/>
      <path d="M213 116 L221 82 Q226 74 231 84 L229 124Z" fill="${body}" stroke="rgba(0,0,0,.13)" stroke-width="2"/>
      <path d="M190 105 L190 84" stroke="#c58f8d" stroke-width="3" stroke-linecap="round" opacity=".55"/>
      <path d="M221 108 L226 88" stroke="#c58f8d" stroke-width="3" stroke-linecap="round" opacity=".55"/>

      <!-- soft white mane following neck -->
      <path d="M245 121
               C264 128 278 142 286 157
               C272 153 260 153 249 158
               C268 166 279 178 285 192
               C271 186 260 185 249 189
               C261 199 269 213 271 228
               C258 219 247 218 237 222
               C233 199 221 182 207 167
               C231 157 244 143 245 121Z"
            fill="${mane}" opacity=".98"/>

      <!-- face -->
      <ellipse cx="171" cy="145" rx="4.5" ry="5" fill="#211c18"/>
      <ellipse cx="169.5" cy="143.5" rx="1.3" ry="1.5" fill="#fff" opacity=".9"/>
      <path d="M127 172 q9 5 19 3" fill="none" stroke="rgba(47,39,30,.35)" stroke-width="2.3" stroke-linecap="round"/>

      <!-- bridle fitted to head -->
      <path d="M158 119 C179 124 204 122 224 116" fill="none" stroke="${bridle}" stroke-width="4" stroke-linecap="round"/>
      <path d="M151 126 C148 145 151 164 160 180" fill="none" stroke="${bridle}" stroke-width="4" stroke-linecap="round"/>
      <path d="M132 164 C148 169 166 169 181 164" fill="none" stroke="${bridle}" stroke-width="4" stroke-linecap="round"/>
      <path d="M160 181 C184 188 207 180 221 164" fill="none" stroke="${bridle}" stroke-width="3.2" stroke-linecap="round"/>

      <!-- tail -->
      <path d="M541 215 C574 216 594 235 598 259 C603 289 590 315 568 333" fill="none" stroke="${mane}" stroke-width="14" stroke-linecap="round"/>
      <path d="M544 218 C569 222 582 238 585 258" fill="none" stroke="${bodyShade}" stroke-width="3" stroke-linecap="round" opacity=".18"/>

      <!-- fitted saddle pad and saddle -->
      <path d="M315 180
               C352 169 407 169 450 181
               C461 188 463 201 456 213
               L437 249
               C405 258 359 257 327 246
               L306 210
               C300 197 303 187 315 180Z"
            fill="${pad.value}" stroke="${pad.trim}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M334 177
               C362 168 401 169 428 180
               C440 186 448 195 448 205
               C424 211 397 214 367 213
               C346 212 327 207 316 200
               C319 189 325 182 334 177Z"
            fill="#694b37" stroke="rgba(0,0,0,.22)" stroke-width="2"/>
      <path d="M367 207 L363 252" stroke="#5a3d2c" stroke-width="4" stroke-linecap="round"/>
      <path d="M430 206 L446 250" stroke="#5a3d2c" stroke-width="4" stroke-linecap="round"/>

      <!-- legs: upright and slimmer -->
      <path d="M311 300 L308 350" stroke="${body}" stroke-width="19" stroke-linecap="round"/>
      <path d="M366 301 L363 350" stroke="${body}" stroke-width="19" stroke-linecap="round"/>
      <path d="M479 300 L477 349" stroke="${body}" stroke-width="19" stroke-linecap="round"/>
      <path d="M532 297 L530 348" stroke="${body}" stroke-width="19" stroke-linecap="round"/>
      ${wrapSvg}
      <path d="M298 352 h22" stroke="${hoof}" stroke-width="11" stroke-linecap="round"/>
      <path d="M353 352 h22" stroke="${hoof}" stroke-width="11" stroke-linecap="round"/>
      <path d="M467 351 h22" stroke="${hoof}" stroke-width="11" stroke-linecap="round"/>
      <path d="M520 350 h22" stroke="${hoof}" stroke-width="11" stroke-linecap="round"/>

      ${accessory}
    </g>`;
  }

  sceneSVG = function(){
    const markup = originalSceneSVG();
    const template = document.createElement("template");
    template.innerHTML = markup.trim();
    const svg = template.content.firstElementChild;
    const topGroups = Array.from(svg.children).filter(el => el.tagName && el.tagName.toLowerCase() === "g");
    if(topGroups.length >= 2){
      const holder = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      holder.innerHTML = horseGroupSVG();
      topGroups[1].replaceWith(holder.firstElementChild);
    }
    return svg.outerHTML;
  };

  if(typeof renderScene === "function") renderScene();
  if(typeof renderHome === "function") renderHome();
  if(typeof renderStable === "function") renderStable();
})();