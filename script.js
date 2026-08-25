const bootScreen = document.getElementById("bootScreen");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");
const commandButtons = document.querySelectorAll("[data-command]");

let terminalBusy = false;
let commandHistory = [];
let commandHistoryIndex = -1;

const commands = {
  help: [
    "<span class='terminal-success'>Available commands:</span>",
    "about              Show who Fabio / TechGnomo is",
    "skills             Show current technical skills",
    "projects           List portfolio projects",
    "clearmoneypath     Open current build information",
    "status             Show current system status",
    "roadmap            Show next development goals",
    "stack              Show the technology stack",
    "contact            Show contact links",
    "links              Show external links",
    "open portfolio     Open the current TechGnomo portfolio",
    "open app           Open the ClearMoneyPath product page",
    "clear              Clear terminal output",
    "",
    "Tip: you can use the quick command buttons under the terminal.",
  ],

  about: [
    "<span class='terminal-success'>Fabio D&apos;Anna / TechGnomo</span>",
    "Hospitality manager moving into junior web development, software development and IT support.",
    "Current focus: practical tools, mobile apps, web projects and simple systems that solve real problems.",
    "Location: Queensland, Australia.",
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
    "Tip: type clearmoneypath to inspect the current build.",
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
    "<span class='terminal-success'>Opening current portfolio...</span>",
    "<a class='terminal-link' href='https://techgnomo.com' target='_blank' rel='noopener'>https://techgnomo.com</a>",
  ],

  "open app": [
    "<span class='terminal-success'>Opening ClearMoneyPath product page...</span>",
    "<a class='terminal-link' href='https://techgnomo.com/clearmoneypath.html' target='_blank' rel='noopener'>https://techgnomo.com/clearmoneypath.html</a>",
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
  socials: "contact",
  email: "contact",
};

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getPlainTextFromHtml(html) {
  const temporaryElement = document.createElement("div");
  temporaryElement.innerHTML = html;
  return temporaryElement.textContent || temporaryElement.innerText || "";
}

async function typeTextIntoElement(element, text, speed = 34) {
  if (!element) {
    return;
  }

  element.classList.add("is-typing");
  element.textContent = "";

  for (let index = 0; index < text.length; index += 1) {
    element.textContent += text[index];

    const character = text[index];
    const extraDelay = character === "." || character === "," || character === ":" ? 145 : 0;

    await sleep(speed + extraDelay);
  }

  element.classList.remove("is-typing");
}

async function typeHtmlLine(element, html, speed = 22) {
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
    let speed = 34;

    if (target.element.tagName.toLowerCase() === "h1") {
      speed = 30;
    }

    if (target.element.classList.contains("hero-copy")) {
      speed = 26;
    }

    await typeTextIntoElement(target.element, target.text, speed);
    await sleep(160);
  }

  revealTargets.forEach((target) => {
    target.classList.add("typing-reveal-visible");
  });
}

async function typeInteractiveIntro() {
  if (!terminalOutput || terminalOutput.dataset.typed === "true") {
    return;
  }

  terminalOutput.dataset.typed = "true";
  terminalOutput.innerHTML = "";

  await printLine("<span class='terminal-success'>Welcome to TechGnomo OS.</span>", "", true);
  await printLine("Type <strong>help</strong> to see available commands.", "", true);
  await printLine("Use ? and ? to navigate your command history.", "", true);
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
    await typeHtmlLine(line, content, 22);
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

    return;
  }

  for (const line of commands[command]) {
    await printLine(line, "", true);
  }

  terminalBusy = false;

  if (terminalInput) {
    terminalInput.disabled = false;
    terminalInput.focus();
  }
}

window.addEventListener("load", async () => {
  await sleep(1200);

  if (bootScreen) {
    bootScreen.classList.add("hidden");
  }

  await sleep(300);

  const firstTerminalWindow = document.querySelector(".terminal-window");

  if (firstTerminalWindow) {
    typeTerminalWindow(firstTerminalWindow);
  }
});

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
  });

  terminalOutput.addEventListener("click", () => {
    terminalInput.focus();
  });
}

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
  ".terminal-card, .file-card, .current-build, .interactive-terminal, .system-dashboard"
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

  const terminalWindowObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeTerminalWindow(entry.target);
          terminalWindowObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  document.querySelectorAll(".terminal-window").forEach((terminalWindow) => {
    terminalWindowObserver.observe(terminalWindow);
  });

  const interactiveTerminalObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeInteractiveIntro();
          interactiveTerminalObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  const interactiveTerminal = document.querySelector(".interactive-terminal");

  if (interactiveTerminal) {
    interactiveTerminalObserver.observe(interactiveTerminal);
  }
} else {
  document.querySelectorAll(".terminal-window").forEach((terminalWindow) => {
    typeTerminalWindow(terminalWindow);
  });

  typeInteractiveIntro();
}
