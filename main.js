// VARIABLES
const menuMobile = document.getElementById("icono-burger")
const menuSeccion = document.getElementById("menu-mobile")
const links = document.querySelectorAll("#menu-mobile li")

// DESPLIEGA O CIERRA MENÚ
menuMobile.onclick = () => {
    menuSeccion.classList.toggle("menu-desplegado")
}

// CIERRA MENÚ AL IR A LINK
for (let link of links) {
    link.onclick = () => {
        menuSeccion.classList.remove("menu-desplegado")
    }
}