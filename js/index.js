import { getSidebar } from "./controller/sidebar.js";
import { setSettings } from "./utils/common.js";
setSettings();
getSidebar();

let videoConfiguration = () => {
  let video = document.querySelector("video");

  video.addEventListener("loadedmetadata", () => {
    video.currentTime = 140;
    video.volume = 0.15;
    video.play();
  });
};

const addTitleOnHeader = () => {
  const header = document.querySelector(".header");
  header.style = "display: flex; align-items: center; justify-content: center;";
  const h1 = document.createElement("h1");
  h1.textContent = "League of Legends Stats (Season 2024)";
  h1.style.color = "var(--pure-white-color)";
  h1.style.fontSize = "2em";
  h1.style.margin = 0;
  header.appendChild(h1);
};
addTitleOnHeader();
videoConfiguration();
