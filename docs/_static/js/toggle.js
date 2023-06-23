function toggleCssMode() {
  var url_root =
    DOCUMENTATION_OPTIONS.URL_ROOT === "./"
      ? ""
      : DOCUMENTATION_OPTIONS.URL_ROOT;

  // Check localStorage for previous color scheme preference, assign the opposite
  var newMode = localStorage.getItem("color-scheme") == DARK ? LIGHT : DARK;

  // Update localStorage with new color scheme preference
  localStorage.setItem("color-scheme", newMode);

  // Update the root element with the new color scheme preference
  document
    .querySelector(":root")
    .setAttribute("style", `--color-scheme: ${newMode}`);

  // Select the light style sheets
  var lightCss = $(`link[href="${url_root}_static/pygments.css"]`)[0].sheet;

  // Enable/disable style sheets
  lightCss.disabled = newMode === DARK;

  // Update logo
  document
    .querySelector("img.solidity-logo")
    .setAttribute("src", newMode === LIGHT ? LIGHT_LOGO_PATH : DARK_LOGO_PATH);
}
