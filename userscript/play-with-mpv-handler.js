// ==UserScript==
// @name                Play with mpv
// @name:en-US          Play with mpv
// @name:zh-CN          使用 mpv 播放
// @name:zh-TW          使用 mpv 播放
// @description         Play website videos and songs with mpv & youtube-dl
// @description:en-US   Play website videos and songs with mpv & youtube-dl
// @description:zh-CN   通过 mpv 和 youtube-dl 播放网页上的视频和歌曲
// @description:zh-TW   通過 mpv 和 youtube-dl 播放網頁上的視頻和歌曲
// @namespace           play-with-mpv-handler
// @version             2020.12.29.2
// @author              Akatsuki Rui
// @license             MIT License
// @require             https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@a4a49b47ecfb1d8fcd27049cc0e8114d05522a0f/gm_config.js
// @grant               GM_info
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_notification
// @grant               GM_openInTab
// @run-at              document-idle
// @noframes
// @match               *://www.youtube.com/*
// @match               *://www.bilibili.com/video/*
// ==/UserScript==

"use strict";

const MPV_HANDLER_VERSION = "v0.1.2";
const MATCH_URLS = ["www.youtube.com/watch", "www.bilibili.com/video/"];

const ICON_MPV =
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0\
PSI2NCIgdmVyc2lvbj0iMSI+CiA8Y2lyY2xlIHN0eWxlPSJvcGFjaXR5Oi4yIiBjeD0iMzIiIGN5\
PSIzMyIgcj0iMjgiLz4KIDxjaXJjbGUgc3R5bGU9ImZpbGw6IzhkMzQ4ZSIgY3g9IjMyIiBjeT0i\
MzIiIHI9IjI4Ii8+CiA8Y2lyY2xlIHN0eWxlPSJvcGFjaXR5Oi4zIiBjeD0iMzQuNSIgY3k9IjI5\
LjUiIHI9IjIwLjUiLz4KIDxjaXJjbGUgc3R5bGU9Im9wYWNpdHk6LjIiIGN4PSIzMiIgY3k9IjMz\
IiByPSIxNCIvPgogPGNpcmNsZSBzdHlsZT0iZmlsbDojZmZmZmZmIiBjeD0iMzIiIGN5PSIzMiIg\
cj0iMTQiLz4KIDxwYXRoIHN0eWxlPSJmaWxsOiM2OTFmNjkiIHRyYW5zZm9ybT0ibWF0cml4KDEu\
NTE1NTQ0NSwwLDAsMS41LC0zLjY1Mzg3OSwtNC45ODczODQ4KSIgZD0ibTI3LjE1NDUxNyAyNC42\
NTgyNTctMy40NjQxMDEgMi0zLjQ2NDEwMiAxLjk5OTk5OXYtNC0zLjk5OTk5OWwzLjQ2NDEwMiAy\
eiIvPgogPHBhdGggc3R5bGU9ImZpbGw6I2ZmZmZmZjtvcGFjaXR5Oi4xIiBkPSJNIDMyIDQgQSAy\
OCAyOCAwIDAgMCA0IDMyIEEgMjggMjggMCAwIDAgNC4wMjE0ODQ0IDMyLjU4NTkzOCBBIDI4IDI4\
IDAgMCAxIDMyIDUgQSAyOCAyOCAwIDAgMSA1OS45Nzg1MTYgMzIuNDE0MDYyIEEgMjggMjggMCAw\
IDAgNjAgMzIgQSAyOCAyOCAwIDAgMCAzMiA0IHoiLz4KPC9zdmc+Cg==";

const ICON_SETTINGS =
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0\
PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KIDxkZWZzPgogIDxzdHlsZSBpZD0iY3VycmVudC1j\
b2xvci1zY2hlbWUiIHR5cGU9InRleHQvY3NzIj4KICAgLkNvbG9yU2NoZW1lLVRleHQgeyBjb2xv\
cjojNDQ0NDQ0OyB9IC5Db2xvclNjaGVtZS1IaWdobGlnaHQgeyBjb2xvcjojNDI4NWY0OyB9CiAg\
PC9zdHlsZT4KIDwvZGVmcz4KIDxwYXRoIHN0eWxlPSJmaWxsOmN1cnJlbnRDb2xvciIgY2xhc3M9\
IkNvbG9yU2NoZW1lLVRleHQiIGQ9Ik0gNi4yNSAxIEwgNi4wOTU3MDMxIDIuODQzNzUgQSA1LjUg\
NS41IDAgMCAwIDQuNDg4MjgxMiAzLjc3MzQzNzUgTCAyLjgxMjUgMi45ODQzNzUgTCAxLjA2MjUg\
Ni4wMTU2MjUgTCAyLjU4Mzk4NDQgNy4wNzIyNjU2IEEgNS41IDUuNSAwIDAgMCAyLjUgOCBBIDUu\
NSA1LjUgMCAwIDAgMi41ODAwNzgxIDguOTMxNjQwNiBMIDEuMDYyNSA5Ljk4NDM3NSBMIDIuODEy\
NSAxMy4wMTU2MjUgTCA0LjQ4NDM3NSAxMi4yMjg1MTYgQSA1LjUgNS41IDAgMCAwIDYuMDk1NzAz\
MSAxMy4xNTIzNDQgTCA2LjI0NjA5MzggMTUuMDAxOTUzIEwgOS43NDYwOTM4IDE1LjAwMTk1MyBM\
IDkuOTAwMzkwNiAxMy4xNTgyMDMgQSA1LjUgNS41IDAgMCAwIDExLjUwNzgxMiAxMi4yMjg1MTYg\
TCAxMy4xODM1OTQgMTMuMDE3NTc4IEwgMTQuOTMzNTk0IDkuOTg2MzI4MSBMIDEzLjQxMjEwOSA4\
LjkyOTY4NzUgQSA1LjUgNS41IDAgMCAwIDEzLjQ5NjA5NCA4LjAwMTk1MzEgQSA1LjUgNS41IDAg\
MCAwIDEzLjQxNjAxNiA3LjA3MDMxMjUgTCAxNC45MzM1OTQgNi4wMTc1NzgxIEwgMTMuMTgzNTk0\
IDIuOTg2MzI4MSBMIDExLjUxMTcxOSAzLjc3MzQzNzUgQSA1LjUgNS41IDAgMCAwIDkuOTAwMzkw\
NiAyLjg0OTYwOTQgTCA5Ljc1IDEgTCA2LjI1IDEgeiBNIDggNiBBIDIgMiAwIDAgMSAxMCA4IEEg\
MiAyIDAgMCAxIDggMTAgQSAyIDIgMCAwIDEgNiA4IEEgMiAyIDAgMCAxIDggNiB6IiB0cmFuc2Zv\
cm09InRyYW5zbGF0ZSg0IDQpIi8+Cjwvc3ZnPgo=";

const MPV_CSS = `
.pwm-play {
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 50%;
  background-size: 48px;
  background-image: url(data:image/svg+xml;base64,${ICON_MPV});
  background-repeat: no-repeat;
}
.pwm-settings {
  display: block;
  transform: translate(25%, 0);
  width: 32px;
  height: 32px;
  background-color: #eeeeee;
  border: 0;
  border-radius: 50%;
  background-size: 32px;
  background-image: url(data:image/svg+xml;base64,${ICON_SETTINGS});
  background-repeat: no-repeat;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.pwm-iframe {
  display: none;
}
.play-with-mpv {
  position: fixed;
  left: 12px;
  bottom: 12px;
}
.play-with-mpv:hover .pwm-settings {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}
`;

const CONFIG_ID = "perferQuality";

const CONFIG_CSS = `
#${CONFIG_ID} .config_header {
  font-size: 1.5em;
  margin: 0;
  padding-bottom: 0.3em;
}
#${CONFIG_ID} .field_label {
  font-size: 1em;
}
#${CONFIG_ID} .radio_label {
  font-size: 0.9em;
}
#${CONFIG_ID} .saveclose_buttons {
  margin: 0.2em;
  padding: 0.3em 1.5em;
}
#${CONFIG_ID}_buttons_holder {
  position: fixed;
  width: 97%;
  bottom: 0;
}
#${CONFIG_ID} .reset_holder {
  float: left;
  position: relative;
  bottom: -1em;
}
#${CONFIG_ID}_field_perferQuality {
  padding-top: 0.3em;
}
`;

const IFRAME_CSS = `
height: 140px;
width: 290px;
border: 1px solid;
border-radius: 3px;
position: fixed;
z-index: 999;
`;

GM_config.init({
  id: `${CONFIG_ID}`,
  title: `${GM_info.script.name}`,
  fields: {
    perferQuality: {
      label: "Prefer quality",
      type: "radio",
      options: ["Best", "4K", "2K", "1080P", "720P"],
      default: "Best",
    },
  },
  events: {
    save: () => {
      updateButton(location.href);
    },
    reset: () => {
      updateButton(location.href);
    },
  },
  css: CONFIG_CSS,
});

function notifyHandlerUpdate() {
  const updateNotify = {
    title: `${GM_info.script.name}`,
    text: `mpv-handler is upgraded to ${MPV_HANDLER_VERSION}\n\nClick to check updates`,
    onclick: () => {
      GM_openInTab("https://github.com/akiirui/mpv-handler/releases/latest");
      GM_setValue("mpvHandlerVersion", MPV_HANDLER_VERSION);
    },
  };

  let version = GM_getValue("mpvHandlerVersion", null);
  if (version !== MPV_HANDLER_VERSION) {
    GM_notification(updateNotify);
  }
}

function appendButton() {
  let head = document.getElementsByTagName("head")[0];
  let style = document.createElement("style");

  if (head) {
    style.innerHTML = MPV_CSS;
    head.appendChild(style);
  }

  let body = document.getElementsByTagName("body")[0];
  let buttonDiv = document.createElement("div");
  let buttonSettings = document.createElement("button");
  let buttonPlay = document.createElement("a");
  let buttonIframe = document.createElement("iframe");

  if (body) {
    buttonSettings.className = "pwm-settings";
    buttonSettings.addEventListener("click", () => {
      if (!GM_config.isOpen) {
        GM_config.open();
        GM_config.frame.style = IFRAME_CSS;
      }
    });

    buttonPlay.className = "pwm-play";
    buttonPlay.target = "pwm-iframe";
    buttonPlay.style = "display: none";
    buttonPlay.addEventListener("click", () => {
      let videoElement = document.getElementsByTagName("video")[0];
      if (videoElement) videoElement.pause();
    });

    buttonIframe.className = "pwm-iframe";
    buttonIframe.name = "pwm-iframe";

    buttonDiv.className = "play-with-mpv";
    buttonDiv.appendChild(buttonSettings);
    buttonDiv.appendChild(buttonPlay);
    buttonDiv.appendChild(buttonIframe);

    body.appendChild(buttonDiv);
  }
}

function updateButton(currentUrl) {
  let isMatch = false;
  let button = document.getElementsByClassName("pwm-play")[0];

  for (const element of MATCH_URLS) {
    if ((isMatch = currentUrl.includes(element))) break;
  }

  if (button) {
    let quality = GM_config.get("perferQuality");
    let protocol = currentUrl + "|" + quality;

    button.style = isMatch ? "display: block" : "display: none";
    button.href = isMatch ? "mpv://" + btoa(protocol) : "";
    console.log(protocol);
  }
}

function detectPJAX() {
  let previousUrl = null;

  setInterval(() => {
    let currentUrl = location.href;

    if (currentUrl && previousUrl !== currentUrl) {
      updateButton(currentUrl);
      previousUrl = currentUrl;
    }
  }, 500);
}

notifyHandlerUpdate();
appendButton();
detectPJAX();
