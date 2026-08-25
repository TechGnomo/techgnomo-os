const bootScreen = document.getElementById("bootScreen");
const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");
const commandButtons = document.querySelectorAll("[data-command]");
const localClock = document.getElementById("localClock");
const osToast = document.getElementById("osToast");

let interfaceStarted = false;
let terminalBusy = false;
let commandHistory = [];
let commandHistoryIndex = -1;
let toastTimer = null;

const commands = {
  home: [
    "<span class='terminal-success'>TechGnomo OS session loaded.</span>",
    "$ init user_session --guest",
    "> session.user: Fabio D&apos;Anna / TechGnomo",
    "> location: Queensland, Australia",
    "> current_path: hospitality_manager -> junior_developer",
    "> focus: web_development | mobile_apps | IT_support",
    "> current_build: ClearMoneyPath.app",
    "> mission: build practical software for real-world problems",
    "> status: online",
    "",
    "Type <strong>help</strong> to view available commands.",
  ],

  help: [
    "<span class='terminal-success'>Available commands:</span>",
    "home               Show startup output",
    "about              Show who Fabio / TechGnomo is",
    "experience         Show hospitality + tech background",
    "skills             Show technical skills",
    "projects           List portfolio projects",
    "inspect            Inspect project files",
    "clearmoneypath     Open current build information",
    "status             Show OS status",
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
    "<span class='terminal-success'>whoami</span>",
    "Name: Fabio D&apos;Anna",
    "Alias: TechGnomo",
    "Location: Queensland, Australia",
    "Current transition: hospitality management -> junior developer / IT support",
    "Main advantage: real operational experience + practical software problem solving.",
  ],

  experience: [
    "<span class='terminal-success'>experience.log</span>",
    "Hospitality management background with real-world business operations experience.",
    "Strong understanding of customers, staff coordination, budgets, time pressure and operational problems.",
    "Current goal: translate that experience into useful web apps, mobile apps and IT support solutions.",
  ],

  skills: [
    "<span class='terminal-success'>skills --list</span>",
    "HTML / CSS / JavaScript",
    "React Native / Expo",
    "Firebase Authentication / Firestore",
    "Git / GitHub / GitHub Pages",
    "Troubleshooting / IT support mindset",
    "Business operations from hospitality management",
  ],

  projects: [
    "<span class='terminal-success'>/projects directory:</span>",
    "01  ClearMoneyPath.app        MVP_IN_DEVELOPMENT",
    "02  BudgetPlanner.web         LIVE_DEMO",
    "03  HospitalityRoster.tool    PORTFOLIO_PROJECT",
    "04  MotorcycleTracker.app     CONCEPT",
    "",
    "Use: inspect",
    "Use: clearmoneypath",
  ],

  inspect: [
    "<span class='terminal-success'>inspect /projects</span>",
    "",
    "[01] ClearMoneyPath.app",
    "     Stack: React Native / Expo / Firebase",
    "     Core: Safe to Spend",
    "     Problem: payday clarity and debt control",
    "     Next: prepare store-ready version",
    "",
    "[02] BudgetPlanner.web",
    "     Stack: HTML / CSS / JavaScript",
    "     Core: budget overview",
    "     Problem: knowing where money goes",
    "",
    "[03] HospitalityRoster.tool",
    "     Stack: web app concept",
    "     Core: shift planning",
    "     Problem: managing staff availability",
    "",
    "[04] MotorcycleTracker.app",
    "     Stack: mobile app concept",
    "     Core: maintenance reminders",
    "     Problem: tracking service history",
  ],

  clearmoneypath: [
    "<span class='terminal-success'>open /projects/ClearMoneyPath.app</span>",
    "ClearMoneyPath is a mobile-first pay cycle planner.",
    "Goal: help users know what to pay, what to save, what is safe to spend and how long until they are debt-free.",
    "Core feature: Safe to Spend",
    "Pay cycles: weekly / fortnightly / monthly",
    "Stack: React Native, Expo, Firebase",
    "<a class='terminal-link' href='https://techgnomo.com/clearmoneypath.html' target='_blank' rel='noopener'>Open ClearMoneyPath landing page</a>",
  ],

  status: [
    "<span class='terminal-success'>system --status</span>",
    "PORTFOLIO_MODE       CMD_INTERFACE",
    "CURRENT_BUILD        ClearMoneyPath",
    "LEARNING_PATH        Web / Mobile / IT Support",
    "DEPLOYMENT           GitHub Pages",
    "PUBLIC_VERSION       TechGnomo OS CMD",
    "STATUS               ONLINE",
  ],

  roadmap: [
    "<span class='terminal-success'>roadmap.txt</span>",
    "01. Polish TechGnomo OS CMD interface",
    "02. Add real ClearMoneyPath screenshots/mockups",
    "03. Add downloadable resume",
    "04. Connect this OS style to the main portfolio",
    "05. Use TechGnomo OS as future homepage style",
  ],

  stack: [
    "<span class='terminal-success'>stack --current</span>",
    "Frontend: HTML, CSS, JavaScript",
    "Hosting: GitHub Pages",
    "Version control: Git + GitHub",
    "App build: React Native, Expo, Firebase",
    "Design style: command interface / OS dashboard / hacker portfolio",
  ],

  resume: [
    "<span class='terminal-success'>resume --summary</span>",
    "Name: Fabio D&apos;Anna",
    "Focus: Junior Web Developer / Junior Software Developer / IT Support",
    "Current build: ClearMoneyPath",
    "Strength: hospitality management experience + practical software problem solving",
    "Portfolio: https://techgnomo.com",
  ],

  goals: [
    "<span class='terminal-success'>goals --active</span>",
    "01. Complete and polish ClearMoneyPath",
    "02. Build a stronger developer portfolio",
    "03. Prepare for junior developer / IT support opportunities",
    "04. Keep building useful real-world projects",
  ],

  contact: [
    "<span class='terminal-success'>connect --profile</span>",
    "<a class='terminal-link' href='mailto:gnomocode@gmail.com'>gnomocode@gmail.com</a>",
    "<a class='terminal-link' href='https://github.com/TechGnomo' target='_blank' rel='noopener'>GitHub: TechGnomo</a>",
    "<a class='terminal-link' href='https://www.linkedin.com/in/fabio-d-anna-5083b5378/' target='_blank' rel='noopener'>LinkedIn profile</a>",
  ],

  links: [
    "<span class='terminal-success'>links --external</span>",
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
  me: "about",
  whoami: "about",
  work: "experience",
  project: "projects",
  apps: "projects",
  i: "inspect",
  inspector: "inspect",
  app: "clearmoneypath",
  cmp: "clearmoneypath",
  build: "clearmoneypath",
  cv: "resume",
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

async function typeHtmlLine(element, html, speed = 18) {
  const plainText = getPlainTextFromHtml(html);

  element.classList.add("is-typing");
  element.textContent = "";

  for (let index = 0; index < plainText.length; index += 1) {
    element.textContent += plainText[index];

    const character = plainText[index];
    const extraDelay = character === "." || character === "," || character === ":" ? 110 : 0;

    await sleep(speed + extraDelay);
  }

  element.classList.remove("is-typing");
  element.innerHTML = html;
}

async function printLine(content, className = "", typed = true) {
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

  return aliases[command] || command;
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

  setActiveDockButton(command);

  await printLine(`guest@techgnomoOS:~$ ${command}`, "terminal-command", false);

  if (command === "clear") {
    terminalOutput.innerHTML = "";

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

    await printLine(`<span class='terminal-success'>Theme switched:</span> ${themeName}`);
    showToast(`Theme: ${themeName}`);

    terminalBusy = false;

    if (terminalInput) {
      terminalInput.disabled = false;
      terminalInput.focus();
    }

    return;
  }

  if (command === "copy email") {
    const email = "gnomocode@gmail.com";
    const copied = await copyText(email);

    if (copied) {
      await printLine(`<span class='terminal-success'>Copied email:</span> ${email}`);
      showToast("Email copied");
    } else {
      await printLine(`<span class='terminal-warning'>Copy unavailable.</span> Email: ${email}`);
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
    await printLine(`<span class='terminal-error'>Command not found:</span> ${command}`);
    await printLine("Type <strong>help</strong> to see available commands.");
    showToast("Unknown command");

    terminalBusy = false;

    if (terminalInput) {
      terminalInput.disabled = false;
      terminalInput.focus();
    }

    return;
  }

  for (const line of commands[command]) {
    await printLine(line);
  }

  terminalBusy = false;

  if (terminalInput) {
    terminalInput.disabled = false;
    terminalInput.focus();
  }
}

function setActiveDockButton(command) {
  commandButtons.forEach((button) => {
    const buttonCommand = normalizeCommand(button.dataset.command || "");

    if (buttonCommand === command) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
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

function focusTerminal() {
  if (terminalInput) {
    terminalInput.focus();
  }
}

async function startInterface() {
  if (interfaceStarted) {
    return;
  }

  interfaceStarted = true;

  if (bootScreen) {
    bootScreen.classList.add("hidden");
  }

  await sleep(420);

  focusTerminal();
  await runCommand("home");
}

function waitForUserInputToStart() {
  if (!bootScreen) {
    startInterface();
    return;
  }

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
  window.setInterval(updateClock, 1000);
  waitForUserInputToStart();
});

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

  terminalOutput.addEventListener("click", focusTerminal);
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
