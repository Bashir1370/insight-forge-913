const ROOT_SELECTOR = ".gdc-guide-v6";
const IMAGE_SELECTOR = 'img[alt="صفحه اصلی GDC"]';
const LAYER_LABELS = ["چرا Projects؟", "Project چیست؟", "نقشه GDC"] as const;

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
) {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

function percent(value: string | null | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildInspector(image: HTMLImageElement) {
  const canvas = image.parentElement as HTMLElement | null;
  const layout = canvas?.closest<HTMLElement>(".mt-5.grid.gap-5");
  const panel = layout?.querySelector<HTMLElement>(":scope > aside");
  if (!canvas || !layout || !panel) return;
  if (panel.dataset.nativeInspector === "true") return;

  const stack = panel.querySelector<HTMLElement>(":scope > .mt-5.space-y-3");
  if (!stack) return;

  const allCards = Array.from(stack.children).filter(
    (item): item is HTMLElement => item instanceof HTMLElement,
  );
  const cards = allCards.slice(0, 3);
  if (cards.length < 3) return;

  panel.dataset.nativeInspector = "true";
  panel.dataset.activeInspector = "0";
  layout.classList.add("gdc-stage-one-inspector-layout");
  canvas.classList.add("gdc-stage-one-inspector-canvas");
  panel.classList.add("gdc-stage-one-inspector-panel");
  stack.classList.add("gdc-stage-one-inspector-stack");

  allCards.slice(3).forEach((card) => {
    card.hidden = true;
    card.setAttribute("aria-hidden", "true");
  });

  cards.forEach((card, index) => {
    card.classList.add("gdc-stage-one-inspector-card");
    card.dataset.inspectorIndex = String(index);
  });

  const rail = el("div", "gdc-stage-one-inspector-rail");
  rail.setAttribute("role", "tablist");
  rail.setAttribute("aria-label", "راهنمای مرحله اول");

  const railButtons = LAYER_LABELS.map((label, index) => {
    const button = el("button", "gdc-stage-one-inspector-tab");
    button.type = "button";
    button.setAttribute("role", "tab");
    button.dataset.inspectorTarget = String(index);

    const indexNode = el("span", "gdc-stage-one-inspector-tab-index", String(index + 1));
    const labelNode = el("span", "gdc-stage-one-inspector-tab-label", label);
    button.append(indexNode, labelNode);
    rail.append(button);
    return button;
  });

  panel.querySelector(":scope > h2")?.after(rail);

  const zoomCard = el("section", "gdc-stage-one-zoom-card");
  zoomCard.hidden = true;
  zoomCard.setAttribute("aria-hidden", "true");

  const zoomHeader = el("div", "gdc-stage-one-zoom-header");
  const zoomTitleWrap = el("div", "gdc-stage-one-zoom-title-wrap");
  const zoomEyebrow = el("span", "gdc-stage-one-zoom-eyebrow", "نمای نزدیک");
  const zoomTitle = el("strong", "gdc-stage-one-zoom-title", "Projects در محیط اصلی GDC");
  zoomTitleWrap.append(zoomEyebrow, zoomTitle);
  const zoomClose = el("button", "gdc-stage-one-zoom-close", "×");
  zoomClose.type = "button";
  zoomClose.setAttribute("aria-label", "بستن نمای نزدیک");
  zoomHeader.append(zoomTitleWrap, zoomClose);

  const zoomSurface = el("div", "gdc-stage-one-zoom-surface");
  zoomSurface.setAttribute("role", "img");
  zoomSurface.setAttribute("aria-label", "نمای نزدیک از ناحیه Projects در اسکرین‌شات GDC");
  zoomCard.append(zoomHeader, zoomSurface);
  rail.after(zoomCard);

  const controls = el("div", "gdc-stage-one-inspector-controls");
  const progress = el("div", "gdc-stage-one-inspector-progress");
  const buttonGroup = el("div", "gdc-stage-one-inspector-actions");
  const zoomToggle = el("button", "gdc-stage-one-inspector-action gdc-stage-one-inspector-zoom", "نمای نزدیک");
  const previous = el("button", "gdc-stage-one-inspector-action gdc-stage-one-inspector-secondary", "قبلی");
  const next = el("button", "gdc-stage-one-inspector-action gdc-stage-one-inspector-primary");
  zoomToggle.type = "button";
  previous.type = "button";
  next.type = "button";
  buttonGroup.append(zoomToggle, previous, next);
  controls.append(progress, buttonGroup);
  stack.after(controls);

  const stageNavigation = panel.querySelector<HTMLElement>(":scope > .mt-5.grid.grid-cols-2");
  stageNavigation?.classList.add("gdc-stage-one-inspector-stage-nav");

  let active = 0;
  let zoomOpen = false;

  const updateZoom = () => {
    const hotspot = canvas.querySelector<HTMLElement>(".gdc-stage-one-hotspot") ??
      (image.nextElementSibling instanceof HTMLElement ? image.nextElementSibling : null);

    const centerX = hotspot
      ? percent(hotspot.style.left, 12.6) + percent(hotspot.style.width, 9) / 2
      : 17.1;
    const centerY = hotspot
      ? percent(hotspot.style.top, 8.8) + percent(hotspot.style.height, 7) / 2
      : 12.3;

    zoomSurface.style.backgroundImage = `url("${image.currentSrc || image.src}")`;
    zoomSurface.style.backgroundSize = "520% auto";
    zoomSurface.style.backgroundPosition = `${centerX}% ${centerY}%`;
  };

  const setZoom = (nextValue: boolean) => {
    zoomOpen = nextValue;
    zoomCard.hidden = !zoomOpen;
    zoomCard.setAttribute("aria-hidden", zoomOpen ? "false" : "true");
    zoomToggle.textContent = zoomOpen ? "بستن نمای نزدیک" : "نمای نزدیک";
    if (zoomOpen) updateZoom();
  };

  const setActive = (nextIndex: number) => {
    active = Math.max(0, Math.min(cards.length - 1, nextIndex));
    panel.dataset.activeInspector = String(active);

    cards.forEach((card, index) => {
      const isActive = index === active;
      card.hidden = !isActive;
      card.setAttribute("aria-hidden", isActive ? "false" : "true");
      if (isActive) {
        card.classList.remove("gdc-stage-one-inspector-card-enter");
        void card.offsetWidth;
        card.classList.add("gdc-stage-one-inspector-card-enter");
      }
    });

    railButtons.forEach((button, index) => {
      const isActive = index === active;
      const isDone = index < active;
      button.dataset.state = isActive ? "active" : isDone ? "done" : "upcoming";
      button.setAttribute("aria-selected", isActive ? "true" : "false");
      button.tabIndex = isActive ? 0 : -1;
      const indexNode = button.querySelector<HTMLElement>(".gdc-stage-one-inspector-tab-index");
      if (indexNode) indexNode.textContent = isDone ? "✓" : String(index + 1);
    });

    progress.textContent = `${active + 1} از ${cards.length}`;
    previous.disabled = active === 0;
    next.hidden = active === cards.length - 1;
    next.textContent = active === 0 ? "Project را بشناسیم" : "نقشه GDC";

    if (stageNavigation) {
      const showStageNav = active === cards.length - 1;
      stageNavigation.hidden = !showStageNav;
      stageNavigation.setAttribute("aria-hidden", showStageNav ? "false" : "true");
    }
  };

  railButtons.forEach((button, index) => {
    button.addEventListener("click", () => setActive(index));
  });
  previous.addEventListener("click", () => setActive(active - 1));
  next.addEventListener("click", () => setActive(active + 1));
  zoomToggle.addEventListener("click", () => setZoom(!zoomOpen));
  zoomClose.addEventListener("click", () => setZoom(false));

  const hotspot = canvas.querySelector<HTMLElement>(".gdc-stage-one-hotspot") ??
    (image.nextElementSibling instanceof HTMLElement ? image.nextElementSibling : null);
  hotspot?.addEventListener("click", () => {
    setActive(1);
    setZoom(true);
  });

  image.addEventListener("load", () => {
    if (zoomOpen) updateZoom();
  });

  setActive(0);
}

function scan() {
  document.querySelectorAll<HTMLElement>(ROOT_SELECTOR).forEach((root) => {
    root.querySelectorAll<HTMLImageElement>(IMAGE_SELECTOR).forEach(buildInspector);
  });
}

function install() {
  scan();
  const observer = new MutationObserver(scan);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "src"],
  });

  window.setTimeout(scan, 80);
  window.setTimeout(scan, 300);
  window.setTimeout(scan, 900);
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
}

export {};
