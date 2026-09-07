const PANEL_SELECTOR = ".gdc-guide-v6 .gdc-stage-one-panel";
const LAYER_LABELS = ["سؤال پژوهشی", "Project چیست؟", "نقشه GDC"] as const;

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
) {
  const element = document.createElement(tag);
  element.className = className;
  if (text) element.textContent = text;
  return element;
}

function enhancePanel(panel: HTMLElement) {
  if (panel.dataset.layeredUi === "true") return;

  const stack = panel.querySelector<HTMLElement>(":scope > .mt-5.space-y-3");
  if (!stack) return;

  const allCards = Array.from(stack.children).filter(
    (item): item is HTMLElement => item instanceof HTMLElement,
  );
  const cards = allCards.slice(0, 3);
  if (cards.length < 3) return;

  panel.dataset.layeredUi = "true";
  panel.dataset.activeLayer = "0";
  stack.classList.add("gdc-stage-one-layers");

  allCards.slice(3).forEach((card) => {
    card.hidden = true;
    card.setAttribute("aria-hidden", "true");
  });

  cards.forEach((card, index) => {
    card.classList.add("gdc-stage-one-layer");
    card.dataset.layerIndex = String(index);
  });

  const rail = createElement("div", "gdc-stage-one-layer-rail");
  rail.setAttribute("role", "tablist");
  rail.setAttribute("aria-label", "مسیر توضیح مرحله اول");

  const railButtons = LAYER_LABELS.map((label, index) => {
    const button = createElement("button", "gdc-stage-one-layer-tab");
    button.type = "button";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-label", label);
    button.dataset.layerTarget = String(index);

    const dot = createElement("span", "gdc-stage-one-layer-dot");
    dot.setAttribute("aria-hidden", "true");
    const text = createElement("span", "gdc-stage-one-layer-tab-label", label);
    button.append(dot, text);
    rail.append(button);
    return button;
  });

  stack.before(rail);

  const footer = createElement("div", "gdc-stage-one-layer-controls");
  const progress = createElement("div", "gdc-stage-one-layer-progress");
  const controls = createElement("div", "gdc-stage-one-layer-buttons");
  const previous = createElement("button", "gdc-stage-one-layer-button gdc-stage-one-layer-button-secondary", "قبلی");
  const next = createElement("button", "gdc-stage-one-layer-button gdc-stage-one-layer-button-primary");
  previous.type = "button";
  next.type = "button";
  controls.append(previous, next);
  footer.append(progress, controls);
  stack.after(footer);

  const stageNavigation = panel.querySelector<HTMLElement>(":scope > .mt-5.grid.grid-cols-2");
  stageNavigation?.classList.add("gdc-stage-one-stage-navigation");

  let active = 0;

  const setActive = (nextIndex: number, focus = false) => {
    active = Math.max(0, Math.min(cards.length - 1, nextIndex));
    panel.dataset.activeLayer = String(active);

    cards.forEach((card, index) => {
      const isActive = index === active;
      card.hidden = !isActive;
      card.setAttribute("aria-hidden", isActive ? "false" : "true");
      if (isActive) {
        card.classList.remove("gdc-stage-one-layer-enter");
        void card.offsetWidth;
        card.classList.add("gdc-stage-one-layer-enter");
      }
    });

    railButtons.forEach((button, index) => {
      const isActive = index === active;
      const isDone = index < active;
      button.dataset.state = isActive ? "active" : isDone ? "done" : "upcoming";
      button.setAttribute("aria-selected", isActive ? "true" : "false");
      button.tabIndex = isActive ? 0 : -1;
      const dot = button.querySelector<HTMLElement>(".gdc-stage-one-layer-dot");
      if (dot) dot.textContent = isDone ? "✓" : String(index + 1);
    });

    progress.textContent = `${active + 1} از ${cards.length}`;
    previous.disabled = active === 0;

    if (active < cards.length - 1) {
      next.hidden = false;
      next.textContent = active === 0 ? "بعدی: Project را بشناسیم" : "بعدی: نقشه GDC";
    } else {
      next.hidden = true;
    }

    if (stageNavigation) {
      stageNavigation.hidden = active !== cards.length - 1;
      stageNavigation.setAttribute("aria-hidden", active === cards.length - 1 ? "false" : "true");
    }

    if (focus) {
      railButtons[active]?.focus({ preventScroll: true });
    }
  };

  railButtons.forEach((button, index) => {
    button.addEventListener("click", () => setActive(index));
    button.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActive(active + 1, true);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActive(active - 1, true);
      }
    });
  });

  previous.addEventListener("click", () => setActive(active - 1));
  next.addEventListener("click", () => setActive(active + 1));

  setActive(0);
}

function scan() {
  document.querySelectorAll<HTMLElement>(PANEL_SELECTOR).forEach(enhancePanel);
}

function install() {
  scan();
  const observer = new MutationObserver(scan);
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install, { once: true });
  } else {
    install();
  }
}

export {};
