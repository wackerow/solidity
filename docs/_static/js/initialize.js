const getLogoSrc = () =>
  localStorage.getItem("color-scheme") != DARK
    ? LIGHT_LOGO_PATH
    : DARK_LOGO_PATH;

function buildHeader() {
  const header = document.createElement("div");
  header.classList.add("unified-header");
  document.querySelector("body").prepend(header);

  const homeLink = document.createElement("a");
  homeLink.classList.add("home-link");
  homeLink.href = SOLIDITY_HOME_URL;
  homeLink.ariaLabel = "Solidity home";
  header.appendChild(homeLink);

  const logo = document.createElement("img");
  logo.classList.add("solidity-logo");
  logo.src = getLogoSrc();
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
    link.innerText = name;
    return link;
  });
  linkElements.forEach((link) => navBar.appendChild(link));
}

document.addEventListener("DOMContentLoaded", buildHeader);

function initialize() {
  // Load style sheets
  var url_root =
    DOCUMENTATION_OPTIONS.URL_ROOT === "./"
      ? ""
      : DOCUMENTATION_OPTIONS.URL_ROOT;

  var lightCss = $(`link[href="${url_root}_static/pygments.css"]`)[0];

  // Check localStorage for existing color scheme preference
  var prefersLight = localStorage.getItem("color-scheme") != DARK;
  // In case none existed, establish localStorage color scheme preference
  var mode = prefersLight ? LIGHT : DARK;
  localStorage.setItem("color-scheme", mode);

  // Select the root element and set the style attribute to denote color-scheme attribute
  document
    .querySelector(":root")
    .setAttribute("style", `--color-scheme: ${mode}`);

  // Set light/dark toggle switch to match localStorage preference
  var checkbox = document.querySelector("input[name=mode]");
  checkbox.checked = prefersLight;

  // Enable/disable light style sheets
  lightCss.sheet.disabled = !prefersLight;

  // Remove old RTD logo anchor element
  document.querySelector(".wy-side-nav-search > a").remove();

  // Add event listener to toggle switch
  checkbox.addEventListener("change", function () {
    toggleCssMode();
  });
}

document.addEventListener("DOMContentLoaded", initialize);
