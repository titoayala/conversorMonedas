const pesos = document.querySelector("#inputClp")
const monedaSeleccionada = document.querySelector("#monedaSeleccionada")
const boton = document.querySelector("#boton")
const monedaConvertida = document.querySelector("#monedaConvertida")
const miGrafico = document.querySelector("#miGrafico")
const apiUrl = "https://mindicador.cl/api"

async function getMonedas(url) {
    try {
        const res = await fetch(url)
        const monedas = await res.json()
        return monedas
    } catch (error) {
        alert("Error al cargar la API. Favor intente de nuevo!")
    }
}
boton.addEventListener("click", () => {
    if (pesos.value == "" || pesos.value <= 0) {
        alert("Ingrese un monto mayor a CERO")
        pesos.value = ""
        return
    }
    renderConvierteMonedas()
})
async function renderConvierteMonedas() {
    try {
        const monedas = await getMonedas(apiUrl);
        let tipoMoneda = "" //SE DEFINE PARA USARLA EN FORMATEO NUMERICO EN LA LINEA 36
        if (monedas[monedaSeleccionada.value].codigo === "dolar") {
            tipoMoneda = "USD"
        } else {
            tipoMoneda = "EUR"
        }
        monedaConvertida.innerHTML = `Resultado: ${new Intl.NumberFormat("en-US", { //SE FORMATEA A TIPO MONEDA
            style: "currency",
            currency: tipoMoneda //SE COLOCA PARA QUE SALGA EL SIGNO MONETARIO CORRESPONDIENTE
        }).format((pesos.value / monedas[monedaSeleccionada.value].valor).toFixed(2))}` //REDONDEA A DOS DECIMALES
    }
    catch (error) {
        alert("Seleccione Moneda a convertir")
        return
    }
}
