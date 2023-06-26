function toggleColorMode() {
  // Check localStorage for previous color scheme preference, assign the opposite
  var newMode = localStorage.getItem(LS_COLOR_SCHEME) == DARK ? LIGHT : DARK;

  // Update localStorage with new color scheme preference
  localStorage.setItem(LS_COLOR_SCHEME, newMode);

  // Update the root element with the new color scheme preference
  document
    .querySelector(":root")
    .setAttribute("style", `--color-scheme: ${newMode}`);

  // Update logo
  document
    .querySelector(`img.${SOLIDITY_LOGO_CLASS}`)
    .setAttribute("src", newMode === LIGHT ? LIGHT_LOGO_PATH : DARK_LOGO_PATH);

  // Update color mode toggle icon
  document
    .querySelector(`img.${COLOR_TOGGLE_ICON_CLASS}`)
    .setAttribute("src", newMode === LIGHT ? MOON_ICON_PATH : SUN_ICON_PATH);

  // Update hamburger menu icon color
  document
    .querySelector("button.mobile-menu-button img")
    .setAttribute(
      "src",
      newMode === LIGHT ? LIGHT_HAMBURGER_PATH : DARK_HAMBURGER_PATH
    );
}

function toggleMenu(options = {}) {
  const handle = ({ classList }) => {
    if (typeof options.force !== "undefined") {
      classList.toggle(MOBILE_MENU_TOGGLE_CLASS, options.force);
    } else {
      classList.toggle(MOBILE_MENU_TOGGLE_CLASS);
    }
  };
  document.querySelectorAll('[data-toggle="rst-versions"]').forEach(handle);
  document.querySelectorAll('[data-toggle="wy-nav-shift"]').forEach(handle);
}
