const bootScreen = document.getElementById("bootScreen");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const terminalForm = document.getElementById("terminalForm");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");

const commands = {
  help: [
    '<span class="terminal-success">Available commands:</span>',
    'about              Show who Fabio / TechGnomo is',
    'skills             Show current technical skills',
    'projects           List portfolio projects',
    'clearmoneypath     Open current build information',
    'contact            Show contact links',
    'links              Show external links',
    'clear              Clear terminal output',
  ],

  about: [
    '<span class="terminal-success">Fabio D&apos;Anna / TechGnomo</span>',
    'Hospitality manager moving into junior web development, software development and IT support.',
    'Current focus: practical tools, mobile apps, web projects and simple systems that solve real problems.',
    'Location: Queensland, Australia.',
  ],

  skills: [
    '<span class="terminal-success">Skills loaded:</span>',
    'HTML / CSS / JavaScript',
    'React Native / Expo',
    'Firebase Authentication / Firestore',
    'Git / GitHub / GitHub Pages',
    'Practical business operations from hospitality management',
    'IT support foundations and troubleshooting mindset',
  ],

  projects: [
    '<span class="terminal-success">/projects directory:</span>',
    'ClearMoneyPath.app        MVP_IN_DEVELOPMENT',
    'BudgetPlanner.web         LIVE_DEMO',
    'HospitalityRoster.tool    PORTFOLIO_PROJECT',
    'MotorcycleTracker.app     CONCEPT',
    '',
    'Tip: type clearmoneypath to inspect the current build.',
  ],

  clearmoneypath: [
    '<span class="terminal-success">Opening /projects/ClearMoneyPath.app...</span>',
    'ClearMoneyPath is a mobile-first pay cycle planner.',
    'Goal: help users know what to pay, what to save, what is safe to spend and how long until they are debt-free.',
    'Stack: React Native, Expo, Firebase.',
    '<a class="terminal-link" href="https://techgnomo.com/clearmoneypath.html" target="_blank" rel="noopener">Open ClearMoneyPath landing page</a>',
  ],

  contact: [
    '<span class="terminal-success">Connection options:</span>',
    '<a class="terminal-link" href="mailto:gnomocode@gmail.com">gnomocode@gmail.com</a>',
    '<a class="terminal-link" href="https://github.com/TechGnomo" target="_blank" rel="noopener">GitHub: TechGnomo</a>',
    '<a class="terminal-link" href="https://www.linkedin.com/in/fabio-d-anna-5083b5378/" target="_blank" rel="noopener">LinkedIn profile</a>',
  ],

  links: [
    '<span class="terminal-success">External links:</span>',
    '<a class="terminal-link" href="https://techgnomo.com" target="_blank" rel="noopener">Current portfolio</a>',
    '<a class="terminal-link" href="https://techgnomo.com/clearmoneypath.html" target="_blank" rel="noopener">ClearMoneyPath product page</a>',
    '<a class="terminal-link" href="https://github.com/TechGnomo" target="_blank" rel="noopener">GitHub</a>',
    '<a class="terminal-link" href="https://www.linkedin.com/in/fabio-d-anna-5083b5378/" target="_blank" rel="noopener">LinkedIn</a>',
  ],
};

window.addEventListener("load", () => {
  window.setTimeout(() => {
    if (bootScreen) {
      bootScreen.classList.add("hidden");
    }
  }, 1200);
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

function printLine(content, className = "") {
  if (!terminalOutput) {
    return;
  }

  const line = document.createElement("p");

  if (className) {
    line.className = className;
  }

  line.innerHTML = content;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();

  if (!command) {
    return;
  }

  printLine(`guest@techgnomo-os:~$ ${command}`, "terminal-line-command");

  if (command === "clear") {
    terminalOutput.innerHTML = "";
    printLine('<span class="terminal-success">Terminal cleared.</span>');
    return;
  }

  if (!commands[command]) {
    printLine(`<span class="terminal-error">Command not found:</span> ${command}`);
    printLine('Type <strong>help</strong> to see available commands.');
    return;
  }

  commands[command].forEach((line) => {
    printLine(line);
  });
}

if (terminalForm && terminalInput && terminalOutput) {
  terminalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    runCommand(terminalInput.value);
    terminalInput.value = "";
  });
}

const cards = document.querySelectorAll(
  ".terminal-card, .file-card, .current-build, .terminal-window, .interactive-terminal"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
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

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  cards.forEach((card) => {
    observer.observe(card);
  });
}
