const bootScreen = document.getElementById("bootScreen");
const uptime = document.getElementById("uptime");
const projectButtons = document.querySelectorAll(".project-file");
const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

let startedAt = Date.now();
let bootDone = false;
let skipTyping = false;

const commandMap = {
  help: [
    "<span class='output-success'>Available commands:</span>",
    "whoami             show profile summary",
    "status             show current status",
    "projects           jump to projects",
    "clear              clear command output",
    "open app           open ClearMoneyPath page",
    "contact            show contact links",
  ],

  whoami: [
    "Fabio D'Anna / TechGnomo",
    "Hospitality manager transitioning into junior web development, mobile apps and IT support.",
    "Building practical software for real-world problems.",
  ],

  status: [
    "LOCATION    Queensland, Australia",
    "FOCUS       Web development -- Mobile apps -- IT support",
    "BUILDING    ClearMoneyPath.app",
    "STATUS      online",
  ],

  projects: [
    "Opening /projects/",
    "Tip: click a filename to expand the project file.",
  ],

  contact: [
    "Email: gnomocode@gmail.com",
    "GitHub: https://github.com/TechGnomo",
    "LinkedIn: Fabio D'Anna",
  ],

  "open app": [
    "ClearMoneyPath product page:",
    "<a href='https://techgnomo.com/clearmoneypath.html' target='_blank' rel='noopener'>https://techgnomo.com/clearmoneypath.html</a>",
  ],
};

const aliases = {
  h: "help",
  "?": "help",
  me: "whoami",
  about: "whoami",
  app: "open app",
  cmp: "open app",
  clearmoneypath: "open app",
  email: "contact",
};

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function plainText(html) {
  const element = document.createElement("div");
  element.innerHTML = html;
  return element.textContent || element.innerText || "";
}

async function typeLine(element, html, speed = 15) {
  const text = plainText(html);

  element.classList.add("typing");
  element.textContent = "";

  for (let index = 0; index < text.length; index += 1) {
    if (skipTyping) {
      element.innerHTML = html;
      element.classList.remove("typing");
      return;
    }

    element.textContent += text[index];

    const character = text[index];
    const delay = character === "." || character === "," || character === ":" ? 80 : 0;

    await sleep(speed + delay);
  }

  element.innerHTML = html;
  element.classList.remove("typing");
}

async function printOutput(html, className = "") {
  const line = document.createElement("p");

  if (className) {
    line.className = className;
  }

  terminalOutput.appendChild(line);
  await typeLine(line, html);
}

function normaliseCommand(value) {
  const command = value.trim().toLowerCase().replace(/\s+/g, " ");
  return aliases[command] || command;
}

async function runCommand(value) {
  const command = normaliseCommand(value);

  if (!command) {
    return;
  }

  skipTyping = false;

  await printOutput(`guest@techgnomoOS:~$ ${command}`, "output-command");

  if (command === "clear") {
    terminalOutput.innerHTML = "";
    return;
  }

  if (!commandMap[command]) {
    await printOutput(`<span class="output-error">Command not found:</span> ${command}`);
    await printOutput("Type help to see available commands.");
    return;
  }

  for (const line of commandMap[command]) {
    await printOutput(line);
  }

  if (command === "projects") {
    document.getElementById("projects")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

function updateUptime() {
  if (!uptime) {
    return;
  }

  const seconds = Math.floor((Date.now() - startedAt) / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  uptime.textContent = `${minutes}m ${remainingSeconds}s`;
}

function finishBoot() {
  if (bootDone) {
    return;
  }

  bootDone = true;
  bootScreen.classList.add("hidden");

  window.setTimeout(() => {
    terminalInput?.focus();
  }, 500);
}

function waitForBootInput() {
  const events = ["pointerdown", "keydown", "touchstart"];

  const handler = () => {
    events.forEach((eventName) => {
      window.removeEventListener(eventName, handler);
    });

    finishBoot();
  };

  events.forEach((eventName) => {
    window.addEventListener(eventName, handler, {
      once: true,
      passive: true,
    });
  });
}

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const row = button.closest(".project-row");
    const isOpen = row.classList.toggle("open");

    button.setAttribute("aria-expanded", String(isOpen));
  });
});

if (terminalForm && terminalInput && terminalOutput) {
  terminalForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = terminalInput.value;
    terminalInput.value = "";

    await runCommand(value);
  });

  terminalOutput.addEventListener("dblclick", () => {
    skipTyping = true;
  });
}

window.addEventListener("load", () => {
  updateUptime();
  window.setInterval(updateUptime, 1000);
  waitForBootInput();
});
