// require the SDK modules
const { Panel } = require("dev/panel");
const { Tool } = require("dev/toolbox");
const { Class } = require("sdk/core/heritage");

// define the panel constructor
const GhostwriterPanel = Class({
  extends: Panel,
  label: "Ghostwriter",
  tooltip: "Write ghostly scripts",
  icon: "../img/icon-48.png",
  url: "../panel.html",
  // when the panel is created,
  // take a reference to the debuggee
  setup: function(options) {
    this.debuggee = options.debuggee;
  },
  dispose: function() {
    this.debuggee = null;
  },
  onReady: function() {
    // in this function you can communicate
    // with the panel document
  }
});

// export the constructor
exports.GhostwriterPanel = GhostwriterPanel;

// create a new tool, initialized
// with the new constructor
const myTool = new Tool({
  panels: { ghostwriterPanel: GhostwriterPanel }
});
