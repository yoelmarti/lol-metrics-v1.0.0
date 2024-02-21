import { setSettings } from "../utils/common.js";
import { getSidebar } from "./sidebar.js";
setSettings();
getSidebar();

const languageOptions = [
  { code: "en_US", language: "English - United Stats" },
  { code: "cs_CZ", language: "Czech" },
  { code: "de_DE", language: "German" },
  { code: "el_GR", language: "Greek" },
  { code: "en_AU", language: "English - Australian" },
  { code: "en_GB", language: "English - Great Britain" },
  { code: "en_PH", language: "English - Philippines" },
  { code: "en_SG", language: "English - Singapore" },
  { code: "es_AR", language: "Spanish - Argentina" },
  { code: "es_ES", language: "Spanish - España" },
  { code: "es_MX", language: "Spanish - Mexico" },
  { code: "fr_FR", language: "French" },
  { code: "hu_HU", language: "Hungarian" },
  { code: "it_IT", language: "Italian" },
  { code: "ja_JP", language: "Japanese" },
  { code: "ko_KR", language: "Korean" },
  { code: "pl_PL", language: "Polish" },
  { code: "pt_BR", language: "Portuguese" },
  { code: "ro_RO", language: "Romanian" },
  { code: "ru_RU", language: "Russian" },
  { code: "th_TH", language: "Thai" },
  { code: "tr_TR", language: "Turkish" },
  { code: "vi_VN", language: "Vietnamese" },
  { code: "zh_CN", language: "Chinese" },
  { code: "zh_MY", language: "Chinese" },
  { code: "zh_TW", language: "Chinese" },
];

const themeSwitch = document.querySelector("#themeSwitch");
const languageSelect = document.getElementById("languageSelect");

const { lightTheme, languageSelected } = JSON.parse(
  localStorage.getItem("settings")
);
themeSwitch.checked = lightTheme;

languageOptions.forEach(({ code, language }) => {
  const option = document.createElement("option");
  option.value = code;
  option.textContent = language;
  option.selected = code === languageSelected;
  languageSelect.appendChild(option);
});

const body = document.querySelector("body");
document.getElementById("myForm").addEventListener("submit", (event) => {
  event.preventDefault();
  localStorage.setItem(
    "settings",
    JSON.stringify({
      lightTheme: themeSwitch.checked,
      languageSelected: languageSelect.value,
    })
  );
  themeSwitch.checked
    ? body.classList.add("light-theme")
    : body.classList.remove("light-theme");
});
