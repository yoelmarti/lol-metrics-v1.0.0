export const getSidebar = async () => {
  const response = await fetch("../../templates/sidebar.html");
  if (!response.ok) throw new Error("Error al obtener el archivo");
  const asideTemplateData = await response.text();

  const aside = document.querySelector(".sidebar");
  aside.innerHTML = asideTemplateData;
  toggleActive();
  logoHomeRedirect();
};

const toggleActive = () => {
  const optionsElements = document.querySelectorAll(".sidebar ul li a");
  optionsElements.forEach((option) => {
    option.href === window.location.href
      ? option.classList.add("active")
      : option.classList.remove("active");
  });
  window.location.href.includes("champion-detail") &&
    optionsElements[2].classList.add("active");
};

const logoHomeRedirect = () => {
  const logo = document.querySelector(".sidebar nav .logo");
  logo.addEventListener("click", () => {
    window.location.href = "/";
  });
};
