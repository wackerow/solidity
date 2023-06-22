function toggleCssMode(isLight) {
  var root = document.querySelector(":root");
  var mode = isLight ? "light" : "dark";
  localStorage.setItem("color-scheme", mode);

  var url_root =
    DOCUMENTATION_OPTIONS.URL_ROOT == "./"
      ? ""
      : DOCUMENTATION_OPTIONS.URL_ROOT;
  var daysheet = $(`link[href="${url_root}_static/pygments.css"]`)[0].sheet;
  daysheet.disabled = !isLight;

  var nightsheet = $(`link[href="${url_root}_static/css/dark.css"]`)[0];
  if (!isLight && nightsheet === undefined) {
    var element = document.createElement("link");
    element.setAttribute("rel", "stylesheet");
    element.setAttribute("type", "text/css");
    element.setAttribute("href", `${url_root}_static/css/dark.css`);
    document.getElementsByTagName("head")[0].appendChild(element);
    return;
  }
  if (nightsheet !== undefined) {
    nightsheet.sheet.disabled = isLight;
  }

  // Update logo
  document
    .querySelector("img.logo")
    .setAttribute(
      "src",
      isLight ? "_static/logo.svg" : "_static/img/logo-dark.svg"
    );
  root.setAttribute("style", `color-scheme: ${isLight ? "light" : "dark"};`);
  if (isLight) {
    root.classList.remove("dark-colors");
  } else {
    root.classList.add("dark-colors");
  }
}

function initialize() {
  var prefersLight = localStorage.getItem("color-scheme") != "dark";
  var checkbox = document.querySelector("input[name=mode]");

  toggleCssMode(prefersLight);
  checkbox.checked = prefersLight;

  checkbox.addEventListener("change", function () {
    toggleCssMode(this.checked);
  });
}

document.addEventListener("DOMContentLoaded", initialize);
