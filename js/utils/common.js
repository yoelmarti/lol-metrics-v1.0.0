export const capitalizeFirstLetter = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const removeHTMLTags = (input) => {
  return input.replace(/<[^>]*>/g, " ");
};

export const getOrdinal = (number) => {
  const lastDigit = number % 10;
  const twoLastDigit = number % 100;

  if (lastDigit === 1 && twoLastDigit !== 11) {
    return `${number}st`;
  } else if (lastDigit === 2 && twoLastDigit !== 12) {
    return `${number}nd`;
  } else if (lastDigit === 3 && twoLastDigit !== 13) {
    return `${number}rd`;
  } else {
    return `${number}th`;
  }
};

export const setSettings = () => {
  if (!localStorage.getItem("settings")) {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        lightTheme: false,
        languageSelected: "en_US",
      })
    );
  } else {
    const { lightTheme } = JSON.parse(localStorage.getItem("settings"));
    if (lightTheme) {
      const body = document.querySelector("body");
      body.classList.add("light-theme");
    } else {
    }
  }
};

export const getLanguage = () => {
  const { languageSelected } = JSON.parse(localStorage.getItem("settings"));
  return languageSelected;
};

export const returnToPreviousPage = () => {
  window.history.back();
};
