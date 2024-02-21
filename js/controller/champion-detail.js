import {
  getLanguage,
  removeHTMLTags,
  returnToPreviousPage,
  setSettings,
} from "../utils/common.js";
import { getSidebar } from "./sidebar.js";
setSettings();
getSidebar();

const goBack = () => {
  const header = document.querySelector(".header");
  const div = document.createElement("div");
  const i = document.createElement("i");
  const p = document.querySelector("p");
  i.classList.add("bx", "bx-arrow-from-right");
  p.textContent = "Go Back";
  div.style = "display: flex; justify-content:center; align-items:center;";
  div.addEventListener("click", () => {
    returnToPreviousPage();
  });
  div.appendChild(i);
  div.appendChild(p);
  header.style =
    "display: flex; justify-content:center; align-items:center; cursor: pointer";
  header.appendChild(div);
};
goBack();
const getChamionDetailTemplate = async () => {
  const response = await fetch("../../templates/champion-detail.html");
  const template = document.createElement("template");
  template.innerHTML = await response.text();
  return template.content.querySelector("#champion-detail-template").content;
};

const createChampionPage = async (champion) => {
  const championPassiveAndSpells = [champion.passive, ...champion.spells];
  const championDetailTemplate = await getChamionDetailTemplate();
  const fragment = document.createDocumentFragment();
  const detailClone = championDetailTemplate.cloneNode(true);
  const detailContainer = detailClone.querySelector(".detail-container");
  detailContainer.style = `background-image: url("https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg");`;

  detailClone.querySelector(".champion-title").textContent =
    champion.title.toUpperCase();
  detailClone.querySelector(".champion-name").textContent = champion.name;
  detailClone.querySelector(".champion-description").textContent =
    champion.blurb;
  detailClone.querySelector(".ability-name").textContent =
    championPassiveAndSpells[0].name;
  detailClone.querySelector(".damage").style =
    championPassiveAndSpells[0].image.group === "passive"
      ? "display: none;"
      : "display: block;";
  detailClone.querySelector(".cooldown").style =
    championPassiveAndSpells[0].image.group === "passive"
      ? "display: none;"
      : "display: block;";
  detailClone.querySelector(".ability-description").textContent =
    removeHTMLTags(championPassiveAndSpells[0].description);

  championPassiveAndSpells.forEach((spell, index) => {
    const img = document.createElement("img");
    if (!index) img.classList.add("selected");
    img.classList.add("ability");
    img.src =
      spell.image.group === "passive"
        ? `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/passive/${spell.image.full}`
        : `https://ddragon.leagueoflegends.com/cdn/14.1.1/img/spell/${spell.image.full}`;
    img.alt = spell.id;
    img.addEventListener("click", () => {
      document
        .querySelectorAll(".abilities-container .ability")
        .forEach((element) => element.classList.remove("selected"));
      img.classList.add("selected");
      document.querySelector(".ability-name").textContent = spell.name;
      document.querySelector(".damage span").textContent = spell.cooldownBurn;
      document.querySelector(".cooldown span").textContent =
        spell?.cooldownBurn;
      document.querySelector(".damage").style =
        spell.image.group === "passive" ? "display: none;" : "display: block;";
      document.querySelector(".cooldown").style =
        spell.image.group === "passive" ? "display: none;" : "display: block;";
      document.querySelector(".ability-description").textContent =
        removeHTMLTags(spell.description);
    });
    detailClone.querySelector(".abilities-container").appendChild(img);
  });
  detailClone.querySelectorAll(".dificulty-level").forEach((level, index) => {
    index < champion.info.difficulty && level.classList.add("selected");
  });
  champion.skins.forEach((skin) => {
    const img = document.createElement("img");
    img.height = 100;
    img.src = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${skin.num}.jpg`;
    img.alt = skin.name;
    img.addEventListener("click", () => {
      detailContainer.style = `background-image: url("https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_${skin.num}.jpg`;
    });
    detailClone
      .querySelector(".skins-container .images-container")
      .appendChild(img);
  });
  fragment.appendChild(detailClone);
  return fragment;
};
const getOneChampion = async (championName) => {
  try {
    const response = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/14.1.1/data/${getLanguage()}/champion/${championName}.json`
    );
    if (!response.ok)
      throw new Error("Ha ocurrido un error al obtener los datos");
    const { data: championData } = await response.json();

    return createChampionPage(championData[championName]);
  } catch (error) {
    window.location.href = "/pages/champions.html";
    alert(error);
  }
};

const getChampion = () => {
  const oneChampionUrl = window.location.href;
  const url = new URL(oneChampionUrl);
  const championName = url.searchParams.get("championName");
  return getOneChampion(championName);
};

const content = document.querySelector(".content");
const champion = await getChampion();
content.appendChild(champion);
