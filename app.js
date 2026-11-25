(() => {
  const pages = [
    { src: "assets/pagina-2.png", name: "El Dios que adoramos", hint: "Canción · 1 de 2" },
    { src: "assets/pagina-3.png", name: "Sublime gracia", hint: "Canción · 2 de 2" },
    { src: "assets/pagina-1.png", name: "Menú", hint: "La celebración" }
  ];
  const cover = document.querySelector("#cover");
  const img = document.querySelector("#page-image");
  const page = document.querySelector("#page");
  const prev = document.querySelector("#prev");
  const next = document.querySelector("#next");
  const navPrev = document.querySelector("#nav-prev");
  const navNext = document.querySelector("#nav-next");
  const count = document.querySelector("#page-count");
  const name = document.querySelector("#page-name");
  const fill = document.querySelector("#progress-fill");
  const progress = document.querySelector("#progress");
  const hint = document.querySelector("#hint");
  let current = -1;
  let busy = false;

  function update() {
    const open = current >= 0;
    prev.disabled = navPrev.disabled = !open || current === 0;
    next.disabled = !open || current === pages.length - 1;
    navNext.disabled = open && current === pages.length - 1;
    count.textContent = open ? `Página ${current + 1} de ${pages.length}` : "Portada";
    name.textContent = open ? pages[current].name : "Jesús + Carmen";
    hint.textContent = open ? pages[current].hint : "Pulsa «Comenzar» para abrir";
    fill.style.width = `${Math.max(0, ((current + 1) / pages.length) * 100)}%`;
    progress.setAttribute("aria-valuenow", open ? String(current + 1) : "0");
    page.setAttribute("aria-label", open ? `${pages[current].name}, página ${current + 1} de ${pages.length}` : "Primera página del cancionero");
    navNext.innerHTML = open ? (current === pages.length - 1 ? "Fin" : 'Siguiente <span aria-hidden="true">→</span>') : 'Comenzar <span aria-hidden="true">→</span>';
  }

  function turn(to) {
    if (busy || to < 0 || to >= pages.length || to === current) return;
    busy = true;
    const direction = to > current ? "turning-next" : "turning-prev";
    page.classList.add(direction);
    if (current < 0) cover.classList.add("open");
    window.setTimeout(() => {
      current = to;
      img.src = pages[current].src;
      img.alt = "";
      update();
      page.classList.remove(direction);
      window.setTimeout(() => { busy = false; }, 360);
    }, 330);
  }

  document.querySelector("#begin").addEventListener("click", () => turn(0));
  next.addEventListener("click", () => turn(current + 1));
  navNext.addEventListener("click", () => turn(current + 1));
  prev.addEventListener("click", () => turn(current - 1));
  navPrev.addEventListener("click", () => turn(current - 1));
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight" || event.key === "PageDown") { event.preventDefault(); turn(current + 1); }
    if (event.key === "ArrowLeft" || event.key === "PageUp") { event.preventDefault(); turn(current - 1); }
    if (event.key === "Home" && current >= 0 && !busy) { current = -1; cover.classList.remove("open"); update(); }
  });
  let touchX = null;
  page.addEventListener("touchstart", event => { touchX = event.changedTouches[0].clientX; }, { passive: true });
  page.addEventListener("touchend", event => {
    if (touchX === null) return;
    const dx = event.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 55) turn(current + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });
  update();
})();

