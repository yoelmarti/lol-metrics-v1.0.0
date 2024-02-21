import { getSidebar } from "./sidebar.js";
import {
  fetchChampionsData,
  filterChampionsByRole,
  roles,
} from "../model/data.js";
import { setSettings } from "../utils/common.js";
setSettings();
const getChampionCardTemplate = async () => {
  const response = await fetch("../../templates/champion-card.html");
  if (!response.ok) throw new Error("Error al obtener el archivo");
  const championCardTemplateData = await response.text();
  const div = document.createElement("div");
  div.innerHTML = championCardTemplateData;
  return div;
};

const championCardTemplate = await getChampionCardTemplate();

const createChampionsCards = (championsList, championCardTemplate) => {
  const fragment = document.createDocumentFragment();

  const championCard = championCardTemplate.querySelector(
    "#champion-card-template"
  ).content;

  championsList.forEach((champion) => {
    const cardClone = championCard.cloneNode(true);

    cardClone.querySelector(".image").src = champion.image;
    cardClone.querySelector(".image").alt = champion.name;
    cardClone.querySelector(".name").textContent = champion.name;
    cardClone.querySelector(".title").textContent = champion.title;
    champion.tags.forEach((element) => {
      const img = document.createElement("img");
      switch (element) {
        case roles.assassin:
          img.src = "../assets/icons/champions-role-icons/assassin.png";
          break;
        case roles.fighter:
          img.src = "../assets/icons/champions-role-icons/fighter.png";
          break;
        case roles.mage:
          img.src = "../assets/icons/champions-role-icons/mage.png";
          break;
        case roles.marksman:
          img.src = "../assets/icons/champions-role-icons/marksman.png";
          break;
        case roles.support:
          img.src = "../assets/icons/champions-role-icons/support.png";
          break;
        case roles.tank:
          img.src = "../assets/icons/champions-role-icons/tank.png";
          break;
      }
      img.alt = element;
      cardClone.querySelector(".role-container").appendChild(img);
    });
    cardClone
      .querySelector(".champion-card")
      .addEventListener(
        "click",
        () =>
          (window.location.href = `../pages/champion-detail.html?championName=${champion.id}`)
      );

    fragment.appendChild(cardClone);
  });
  const div = document.createElement("div");
  div.classList.add("champions-container");
  div.appendChild(fragment);
  return div;
};

const getRoleButtons = async () => {
  const buttons = await fetch("../../templates/champion-filter.html");
  const template = document.createElement("template");
  template.innerHTML = await buttons.text();
  const buttonsList = template.content
    .querySelector("#role-filter")
    .querySelectorAll(".menu-button");
  buttonsList.forEach((button) => {
    button.textContent === "All" && button.classList.add("selected");
    button.addEventListener("click", (event) => {
      buttonsList.forEach((button) => button.classList.remove("selected"));
      button.classList.add("selected");
      filteredChampions = filterChampionsByRole(
        championList,
        event.target.innerText
      );
      const championsContainer = document.querySelector(".champions-container");
      championsContainer.innerHTML = "";
      championsContainer.appendChild(
        createChampionsCards(filteredChampions, championCardTemplate)
      );
    });
  });

  const header = document.querySelector(".header");
  header.appendChild(template.content.querySelector("#role-filter"));
};

getSidebar();
await getRoleButtons();
const championList = await fetchChampionsData();
let filteredChampions = await filterChampionsByRole(championList);
const content = document.querySelector(".content");
content.appendChild(
  createChampionsCards(filteredChampions, championCardTemplate)
);
