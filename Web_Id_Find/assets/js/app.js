// ============================================================================
// The Binding of Isaac: Repentance — Item ID Catalog v2.0 (PC 1.7.9b)
// ============================================================================
(() => {
  "use strict";

  const STORAGE_KEYS = {
    BUILD: "isaac_foursouls_build",
    CUSTOM_DB_V2: "isaac_v2_custom_db",
    CUSTOM_DB_V1: "isaac_foursouls_custom_db_eid_v2",
  };

  const PAGE_SIZE = 48;

  const CUSTOM_ART_META = {
    12: { src: "./assets/art/art-12.webp", artNote: "保留红底白斑伞盖，在菌柄加入泪眼与全属性爆发的金色粒子。" },
    105: { src: "./assets/art/art-105.webp", artNote: "战损红宝石质感的六面骰悬浮于碎裂祭坛之上，环绕重随命运电弧。" },
    114: { src: "./assets/art/art-114.webp", artNote: "铆钉木柄屠夫菜刀配以寒光刀面与鲜血，底座刻有深红刀痕。" },
    118: { src: "./assets/art/art-118.webp", artNote: "利维坦双十字无穷徽记化为沸腾血浆晶体，迸发地狱暗红电弧。" },
    182: { src: "./assets/art/art-182.webp", artNote: "荆棘缠绕的解剖心脏顶端燃起神圣金焰与天使光环。" },
    331: { src: "./assets/art/art-331.webp", artNote: "全视之眼黄金三角淌下青色圣泪，背后绽放几何白光法阵。" },
    395: { src: "./assets/art/art-395.webp", artNote: "机械神经头显中央凝聚翠绿等离子激光圆环。" },
    562: { src: "./assets/art/art-562.webp", artNote: "流淌泪水的崩裂巨石背后冲出象征“只升不降”的金色箭头。" },
    636: { src: "./assets/art/art-636.webp", artNote: "复古机械键盘 R 键帽散发霓虹绿光与时光倒流齿轮。" },
    678: { src: "./assets/art/art-678.webp", artNote: "半透明粉红灵体胎儿蜷缩在血色护盾泡内。" },
    689: { src: "./assets/art/art-689.webp", artNote: "王冠在青、品红、紫三色故障像素块中闪烁切分。" },
    723: { src: "./assets/art/art-723.webp", artNote: "星空紫计数二十面骰浮现金色数字 20 与降序螺旋箭头。" },
  };

  const QUALITY_META = {
    4: { label: "Q4", stars: "★★★★", cls: "q-4" },
    3: { label: "Q3", stars: "★★★", cls: "q-3" },
    2: { label: "Q2", stars: "★★", cls: "q-2" },
    1: { label: "Q1", stars: "★", cls: "q-1" },
    0: { label: "Q0", stars: "☆", cls: "q-0" },
  };

  const TYPE_LABELS = {
    passive: "被动",
    active: "主动",
    familiar: "跟班",
  };

  const ROOM_DOOR_GUIDE = {
    宝箱房: { doorSvg: "doorTreasure", title: "金色王冠门 · 宝箱房", tip: "第 1 层免费进入，第 2–6 层需消耗 1 把钥匙开锁。" },
    恶魔房: { doorSvg: "doorDevil", title: "暗红恶魔门 · 恶魔房", tip: "第 2 层起不损失红心容器击败本层 Boss 后高概率开启，需用心容器或魂心交易。" },
    天使房: { doorSvg: "doorAngel", title: "圣光羽翼门 · 天使房", tip: "恶魔房开启时不进入或不交易，后续楼层可转化为天使房。" },
    隐藏房: { doorSvg: "doorSecret", title: "裂纹墙 · 隐藏房", tip: "通常位于 2–3 个相邻普通房间的无障碍夹角墙后，用炸弹炸开。" },
    星象房: { doorSvg: "doorPlanet", title: "深蓝星轨门 · 星象房", tip: "跳过未开启的宝箱房可大幅提升下一层生成星象房的概率。" },
    Boss房: { doorSvg: "doorBoss", title: "骷髅门 · Boss 房", tip: "击败每层常规 Boss 后从 Boss 道具池掉落 1 件道具。" },
    商店: { doorSvg: "doorShop", title: "金币门 · 商店", tip: "消耗 1 把钥匙进入，常规道具售价 15 硬币。" },
    诅咒房: { doorSvg: "doorCurse", title: "带刺铁门 · 诅咒房", tip: "进出大门各扣半颗心（飞行进门不扣血），常出现红箱子与猫套道具。" },
    图书馆: { doorSvg: "doorLibrary", title: "书卷门 · 图书馆", tip: "消耗 1 把钥匙进入，陈列多本书籍类道具。" },
    红箱子: { doorSvg: "doorCurse", title: "红箱子道具池", tip: "开启红箱子有概率直接开出道具或传送到恶魔/天使房。" },
  };

  const TRANSFORMATIONS = [
    { id: "Guppy", nameZh: "嗝屁猫 (猫套)", bonus: "获得飞行，眼泪命中时有概率生成追踪蓝苍蝇。" },
    { id: "Seraphim", nameZh: "炽天使 (天使套)", bonus: "获得飞行并立即获得 3 颗魂心。" },
    { id: "Leviathan", nameZh: "利维坦 (恶魔套)", bonus: "获得飞行并立即获得 2 颗黑心。" },
    { id: "Beelzebub", nameZh: "苍蝇王 (苍蝇套)", bonus: "获得飞行，敌方苍蝇类怪物转化为友方蓝苍蝇。" },
    { id: "Bookworm", nameZh: "书虫 (书套)", bonus: "射击时有概率额外发射一发眼泪。" },
    { id: "Fun Guy", nameZh: "蘑菇套", bonus: "红心容器上限 +1 并恢复 1 颗红心。" },
    { id: "Spun", nameZh: "嗑药套 (针套)", bonus: "伤害 +2.0、移速 +0.15 并掉落一颗胶囊。" },
    { id: "Mom", nameZh: "妈套 (Yes Mother?)", bonus: "背后长出跟随切敌的静态妈刀。" },
    { id: "Conjoined", nameZh: "连体套", bonus: "额外向左右 45° 方向同步发射两发眼泪。" },
  ];

  // Valid presets matching actual 3/3 transformations in built-in 62-item DB
  const BUILD_PRESETS = {
    leviathan: { title: "恶魔套示例（3/3 利维坦）", ids: [118, 230, 441] },
    seraphim: { title: "天使套示例（3/3 炽天使）", ids: [182, 331, 72] },
    mush: { title: "蘑菇套示例（3/3 蘑菇套）", ids: [11, 12, 71] },
  };

  const SPINDOWN_EXAMPLES = [
    { fromId: 119, toId: 118, label: "编号对照示例一：#119 → #118" },
    { fromId: 183, toId: 182, label: "编号对照示例二：#183 → #182" },
    { fromId: 679, toId: 678, label: "编号对照示例三：#679 → #678" },
    { fromId: 692, toId: 691, label: "编号对照示例四：#692 → #691" },
    { fromId: 637, toId: 636, label: "编号对照示例五：#637 → #636" },
  ];

  // ==========================================================================
  // STATE
  // ==========================================================================
  let defaultItems = [];
  let itemsDB = [];
  let vanillaIndex = {
    version: "PC Repentance 1.7.9b",
    maxId: 732,
    validIds: [],
    validSet: new Set(),
    gapIds: [],
    notableNames: {},
  };

  const state = {
    tab: "catalog",
    searchQuery: "",
    quality: "all",
    type: "all",
    pool: "all",
    sort: "id-asc",
    page: 1,
    isCustomDB: false,
    buildIds: [118, 182, 562],
    selectedId: null,
    modalArtView: "minimal",
    galleryRendered: false,
    lastFocusedBeforeModal: null,
  };

  // ==========================================================================
  // SAFE TEXT ESCAPING & STRICT ID PARSING (SHARED BY SEARCH / CONSOLE / DICE)
  // ==========================================================================
  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function toHalfWidth(str) {
    return String(str ?? "").replace(/[\uFF01-\uFF5E]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
    );
  }

  /**
   * Unified strict ID parser for Search, Console Generator, and Spindown Dice.
   * Accepts:
   *   118, #678, c182, 5.100.331, g c118, giveitem c118, spawn 5.100.118
   * Rejects blank, 0, negative, decimals (119.5), non-safe integers (> MAX_SAFE_INTEGER).
   * Returns:
   *   { isIdAttempt: boolean, valid: boolean, id: number|null, error: string|null }
   */
  function parseUnifiedIdInput(raw, { strictMode = false } = {}) {
    const trimmed = toHalfWidth(raw).trim();
    if (!trimmed) {
      return {
        isIdAttempt: strictMode,
        valid: false,
        id: null,
        error: strictMode ? "请输入 PC 忏悔 1.7.9b 有效的正整数道具编号（如 118）。" : null,
      };
    }

    const lowered = trimmed.toLowerCase();

    // Match full console commands or prefixed ID formats
    let candidate = null;
    const cmdMatch = lowered.match(
      /^(?:(?:g|giveitem)\s+c?|spawn\s+5\.100\.|5\.100\.|#|c(?=[+-]?\d))([^\s]+)$/,
    );
    if (cmdMatch) {
      candidate = cmdMatch[1];
    } else if (/^[+-]?\d+(?:\.\d+)?$/.test(lowered)) {
      candidate = lowered;
    } else if (strictMode) {
      return {
        isIdAttempt: true,
        valid: false,
        id: null,
        error: `「${trimmed}」不是有效的编号格式。请输入正整数（如 118）或完整指令（如 g c118）。`,
      };
    } else {
      // Plain keyword / alias / English name search
      return { isIdAttempt: false, valid: false, id: null, error: null };
    }

    // Strict positive safe integer verification (no decimals, no negatives, no leading junk)
    if (!/^\d+$/.test(candidate)) {
      return {
        isIdAttempt: true,
        valid: false,
        id: null,
        error: `编号「${trimmed}」无效：必须为正整数，不能包含负号、小数点或非法字符。`,
      };
    }

    const num = Number(candidate);
    const normalizedDigits = candidate.replace(/^0+/, "") || "0";
    if (!Number.isSafeInteger(num) || String(num) !== normalizedDigits) {
      return {
        isIdAttempt: true,
        valid: false,
        id: null,
        error: `编号「${trimmed}」超出 JavaScript 安全整数范围，无法精确表示。`,
      };
    }

    if (num <= 0) {
      return {
        isIdAttempt: true,
        valid: false,
        id: null,
        error: "编号必须为大于 0 的正整数。",
      };
    }

    return { isIdAttempt: true, valid: true, id: num, error: null };
  }

  function classifyVanillaId(id) {
    const inCurrent = itemsDB.find((i) => i.id === id) || null;
    if (inCurrent) {
      return {
        status: vanillaIndex.validSet.has(id) ? "collected" : "custom",
        item: inCurrent,
      };
    }
    if (vanillaIndex.validSet.has(id)) {
      return {
        status: "uncollected_vanilla",
        item: null,
        notableName: vanillaIndex.notableNames[String(id)] || null,
      };
    }
    return { status: "nonexistent", item: null };
  }

  // ==========================================================================
  // FULL DATASET VALIDATION & SAFE LOCALSTORAGE PERSISTENCE
  // ==========================================================================
  function validateItemsDataset(raw) {
    if (!Array.isArray(raw)) {
      return { ok: false, error: "JSON 根节点必须是道具数组（[...]）。" };
    }
    if (raw.length === 0) {
      return { ok: false, error: "道具数组不能为空。" };
    }

    const seenIds = new Set();
    const cleaned = [];

    for (let idx = 0; idx < raw.length; idx++) {
      const entry = raw[idx];
      const pos = `第 ${idx + 1} 条`;
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
        return { ok: false, error: `${pos}数据不是有效对象。` };
      }
      if (
        typeof entry.id !== "number" ||
        !Number.isSafeInteger(entry.id) ||
        entry.id <= 0
      ) {
        return { ok: false, error: `${pos}的 id 必须为正整数。` };
      }
      if (seenIds.has(entry.id)) {
        return { ok: false, error: `存在重复编号 #${entry.id}，已取消导入。` };
      }
      seenIds.add(entry.id);

      if (typeof entry.nameZh !== "string" || !entry.nameZh.trim()) {
        return { ok: false, error: `#${entry.id} 缺少有效的中文名称 (nameZh)。` };
      }
      if (typeof entry.nameEn !== "string") {
        return { ok: false, error: `#${entry.id} 缺少字符串类型的英文名称 (nameEn)。` };
      }
      if (typeof entry.effect !== "string" || !entry.effect.trim()) {
        return { ok: false, error: `#${entry.id} 缺少有效的效果说明 (effect)。` };
      }
      if (
        typeof entry.quality !== "number" ||
        !Number.isInteger(entry.quality) ||
        entry.quality < 0 ||
        entry.quality > 4
      ) {
        return { ok: false, error: `#${entry.id} 的品质 (quality) 必须为 0–4 的整数。` };
      }
      if (!["passive", "active", "familiar"].includes(entry.type)) {
        return {
          ok: false,
          error: `#${entry.id} 的类型 (type) 必须为 passive、active 或 familiar。`,
        };
      }
      if (
        !Array.isArray(entry.pools) ||
        !entry.pools.every((p) => typeof p === "string")
      ) {
        return { ok: false, error: `#${entry.id} 的 pools 必须为字符串数组。` };
      }

      const optionalArrayFields = ["aliases", "stats", "transforms", "specialSources"];
      for (const field of optionalArrayFields) {
        if (
          entry[field] !== undefined &&
          (!Array.isArray(entry[field]) ||
            !entry[field].every((v) => typeof v === "string"))
        ) {
          return { ok: false, error: `#${entry.id} 的 ${field} 字段必须为字符串数组。` };
        }
      }

      cleaned.push({
        id: entry.id,
        nameZh: entry.nameZh.trim(),
        nameEn: entry.nameEn.trim(),
        aliases: entry.aliases ? [...entry.aliases] : [],
        quote: typeof entry.quote === "string" ? entry.quote : "",
        quoteEn: typeof entry.quoteEn === "string" ? entry.quoteEn : "",
        quality: entry.quality,
        type: entry.type,
        charge: typeof entry.charge === "string" ? entry.charge : undefined,
        pools: [...entry.pools],
        specialSources: entry.specialSources ? [...entry.specialSources] : [],
        icon: typeof entry.icon === "string" ? entry.icon : "tear",
        effect: entry.effect.trim(),
        stats: entry.stats ? [...entry.stats] : [],
        synergies: typeof entry.synergies === "string" ? entry.synergies : "",
        transforms: entry.transforms ? [...entry.transforms] : [],
        unlock: typeof entry.unlock === "string" ? entry.unlock : null,
        specialNote: typeof entry.specialNote === "string" ? entry.specialNote : undefined,
      });
    }

    return { ok: true, items: cleaned };
  }

  function loadPersistedState() {
    // 1. Load saved build IDs (compatible with v1.0)
    try {
      const savedBuild = localStorage.getItem(STORAGE_KEYS.BUILD);
      if (savedBuild) {
        const parsed = JSON.parse(savedBuild);
        if (
          Array.isArray(parsed) &&
          parsed.every((n) => typeof n === "number" && Number.isSafeInteger(n) && n > 0)
        ) {
          state.buildIds = Array.from(new Set(parsed));
        }
      }
    } catch (_e) {
      // Keep default buildIds
    }

    // 2. Load custom DB (v2 key first, then v1 compatibility key)
    const rawV2 = safeStorageGet(STORAGE_KEYS.CUSTOM_DB_V2);
    const rawV1 = rawV2 === null ? safeStorageGet(STORAGE_KEYS.CUSTOM_DB_V1) : null;
    const rawCustom = rawV2 !== null ? rawV2 : rawV1;

    if (rawCustom !== null) {
      try {
        const parsed = JSON.parse(rawCustom);
        const check = validateItemsDataset(parsed);
        if (check.ok) {
          itemsDB = check.items;
          state.isCustomDB = true;
          return;
        }
        showStorageRecoveryNotice(
          `检测到浏览器存档中的自定义道具库无效（${check.error}），已自动回退到内置 PC 忏悔 1.7.9b 道具库。`,
        );
      } catch (_err) {
        showStorageRecoveryNotice(
          "检测到浏览器存档中的自定义道具库 JSON 损坏，已自动回退到内置 PC 忏悔 1.7.9b 道具库。",
        );
      }
      itemsDB = [...defaultItems];
      state.isCustomDB = false;
    } else {
      itemsDB = [...defaultItems];
      state.isCustomDB = false;
    }
  }

  function safeStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (_e) {
      return null;
    }
  }

  function saveBuildState() {
    try {
      localStorage.setItem(STORAGE_KEYS.BUILD, JSON.stringify(state.buildIds));
    } catch (_e) {
      // Non-fatal
    }
  }

  function showStorageRecoveryNotice(msg) {
    const el = document.getElementById("storage-notice");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hidden");
  }

  // ==========================================================================
  // HONEST CLIPBOARD COPY WITH MANUAL SELECTABLE FALLBACK
  // ==========================================================================
  function showToast(msg, isError = false) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("toast-error", isError);
    el.classList.add("visible");
    clearTimeout(window.__isaacToastTimer);
    window.__isaacToastTimer = setTimeout(() => {
      el.classList.remove("visible");
    }, 2600);
  }

  function renderCopyFallback(containerId, text, label) {
    const box = document.getElementById(containerId) || document.getElementById("global-copy-fallback");
    if (!box) return;
    const isMultiLine = text.includes("\n");
    box.classList.remove("hidden");
    box.innerHTML = `
      <p class="copy-fallback-label">自动复制未成功，请手动选中下方「${escapeHtml(label)}」并按 Ctrl+C / Cmd+C 复制：</p>
      ${
        isMultiLine
          ? `<textarea class="copy-fallback-textarea" readonly aria-label="可手动复制的${escapeHtml(label)}">${escapeHtml(text)}</textarea>`
          : `<input type="text" class="copy-fallback-input" readonly value="${escapeHtml(text)}" aria-label="可手动复制的${escapeHtml(label)}" />`
      }
    `;
    const field = box.querySelector("input, textarea");
    if (field) {
      field.focus();
      field.select();
    }
  }

  function hideCopyFallbacks() {
    ["global-copy-fallback", "build-copy-fallback", "dev-copy-fallback", "modal-copy-fallback"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add("hidden");
        el.innerHTML = "";
      }
    });
  }

  async function copyCommand(text, label, fallbackContainerId = "global-copy-fallback") {
    hideCopyFallbacks();
    let copied = false;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch (_err) {
        copied = false;
      }
    }

    if (!copied) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        const res = document.execCommand("copy");
        copied = res === true;
      } catch (_err) {
        copied = false;
      }
      document.body.removeChild(ta);
    }

    if (copied) {
      showToast(`已复制 ${label}`);
      return true;
    }

    showToast(`复制失败，已提供可选中的${label}`, true);
    renderCopyFallback(fallbackContainerId, text, label);
    return false;
  }

  // ==========================================================================
  // ORDER-INDEPENDENT BUILD STAT ESTIMATION (属性估算)
  // ==========================================================================
  function getAvailableBuildItems() {
    const available = [];
    const missingIds = [];
    for (const id of state.buildIds) {
      const found = itemsDB.find((i) => i.id === id);
      if (found) available.push(found);
      else missingIds.push(id);
    }
    const commandItems = available.filter((item) => vanillaIndex.validSet.has(item.id));
    return { available, missingIds, commandItems };
  }

  function computeBuildEstimate(availableItems) {
    const idSet = new Set(availableItems.map((i) => i.id));
    const hasRockBottom = idSet.has(562);

    // Base Isaac stats
    let flatDmg = 0;
    let dmgMult = 1.0;
    let flatTears = 0;
    let tearsMult = 1.0;
    let flatSpd = 0;
    let redHearts = 3;
    let soulHearts = 0;
    let blackHearts = 0;

    // 1.5x non-stacking damage multiplier pool (#4 Cricket's Head, #12 Magic Mushroom)
    if (idSet.has(4) || idSet.has(12)) {
      dmgMult *= 1.5;
    }

    // Verified PC Repentance 1.7.9b flat & multiplier contributions (order-independent)
    if (idSet.has(1)) flatTears += 0.7;
    if (idSet.has(2) && !hasRockBottom) tearsMult *= 0.51;
    if (idSet.has(4)) flatDmg += 0.5;
    if (idSet.has(12)) { flatDmg += 0.3; flatSpd += 0.3; redHearts += 1; }
    if (idSet.has(14)) flatSpd += 0.3;
    if (idSet.has(15)) redHearts += 1;
    if (idSet.has(70)) { flatDmg += 1.0; flatSpd += 0.2; }
    if (idSet.has(71)) flatSpd += 0.3;
    if (idSet.has(72)) { flatTears += 0.5; soulHearts += 3; }
    if (idSet.has(119)) { redHearts += 1; flatSpd += 0.3; }
    if (idSet.has(149)) flatDmg += 40.0;
    if (idSet.has(169)) {
      flatDmg += 4.0;
      dmgMult *= 2.0;
      if (!hasRockBottom) tearsMult *= 0.42;
    }
    if (idSet.has(182)) {
      flatDmg += 1.0;
      dmgMult *= 2.3;
      redHearts += 1;
      if (!hasRockBottom) flatTears -= 0.4;
    }
    if (idSet.has(183)) flatTears += 0.7;
    if (idSet.has(230)) {
      flatDmg += 1.5;
      flatSpd += 0.2;
      blackHearts += redHearts + 2;
      redHearts = 0;
    }
    if (idSet.has(245) && !hasRockBottom) dmgMult *= 0.8;
    if (idSet.has(301)) soulHearts += 3;
    if (idSet.has(307)) { flatDmg += 0.5; flatTears += 0.5; flatSpd += 0.1; redHearts += 1; }
    if (idSet.has(331)) {
      flatDmg += 0.5;
      if (!hasRockBottom) flatTears -= 0.3;
    }
    if (idSet.has(415)) {
      dmgMult *= 2.0;
      soulHearts += 2;
    }
    if (idSet.has(590)) flatSpd += 0.4;
    if (idSet.has(591)) redHearts += 1;
    if (idSet.has(592)) flatDmg += 1.0;
    if (idSet.has(594)) redHearts += 2;
    if (idSet.has(598)) flatTears += 0.7;
    if (idSet.has(633)) { flatDmg += 2.0; flatSpd += 0.1; }

    // Transformation bonuses (deterministic, from availableItems)
    const transCounts = {};
    for (const item of availableItems) {
      for (const t of item.transforms || []) {
        transCounts[t] = (transCounts[t] || 0) + 1;
      }
    }
    if ((transCounts["Spun"] || 0) >= 3) {
      flatDmg += 2.0;
      flatSpd += 0.15;
    }
    if ((transCounts["Seraphim"] || 0) >= 3) soulHearts += 3;
    if ((transCounts["Leviathan"] || 0) >= 3) blackHearts += 2;
    if ((transCounts["Fun Guy"] || 0) >= 3) redHearts += 1;

    const finalDmg = Math.max(0.5, (3.5 + flatDmg) * dmgMult);
    const finalTears = Math.max(0.5, (2.73 + flatTears) * tearsMult);
    const finalSpd = Math.min(2.0, Math.max(0.1, 1.0 + flatSpd));

    return {
      dmg: finalDmg.toFixed(2),
      tears: finalTears.toFixed(2),
      spd: finalSpd.toFixed(2),
      redHearts: Math.min(12, redHearts),
      soulHearts: Math.min(12, soulHearts),
      blackHearts: Math.min(12, blackHearts),
      transCounts,
    };
  }

  function updateHudDisplay() {
    const { available } = getAvailableBuildItems();
    const est = computeBuildEstimate(available);

    const dmgEl = document.getElementById("hud-dmg");
    const tearsEl = document.getElementById("hud-tears");
    const spdEl = document.getElementById("hud-spd");
    if (dmgEl) dmgEl.textContent = est.dmg;
    if (tearsEl) tearsEl.textContent = est.tears;
    if (spdEl) spdEl.textContent = est.spd;

    const heartsBar = document.getElementById("hud-hearts-bar");
    if (heartsBar) {
      const icons = [];
      for (let i = 0; i < Math.min(5, est.redHearts); i++) icons.push(window.ISAAC_ICONS.UI.heartRed);
      for (let i = 0; i < Math.min(4, est.soulHearts); i++) icons.push(window.ISAAC_ICONS.UI.heartSoul);
      for (let i = 0; i < Math.min(4, est.blackHearts); i++) icons.push(window.ISAAC_ICONS.UI.heartBlack);
      heartsBar.innerHTML = icons.slice(0, 8).join("");
    }

    const navCount = document.getElementById("nav-count");
    if (navCount) navCount.textContent = String(itemsDB.length);
    const buildCount = document.getElementById("build-count");
    if (buildCount) buildCount.textContent = String(available.length);

    const badge = document.getElementById("db-source-badge");
    if (badge) {
      badge.textContent = state.isCustomDB
        ? `自定义库 · 当前 ${itemsDB.length} 件`
        : `内置 PC 忏悔 1.7.9b · 共 ${itemsDB.length} 件`;
      badge.classList.toggle("custom", state.isCustomDB);
    }

    const devSummary = document.getElementById("dev-db-summary");
    if (devSummary) {
      devSummary.textContent = state.isCustomDB
        ? `当前使用【自定义道具库】（共 ${itemsDB.length} 件）。导入新文件将先完整校验再替换当前库；可随时恢复内置 ${defaultItems.length} 件默认库。`
        : `当前使用【内置 PC 忏悔 1.7.9b 精选库】（共 ${itemsDB.length} 件）。导入自定义库会先完成整份校验再替换当前浏览库，兼容 1.0 有效 JSON 备份。`;
    }
  }

  // ==========================================================================
  // CATALOG RENDERING (EXACT ID PANEL vs UNIFIED COMPACT SORTED LIST)
  // ==========================================================================
  function getNicheBgClass(item) {
    const pools = item.pools || [];
    if (pools.includes("天使房")) return "niche-bg-angel";
    if (pools.includes("恶魔房")) return "niche-bg-devil";
    if (pools.includes("星象房")) return "niche-bg-planet";
    if (pools.includes("隐藏房")) return "niche-bg-secret";
    return "niche-bg-default";
  }

  function renderExactMatchPanel(parsedId) {
    const box = document.getElementById("exact-match-box");
    const listWrap = document.getElementById("catalog-list-wrap");
    if (!box || !listWrap) return;

    if (!parsedId.isIdAttempt) {
      box.classList.add("hidden");
      box.innerHTML = "";
      listWrap.classList.remove("hidden");
      return;
    }

    // Exact ID query mode: ONLY show dedicated status/result card, hide listWrap
    listWrap.classList.add("hidden");
    box.classList.remove("hidden");

    if (!parsedId.valid) {
      box.innerHTML = `
        <div class="exact-status-card status-nonexistent">
          <div class="exact-status-top">
            <div>
              <span class="version-badge">编号输入无效</span>
              <h2 class="hand-title" style="margin: 8px 0 4px; font-size: 1.15rem;">无法解析该编号</h2>
              <p style="margin: 0; font-size: 13px; font-weight: 700; color: var(--ink-700);">${escapeHtml(parsedId.error)}</p>
            </div>
            <button type="button" class="isaac-btn btn-parchment" data-action="clear-search">返回浏览列表</button>
          </div>
        </div>
      `;
      return;
    }

    const id = parsedId.id;
    const statusInfo = classifyVanillaId(id);

    if (statusInfo.item) {
      const item = statusInfo.item;
      const hasVanillaId = statusInfo.status === "collected";
      const hasQ4Portrait = window.ISAAC_ICONS.hasQ4Portrait(item);
      const qMeta = QUALITY_META[item.quality] || QUALITY_META[0];
      const inBuild = state.buildIds.includes(item.id);
      const filterNotes = [];
      if (state.type !== "all" && item.type !== state.type) {
        filterNotes.push(`当前类型筛选为「${TYPE_LABELS[state.type] || state.type}」，该道具实际为「${TYPE_LABELS[item.type]}」`);
      }
      if (state.quality !== "all" && item.quality !== Number(state.quality)) {
        filterNotes.push(`当前品质筛选为 Q${state.quality}，该道具实际为 Q${item.quality}`);
      }
      if (state.pool !== "all" && !(item.pools || []).includes(state.pool)) {
        filterNotes.push(`当前道具池筛选为「${state.pool}」`);
      }

      box.innerHTML = `
        <div class="exact-status-card${hasQ4Portrait ? " q4-featured-card" : ""}">
          <div class="exact-status-top">
            <div class="exact-item-main">
              <button type="button" class="icon-stage-btn ${hasQ4Portrait ? "q4-stage" : window.ISAAC_ICONS.MINIMAL_SMALL_ICONS[item.id] ? "has-minimal" : ""}" data-open-modal="${item.id}" aria-label="打开 #${item.id} ${escapeHtml(item.nameZh)} 详情">
                ${window.ISAAC_ICONS.getItemIcon(item, hasQ4Portrait ? 56 : 44)}
              </button>
              <div style="min-width: 0;">
                <div class="card-id-group">
                  <span class="version-badge">${hasVanillaId ? "精确命中" : "自定义编号"} #${item.id}</span>
                  <span class="q-chip ${qMeta.cls}">${qMeta.label} ${qMeta.stars}</span>
                  <span class="type-chip">${TYPE_LABELS[item.type] || item.type}</span>
                </div>
                <h2 class="hand-title" style="margin: 6px 0 2px; font-size: 1.25rem;">
                  ${escapeHtml(item.nameZh)}
                  <span class="mono" style="font-size: 13px; color: var(--ink-500); font-weight: 700;">${escapeHtml(item.nameEn)}</span>
                </h2>
                <p style="margin: 4px 0 0; font-size: 13px; font-weight: 700; color: var(--ink-900);">${escapeHtml(item.effect)}</p>
                ${
                  filterNotes.length
                    ? `<p style="margin: 6px 0 0; font-size: 11px; font-weight: 700; color: var(--amber-ink);">提示：精确编号搜索不受列表筛选隐藏影响（${escapeHtml(filterNotes.join("；"))}），清空搜索后原筛选继续生效。</p>`
                    : ""
                }
              </div>
            </div>
            <div class="search-quick-actions" style="flex-shrink: 0;">
              ${hasVanillaId ? `
                <button type="button" class="isaac-btn btn-gold mono" data-copy-cmd="g c${item.id}" data-copy-label="获取指令">复制 g c${item.id}</button>
                <button type="button" class="isaac-btn btn-parchment mono" data-copy-cmd="spawn 5.100.${item.id}" data-copy-label="生成底座指令">复制 spawn</button>
              ` : ""}
              <button type="button" class="isaac-btn ${inBuild ? "btn-crimson" : "btn-parchment"}" data-toggle-build="${item.id}">${inBuild ? "已加入配装 ✓" : "+ 加入配装"}</button>
              <button type="button" class="isaac-btn btn-ink" data-open-modal="${item.id}">查看详情 →</button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    if (statusInfo.status === "uncollected_vanilla") {
      box.innerHTML = `
        <div class="exact-status-card status-uncollected">
          <div class="exact-status-top">
            <div>
              <div class="card-id-group">
                <span class="q-chip q-4">原版存在 · 本站暂未收录</span>
                <span class="id-chip">#${id}</span>
                ${statusInfo.notableName ? `<span class="mono" style="font-size: 12px; font-weight: 800; color: var(--ink-700);">${escapeHtml(statusInfo.notableName)}</span>` : ""}
              </div>
              <h2 class="hand-title" style="margin: 8px 0 4px; font-size: 1.15rem;">
                PC 忏悔 1.7.9b 存在编号 #${id}，但当前库（${itemsDB.length} 件）暂未收录详情
              </h2>
              <p style="margin: 0; font-size: 12px; font-weight: 700; color: var(--ink-700);">
                该编号在原版 1.7.9b 中有效，可直接复制控制台指令，或通过底部开发者抽屉导入完整 700+ 自定义库。
              </p>
            </div>
            <div class="search-quick-actions" style="flex-shrink: 0;">
              <button type="button" class="isaac-btn btn-gold mono" data-copy-cmd="giveitem c${id}" data-copy-label="获取指令">复制 giveitem c${id}</button>
              <button type="button" class="isaac-btn btn-parchment mono" data-copy-cmd="spawn 5.100.${id}" data-copy-label="生成底座指令">复制 spawn 5.100.${id}</button>
              <button type="button" class="isaac-btn btn-parchment" data-action="clear-search">返回浏览</button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Nonexistent in vanilla 1.7.9b (e.g. #43, #61, #999)
    box.innerHTML = `
      <div class="exact-status-card status-nonexistent">
        <div class="exact-status-top">
          <div>
            <div class="card-id-group">
              <span class="q-chip q-0">原版无此编号</span>
              <span class="id-chip">#${id}</span>
            </div>
            <h2 class="hand-title" style="margin: 8px 0 4px; font-size: 1.15rem;">
              PC 忏悔 1.7.9b 不存在道具编号 #${id}
            </h2>
            <p style="margin: 0; font-size: 12px; font-weight: 700; color: var(--ink-700);">
              该编号在原版 1.7.9b 中为空缺编号或超出范围（1–${vanillaIndex.maxId}），已禁用控制台指令生成以避免无效命令。
            </p>
          </div>
          <div class="search-quick-actions" style="flex-shrink: 0;">
            <button type="button" class="isaac-btn btn-parchment mono" disabled>指令已禁用</button>
            <button type="button" class="isaac-btn btn-ink" data-action="clear-search">返回浏览</button>
          </div>
        </div>
      </div>
    `;
  }

  function getFilteredKeywordItems() {
    const q = toHalfWidth(state.searchQuery).trim().toLowerCase();

    const list = itemsDB.filter((item) => {
      if (state.quality !== "all" && item.quality !== Number(state.quality)) return false;
      if (state.type !== "all" && item.type !== state.type) return false;
      if (state.pool !== "all" && !(item.pools || []).includes(state.pool)) return false;
      if (!q) return true;
      const hay = [
        item.id,
        item.nameZh,
        ...(item.aliases || []),
        item.nameEn,
        item.quote,
        item.quoteEn,
        item.effect,
        item.synergies,
        ...(item.pools || []),
        ...(item.specialSources || []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });

    list.sort((a, b) => {
      if (state.sort === "id-asc") return a.id - b.id;
      if (state.sort === "id-desc") return b.id - a.id;
      if (state.sort === "quality-desc") return b.quality - a.quality || a.id - b.id;
      return a.id - b.id;
    });

    return list;
  }

  function renderCompactCard(item) {
    const hasQ4Portrait = window.ISAAC_ICONS.hasQ4Portrait(item);
    const qMeta = QUALITY_META[item.quality] || QUALITY_META[0];
    const inBuild = state.buildIds.includes(item.id);
    const nicheBg = getNicheBgClass(item);
    const typeLabel =
      item.type === "active" && item.charge
        ? `主动·${item.charge}`
        : TYPE_LABELS[item.type] || item.type;

    const poolTags = (item.pools || [])
      .slice(0, 2)
      .map((p) => `<span class="pool-tag">${escapeHtml(p)}</span>`)
      .join("");
    const specialTags = (item.specialSources || [])
      .slice(0, 1)
      .map((s) => `<span class="pool-tag special-source" title="${escapeHtml(s)}">特殊来源</span>`)
      .join("");

    return `
      <article class="stone-niche-cell ${nicheBg}${hasQ4Portrait ? " q4-featured-card" : ""}" data-item-id="${item.id}">
        <div>
          <div class="card-meta-row">
            <div class="card-id-group">
              <span class="id-chip">#${item.id}</span>
              <span class="type-chip">${escapeHtml(typeLabel)}</span>
            </div>
            <span class="q-chip ${qMeta.cls}">${qMeta.label} ${qMeta.stars}</span>
          </div>

          <div class="card-body-row">
            <button
              type="button"
              class="icon-stage-btn ${hasQ4Portrait ? "q4-stage" : window.ISAAC_ICONS.MINIMAL_SMALL_ICONS[item.id] ? "has-minimal" : ""}"
              data-open-modal="${item.id}"
              aria-label="查看 #${item.id} ${escapeHtml(item.nameZh)} 详情"
            >
              ${window.ISAAC_ICONS.getItemIcon(item, hasQ4Portrait ? 56 : 44)}
            </button>
            <div class="card-title-col">
              <button type="button" class="card-title-btn" data-open-modal="${item.id}">
                ${escapeHtml(item.nameZh)}
              </button>
              <p class="card-en">${escapeHtml(item.nameEn)}</p>
              ${item.quote ? `<p class="card-quote">「${escapeHtml(item.quote)}」</p>` : ""}
            </div>
          </div>

          <p class="card-effect">${escapeHtml(item.effect)}</p>
          <div class="card-pools-row">
            ${poolTags || specialTags || `<span class="pool-tag special-source">无常规池</span>`}
          </div>
        </div>

        <div class="card-actions-row">
          ${vanillaIndex.validSet.has(item.id) ? `
            <button
              type="button"
              class="niche-btn mono"
              data-copy-cmd="g c${item.id}"
              data-copy-label="#${item.id} 指令"
            >
              复制 g c${item.id}
            </button>
          ` : `<span class="type-chip">自定义编号</span>`}
          <div class="card-action-btns">
            <button
              type="button"
              class="niche-btn ${inBuild ? "in-build" : ""}"
              data-toggle-build="${item.id}"
            >
              ${inBuild ? "已选 ✓" : "+ 配装"}
            </button>
            <button
              type="button"
              class="niche-btn dark"
              data-open-modal="${item.id}"
            >
              详情
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderCatalog() {
    const parsedId = parseUnifiedIdInput(state.searchQuery, { strictMode: false });
    renderExactMatchPanel(parsedId);
    if (parsedId.isIdAttempt) return;

    const list = getFilteredKeywordItems();
    const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (state.page > totalPages) state.page = totalPages;

    const start = (state.page - 1) * PAGE_SIZE;
    const pageItems = list.slice(start, start + PAGE_SIZE);

    const summary = document.getElementById("results-summary");
    const pageInfo = document.getElementById("pagination-info");
    const grid = document.getElementById("items-grid");
    const pageBar = document.getElementById("pagination-bar");

    if (summary) {
      summary.textContent = `PC 忏悔 1.7.9b · 当前匹配 ${list.length} / ${itemsDB.length} 件道具（统一排序）`;
    }
    if (pageInfo) {
      pageInfo.textContent = list.length > PAGE_SIZE ? `第 ${state.page} / ${totalPages} 页` : "";
    }

    if (!grid) return;
    if (pageItems.length === 0) {
      grid.innerHTML = `
        <div class="isaac-sheet" style="grid-column: 1 / -1; text-align: center;">
          <p style="margin: 0; font-weight: 900;">没有匹配当前关键词或筛选条件的道具</p>
          <p style="margin: 6px 0 0; font-size: 12px; color: var(--ink-700);">点击「重置筛选」可恢复全部列表。</p>
        </div>
      `;
      if (pageBar) pageBar.classList.add("hidden");
      return;
    }

    grid.innerHTML = pageItems.map(renderCompactCard).join("");

    if (pageBar) {
      if (totalPages > 1) {
        pageBar.classList.remove("hidden");
        pageBar.innerHTML = `
          <button type="button" class="isaac-btn btn-parchment" data-page="${state.page - 1}" ${state.page <= 1 ? "disabled" : ""}>← 上一页</button>
          <span class="db-source-badge mono">第 ${state.page} / ${totalPages} 页</span>
          <button type="button" class="isaac-btn btn-parchment" data-page="${state.page + 1}" ${state.page >= totalPages ? "disabled" : ""}>下一页 →</button>
        `;
      } else {
        pageBar.classList.add("hidden");
        pageBar.innerHTML = "";
      }
    }
  }

  // ==========================================================================
  // LAZY GALLERY RENDERING (ONLY LOADS ART IMAGES WHEN GALLERY IS OPENED)
  // ==========================================================================
  function renderGalleryView() {
    const previewEl = document.getElementById("minimal-icon-preview");
    if (previewEl) {
      const sampleIds = [118, 182, 636];
      previewEl.innerHTML = sampleIds
        .map((id) => {
          const item = itemsDB.find((i) => i.id === id) || defaultItems.find((i) => i.id === id);
          if (!item) return "";
          return `
            <div class="icon-compare-card">
              <div>
                <div class="mono" style="font-size: 11px; color: var(--gilt-300); font-weight: 900;">#${item.id}</div>
                <div class="hand-title" style="font-size: 15px; font-weight: 900;">${escapeHtml(item.nameZh)}</div>
                <div class="mono" style="font-size: 10px; color: rgba(227,204,163,0.75);">${escapeHtml(item.nameEn)}</div>
              </div>
              <div class="size-sample-group">
                <div class="size-sample">
                  <div class="size-box-32${window.ISAAC_ICONS.hasQ4Portrait(item) ? " q4-stage" : ""}">${window.ISAAC_ICONS.getItemIcon(item, 28)}</div>
                  <span>32px</span>
                </div>
                <div class="size-sample">
                  <div class="size-box-48${window.ISAAC_ICONS.hasQ4Portrait(item) ? " q4-stage" : ""}">${window.ISAAC_ICONS.getItemIcon(item, 42)}</div>
                  <span>48px</span>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
    }

    const grid = document.getElementById("gallery-grid");
    if (!grid) return;

    const featuredIds = Object.keys(CUSTOM_ART_META).map(Number);
    const featuredItems = featuredIds
      .map((id) => itemsDB.find((i) => i.id === id) || defaultItems.find((i) => i.id === id))
      .filter(Boolean);

    grid.innerHTML = featuredItems
      .map((item) => {
        const art = CUSTOM_ART_META[item.id];
        const qMeta = QUALITY_META[item.quality] || QUALITY_META[0];
        return `
          <article class="framed-masterpiece">
            <div class="gallery-card-top">
              <button type="button" class="gallery-art-frame" data-open-modal="${item.id}" aria-label="鉴赏 #${item.id} ${escapeHtml(item.nameZh)} 详情">
                <img src="${art.src}" alt="${escapeHtml(item.nameZh)} 典藏插画" loading="lazy" />
              </button>
              <div style="flex: 1; min-width: 0;">
                <div class="card-meta-row">
                  <span class="id-chip">#${item.id}</span>
                  <span class="q-chip ${qMeta.cls}">${qMeta.label} ${qMeta.stars}</span>
                </div>
                <h3 class="hand-title" style="margin: 6px 0 2px; font-size: 1.2rem; color: var(--ink-950);">
                  ${escapeHtml(item.nameZh)}
                  <span class="mono" style="font-size: 12px; color: var(--ink-500);">${escapeHtml(item.nameEn)}</span>
                </h3>
                <div class="art-note-box">画师手记：${escapeHtml(art.artNote)}</div>
                <p style="margin: 8px 0 0; font-size: 12px; font-weight: 700; color: var(--ink-900);">${escapeHtml(item.effect)}</p>
              </div>
            </div>
            <div style="display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1.5px dashed rgba(61,44,36,0.35);">
              <button type="button" class="isaac-btn btn-parchment btn-sm mono" data-copy-cmd="g c${item.id}" data-copy-label="#${item.id} 指令">复制 g c${item.id}</button>
              <button type="button" class="isaac-btn btn-ink btn-sm" data-open-modal="${item.id}">翻开详情 →</button>
            </div>
          </article>
        `;
      })
      .join("");

    state.galleryRendered = true;
  }

  // ==========================================================================
  // BUILD STICKER JOURNAL RENDERING (SINGLE SOURCE OF AVAILABLE ITEMS)
  // ==========================================================================
  function renderBuildView() {
    const { available, missingIds, commandItems } = getAvailableBuildItems();
    const est = computeBuildEstimate(available);

    const titleEl = document.getElementById("build-available-title");
    if (titleEl) {
      titleEl.textContent = `手账软木贴纸墙（当前库可用 ${available.length} 件${missingIds.length ? `，另有 ${missingIds.length} 件当前库未收录` : ""}）`;
    }

    const missingBox = document.getElementById("build-missing-notice");
    if (missingBox) {
      if (missingIds.length > 0) {
        missingBox.classList.remove("hidden");
        missingBox.textContent = `原配装记录中以下编号在当前道具库不可用：${missingIds.map((id) => `#${id}`).join("、")}。它们已保留在记录中（切回内置库可恢复），但不计入当前可用件数、属性估算与复制指令。`;
      } else {
        missingBox.classList.add("hidden");
        missingBox.textContent = "";
      }
    }

    const grid = document.getElementById("build-items-grid");
    if (grid) {
      if (state.buildIds.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 24px; color: var(--parchment-50); font-size: 12px; font-weight: 700;">
            当前配装为空。点击上方示例或在图鉴中点击「+ 配装」加入道具。
          </div>
        `;
      } else {
        const availableHtml = available
          .map(
            (item) => `
              <div class="diecut-sticker">
                <button type="button" class="icon-stage-btn${window.ISAAC_ICONS.hasQ4Portrait(item) ? " q4-stage" : ""}" data-open-modal="${item.id}" aria-label="查看 #${item.id} ${escapeHtml(item.nameZh)}">
                  ${window.ISAAC_ICONS.getItemIcon(item, window.ISAAC_ICONS.hasQ4Portrait(item) ? 54 : 42)}
                </button>
                <span class="mono" style="margin-top: 6px; font-size: 10px; font-weight: 900; color: var(--crimson-800);">#${item.id}</span>
                <span class="hand-title" style="font-size: 13px; font-weight: 900;">${escapeHtml(item.nameZh)}</span>
                <button type="button" class="isaac-btn btn-parchment btn-sm" style="margin-top: 8px; width: 100%;" data-toggle-build="${item.id}">移除 ×</button>
              </div>
            `,
          )
          .join("");

        const missingHtml = missingIds
          .map(
            (id) => `
              <div class="diecut-sticker missing-in-db">
                <span class="mono" style="font-size: 12px; font-weight: 900; color: #57534e;">#${id}</span>
                <span style="margin-top: 4px; font-size: 11px; font-weight: 800; color: #57534e;">当前库缺失</span>
                <button type="button" class="isaac-btn btn-parchment btn-sm" style="margin-top: 8px; width: 100%;" data-toggle-build="${id}">移除 ×</button>
              </div>
            `,
          )
          .join("");

        grid.innerHTML = availableHtml + missingHtml;
      }
    }

    // Transformation progress & seal
    const tList = document.getElementById("transformation-list");
    const stampBox = document.getElementById("corkboard-stamp-box");
    const achieved = [];

    if (tList) {
      tList.innerHTML = TRANSFORMATIONS.map((t) => {
        const count = est.transCounts[t.id] || 0;
        const pct = Math.min(100, (count / 3) * 100);
        const done = count >= 3;
        if (done) achieved.push(t);
        return `
          <div class="transform-card ${done ? "done" : ""}">
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 900;">
              <span>${escapeHtml(t.nameZh)}</span>
              <span class="mono">${count}/3 ${done ? "★已达成" : ""}</span>
            </div>
            <div class="progress-track"><div class="progress-fill" style="width: ${pct}%"></div></div>
            <p style="margin: 4px 0 0; font-size: 11px; color: var(--ink-700);">${escapeHtml(t.bonus)}</p>
          </div>
        `;
      }).join("");
    }

    if (stampBox) {
      if (achieved.length > 0) {
        stampBox.classList.remove("hidden");
        stampBox.innerHTML = achieved
          .map((t) => `<span class="red-ink-seal">${escapeHtml(t.nameZh)} 达成</span>`)
          .join(" ");
      } else {
        stampBox.classList.add("hidden");
        stampBox.innerHTML = "";
      }
    }

    // Line-by-line copyable commands for available items
    const lineCmdWrap = document.getElementById("build-line-commands");
    if (lineCmdWrap) {
      if (commandItems.length === 0) {
        lineCmdWrap.innerHTML = `<p style="margin: 0; font-size: 12px; color: var(--ink-500);">当前配装暂无可用的原版指令。</p>`;
      } else {
        lineCmdWrap.innerHTML = `
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${commandItems
              .map(
                (item) => `
                  <button
                    type="button"
                    class="isaac-btn btn-parchment btn-sm mono"
                    data-copy-cmd="g c${item.id}"
                    data-copy-label="#${item.id} ${escapeHtml(item.nameZh)} 指令"
                    data-copy-target="build-copy-fallback"
                  >
                    g c${item.id}（${escapeHtml(item.nameZh)}）
                  </button>
                `,
              )
              .join("")}
          </div>
          ${commandItems.length < available.length ? `<p style="margin: 8px 0 0; font-size: 12px; color: var(--ink-500);">复制时只包含原版编号，自定义道具仍保留在配装。</p>` : ""}
        `;
      }
    }
  }

  // ==========================================================================
  // SPINDOWN DICE NUMBER REFERENCE (编号对照)
  // ==========================================================================
  function renderSpindownExamples() {
    const grid = document.getElementById("alchemy-comic-grid");
    if (!grid) return;

    grid.innerHTML = SPINDOWN_EXAMPLES.map((ex) => {
      const fromItem = itemsDB.find((i) => i.id === ex.fromId);
      const toItem = itemsDB.find((i) => i.id === ex.toId);
      if (!fromItem || !toItem) return "";
      const fromQ = QUALITY_META[fromItem.quality] || QUALITY_META[0];
      const toQ = QUALITY_META[toItem.quality] || QUALITY_META[0];
      return `
        <article class="alchemy-card">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px;">
              <strong style="font-size: 13px; color: var(--crimson-800);">${escapeHtml(ex.label)}</strong>
              <span class="q-chip q-4">编号对照</span>
            </div>
            <div class="alchemy-stage">
              <button type="button" class="niche-btn dark" data-open-modal="${fromItem.id}">
                #${fromItem.id} ${escapeHtml(fromItem.nameZh)} (${fromQ.label})
              </button>
              <span class="mono" style="font-size: 11px; color: var(--gilt-300); font-weight: 900;">编号 -1 →</span>
              <button type="button" class="niche-btn dark" data-open-modal="${toItem.id}">
                #${toItem.id} ${escapeHtml(toItem.nameZh)} (${toQ.label})
              </button>
            </div>
            <p style="margin: 8px 0 0; font-size: 12px; color: var(--ink-700);">
              在 PC 忏悔 1.7.9b 编号序列中，#${fromItem.id}（${fromQ.label}）的紧邻前一项为 #${toItem.id}（${toQ.label}）；实际重随受解锁与挑战模式规则影响。
            </p>
          </div>
          <div style="margin-top: 10px; display: flex; justify-content: flex-end;">
            <button type="button" class="isaac-btn btn-parchment btn-sm" data-spin-preset="${fromItem.id}">
              载入下方对照台 ↓
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  function runSpindownLookup() {
    const inputEl = document.getElementById("spindown-input");
    const errEl = document.getElementById("spindown-error");
    const outEl = document.getElementById("spindown-result");
    if (!inputEl || !errEl || !outEl) return;

    const parsed = parseUnifiedIdInput(inputEl.value, { strictMode: true });
    if (!parsed.valid) {
      errEl.textContent = parsed.error;
      errEl.classList.remove("hidden");
      outEl.innerHTML = "";
      return;
    }

    const startId = parsed.id;
    if (startId > vanillaIndex.maxId) {
      errEl.textContent = `PC 忏悔 1.7.9b 最大道具编号为 #${vanillaIndex.maxId}，#${startId} 超出原版范围。`;
      errEl.classList.remove("hidden");
      outEl.innerHTML = "";
      return;
    }

    errEl.classList.add("hidden");
    errEl.textContent = "";

    // Walk downwards through vanilla 1.7.9b valid IDs (up to 12 valid steps)
    const rows = [];
    let current = startId;
    let validOffset = 0;
    while (current >= 1 && rows.length < 12) {
      if (vanillaIndex.validSet.has(current)) {
        const localItem = itemsDB.find((i) => i.id === current) || null;
        rows.push({
          id: current,
          diff: startId - current,
          validOffset,
          item: localItem,
          notableName: vanillaIndex.notableNames[String(current)] || null,
        });
        validOffset++;
      }
      current--;
    }

    outEl.innerHTML = rows
      .map((row) => {
        const tag = row.diff === 0 ? "起始编号" : `编号差 -${row.diff}（有效序位 -${row.validOffset}）`;
        if (row.item) {
          const qMeta = QUALITY_META[row.item.quality] || QUALITY_META[0];
          return `
            <div class="transform-card" style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
              <div style="min-width: 0;">
                <div class="card-id-group">
                  <span class="id-chip">#${row.id}</span>
                  <span class="q-chip ${qMeta.cls}">${qMeta.label}</span>
                  <span class="mono" style="font-size: 10px; color: var(--ink-500);">${tag}</span>
                </div>
                <strong style="display: block; margin-top: 3px; font-size: 13px;">${escapeHtml(row.item.nameZh)} <span class="mono" style="font-size: 11px; color: var(--ink-500);">${escapeHtml(row.item.nameEn)}</span></strong>
              </div>
              <button type="button" class="isaac-btn btn-gold btn-sm" data-open-modal="${row.id}">详情</button>
            </div>
          `;
        }
        return `
          <div class="transform-card" style="display: flex; align-items: center; justify-content: space-between; gap: 8px; opacity: 0.85;">
            <div style="min-width: 0;">
              <div class="card-id-group">
                <span class="id-chip">#${row.id}</span>
                <span class="type-chip">原版存在 · 本站未收录</span>
                <span class="mono" style="font-size: 10px; color: var(--ink-500);">${tag}</span>
              </div>
              <span class="mono" style="display: block; margin-top: 3px; font-size: 12px; color: var(--ink-700);">
                ${row.notableName ? escapeHtml(row.notableName) : `PC 忏悔 1.7.9b 原版有效道具 #${row.id}`}
              </span>
            </div>
            <button type="button" class="isaac-btn btn-parchment btn-sm mono" data-copy-cmd="g c${row.id}" data-copy-label="#${row.id} 指令">g c${row.id}</button>
          </div>
        `;
      })
      .join("");
  }

  // ==========================================================================
  // ACCESSIBLE DETAIL MODAL (FOCUS TRAP + FOCUS RESTORE + LAZY ART)
  // ==========================================================================
  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => !el.classList.contains("hidden") && el.offsetParent !== null);
  }

  function openModal(id, triggerEl = null) {
    const item = itemsDB.find((i) => i.id === id) || defaultItems.find((i) => i.id === id);
    if (!item) return;

    if (state.selectedId === null) {
      state.lastFocusedBeforeModal = triggerEl || document.activeElement;
    }

    const hasArt = Boolean(CUSTOM_ART_META[item.id]);
    const hasQ4Portrait = window.ISAAC_ICONS.hasQ4Portrait(item);
    if (state.selectedId !== id) {
      state.modalArtView = hasArt && !hasQ4Portrait ? "art" : "minimal";
    }
    state.selectedId = id;

    const qMeta = QUALITY_META[item.quality] || QUALITY_META[0];
    const inBuild = state.buildIds.includes(item.id);
    const prevVanillaId = findAdjacentVanillaId(item.id, -1);
    const nextVanillaId = findAdjacentVanillaId(item.id, 1);
    const prevItem = prevVanillaId ? itemsDB.find((i) => i.id === prevVanillaId) : null;
    const nextItem = nextVanillaId ? itemsDB.find((i) => i.id === nextVanillaId) : null;

    const art = CUSTOM_ART_META[item.id];
    const showQ4Portrait = hasQ4Portrait && state.modalArtView === "minimal";
    const stageHtml =
      state.modalArtView === "art" && art
        ? `<img src="${art.src}" alt="${escapeHtml(item.nameZh)} 典藏插画" />`
        : window.ISAAC_ICONS.getItemIcon(item, showQ4Portrait ? 184 : 140);

    const doorGuides = (item.pools || []).map((p) => {
      const g = ROOM_DOOR_GUIDE[p] || { doorSvg: "doorSpecial", title: p, tip: "属于该常规房间道具池。" };
      return `
        <div style="display: flex; align-items: flex-start; gap: 8px; margin-top: 6px;">
          ${window.ISAAC_ICONS.UI[g.doorSvg] || window.ISAAC_ICONS.UI.doorSpecial}
          <div>
            <strong style="font-size: 12px;">${escapeHtml(g.title)}</strong>
            <p style="margin: 2px 0 0; font-size: 11px; color: var(--ink-700);">${escapeHtml(g.tip)}</p>
          </div>
        </div>
      `;
    });

    const specialSourcesHtml = (item.specialSources || []).map(
      (s) => `
        <div style="display: flex; align-items: flex-start; gap: 8px; margin-top: 6px;">
          ${window.ISAAC_ICONS.UI.doorSpecial}
          <div>
            <strong style="font-size: 12px;">特殊奖励 / 固定来源</strong>
            <p style="margin: 2px 0 0; font-size: 11px; color: var(--ink-700);">${escapeHtml(s)}</p>
          </div>
        </div>
      `,
    );

    const body = document.getElementById("modal-body");
    body.innerHTML = `
      <div class="modal-grid">
        <div>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button type="button" class="isaac-btn btn-sm ${state.modalArtView === "art" ? "btn-gold" : "btn-parchment"}" data-modal-art="art" ${!hasArt ? "disabled" : ""}>
              典藏插画${hasArt ? "" : "(无)"}
            </button>
            <button type="button" class="isaac-btn btn-sm ${state.modalArtView === "minimal" ? "btn-gold" : "btn-parchment"}" data-modal-art="minimal">
              ${hasQ4Portrait ? "Q4 手绘图标" : "列表矢量图标"}
            </button>
          </div>

          <div class="modal-stage-box${showQ4Portrait ? " q4-stage" : ""}">${stageHtml}</div>

          ${
            art && !showQ4Portrait
              ? `<div class="art-note-box">画师手记：${escapeHtml(art.artNote)}</div>`
              : ""
          }

          <div class="modal-block">
            <strong style="font-size: 12px;">解锁与版本基准（PC 忏悔 1.7.9b）</strong>
            <p style="margin: 4px 0 0; font-size: 12px; color: var(--ink-700);">
              ${item.unlock ? escapeHtml(item.unlock) : "默认初始可遇（无需前置成就解锁）。"}
            </p>
          </div>
        </div>

        <div>
          <div class="card-id-group">
            <span class="version-badge">#${item.id}</span>
            <span class="q-chip ${qMeta.cls}">${qMeta.label} ${qMeta.stars}</span>
            <span class="type-chip">${escapeHtml(TYPE_LABELS[item.type] || item.type)}${item.type === "active" && item.charge ? ` · ${escapeHtml(item.charge)}` : ""}</span>
          </div>

          <h2 id="modal-title" class="hand-title" style="margin: 8px 0 2px; font-size: 1.55rem;">
            ${escapeHtml(item.nameZh)}
            <span class="mono" style="font-size: 14px; color: var(--ink-500); font-weight: 700;">${escapeHtml(item.nameEn)}</span>
          </h2>
          ${item.quote ? `<p class="mono" style="margin: 2px 0 0; font-size: 12px; font-weight: 800; color: var(--crimson-800);">EID 拾取语：「${escapeHtml(item.quote)}」</p>` : ""}
          ${item.aliases && item.aliases.length ? `<p style="margin: 3px 0 0; font-size: 12px; color: var(--ink-700);">常见俗称：${escapeHtml(item.aliases.join(" / "))}</p>` : ""}

          <div class="modal-block">
            <strong style="font-size: 13px; color: var(--crimson-800);">效果说明</strong>
            <p style="margin: 5px 0 0; font-size: 13px; font-weight: 700;">${escapeHtml(item.effect)}</p>
            ${item.specialNote ? `<p style="margin: 6px 0 0; font-size: 12px; color: var(--amber-ink); font-weight: 700;">机制补充：${escapeHtml(item.specialNote)}</p>` : ""}
          </div>

          ${
            item.synergies
              ? `<div class="modal-block amber"><strong style="font-size: 13px;">联动与实用说明</strong><p style="margin: 5px 0 0; font-size: 12px; font-weight: 700;">${escapeHtml(item.synergies)}</p></div>`
              : ""
          }

          <div class="modal-block">
            <strong style="font-size: 13px;">获取来源（常规池与特殊来源区分展示）</strong>
            ${doorGuides.join("")}
            ${specialSourcesHtml.join("")}
            ${doorGuides.length === 0 && specialSourcesHtml.length === 0 ? `<p style="margin: 4px 0 0; font-size: 12px; color: var(--ink-700);">暂未标注常规道具池。</p>` : ""}
          </div>

          <div class="modal-block">
            <strong style="font-size: 12px;">计数二十面骰 · 相邻编号对照（PC 1.7.9b）</strong>
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; margin-top: 6px; font-size: 12px;">
              <div>
                <span>前一项：</span>
                ${
                  prevItem
                    ? `<button type="button" class="isaac-btn btn-parchment btn-sm mono" data-open-modal="${prevItem.id}">#${prevItem.id} ${escapeHtml(prevItem.nameZh)}</button>`
                    : `<span class="mono">${prevVanillaId ? `#${prevVanillaId}（原版存在，本站未收录）` : "无"}</span>`
                }
              </div>
              <div>
                <span>后一项：</span>
                ${
                  nextItem
                    ? `<button type="button" class="isaac-btn btn-parchment btn-sm mono" data-open-modal="${nextItem.id}">#${nextItem.id} ${escapeHtml(nextItem.nameZh)}</button>`
                    : `<span class="mono">${nextVanillaId ? `#${nextVanillaId}（原版存在，本站未收录）` : "无"}</span>`
                }
              </div>
            </div>
          </div>

          <div id="modal-copy-fallback" class="copy-fallback-box hidden" role="alert"></div>

          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; margin-top: 14px;">
            <a href="https://bindingofisaacrebirth.wiki.gg/wiki/${encodeURIComponent(item.nameEn.replace(/ /g, "_"))}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; font-weight: 800; color: var(--ink-700);">
              在官方 Wiki.gg 查看 ↗
            </a>
            <div class="search-quick-actions">
              ${vanillaIndex.validSet.has(item.id) ? `
                <button type="button" class="isaac-btn btn-parchment btn-sm mono" data-copy-cmd="g c${item.id}" data-copy-label="#${item.id} 指令" data-copy-target="modal-copy-fallback">复制 g c${item.id}</button>
                <button type="button" class="isaac-btn btn-parchment btn-sm mono" data-copy-cmd="spawn 5.100.${item.id}" data-copy-label="#${item.id} 底座指令" data-copy-target="modal-copy-fallback">复制 spawn</button>
              ` : `<span class="version-badge">自定义编号</span>`}
              <button type="button" class="isaac-btn btn-sm ${inBuild ? "btn-crimson" : "btn-gold"}" data-toggle-build="${item.id}" data-reopen-modal="${item.id}">${inBuild ? "从配装移除" : "+ 加入配装"}</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const modal = document.getElementById("detail-modal");
    const surface = document.getElementById("modal-dialog-surface");
    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
    if (surface) surface.scrollTop = 0;

    const closeBtn = document.getElementById("close-modal-btn");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (state.selectedId === null) return;
    state.selectedId = null;
    const modal = document.getElementById("detail-modal");
    modal.classList.add("hidden");
    document.body.classList.remove("modal-open");

    if (state.lastFocusedBeforeModal && typeof state.lastFocusedBeforeModal.focus === "function") {
      state.lastFocusedBeforeModal.focus();
    }
    state.lastFocusedBeforeModal = null;
  }

  function findAdjacentVanillaId(id, dir) {
    let cur = id + dir;
    while (cur >= 1 && cur <= vanillaIndex.maxId) {
      if (vanillaIndex.validSet.has(cur)) return cur;
      cur += dir;
    }
    return null;
  }

  // ==========================================================================
  // DEVELOPER CONSOLE GENERATOR (UNIFIED VALIDATION)
  // ==========================================================================
  function updateDevConsoleControls() {
    const input = document.getElementById("dev-cmd-id-input");
    const giveBtn = document.getElementById("dev-copy-give-btn");
    const spawnBtn = document.getElementById("dev-copy-spawn-btn");
    const fb = document.getElementById("dev-cmd-feedback");
    if (!input || !giveBtn || !spawnBtn || !fb) return;

    const parsed = parseUnifiedIdInput(input.value, { strictMode: true });
    if (!parsed.valid) {
      giveBtn.disabled = true;
      spawnBtn.disabled = true;
      giveBtn.textContent = "giveitem 不可用";
      spawnBtn.textContent = "spawn 不可用";
      fb.textContent = parsed.error;
      fb.className = "inline-feedback error";
      return null;
    }

    const id = parsed.id;
    if (!vanillaIndex.validSet.has(id)) {
      giveBtn.disabled = true;
      spawnBtn.disabled = true;
      giveBtn.textContent = "原版无此编号";
      spawnBtn.textContent = "原版无此编号";
      fb.textContent = `PC 忏悔 1.7.9b 不存在道具编号 #${id}，已禁用控制台指令生成。`;
      fb.className = "inline-feedback error";
      return null;
    }

    giveBtn.disabled = false;
    spawnBtn.disabled = false;
    giveBtn.textContent = `复制 giveitem c${id}`;
    spawnBtn.textContent = `复制 spawn 5.100.${id}`;

    const statusInfo = classifyVanillaId(id);
    if (statusInfo.status === "collected") {
      fb.textContent = `已校验：#${id} ${statusInfo.item.nameZh}（${statusInfo.item.nameEn}）`;
      fb.className = "inline-feedback ok";
    } else {
      fb.textContent = `已校验：#${id} 属于 PC 忏悔 1.7.9b 原版有效编号（本站当前库未收录详情）。`;
      fb.className = "inline-feedback warn";
    }
    return id;
  }

  // ==========================================================================
  // TABS & FILTER BUTTON STATES
  // ==========================================================================
  function renderTabs() {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      const active = btn.dataset.tab === state.tab;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    ["catalog", "gallery", "build", "spindown"].forEach((tabId) => {
      const panel = document.getElementById(`view-${tabId}`);
      if (panel) panel.classList.toggle("hidden", state.tab !== tabId);
    });

    if (state.tab === "gallery" && !state.galleryRendered) {
      renderGalleryView();
    }
    if (state.tab === "spindown") {
      renderSpindownExamples();
      runSpindownLookup();
    }
  }

  function renderFilterButtons() {
    document.querySelectorAll(".quality-btn").forEach((btn) => {
      const active = btn.dataset.quality === String(state.quality);
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function renderAll() {
    updateHudDisplay();
    renderTabs();
    renderFilterButtons();
    renderCatalog();
    renderBuildView();
    if (state.galleryRendered) renderGalleryView();
    if (state.tab === "spindown") {
      renderSpindownExamples();
      runSpindownLookup();
    }
    updateDevConsoleControls();
  }

  function toggleBuild(id) {
    if (state.buildIds.includes(id)) {
      state.buildIds = state.buildIds.filter((x) => x !== id);
      showToast(`已从配装移除 #${id}`);
    } else {
      state.buildIds.push(id);
      showToast(`已将 #${id} 加入配装`);
    }
    saveBuildState();
    renderAll();
  }

  // ==========================================================================
  // URL ?id= DEEP LINK SUPPORT
  // ==========================================================================
  function applyInitialUrlParam() {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    if (idParam && idParam.trim()) {
      state.searchQuery = idParam.trim();
      const input = document.getElementById("search-input");
      const clearBtn = document.getElementById("clear-search-btn");
      if (input) input.value = state.searchQuery;
      if (clearBtn) clearBtn.classList.remove("hidden");
    }
  }

  // ==========================================================================
  // EVENT WIRING & INITIALIZATION
  // ==========================================================================
  function initStaticIcons() {
    document.querySelectorAll(".nav-svg-slot").forEach((slot) => {
      const key = slot.dataset.icon;
      if (window.ISAAC_ICONS.UI[key]) slot.innerHTML = window.ISAAC_ICONS.UI[key];
    });
    const slots = [
      ["hud-icon-dmg", "statDmg"],
      ["hud-icon-tears", "statTears"],
      ["hud-icon-spd", "statSpd"],
      ["random-btn-icon", "diceMini"],
      ["dev-drawer-icon", "devTerminal"],
    ];
    for (const [elId, iconKey] of slots) {
      const el = document.getElementById(elId);
      if (el && window.ISAAC_ICONS.UI[iconKey]) el.innerHTML = window.ISAAC_ICONS.UI[iconKey];
    }
  }

  function bindEvents() {
    // Delegated click handler for cards, modals, presets, pagination, and copy buttons
    document.addEventListener("click", (e) => {
      const target = e.target.closest("button");
      if (!target) return;

      if (target.dataset.openModal) {
        const id = Number(target.dataset.openModal);
        if (Number.isSafeInteger(id)) openModal(id, target);
        return;
      }

      if (target.dataset.modalArt) {
        state.modalArtView = target.dataset.modalArt;
        if (state.selectedId !== null) openModal(state.selectedId, state.lastFocusedBeforeModal);
        return;
      }

      if (target.dataset.copyCmd) {
        copyCommand(
          target.dataset.copyCmd,
          target.dataset.copyLabel || "控制台指令",
          target.dataset.copyTarget || "global-copy-fallback",
        );
        return;
      }

      if (target.dataset.toggleBuild) {
        const id = Number(target.dataset.toggleBuild);
        if (Number.isSafeInteger(id)) {
          toggleBuild(id);
          if (target.dataset.reopenModal && state.selectedId !== null) {
            openModal(Number(target.dataset.reopenModal), state.lastFocusedBeforeModal);
          }
        }
        return;
      }

      if (target.dataset.page) {
        state.page = Math.max(1, Number(target.dataset.page));
        renderCatalog();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (target.dataset.action === "clear-search") {
        clearSearch();
        return;
      }

      if (target.dataset.spinPreset) {
        const spinInput = document.getElementById("spindown-input");
        if (spinInput) {
          spinInput.value = target.dataset.spinPreset;
          runSpindownLookup();
        }
        return;
      }
    });

    // Tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.tab = btn.dataset.tab;
        renderTabs();
      });
    });

    document.getElementById("gallery-back-btn")?.addEventListener("click", () => {
      state.tab = "catalog";
      renderTabs();
    });

    // Mobile filter collapse
    const filterToggle = document.getElementById("mobile-filter-toggle");
    const filtersPanel = document.getElementById("filters-panel");
    if (filterToggle && filtersPanel) {
      filterToggle.addEventListener("click", () => {
        const collapsed = filtersPanel.classList.toggle("mobile-collapsed");
        filterToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
        filterToggle.textContent = collapsed ? "筛选与排序 ▾" : "收起筛选 ▴";
      });
    }

    // Search input
    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("clear-search-btn");

    function clearSearch() {
      state.searchQuery = "";
      state.page = 1;
      if (searchInput) searchInput.value = "";
      if (clearSearchBtn) clearSearchBtn.classList.add("hidden");
      renderCatalog();
    }

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        state.page = 1;
        if (clearSearchBtn) clearSearchBtn.classList.toggle("hidden", !state.searchQuery);
        renderCatalog();
      });
    }
    clearSearchBtn?.addEventListener("click", clearSearch);

    // Quick lookup buttons
    document.querySelectorAll(".quick-id-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.searchQuery = btn.dataset.quickId || "";
        state.page = 1;
        if (searchInput) searchInput.value = state.searchQuery;
        if (clearSearchBtn) clearSearchBtn.classList.toggle("hidden", !state.searchQuery);
        renderCatalog();
      });
    });

    // Random item
    document.getElementById("random-item-btn")?.addEventListener("click", (e) => {
      if (itemsDB.length === 0) return;
      const rnd = itemsDB[Math.floor(Math.random() * itemsDB.length)];
      openModal(rnd.id, e.currentTarget);
    });

    // Quality buttons
    document.querySelectorAll(".quality-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.quality = btn.dataset.quality;
        state.page = 1;
        renderFilterButtons();
        renderCatalog();
      });
    });

    // Dropdown filters
    document.getElementById("type-filter")?.addEventListener("change", (e) => {
      state.type = e.target.value;
      state.page = 1;
      renderCatalog();
    });
    document.getElementById("pool-filter")?.addEventListener("change", (e) => {
      state.pool = e.target.value;
      state.page = 1;
      renderCatalog();
    });
    document.getElementById("sort-select")?.addEventListener("change", (e) => {
      state.sort = e.target.value;
      state.page = 1;
      renderCatalog();
    });

    // Reset filters
    document.getElementById("reset-filters-btn")?.addEventListener("click", () => {
      state.searchQuery = "";
      state.quality = "all";
      state.type = "all";
      state.pool = "all";
      state.sort = "id-asc";
      state.page = 1;
      if (searchInput) searchInput.value = "";
      if (clearSearchBtn) clearSearchBtn.classList.add("hidden");
      const tf = document.getElementById("type-filter");
      const pf = document.getElementById("pool-filter");
      const ss = document.getElementById("sort-select");
      if (tf) tf.value = "all";
      if (pf) pf.value = "all";
      if (ss) ss.value = "id-asc";
      renderAll();
    });

    // Build presets & actions
    document.querySelectorAll(".preset-run-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const preset = BUILD_PRESETS[btn.dataset.preset];
        if (!preset) return;
        state.buildIds = [...preset.ids];
        saveBuildState();
        renderAll();
        showToast(`已载入：${preset.title}`);
      });
    });

    document.getElementById("copy-build-cmd-btn")?.addEventListener("click", () => {
      const { commandItems } = getAvailableBuildItems();
      if (commandItems.length === 0) {
        showToast("当前配装暂无可用的原版指令", true);
        return;
      }
      const lines = commandItems.map((item) => `giveitem c${item.id}`).join("\n");
      copyCommand(lines, "当前配装的原版指令", "build-copy-fallback");
    });

    document.getElementById("clear-build-btn")?.addEventListener("click", () => {
      state.buildIds = [];
      saveBuildState();
      renderAll();
      showToast("已清空全部配装");
    });

    // Spindown controls
    document.getElementById("spindown-run-btn")?.addEventListener("click", runSpindownLookup);
    document.getElementById("spindown-input")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") runSpindownLookup();
    });

    // Developer console controls
    const devInput = document.getElementById("dev-cmd-id-input");
    devInput?.addEventListener("input", updateDevConsoleControls);
    document.getElementById("dev-copy-give-btn")?.addEventListener("click", () => {
      const id = updateDevConsoleControls();
      if (id !== null) copyCommand(`giveitem c${id}`, "控制台获取指令", "dev-copy-fallback");
    });
    document.getElementById("dev-copy-spawn-btn")?.addEventListener("click", () => {
      const id = updateDevConsoleControls();
      if (id !== null) copyCommand(`spawn 5.100.${id}`, "控制台生成底座指令", "dev-copy-fallback");
    });

    // Export JSON
    document.getElementById("export-json-btn")?.addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(itemsDB, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "isaac_repentance_1.7.9b_items.json";
      a.click();
      URL.revokeObjectURL(url);
      showToast(`已导出 ${itemsDB.length} 件道具 JSON 备份`);
    });

    // Import Custom JSON (strict full validation BEFORE switching & persisting)
    document.getElementById("import-json-input")?.addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      const statusEl = document.getElementById("import-status");
      if (!file || !statusEl) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        let parsed;
        try {
          parsed = JSON.parse(String(ev.target.result || ""));
        } catch (parseErr) {
          statusEl.textContent = `导入失败（JSON 格式错误）：${parseErr.message}。已保留上一份可用道具库。`;
          statusEl.className = "inline-feedback error";
          showToast("导入失败：JSON 格式错误", true);
          return;
        }

        const validation = validateItemsDataset(parsed);
        if (!validation.ok) {
          statusEl.textContent = `导入失败（数据校验未通过）：${validation.error} 已保留上一份可用道具库。`;
          statusEl.className = "inline-feedback error";
          showToast("导入失败：数据校验未通过", true);
          return;
        }

        const serialized = JSON.stringify(validation.items);
        try {
          localStorage.setItem(STORAGE_KEYS.CUSTOM_DB_V2, serialized);
        } catch (storageErr) {
          statusEl.textContent = `导入失败（浏览器存储写入失败）：${storageErr.message}。已保留上一份可用道具库。`;
          statusEl.className = "inline-feedback error";
          showToast("导入失败：存储空间不足或被禁用", true);
          return;
        }

        itemsDB = validation.items;
        state.isCustomDB = true;
        state.page = 1;
        statusEl.textContent = `已切换至自定义库（共 ${itemsDB.length} 件），刷新后将保持该数据。`;
        statusEl.className = "inline-feedback ok";
        showToast(`成功导入自定义库（${itemsDB.length} 件）`);
        renderAll();
      };
      reader.onerror = () => {
        statusEl.textContent = "导入失败：无法读取所选文件。已保留上一份可用道具库。";
        statusEl.className = "inline-feedback error";
      };
      reader.readAsText(file);
      e.target.value = "";
    });

    // Restore Default Built-in DB
    document.getElementById("restore-default-btn")?.addEventListener("click", () => {
      try {
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_DB_V2);
        localStorage.removeItem(STORAGE_KEYS.CUSTOM_DB_V1);
      } catch (_e) {}
      itemsDB = [...defaultItems];
      state.isCustomDB = false;
      state.page = 1;
      const statusEl = document.getElementById("import-status");
      if (statusEl) {
        statusEl.textContent = `已恢复默认内置 PC 忏悔 1.7.9b 道具库（共 ${itemsDB.length} 件）。`;
        statusEl.className = "inline-feedback ok";
      }
      showToast(`已恢复默认内置库（${itemsDB.length} 件）`);
      renderAll();
    });

    // Modal close & keyboard focus trap
    document.getElementById("close-modal-btn")?.addEventListener("click", closeModal);
    document.getElementById("detail-modal")?.addEventListener("click", (e) => {
      if (e.target.id === "detail-modal") closeModal();
    });

    document.addEventListener("keydown", (e) => {
      // Modal keyboard controls
      if (state.selectedId !== null) {
        if (e.key === "Escape") {
          e.preventDefault();
          closeModal();
          return;
        }
        if (e.key === "Tab") {
          const surface = document.getElementById("modal-dialog-surface");
          const focusables = surface ? getFocusableElements(surface) : [];
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first || document.activeElement === surface) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
          return;
        }
        return;
      }

      // '/' shortcut: ONLY on catalog tab and ONLY outside editable fields
      if (e.key === "/" && state.tab === "catalog") {
        const active = document.activeElement;
        const tag = active ? active.tagName.toLowerCase() : "";
        const isEditable =
          tag === "input" ||
          tag === "textarea" ||
          tag === "select" ||
          (active && active.isContentEditable);
        if (!isEditable && searchInput) {
          e.preventDefault();
          searchInput.focus();
        }
      }
    });
  }

  async function boot() {
    initStaticIcons();
    try {
      const [itemsRes, vanillaRes] = await Promise.all([
        fetch("./data/items.json"),
        fetch("./data/vanilla-1.7.9b-ids.json"),
      ]);
      if (!itemsRes.ok || !vanillaRes.ok) {
        throw new Error("无法加载静态数据文件，请确认通过 HTTP 服务器预览而非 file:// 直接打开。");
      }
      defaultItems = await itemsRes.json();
      const vData = await vanillaRes.json();
      vanillaIndex = {
        ...vData,
        validSet: new Set(vData.validIds || []),
      };
    } catch (err) {
      const grid = document.getElementById("items-grid");
      if (grid) {
        grid.innerHTML = `<div class="inline-feedback error" style="grid-column: 1 / -1;">数据初始化失败：${escapeHtml(err.message)}</div>`;
      }
      return;
    }

    loadPersistedState();
    applyInitialUrlParam();
    bindEvents();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
