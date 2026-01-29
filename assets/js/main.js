(() => {
  const D = window.PROJECT_DATA;

  // --------- Small SVG icon set (no external dependencies) ---------
  const ICONS = {
    paper: `<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.7"/><path d="M14 3v4a1 1 0 0 0 1 1h4" stroke="currentColor" stroke-width="1.7"/><path d="M8 12h8M8 16h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    code:  `<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M8 9 5 12l3 3M16 9l3 3-3 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 7 10 17" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    hf:    `<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M6 8c2-2 4-3 6-3s4 1 6 3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M6 16c2 2 4 3 6 3s4-1 6-3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M8 12h8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`,
    db:    `<svg class="icon" viewBox="0 0 24 24" fill="none"><path d="M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3Z" stroke="currentColor" stroke-width="1.7"/><path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6" stroke="currentColor" stroke-width="1.7"/><path d="M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" stroke="currentColor" stroke-width="1.7"/></svg>`
  };

  // --------- Prompt tooltip ---------
  const tooltip = document.getElementById("promptTooltip");
  const tooltipText = document.getElementById("promptTooltipText");
  const tooltipClose = document.getElementById("promptTooltipClose");

  const showPrompt = (txt) => {
    tooltipText.textContent = txt || "";
    tooltip.classList.add("show");
    tooltip.setAttribute("aria-hidden", "false");
  };
  const hidePrompt = () => {
    tooltip.classList.remove("show");
    tooltip.setAttribute("aria-hidden", "true");
  };
  tooltipClose?.addEventListener("click", hidePrompt);

  // Hide tooltip on Esc
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hidePrompt();
  });

  // --------- Tabs ---------
  const initTabs = (groupName) => {
    const tabRow = document.querySelector(`.tabs[data-tabs="${groupName}"]`);
    if (!tabRow) return;
    const tabs = Array.from(tabRow.querySelectorAll(".tab"));
    const panes = Array.from(tabRow.parentElement.querySelectorAll(".tabpane"));
    tabs.forEach(t => {
      t.addEventListener("click", () => {
        tabs.forEach(x => x.classList.remove("active"));
        panes.forEach(p => p.classList.remove("active"));
        t.classList.add("active");
        const id = t.dataset.tab;
        document.getElementById(id)?.classList.add("active");
      });
    });
  };

  initTabs("generation");
  initTabs("editing");

  // --------- Resource buttons ---------
  const resourceButtons = document.getElementById("resourceButtons");
  if (resourceButtons && D?.resources?.length) {
    resourceButtons.innerHTML = D.resources.map(r => {
      const icon = ICONS[r.icon] || ICONS.code;
      return `
        <a class="icon-btn" href="${r.url}" target="_blank" rel="noopener">
          ${icon}
          <span>${escapeHtml(r.label)}</span>
        </a>`;
    }).join("");
  }

  // --------- Helper renderers ---------
  const attachPromptHandlers = (cardEl, prompt) => {
    // Desktop hover shows tooltip
    cardEl.addEventListener("mouseenter", () => showPrompt(prompt));
    cardEl.addEventListener("mouseleave", () => hidePrompt());

    // Mobile tap via info button
    const btn = cardEl.querySelector(".info-btn");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showPrompt(prompt);
      });
    }
  };

  // --------- Generation: image grid ---------
  const genImageGrid = document.getElementById("genImageGrid");
  if (genImageGrid && D?.genImages) {
    genImageGrid.innerHTML = D.genImages.map(x => `
      <div class="media-card" data-prompt="${escapeHtmlAttr(x.prompt)}">
        <button class="info-btn" title="Show prompt">ⓘ</button>
        <img class="media" src="${x.media}" alt="${escapeHtmlAttr(x.title || "Generated image")}" loading="lazy" />
        <div class="media-meta">
          <div class="label">${escapeHtml(x.title || "Image")}</div>
          <div class="sub">Hover to view prompt</div>
        </div>
      </div>
    `).join("");

    Array.from(genImageGrid.querySelectorAll(".media-card")).forEach((el, i) => {
      attachPromptHandlers(el, D.genImages[i].prompt);
    });
  }

  // --------- Generation: video grid ---------
  const genVideoGrid = document.getElementById("genVideoGrid");
  if (genVideoGrid && D?.genVideos) {
    genVideoGrid.innerHTML = D.genVideos.map(x => `
      <div class="media-card" data-prompt="${escapeHtmlAttr(x.prompt)}">
        <button class="info-btn" title="Show prompt">ⓘ</button>
        <video class="media" controls playsinline preload="metadata">
          <source src="${x.media}" type="video/mp4" />
        </video>
        <div class="media-meta">
          <div class="label">${escapeHtml(x.title || "Video")}</div>
          <div class="sub">Hover to view prompt</div>
        </div>
      </div>
    `).join("");

    Array.from(genVideoGrid.querySelectorAll(".media-card")).forEach((el, i) => {
      attachPromptHandlers(el, D.genVideos[i].prompt);
    });
  }

  // --------- In-Context Generation (UniVideo-like) ---------
  const inContextGenStack = document.getElementById("inContextGenStack");
  if (inContextGenStack && D?.inContextGen) {
    inContextGenStack.innerHTML = D.inContextGen.map(item => `
      <div class="ctx-card">
        <div class="ctx-top">
          <div>
            <div class="muted">Reference images</div>
            <div class="ctx-refgrid">
              ${(item.refs || []).map(p => `<img src="${p}" alt="Reference image" loading="lazy" />`).join("")}
            </div>
          </div>
          <div class="ctx-output">
            <div class="muted">Generated video</div>
            <video controls playsinline preload="metadata">
              <source src="${item.outputVideo}" type="video/mp4" />
            </video>
          </div>
        </div>
        <div class="ctx-instruction"><b>Instruction:</b> ${escapeHtml(item.instruction || "")}</div>
      </div>
    `).join("");
  }

  // --------- Image Editing (before/after slider + prompt tooltip) ---------
  const imageEditGrid = document.getElementById("imageEditGrid");
  if (imageEditGrid && D?.imageEdits) {
    imageEditGrid.innerHTML = D.imageEdits.map((x, idx) => `
      <div class="media-card" data-prompt="${escapeHtmlAttr(x.prompt)}">
        <button class="info-btn" title="Show prompt">ⓘ</button>
        <div class="compare" data-idx="${idx}">
          <img class="before" src="${x.before}" alt="Before" loading="lazy" />
          <img class="after" src="${x.after}" alt="After" loading="lazy" />
          <div class="handle"></div>
          <input class="range" type="range" min="0" max="100" value="50" aria-label="Compare slider" />
        </div>
        <div class="media-meta">
          <div class="label">${escapeHtml(x.title || "Image Edit")}</div>
          <div class="sub">Drag to compare, hover for prompt</div>
        </div>
      </div>
    `).join("");

    Array.from(imageEditGrid.querySelectorAll(".media-card")).forEach((el, i) => {
      attachPromptHandlers(el, D.imageEdits[i].prompt);
    });

    // slider logic
    Array.from(imageEditGrid.querySelectorAll(".compare")).forEach((cmp) => {
      const range = cmp.querySelector(".range");
      const after = cmp.querySelector(".after");
      const handle = cmp.querySelector(".handle");
      const setPos = (v) => {
        const pct = Math.max(0, Math.min(100, Number(v)));
        after.style.clipPath = `inset(0 0 0 ${pct}%)`;
        handle.style.left = `${pct}%`;
      };
      setPos(range.value);
      range.addEventListener("input", () => setPos(range.value));
    });
  }

  // --------- Video Editing: filters + blocks ---------
  const filters = document.getElementById("videoEditFilters");
  const stack = document.getElementById("videoEditStack");

  const renderVideoEdits = (task) => {
    if (!stack) return;
    const items = (D.videoEdits || []).filter(x => task === "All" ? true : x.task === task);
    stack.innerHTML = items.map(x => `
      <div class="video-block" data-task="${escapeHtmlAttr(x.task)}">
        <div class="video-pair">
          <div>
            <div class="muted">Source</div>
            <video controls playsinline preload="metadata">
              <source src="${x.src}" type="video/mp4" />
            </video>
          </div>
          <div>
            <div class="muted">Edited</div>
            <video controls playsinline preload="metadata">
              <source src="${x.out}" type="video/mp4" />
            </video>
          </div>
        </div>
        <div class="block-caption"><b>${escapeHtml(x.task)}:</b> ${escapeHtml(x.prompt)}</div>
      </div>
    `).join("");
  };

  if (filters && D?.videoEditTasks?.length) {
    filters.innerHTML = D.videoEditTasks.map((t, i) => `
      <button class="filter-btn ${i === 0 ? "active":""}" data-task="${escapeHtmlAttr(t)}">${escapeHtml(t)}</button>
    `).join("");

    Array.from(filters.querySelectorAll(".filter-btn")).forEach(btn => {
      btn.addEventListener("click", () => {
        Array.from(filters.querySelectorAll(".filter-btn")).forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderVideoEdits(btn.dataset.task);
      });
    });

    renderVideoEdits("All");
  }

  // --------- In-Context Editing ---------
  const inContextEditStack = document.getElementById("inContextEditStack");
  if (inContextEditStack && D?.inContextEdits) {
    inContextEditStack.innerHTML = D.inContextEdits.map(item => `
      <div class="ctx-card">
        <div class="ctx-top">
          <div>
            <div class="muted">Reference images</div>
            <div class="ctx-refgrid">
              ${(item.refs || []).map(p => `<img src="${p}" alt="Reference image" loading="lazy" />`).join("")}
            </div>
          </div>
          <div class="ctx-output">
            <div class="muted">Output video</div>
            <video controls playsinline preload="metadata">
              <source src="${item.outputVideo}" type="video/mp4" />
            </video>
          </div>
        </div>
        <div class="ctx-instruction"><b>Instruction:</b> ${escapeHtml(item.instruction || "")}</div>
      </div>
    `).join("");
  }

  // --------- Re-cam section ---------
  const recamStack = document.getElementById("recamStack");
  if (recamStack && D?.recam) {
    recamStack.innerHTML = D.recam.map(item => `
      <div class="video-block">
        <div class="video-pair">
          <div>
            <div class="muted">Reference camera-motion video</div>
            <video controls playsinline preload="metadata">
              <source src="${item.refVideo}" type="video/mp4" />
            </video>
          </div>
          <div>
            <div class="muted">Original (top) & Re-cammed (bottom)</div>
            <div class="stack" style="gap:10px;">
              <video controls playsinline preload="metadata">
                <source src="${item.oriVideo}" type="video/mp4" />
              </video>
              <video controls playsinline preload="metadata">
                <source src="${item.outVideo}" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
        <div class="block-caption"><b>Instruction:</b> ${escapeHtml(item.instruction || "")}</div>
      </div>
    `).join("");
  }

  // --------- Footer year ---------
  document.getElementById("year").textContent = String(new Date().getFullYear());

  // --------- Utilities ---------
  function escapeHtml(s){
    return String(s ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
  function escapeHtmlAttr(s){ return escapeHtml(s).replaceAll("\n","&#10;"); }

})();