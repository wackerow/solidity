var url_root =
  DOCUMENTATION_OPTIONS.URL_ROOT === "./" ? "" : DOCUMENTATION_OPTIONS.URL_ROOT;

const getLogoSrc = (isDark) => (isDark ? DARK_LOGO_PATH : LIGHT_LOGO_PATH);

const getModeIconSrc = (isDark) => (isDark ? SUN_ICON_PATH : MOON_ICON_PATH);

const getMenuIconSrc = (isDark) =>
  isDark ? DARK_HAMBURGER_PATH : LIGHT_HAMBURGER_PATH;

function buildHeader() {
  const isDarkMode = localStorage.getItem(LS_COLOR_SCHEME) == DARK;

  const header = document.createElement("div");
  header.classList.add("unified-header");
  document.querySelector("body").prepend(header);

  const homeLink = document.createElement("a");
  homeLink.classList.add("home-link");
  homeLink.href = SOLIDITY_HOME_URL;
  homeLink.ariaLabel = "Solidity home";
  header.appendChild(homeLink);

  const logo = document.createElement("img");
  logo.classList.add(SOLIDITY_LOGO_CLASS);
  logo.src = getLogoSrc(isDarkMode);
  logo.alt = "Solidity logo";
  homeLink.appendChild(logo);

  const navBar = document.createElement("nav");
  navBar.classList.add("nav-bar");
  header.appendChild(navBar);

  const linkElements = NAV_LINKS.map(({ name, href }) => {
    const link = document.createElement("a");
    link.classList.add("nav-link");
    link.setAttribute("key", name);
    link.setAttribute("href", href);
    link.setAttribute("aria-label", name);
    let innerText = name;
    if (href === FORUM_URL) {
      innerText += " ↗";
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    }
    link.innerText = innerText;
    return link;
  });
  linkElements.forEach((link) => navBar.appendChild(link));

  // Build color toggle
  const toggleIcon = document.createElement("img");
  toggleIcon.classList.add(COLOR_TOGGLE_ICON_CLASS);
  toggleIcon.src = getModeIconSrc(isDarkMode);
  toggleIcon.alt = "Color mode toggle icon";
  toggleIcon.setAttribute("aria-hidden", "true");
  toggleIcon.setAttribute("key", "toggle icon");
  const colorModeButton = document.createElement("button");
  colorModeButton.classList.add("color-toggle");
  colorModeButton.setAttribute("type", "button");
  colorModeButton.setAttribute("aria-label", "Toggle light dark mode");
  colorModeButton.setAttribute("key", "color mode button");
  colorModeButton.addEventListener("click", toggleColorMode);
  colorModeButton.appendChild(toggleIcon);
  navBar.appendChild(colorModeButton);

  // Build mobile hamburger menu
  const menuIcon = document.createElement("img");
  menuIcon.classList.add(COLOR_TOGGLE_ICON_CLASS);
  menuIcon.src = getMenuIconSrc(isDarkMode);
  menuIcon.alt = "Toggle menu";
  menuIcon.setAttribute("aria-hidden", "true");
  menuIcon.setAttribute("key", "menu icon");
  const menuButton = document.createElement("button");
  menuButton.classList.add("color-toggle");
  menuButton.classList.add("mobile-menu-button");
  menuButton.setAttribute("type", "button");
  menuButton.setAttribute("aria-label", "Toggle menu");
  menuButton.setAttribute("key", "menu button");
  menuButton.addEventListener("click", toggleMenu);
  menuButton.appendChild(menuIcon);
  navBar.appendChild(menuButton);
}

document.addEventListener("DOMContentLoaded", buildHeader);

function initialize() {
  // Check localStorage for existing color scheme preference
  var prefersDark = localStorage.getItem(LS_COLOR_SCHEME) == DARK;
  // In case none existed, establish localStorage color scheme preference
  var mode = prefersDark ? DARK : LIGHT;
  localStorage.setItem(LS_COLOR_SCHEME, mode);

  // Select the root element and set the style attribute to denote color-scheme attribute
  document
    .querySelector(":root")
    .setAttribute("style", `--color-scheme: ${mode}`);

  // Enable/disable pygments
  var lightCss = $(`link[href="${url_root}_static/pygments.css"]`)[0].sheet;
  lightCss.disabled = !prefersDark;

  // Remove old input and RTD logo anchor element
  document.querySelector("input[name=mode]").remove();
  document.querySelector("label[for=switch]").remove();
  document.querySelector(".wy-side-nav-search > a").remove();

  // Close menu
  toggleMenu({ force: false });
}

document.addEventListener("DOMContentLoaded", initialize);
