const menuMobile = document.getElementById("icono-burger")
const menuSeccion = document.getElementById("seccion-menu-mobile")

menuMobile.onclick = () => {
    menuSeccion.classList.toggle("menu-oculto")
}