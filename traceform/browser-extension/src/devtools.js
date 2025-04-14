// src/devtools.js

// Create a panel named "Traceform"
chrome.devtools.panels.create(
  "Traceform",            // Title of the panel
  "icons/icon16.png",     // Path to an icon (optional, update if you have icons)
  "panel.html",           // Path to the panel's HTML page
  (panel) => {
    // Code executed when the panel is created (optional)
    console.log("Traceform DevTools panel created.", panel);
  }
);

// You can also add listeners here for when the panel is shown/hidden, etc.
// Example:
// chrome.devtools.panels.onShown.addListener(panelWindow => {
//   console.log("Traceform panel shown", panelWindow);
// });
