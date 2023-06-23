function initialize() {
  const [DARK, LIGHT] = ["dark", "light"];
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

  // TODO: Figure out how to pre-load this image so it doesn't lag on first toggle
  // Update logo
  document
    .querySelector("img.logo")
    .setAttribute(
      "src",
      prefersLight ? "_static/logo.svg" : "_static/img/logo-dark.svg"
    );

  // Add event listener to toggle switch
  checkbox.addEventListener("change", function () {
    toggleCssMode();
  });
}

document.addEventListener("DOMContentLoaded", initialize);
