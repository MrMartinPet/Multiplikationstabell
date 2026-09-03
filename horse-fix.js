"use strict";
(() => {
  const originalSceneSVG = sceneSVG;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "mobile-clean.css?v=9";
  document.head.appendChild(link);

  sceneSVG = function(){
    const markup = originalSceneSVG();
    const template = document.createElement("template");
    template.innerHTML = markup.trim();
    const svg = template.content.firstElementChild;

    const groups = Array.from(svg.children).filter(
      el => el.tagName && el.tagName.toLowerCase() === "g"
    );

    if(groups.length >= 2){
      const horse = groups[1];

      // Restore the previous horse illustration, but move it closer to the owner,
      // keep the whole pony in frame and make the silhouette a little slimmer.
      horse.setAttribute("transform", "translate(292 44) scale(1 .92)");
    }
    return svg.outerHTML;
  };

  function cleanStaticUI(){
    document.querySelector(".brand small")?.remove();

    const heroTitle = document.querySelector("#home .heroTitle");
    if(heroTitle) heroTitle.remove();

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
