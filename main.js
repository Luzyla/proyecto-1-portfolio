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

// FILTRO PROYECTOS
const buttons = document.querySelectorAll(".menu-proyectos")
const proyectos = document.querySelectorAll(".proyectos")

// console.log(buttons)
// console.log(proyectos)

for (let button of buttons) {
    
    button.onclick = () => {
        for (let proyecto of proyectos) {
            const boton = button.dataset.name
            const proyectoFiltrado = proyecto.dataset.name
                        
            if (boton === proyectoFiltrado) {
                proyecto.classList.remove("hidden")
            }
            else if (boton === "todos") {
                proyecto.classList.remove("hidden")
            }
            else {
                proyecto.classList.add("hidden")
            }
        }
    
    }

}       


