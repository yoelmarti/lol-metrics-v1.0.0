import { capitalizeFirstLetter, getLanguage } from "../utils/common.js";

capitalizeFirstLetter;

export const roles = {
  assassin: "Assassin",
  fighter: "Fighter",
  mage: "Mage",
  marksman: "Marksman",
  support: "Support",
  tank: "Tank",
};

//Champions
const championsUrl = `https://ddragon.leagueoflegends.com/cdn/13.24.1/data/${getLanguage()}/champion.json`;

class Champion {
  constructor(champion) {
    this.image = `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.id}_0.jpg`;
    this.title = capitalizeFirstLetter(champion.title);
    this.name = champion.name;
    this.tags = champion.tags;
    this.id = champion.id;
  }
}

export const fetchChampionsData = async () => {
  const res = await fetch(championsUrl);
  if (!res.ok) return null;
  const { data: championsData } = await res.json();
  return Object.values(championsData).map((champion) => new Champion(champion));
};

export const filterChampionsByRole = (championList, selectedRoles = "all") => {
  const filteredChampions = championList.filter(
    (champion) =>
      selectedRoles.toLowerCase() === "all" ||
      champion.tags.includes(roles[selectedRoles.toLowerCase()])
  );
  return filteredChampions;
};

//Summoner
const apiKey = "RGAPI-09864d10-17a3-48d3-8c56-76696f7b889a";

const regionAndSubregions = {
  americas: {
    name: "americas",
    subregionList: ["NA1", "BR1", "LA1", "LA2"],
  },
  asia: {
    name: "asia",
    subregionList: ["KR", "JP1"],
  },
  europe: {
    name: "europe",
    subregionList: ["EUN1", "EUW1", "TR1", "RU"],
  },
  sea: {
    name: "sea",
    subregionList: ["OC1", "PH2", "SG2", "TH2", "TW2", "VN2"],
  },
};

class Summoner {
  constructor(summoner) {
    this.puuid = summoner.puuid;
    this.id = summoner.id;
    this.name = summoner.name;
    this.profileIcon = `https://ddragon.leagueoflegends.com/cdn/14.2.1/img/profileicon/${summoner.profileIconId}.png`;
    this.level = summoner.summonerLevel;
  }
}

export const getSummonerpuuid = async (summonerName, subregion) => {
  subregion = !subregion
    ? regionAndSubregions.europe.subregionList[1]
    : subregion;
  if (!summonerName) {
    alert("You need a summoner name");
    return;
  } else {
    try {
      const baseURL = `https://${subregion}.api.riotgames.com/`;
      const response = await fetch(
        `${baseURL}lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${apiKey}`
      );
      const summonerData = new Summoner(await response.json());
      let region;
      region = regionAndSubregions.americas.subregionList.includes(subregion)
        ? regionAndSubregions.americas.name
        : regionAndSubregions.asia.subregionList.includes(subregion)
        ? regionAndSubregions.asia.name
        : regionAndSubregions.europe.subregionList.includes(subregion)
        ? regionAndSubregions.europe.name
        : regionAndSubregions.sea.name;
      return { summonerData, region: region, subregion };
    } catch (error) {
      alert(
        "An error has occurred in the request, check if the region you are looking for is the correct one."
      );
    }
  }
};

export const fetchLeagueData = async (summonerId, subregion) => {
  const response = await fetch(
    `https://${subregion}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${apiKey}`
  );
  return response.ok ? await response.json() : null;
};
export const fetchTopChampionsPlayed = async (summonerId, subregion) => {
  const response = await fetch(
    `https://${subregion}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${summonerId}/top?count=3&api_key=${apiKey}`
  );
  return response.ok ? response.json() : null;
};

export const fetchSummonerMatchesIds = async (puuid, region) => {
  const response = await fetch(
    `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=15&queue=420&api_key=${apiKey}`
  );
  return response.ok ? await response.json() : null;
};
export const fetchChampions = async () => {
  const response = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/14.2.1/data/${getLanguage()}/champion.json`
  );
  return response.ok ? response.json() : null;
};

export const fetchMatchData = async (region, matchId, puuid) => {
  const response = await fetch(
    `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`
  );
  if (!response.ok) {
    return null;
  } else {
    const data = await response.json();
    const { participants, ...matchGenericInfo } = data.info;
    const participant = participants.find(
      (participant) => participant.puuid === puuid
    );
    if (participant) {
      return {
        champion: participant.championName,
        kills: participant.kills,
        deaths: participant.deaths,
        assists: participant.assists,
        championLevel: participant.champLevel,
        lane: participant.lane,
        matchDuration: participant.timePlayed,
        items: [
          participant.item0,
          participant.item1,
          participant.item2,
          participant.item3,
          participant.item4,
          participant.item5,
          participant.item6,
        ],
        win: participant.win,
        gameName: participant.riotIdGameName,
        tagLine: participant.riotIdTagline,
        allParticipants: participants,
        matchInfo: matchGenericInfo,
      };
    } else {
      return null;
    }
  }
};
