const pesos = document.querySelector("#inputClp")
const monedaSeleccionada = document.querySelector("#monedaSeleccionada")
const boton = document.querySelector("#boton")
const monedaConvertida = document.querySelector("#monedaConvertida")
const miGrafico = document.querySelector("#miGrafico")
const apiUrl = "https://mindicador.cl/api" //ENDPOINT PRINCIPAL

async function obtenerMonedas(url) {
    try {
        const res = await fetch(url)
        const monedas = await res.json()
        return monedas
    } catch (error) {
        alert("Error al cargar la API. Favor intente de nuevo!")
        return
    }
}

async function renderConvierteMonedas() {
    try {
        const monedas = await obtenerMonedas(apiUrl);
        let tipoMoneda = "" //SE DEFINE PARA USARLA EN FORMATEO NUMERICO EN LA LINEA 38
        if (monedas[monedaSeleccionada.value].codigo === "dolar") {
            tipoMoneda = "USD"
        } else {
            tipoMoneda = "EUR"
        }
        monedaConvertida.innerHTML = `Resultado: ${new Intl.NumberFormat("en-US", { //SE FORMATEA A TIPO MONEDA
            style: "currency",
            currency: tipoMoneda //SE COLOCA PARA QUE SALGA EL SIGNO MONETARIO CORRESPONDIENTE
        }).format((pesos.value / monedas[monedaSeleccionada.value].valor).toFixed(2))}` //REDONDEA A DOS DECIMALES
        renderGrafica()
    }
    catch (error) {
        alert("Seleccione Moneda a convertir")
    }
}

boton.addEventListener("click", () => {
    if (pesos.value == "" || pesos.value <= 0) {
        alert("Ingrese un monto mayor a CERO")
        pesos.value = ""
        return
    }
    renderConvierteMonedas() //LLAMADO A FUNCION PRINCIPAL
})

async function cargaDatosParaGrafico() {
    const urlParaGrafico = await obtenerMonedas(apiUrl + "/" + monedaSeleccionada.value)
    console.log(urlParaGrafico) //NUEVO ENDPOINT PARA DATOS HISTORICOS
    const fechasEjeX = urlParaGrafico.serie.map((dato) => {
        return dato.fecha.split("T")[0]
    })
    const valoresMonedaEjeY = urlParaGrafico.serie.map((dato) => {
        return Number(dato.valor)
    })

    const ejeY = [
        {
            label: monedaSeleccionada.value,
            borderColor: "rgb(255, 99, 132)",
            valoresMonedaEjeY
        }
    ]
    return { fechasEjeX, ejeY }
}

async function renderGrafica() {
    const grafico = await cargaDatosParaGrafico()
    const config = {
        type: "line",
        grafico
    }
    miGrafico.style.backgroundColor = "white";
    new Chart(miGrafico, config);
}
