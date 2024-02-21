import {
  fetchLeagueData,
  fetchTopChampionsPlayed,
  fetchMatchData,
  fetchSummonerMatchesIds,
  fetchChampions,
  getSummonerpuuid,
} from "../model/data.js";
import { getOrdinal } from "../utils/common.js";
import { getSidebar } from "./sidebar.js";
import { setSettings } from "../utils/common.js";

setSettings();
getSidebar();

const addFirstInfo = () => {
  const h2 = document.createElement("h2");
  const i = document.createElement("i");
  i.style.color = "var(--pure-white-color)";
  i.classList.add("bx", "bxs-chevrons-up", "bx-lg");
  h2.textContent = "LOOK UP YOUR STATISTICS VIA IN-GAME NAME AND YOUR REGION";
  h2.style.color = "var(--pure-white-color)";
  document.querySelector(".content").appendChild(i);
  document.querySelector(".content").appendChild(h2);
};
addFirstInfo();

const getRegionAndNameForm = async () => {
  const response = await fetch(`../../templates/summoners-form-template.html`);
  const template = document.createElement("template");
  response.ok
    ? (template.innerHTML = await response.text())
    : alert("Ha ocurrido un error al obtener la plantilla!");

  const selectTemplate =
    template.content.querySelector("#select-template").content;
  const selectAndInputContainer = document.createElement("div");
  selectAndInputContainer.classList.add("form-container");
  let inputValue = "";
  let selectValue = "";
  selectTemplate
    .querySelector("#region-select")
    .addEventListener("change", (event) => (selectValue = event.target.value));
  selectAndInputContainer.appendChild(selectTemplate);
  const inputTemplate =
    template.content.querySelector("#input-template").content;
  inputTemplate
    .querySelector("#summoner-input")
    .addEventListener("input", (event) => (inputValue = event.target.value));
  inputTemplate
    .querySelector(".bx-search-alt")
    .addEventListener("click", async () => {
      document.querySelector(".content").innerHTML = "";
      const { summonerData, region, subregion } = await getSummonerpuuid(
        inputValue,
        selectValue
      );
      if (!summonerData) {
        return alert(
          "The player information is incomplete, please perform a correct search."
        );
      }
      const leagueData = await fetchLeagueData(summonerData.id, subregion);
      if (!leagueData.length) {
        return alert(
          "The player information is incomplete, please perform a correct search."
        );
      }
      const matchesIds = await fetchSummonerMatchesIds(
        summonerData.puuid,
        region
      );
      const topChampionsPlayedData = await fetchTopChampionsPlayed(
        summonerData.puuid,
        subregion
      );
      const { data: champions } = await fetchChampions();

      const topChampionsPlayed = topChampionsPlayedData.map((topChampion) => {
        const found = Object.values(champions).find(
          (champion) => +champion.key === topChampion.championId
        );
        if (found) {
          const date = new Date(topChampion.lastPlayTime);
          const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];
          return {
            id: found.id,
            images: {
              small: `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/champion/${found.id}.png`,
              full: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${found.id}_0.jpg`,
            },
            level: topChampion.championLevel,
            points: topChampion.championPoints,
            lastDayPlayed: `${getOrdinal(date.getDate())} ${
              months[date.getMonth()]
            } ${date.getFullYear()}`,
          };
        }
      });
      const matchDataList = await Promise.all(
        matchesIds.map((matchId) =>
          fetchMatchData(region, matchId, summonerData.puuid)
        )
      );
      const dataToDisplay = {
        summonerData,
        leagueData: leagueData[0],
        matchDataList,
        topChampionsPlayed,
        allChampions: champions,
      };
      displaySummonerDataAndMatches(dataToDisplay);
    });

  selectAndInputContainer.appendChild(inputTemplate);
  return selectAndInputContainer;
};

const setTierImage = (tier) => {
  switch (tier) {
    case "challenger":
      return "../assets/Ranked Emblems Latest/challenger.png";
    case "grandmaster":
      return "../assets/Ranked Emblems Latest/grandmaster.png";
    case "master":
      return "../assets/Ranked Emblems Latest/challenger.png";
    case "diamond":
      return "../assets/Ranked Emblems Latest/diamond.png";
    case "emerald":
      return "../assets/Ranked Emblems Latest/emerald.png";
    case "platinum":
      return "../assets/Ranked Emblems Latest/platinum.png";
    case "gold":
      return "../assets/Ranked Emblems Latest/gold.png";
    case "silver":
      return "../assets/Ranked Emblems Latest/silver.png";
    case "bronze":
      return "../assets/Ranked Emblems Latest/bronze.png";
    case "iron":
      return "../assets/Ranked Emblems Latest/iron.png";
  }
};

const displaySummonerDataAndMatches = (fullSummonerData) => {
  const averageKills = (
    fullSummonerData.matchDataList.reduce(
      (acc, match) => acc + match.kills,
      0
    ) / fullSummonerData.matchDataList.length
  ).toFixed(1);
  const averageDeaths = (
    fullSummonerData.matchDataList.reduce(
      (acc, match) => acc + match.deaths,
      0
    ) / fullSummonerData.matchDataList.length
  ).toFixed(1);
  const averageAssits = (
    fullSummonerData.matchDataList.reduce(
      (acc, match) => acc + match.assists,
      0
    ) / fullSummonerData.matchDataList.length
  ).toFixed(1);

  const fragment = document.createDocumentFragment();
  const summonerTemplate = document.querySelector("#summoner").content;
  const summonerClone = summonerTemplate.cloneNode(true);
  summonerClone.querySelector(
    ".cover"
  ).style = `background-image: url("${fullSummonerData.topChampionsPlayed[0].images.full}");`;
  summonerClone.querySelector(".profile-icon").src =
    fullSummonerData.summonerData.profileIcon;
  summonerClone.querySelector(".profile-icon").alt =
    fullSummonerData.summonerData.name;
  summonerClone.querySelector(".cover .name").textContent =
    fullSummonerData.summonerData.name;
  summonerClone.querySelector(
    ".cover .tag-name"
  ).textContent = `#${fullSummonerData.matchDataList[0].tagLine}`;
  summonerClone.querySelector(".tier").src = setTierImage(
    fullSummonerData.leagueData.tier.toLowerCase()
  );
  summonerClone.querySelector(".tier").alt = fullSummonerData.leagueData.tier;
  summonerClone.querySelector(".lp-box .title").textContent =
    fullSummonerData.leagueData.tier;
  summonerClone.querySelector(
    ".lp-box .league-points"
  ).textContent = `${fullSummonerData.leagueData.leaguePoints} LP`;
  summonerClone.querySelector(".win-rate-box .win-rate").textContent = `${(
    (fullSummonerData.leagueData.wins /
      (fullSummonerData.leagueData.wins + fullSummonerData.leagueData.losses)) *
    100
  ).toFixed(1)} %`;
  summonerClone.querySelector(
    ".win-rate-box .wins-losses"
  ).textContent = `${fullSummonerData.leagueData.wins}W - ${fullSummonerData.leagueData.losses}L`;

  const averageKDAlastMatches = () => {
    let list;
    return (list = fullSummonerData.matchDataList.map((match) => {
      let result = (match.kills + match.assists) / match.deaths || 0;
      return result;
    }));
  };
  const min = Math.min(...averageKDAlastMatches());
  const max = Math.max(...averageKDAlastMatches());
  const kdaList = averageKDAlastMatches();
  const normalizedAverageKDAForChart = averageKDAlastMatches().map((valor) =>
    valor !== 0
      ? Math.round((((valor - min) / (max - min)) * (1 - 0.1) + 0.1) * 100) /
        100
      : 0
  );

  kdaList.forEach((kda, index) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const span = document.createElement("span");

    td.style.setProperty(
      "--start",
      `${!index ? 0 : normalizedAverageKDAForChart[index - 1]}`
    );
    td.style.setProperty("--end", `${normalizedAverageKDAForChart[index]}`);
    span.textContent = kda.toFixed(2);
    span.classList.add("data");
    td.appendChild(span);
    tr.appendChild(td);
    summonerClone.querySelector(".charts-css > tbody").appendChild(tr);
  });
  summonerClone.querySelector(".kda .absolute-kda-value").textContent = `${(
    (+averageKills + +averageAssits) /
    +averageDeaths
  ).toFixed(2)}`;
  summonerClone.querySelector(
    ".avg-kda .avg-k-d-a-value"
  ).textContent = `${averageKills}/${averageDeaths}/${averageAssits}`;

  const topChampionTemplate = document.querySelector("#top-champion").content;
  fullSummonerData.topChampionsPlayed.forEach((champion) => {
    const topChampionCloned = topChampionTemplate.cloneNode(true);
    topChampionCloned.querySelector(".avatar").src = champion.images.small;
    topChampionCloned.querySelector(".avatar").alt = champion.id;
    topChampionCloned.querySelector(".name").textContent = champion.id;
    topChampionCloned.querySelector(
      ".level"
    ).textContent = `Level ${champion.level}`;
    topChampionCloned.querySelector(
      ".points"
    ).textContent = `Points ${champion.points}`;
    topChampionCloned.querySelector(
      ".last-day-played"
    ).textContent = `Last Day Played ${champion.lastDayPlayed}`;
    summonerClone
      .querySelector(".top-champions")
      .appendChild(topChampionCloned);
  });
  summonerClone.querySelector(
    ".matches header div h2"
  ).textContent = `Last ${fullSummonerData.matchDataList.length} matches played`;
  const simpleMatchInfo = document.querySelector("#match-info").content;
  fullSummonerData.matchDataList.forEach((match) => {
    let matchDate = new Date(match.matchInfo.gameCreation);
    let todayDate = new Date();
    let diffBetweenDates = todayDate - matchDate;
    let diffResult = Math.floor(diffBetweenDates / (1000 * 60 * 60 * 24));

    let minuts = Math.floor(match.matchInfo.gameDuration / 60);
    let seconds = match.matchInfo.gameDuration % 60;

    const simpleMatchCloned = simpleMatchInfo.cloneNode(true);
    simpleMatchCloned
      .querySelector(".match")
      .classList.add(`${match.win ? "victory" : "defeat"}`);
    simpleMatchCloned.querySelector(".days-ago").textContent = `${
      !diffResult
        ? "today"
        : diffResult === 1
        ? "yesterday"
        : diffResult + " days ago"
    }`;
    simpleMatchCloned.querySelector(
      ".match-duration"
    ).innerText = `${minuts}m ${seconds}s`;
    simpleMatchCloned.querySelector(".result").textContent = `${
      match.win ? "Victory" : "Defeat"
    }`;
    simpleMatchCloned.querySelector(".result").style.color = `${
      match.win ? "var(--victory-color)" : "var(--defeat-color)"
    }`;
    simpleMatchCloned.querySelector(
      ".champion-small-image"
    ).src = `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/champion/${match.champion}.png`;
    simpleMatchCloned.querySelector(".champion-small-image").alt =
      match.champion;
    simpleMatchCloned.querySelector(".level").textContent = match.championLevel;

    match.items.forEach((item) => {
      const img = document.createElement("img");
      if (item) {
        img.src = `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/item/${item}.png`;
        img.alt = item;
        simpleMatchCloned.querySelector(".items").appendChild(img);
      }
    });

    simpleMatchCloned.querySelector(
      ".kda"
    ).textContent = `${match.kills}/${match.deaths}/${match.assists}`;
    summonerClone.querySelector(".matches").appendChild(simpleMatchCloned);
  });

  fragment.appendChild(summonerClone);
  document.querySelector(".content").appendChild(fragment);
};

document.querySelector(".header").appendChild(await getRegionAndNameForm());
