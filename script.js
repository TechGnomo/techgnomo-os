const bootScreen = document.getElementById("bootScreen");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");
const commandButtons = document.querySelectorAll("[data-command]");
const focusTerminalButton = document.getElementById("focusTerminalButton");
const localClock = document.getElementById("localClock");
const osToast = document.getElementById("osToast");

let terminalBusy = false;
let commandHistory = [];
let commandHistoryIndex = -1;
let toastTimer = null;
let scrollTicking = false;
let interfaceStarted = false;

const commands = {
  help: [
    "<span class='terminal-success'>Available commands:</span>",
    "about              Show who Fabio / TechGnomo is",
    "experience         Show hospitality + tech background",
    "skills             Show current technical skills",
    "projects           List portfolio projects",
    "inspect            Jump to Project Inspector",
    "clearmoneypath     Open current build information",
    "status             Show current system status",
    "roadmap            Show next development goals",
    "stack              Show the technology stack",
    "resume             Show resume summary",
    "goals              Show current career goals",
    "theme              Toggle alternate OS theme",
    "copy email         Copy contact email",
    "contact            Show contact links",
    "links              Show external links",
    "open portfolio     Show current portfolio link",
    "open app           Show ClearMoneyPath product page link",
    "open github        Show GitHub link",
    "open linkedin      Show LinkedIn link",
    "clear              Clear terminal output",
    "",
    "Shortcuts:",
    "/                  Focus terminal",
    "Ctrl + K           Clear terminal",
    "Tab                Autocomplete command",
    "? / ?              Navigate command history",
  ],

  about: [
    "<span class='terminal-success'>Fabio D&apos;Anna / TechGnomo</span>",
    "Hospitality manager moving into junior web development, software development and IT support.",
    "Current focus: practical tools, mobile apps, web projects and simple systems that solve real problems.",
    "Location: Queensland, Australia.",
  ],

  experience: [
    "<span class='terminal-success'>Experience profile:</span>",
    "Hospitality management background with real-world business operations experience.",
    "Strong understanding of customer pressure, staff coordination, budgets, time limits and operational problems.",
    "Currently translating that practical experience into web apps, mobile apps and IT support skills.",
  ],

  skills: [
    "<span class='terminal-success'>Skills loaded:</span>",
    "HTML / CSS / JavaScript",
    "React Native / Expo",
    "Firebase Authentication / Firestore",
    "Git / GitHub / GitHub Pages",
    "Practical business operations from hospitality management",
    "IT support foundations and troubleshooting mindset",
  ],

  projects: [
    "<span class='terminal-success'>/projects directory:</span>",
    "ClearMoneyPath.app        MVP_IN_DEVELOPMENT",
    "BudgetPlanner.web         LIVE_DEMO",
    "HospitalityRoster.tool    PORTFOLIO_PROJECT",
    "MotorcycleTracker.app     CONCEPT",
    "",
    "Tip: type inspect to open the project inspector.",
  ],

  inspect: [
    "<span class='terminal-success'>Opening Project Inspector...</span>",
    "Inspecting /projects directory.",
    "Scroll target: #project-inspector",
  ],

  clearmoneypath: [
    "<span class='terminal-success'>Opening /projects/ClearMoneyPath.app...</span>",
    "ClearMoneyPath is a mobile-first pay cycle planner.",
    "Goal: help users know what to pay, what to save, what is safe to spend and how long until they are debt-free.",
    "Stack: React Native, Expo, Firebase.",
    "<a class='terminal-link' href='https://techgnomo.com/clearmoneypath.html' target='_blank' rel='noopener'>Open ClearMoneyPath landing page</a>",
  ],

  status: [
    "<span class='terminal-success'>System status:</span>",
    "PORTFOLIO_MODE       ACTIVE",
    "CURRENT_BUILD        ClearMoneyPath",
    "LEARNING_PATH        Web / Mobile / IT Support",
    "DEPLOYMENT           GitHub Pages",
    "PUBLIC_VERSION       TechGnomo OS v2",
    "NEXT_OBJECTIVE       Make the interface more interactive and memorable",
  ],

  roadmap: [
    "<span class='terminal-success'>Development roadmap:</span>",
    "01. Improve terminal UI and command responses",
    "02. Add project detail panels",
    "03. Add real app screenshots / mockups",
    "04. Add downloadable resume",
    "05. Connect TechGnomo OS to the main portfolio",
    "06. Use TechGnomo OS as the future homepage style",
  ],

  stack: [
    "<span class='terminal-success'>Tech stack:</span>",
    "Frontend: HTML, CSS, JavaScript",
    "Hosting: GitHub Pages",
    "Version control: Git + GitHub",
    "App build: React Native, Expo, Firebase",
    "Design style: terminal UI, OS dashboard, hacker portfolio",
  ],

  resume: [
    "<span class='terminal-success'>Resume summary:</span>",
    "Name: Fabio D&apos;Anna",
    "Focus: Junior Web Developer / Junior Software Developer / IT Support",
    "Current build: ClearMoneyPath",
    "Strength: combining hospitality management experience with practical software problem solving.",
    "Portfolio: https://techgnomo.com",
  ],

  goals: [
    "<span class='terminal-success'>Current goals:</span>",
    "01. Complete and polish ClearMoneyPath",
    "02. Build a stronger developer portfolio",
    "03. Prepare for junior developer / IT support opportunities",
    "04. Keep building useful real-world projects",
  ],

  contact: [
    "<span class='terminal-success'>Connection options:</span>",
    "<a class='terminal-link' href='mailto:gnomocode@gmail.com'>gnomocode@gmail.com</a>",
    "<a class='terminal-link' href='https://github.com/TechGnomo' target='_blank' rel='noopener'>GitHub: TechGnomo</a>",
    "<a class='terminal-link' href='https://www.linkedin.com/in/fabio-d-anna-5083b5378/' target='_blank' rel='noopener'>LinkedIn profile</a>",
  ],

  links: [
    "<span class='terminal-success'>External links:</span>",
    "<a class='terminal-link' href='https://techgnomo.com' target='_blank' rel='noopener'>Current portfolio</a>",
    "<a class='terminal-link' href='https://techgnomo.com/clearmoneypath.html' target='_blank' rel='noopener'>ClearMoneyPath product page</a>",
    "<a class='terminal-link' href='https://github.com/TechGnomo' target='_blank' rel='noopener'>GitHub</a>",
    "<a class='terminal-link' href='https://www.linkedin.com/in/fabio-d-anna-5083b5378/' target='_blank' rel='noopener'>LinkedIn</a>",
  ],

  "open portfolio": [
    "<span class='terminal-success'>Current portfolio:</span>",
    "<a class='terminal-link' href='https://techgnomo.com' target='_blank' rel='noopener'>https://techgnomo.com</a>",
  ],

  "open app": [
    "<span class='terminal-success'>ClearMoneyPath product page:</span>",
    "<a class='terminal-link' href='https://techgnomo.com/clearmoneypath.html' target='_blank' rel='noopener'>https://techgnomo.com/clearmoneypath.html</a>",
  ],

  "open github": [
    "<span class='terminal-success'>GitHub profile:</span>",
    "<a class='terminal-link' href='https://github.com/TechGnomo' target='_blank' rel='noopener'>https://github.com/TechGnomo</a>",
  ],

  "open linkedin": [
    "<span class='terminal-success'>LinkedIn profile:</span>",
    "<a class='terminal-link' href='https://www.linkedin.com/in/fabio-d-anna-5083b5378/' target='_blank' rel='noopener'>LinkedIn profile</a>",
  ],
};

const aliases = {
  h: "help",
  "?": "help",
  project: "projects",
  apps: "projects",
  app: "clearmoneypath",
  cmp: "clearmoneypath",
  build: "clearmoneypath",
  me: "about",
  whoami: "about",
  work: "experience",
  cv: "resume",
  i: "inspect",
  inspector: "inspect",
  github: "open github",
  linkedin: "open linkedin",
  social: "contact",
  socials: "contact",
  email: "contact",
  copy: "copy email",
  mail: "copy email",
};

const allCommandNames = [
  ...Object.keys(commands),
  "theme",
  "copy email",
  ...Object.keys(aliases),
];

const sectionConfigs = {
  terminal: {
    typingSelector: null,
    revealSelector: null,
    focusInput: true,
  },

  about: {
    typingSelector: ".terminal-card h2, .terminal-card p",
    revealSelector: ".tag-list",
  },

  projects: {
    typingSelector: ".file-card h2, .file-card p",
    revealSelector: ".file-meta, .file-actions",
  },

  "project-inspector": {
    typingSelector: ".project-inspector summary strong, .inspector-content p, .inspector-grid strong",
    revealSelector: ".project-inspector summary span, .project-inspector summary em, .inspector-grid article",
  },

  clearmoneypath: {
    typingSelector: ".build-copy h2, .build-copy p, .build-copy li",
    revealSelector: ".eyebrow, .hero-actions, .phone-preview",
  },

  contact: {
    typingSelector: ".contact-card h2, .contact-card p",
    revealSelector: ".contact-links",
  },
};

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getPlainTextFromHtml(html) {
  const temporaryElement = document.createElement("div");
  temporaryElement.innerHTML = html;
  return temporaryElement.textContent || temporaryElement.innerText || "";
}

function showToast(message) {
  if (!osToast) {
    return;
  }

  osToast.textContent = message;
  osToast.classList.add("show");

  window.clearTimeout(toastTimer);

  toastTimer = window.setTimeout(() => {
    osToast.classList.remove("show");
  }, 2200);
}

async function typeTextIntoElement(element, text, speed = 30) {
  if (!element) {
    return;
  }

  element.classList.add("is-typing");
  element.textContent = "";

  for (let index = 0; index < text.length; index += 1) {
    element.textContent += text[index];

    const character = text[index];
    const extraDelay = character === "." || character === "," || character === ":" ? 125 : 0;

    await sleep(speed + extraDelay);
  }

  element.classList.remove("is-typing");
}

async function typeHtmlLine(element, html, speed = 18) {
  const plainText = getPlainTextFromHtml(html);

  element.classList.add("is-typing");
  element.textContent = "";

  for (let index = 0; index < plainText.length; index += 1) {
    element.textContent += plainText[index];
    await sleep(speed);
  }

  element.classList.remove("is-typing");
  element.innerHTML = html;
}

function storeOriginalText(element) {
  if (!element || element.dataset.originalText) {
    return;
  }

  element.dataset.originalText = element.textContent.trim();
}

function resetTypingTargets(section, selector) {
  if (!selector) {
    return [];
  }

  const targets = Array.from(section.querySelectorAll(selector));

  return targets
    .map((element) => {
      storeOriginalText(element);

      return {
        element,
        text: element.dataset.originalText || element.textContent.trim(),
      };
    })
    .filter((target) => target.text.length > 0);
}

function resetRevealTargets(section, selector) {
  if (!selector) {
    return [];
  }

  return Array.from(section.querySelectorAll(selector));
}

async function typeSectionContent(section, config) {
  if (!config || !config.typingSelector) {
    return;
  }

  const typingTargets = resetTypingTargets(section, config.typingSelector);
  const revealTargets = resetRevealTargets(section, config.revealSelector);

  typingTargets.forEach((target) => {
    target.element.textContent = "";
    target.element.classList.add("typing-target");
  });

  revealTargets.forEach((target) => {
    target.classList.remove("typing-reveal-visible");
    target.classList.add("typing-reveal");
  });

  await sleep(160);

  for (const target of typingTargets) {
    const tagName = target.element.tagName.toLowerCase();

    let speed = 18;

    if (tagName === "h2" || tagName === "strong") {
      speed = 24;
    }

    if (tagName === "li") {
      speed = 15;
    }

    await typeTextIntoElement(target.element, target.text, speed);
    await sleep(110);
  }

  revealTargets.forEach((target) => {
    target.classList.add("typing-reveal-visible");
  });
}

function getSectionContent(section) {
  return Array.from(section.children).find((child) => {
    return !child.classList.contains("section-label");
  });
}

function createButtonFromLabel(section) {
  const label = section.querySelector(".section-label");
  const labelText = label?.querySelector("p");

  if (!label || !labelText || label.querySelector(".section-command-button")) {
    return null;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "section-command-button";
  button.innerHTML = labelText.innerHTML;
  button.setAttribute("aria-expanded", "false");

  label.replaceChild(button, labelText);

  return button;
}

function collapseSection(section, button) {
  section.classList.remove("section-command-open");
  section.classList.add("section-command-collapsed");

  if (button) {
    button.setAttribute("aria-expanded", "false");
    button.classList.remove("section-command-button-active");
  }
}

async function openSection(section, button, config) {
  section.classList.remove("section-command-collapsed");
  section.classList.add("section-command-open");

  if (button) {
    button.setAttribute("aria-expanded", "true");
    button.classList.add("section-command-button-active");
  }

  section.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  await sleep(430);

  if (section.id === "terminal") {
    await typeInteractiveIntro(true);

    if (terminalInput) {
      terminalInput.focus();
    }

    return;
  }

  await typeSectionContent(section, config);
}

function initialiseClickableSections() {
  Object.keys(sectionConfigs).forEach((sectionId) => {
    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const button = createButtonFromLabel(section) || section.querySelector(".section-command-button");

    if (!button) {
      return;
    }

    collapseSection(section, button);

    if (button.dataset.sectionHandlerAttached === "true") {
      return;
    }

    button.dataset.sectionHandlerAttached = "true";

    button.addEventListener("click", async (event) => {
      event.preventDefault();

      const isOpen = section.classList.contains("section-command-open");

      if (isOpen) {
        collapseSection(section, button);
        return;
      }

      await openSection(section, button, sectionConfigs[sectionId]);
    });
  });
}

async function typeTerminalWindow(terminalWindow) {
  if (!terminalWindow || terminalWindow.dataset.typed === "true") {
    return;
  }

  terminalWindow.dataset.typed = "true";

  const typingTargets = terminalWindow.querySelectorAll(
    ".window-header p, .command, .system-line, h1, .hero-copy"
  );

  const revealTargets = terminalWindow.querySelectorAll(
    ".hero-actions, .status-grid"
  );

  const savedTargets = [];

  typingTargets.forEach((target) => {
    const originalText = target.textContent.trim();

    if (!originalText) {
      return;
    }

    savedTargets.push({
      element: target,
      text: originalText,
    });

    target.textContent = "";
    target.classList.add("typing-target");
  });

  revealTargets.forEach((target) => {
    target.classList.add("typing-reveal");
  });

  await sleep(180);

  for (const target of savedTargets) {
    let speed = 30;

    if (target.element.tagName.toLowerCase() === "h1") {
      speed = 26;
    }

    if (target.element.classList.contains("hero-copy")) {
      speed = 22;
    }

    await typeTextIntoElement(target.element, target.text, speed);
    await sleep(160);
  }

  revealTargets.forEach((target) => {
    target.classList.add("typing-reveal-visible");
  });
}

async function typeInteractiveIntro(forceRestart = false) {
  if (!terminalOutput) {
    return;
  }

  if (terminalOutput.dataset.typed === "true" && !forceRestart) {
    return;
  }

  terminalOutput.dataset.typed = "true";
  terminalOutput.innerHTML = "";

  await printLine("<span class='terminal-success'>Welcome to TechGnomo OS.</span>", "", true);
  await printLine("Type <strong>help</strong> to see available commands.", "", true);
  await printLine("Use ? and ? to navigate your command history.", "", true);
  await printLine("Use Tab to autocomplete commands.", "", true);
}

async function printLine(content, className = "", typed = false) {
  if (!terminalOutput) {
    return;
  }

  const line = document.createElement("p");

  if (className) {
    line.className = className;
  }

  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;

  if (typed) {
    await typeHtmlLine(line, content, 18);
  } else {
    line.innerHTML = content;
  }

  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function normalizeCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase().replace(/\s+/g, " ");

  if (aliases[command]) {
    return aliases[command];
  }

  return command;
}

function focusTerminal() {
  const terminalSection = document.getElementById("terminal");

  if (terminalSection && terminalSection.classList.contains("section-command-collapsed")) {
    const terminalButton = terminalSection.querySelector(".section-command-button");
    openSection(terminalSection, terminalButton, sectionConfigs.terminal);
  }

  if (terminalSection) {
    terminalSection.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  window.setTimeout(() => {
    if (terminalInput) {
      terminalInput.focus();
    }
  }, 450);

  showToast("Terminal focused");
}

function scrollToSection(id) {
  const target = document.getElementById(id);

  if (!target) {
    return;
  }

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch (error) {
    return false;
  }
}

async function runCommand(rawCommand) {
  const command = normalizeCommand(rawCommand);

  if (!command || terminalBusy) {
    return;
  }

  terminalBusy = true;

  if (terminalInput) {
    terminalInput.disabled = true;
  }

  if (commandHistory[commandHistory.length - 1] !== command) {
    commandHistory.push(command);
  }

  commandHistoryIndex = commandHistory.length;

  await printLine(`guest@techgnomo-os:~$ ${command}`, "terminal-line-command", false);

  if (command === "clear") {
    terminalOutput.innerHTML = "";
    await printLine("<span class='terminal-success'>Terminal cleared.</span>", "", true);

    terminalBusy = false;

    if (terminalInput) {
      terminalInput.disabled = false;
      terminalInput.focus();
    }

    showToast("Terminal cleared");
    return;
  }

  if (command === "theme") {
    document.body.classList.toggle("alt-theme");

    const themeName = document.body.classList.contains("alt-theme")
      ? "ALT_THEME"
      : "DEFAULT_THEME";

    await printLine(`<span class='terminal-success'>Theme switched:</span> ${themeName}`, "", true);

    terminalBusy = false;

    if (terminalInput) {
      terminalInput.disabled = false;
      terminalInput.focus();
    }

    showToast(`Theme: ${themeName}`);
    return;
  }

  if (command === "copy email") {
    const email = "gnomocode@gmail.com";
    const copied = await copyText(email);

    if (copied) {
      await printLine(`<span class='terminal-success'>Copied email:</span> ${email}`, "", true);
      showToast("Email copied");
    } else {
      await printLine(`<span class='terminal-warning'>Copy unavailable.</span> Email: ${email}`, "", true);
      showToast("Copy unavailable");
    }

    terminalBusy = false;

    if (terminalInput) {
      terminalInput.disabled = false;
      terminalInput.focus();
    }

    return;
  }

  if (!commands[command]) {
    await printLine(`<span class='terminal-error'>Command not found:</span> ${command}`, "", true);
    await printLine("Type <strong>help</strong> to see available commands.", "", true);

    terminalBusy = false;

    if (terminalInput) {
      terminalInput.disabled = false;
      terminalInput.focus();
    }

    showToast("Unknown command");
    return;
  }

  for (const line of commands[command]) {
    await printLine(line, "", true);
  }

  if (command === "inspect") {
    const inspectorSection = document.getElementById("project-inspector");
    const inspectorButton = inspectorSection?.querySelector(".section-command-button");

    if (inspectorSection && inspectorSection.classList.contains("section-command-collapsed")) {
      window.setTimeout(() => {
        openSection(inspectorSection, inspectorButton, sectionConfigs["project-inspector"]);
      }, 300);
    } else {
      window.setTimeout(() => scrollToSection("project-inspector"), 300);
    }

    showToast("Opening Project Inspector");
  }

  if (command === "clearmoneypath") {
    const appSection = document.getElementById("clearmoneypath");
    const appButton = appSection?.querySelector(".section-command-button");

    if (appSection && appSection.classList.contains("section-command-collapsed")) {
      window.setTimeout(() => {
        openSection(appSection, appButton, sectionConfigs.clearmoneypath);
      }, 300);
    } else {
      window.setTimeout(() => scrollToSection("clearmoneypath"), 300);
    }
  }

  terminalBusy = false;

  if (terminalInput) {
    terminalInput.disabled = false;
    terminalInput.focus();
  }
}

function updateClock() {
  if (!localClock) {
    return;
  }

  const now = new Date();

  localClock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function updateActiveDockLink() {
  const dockLinks = document.querySelectorAll(".os-dock a[href^='#']");
  const sections = Array.from(document.querySelectorAll("main[id], section[id]"));

  let currentId = "home";

  sections.forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;

    if (sectionTop <= 180) {
      currentId = section.id;
    }
  });

  dockLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (href === `#${currentId}`) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function requestActiveDockUpdate() {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;

  window.requestAnimationFrame(() => {
    updateActiveDockLink();
    scrollTicking = false;
  });
}

function autocompleteCommand() {
  if (!terminalInput) {
    return;
  }

  const value = terminalInput.value.trim().toLowerCase();

  if (!value) {
    terminalInput.value = "help";
    return;
  }

  const match = allCommandNames
    .filter((commandName) => commandName.startsWith(value))
    .sort((a, b) => a.length - b.length)[0];

  if (match) {
    terminalInput.value = match;
    showToast(`Autocomplete: ${match}`);
  }
}

function createBootInputPrompt() {
  if (!bootScreen) {
    return;
  }

  if (bootScreen.querySelector(".boot-input-prompt")) {
    return;
  }

  const bootTerminal = bootScreen.querySelector(".boot-terminal");

  if (!bootTerminal) {
    return;
  }

  const prompt = document.createElement("p");
  prompt.className = "boot-input-prompt";
  prompt.textContent = "Press any key / click / tap / scroll to enter interface";

  bootTerminal.appendChild(prompt);
}

async function startInterface() {
  if (interfaceStarted) {
    return;
  }

  interfaceStarted = true;

  if (bootScreen) {
    bootScreen.classList.add("hidden");
  }

  await sleep(320);

  const firstTerminalWindow = document.querySelector(".terminal-window");

  if (firstTerminalWindow) {
    typeTerminalWindow(firstTerminalWindow);
  }
}

function waitForUserInputToStart() {
  if (!bootScreen) {
    startInterface();
    return;
  }

  createBootInputPrompt();

  window.setTimeout(() => {
    bootScreen.classList.add("boot-ready");
  }, 900);

  const startEvents = ["pointerdown", "keydown", "touchstart", "wheel"];

  const handleStart = () => {
    startEvents.forEach((eventName) => {
      window.removeEventListener(eventName, handleStart);
    });

    startInterface();
  };

  startEvents.forEach((eventName) => {
    window.addEventListener(eventName, handleStart, {
      once: true,
      passive: true,
    });
  });
}

window.addEventListener("load", () => {
  updateClock();
  updateActiveDockLink();
  initialiseClickableSections();

  window.setInterval(updateClock, 1000);

  waitForUserInputToStart();
});

window.addEventListener("scroll", requestActiveDockUpdate, { passive: true });
window.addEventListener("resize", requestActiveDockUpdate);

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });
  });
}

if (terminalForm && terminalInput && terminalOutput) {
  terminalForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = terminalInput.value;
    terminalInput.value = "";

    await runCommand(value);
  });

  terminalInput.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (commandHistory.length === 0) {
        return;
      }

      commandHistoryIndex = Math.max(0, commandHistoryIndex - 1);
      terminalInput.value = commandHistory[commandHistoryIndex] || "";
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (commandHistory.length === 0) {
        return;
      }

      commandHistoryIndex = Math.min(commandHistory.length, commandHistoryIndex + 1);
      terminalInput.value = commandHistory[commandHistoryIndex] || "";
    }

    if (event.key === "Tab") {
      event.preventDefault();
      autocompleteCommand();
    }
  });

  terminalOutput.addEventListener("click", () => {
    terminalInput.focus();
  });
}

if (focusTerminalButton) {
  focusTerminalButton.addEventListener("click", focusTerminal);
}

document.addEventListener("keydown", async (event) => {
  const activeTag = document.activeElement?.tagName?.toLowerCase();
  const isTypingInInput = activeTag === "input" || activeTag === "textarea";

  if (event.key === "/" && !isTypingInInput) {
    event.preventDefault();
    focusTerminal();
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();

    if (!terminalBusy && terminalOutput) {
      await runCommand("clear");
    }
  }
});

commandButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const command = button.dataset.command;

    if (!command || terminalBusy) {
      return;
    }

    await runCommand(command);
  });
});

const animatedCards = document.querySelectorAll(
  ".terminal-card, .file-card, .current-build, .interactive-terminal, .system-dashboard, .project-inspector"
);

if ("IntersectionObserver" in window) {
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.animate(
            [
              { opacity: 0, transform: "translateY(18px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            {
              duration: 520,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "both",
            }
          );

          cardObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  animatedCards.forEach((card) => {
    cardObserver.observe(card);
  });
}
