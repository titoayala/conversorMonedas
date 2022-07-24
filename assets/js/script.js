const pesos = document.querySelector("#inputClp")
const monedaSeleccionada = document.querySelector("#monedaSeleccionada")
const boton = document.querySelector("#boton")
const monedaConvertida = document.querySelector("#monedaConvertida")
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
    graficoTotal();
})

function graficoTotal() {
    async function cargaDatosParaGrafico() {
        const urlGrafico = await fetch(apiUrl + "/" + monedaSeleccionada.value);
        const datosGrafico = await urlGrafico.json();

        const labels = datosGrafico.serie.map((ejeX) => {
            return ejeX.fecha.split("T")[0];
        });

        const data = datosGrafico.serie.map((ejeY) => {
            const valorEjeY = ejeY.valor;
            return Number(valorEjeY);
        });

        const datasets = [
            {
                label: "Historial últimos 31 días " + monedaSeleccionada.value,
                borderColor: "rgb(255, 99, 132)",
                data
            }
        ];
        return { labels, datasets };
    }

    async function renderGrafica() {
        const data = await cargaDatosParaGrafico();

        const config = {
            type: "line",
            data
        };

        const myChart = document.querySelector("#myChart");
        myChart.style.backgroundColor = "white";
        new Chart(myChart, config);
    }
    renderGrafica();
}