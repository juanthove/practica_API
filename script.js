const apiWeather = "https://api.openweathermap.org/data/2.5/weather";
const apiLocation = "http://api.openweathermap.org/geo/1.0/direct";
const apiCountry = "https://restcountries.com/v3.1/";

const ciudad = document.getElementById("ciudad");
const pais = document.getElementById("pais");
const botonBusqueda = document.getElementById("botonBusqueda");

const resultado = document.getElementById("resultado");

botonBusqueda.addEventListener("click", async () => {
    resultado.innerHTML = "";

    let ciudadPais = ciudad.value; //Guardo el valor de la ciudad

    if(pais.value.trim()){ //Si el campo pais tiene algo guardo tambien el código del pais
        const codigo = await obtenerCodigoPais();
        ciudadPais += `,${codigo}`;
    }

    buscarCiudad(ciudadPais);
    
});

async function obtenerCodigoPais() {
    try {
        const response = await fetch(`${apiCountry}name/${pais.value}`); //Obtengo el código del pais ingresado
        if(response.ok) {
            const data = await response.json();
            return data[0].cca2; //Obtengo el código de 2 letras del pais
        }
    } catch(error) {
        console.error(error);
        return null;
    }
}

function buscarCiudad(ciudadPais){
    fetch(`${apiLocation}?q=${ciudadPais}&limit=5&appid=${apiKey}`) //Busca las ciudades posibles
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(ciudades => {
            ciudades.forEach(ciudad => { //Recorro cada ciudad encontrada buscando su clima
                buscarClima(ciudad);
            });
        })
        .catch(error => console.error(error));
}

async function buscarClima(ciudad){
    const {lat, lon, country} = ciudad;
    let pais, clima;
    try{
        const response = await fetch(`${apiCountry}alpha/${country}`); //Obtengo el nombre del pais de la ciudad encontrada
        if(response.ok) {
            pais = await response.json();
        }
        const responseClima = await fetch(`${apiWeather}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=sp`); //Obtengo el clima de la ciudad
        if(responseClima.ok) {
            clima = await responseClima.json();
        }

        insertarClima(clima, pais[0].name.common);

    } catch(error) {
        console.error(error);
        return null;
    }
}

function insertarClima(clima, pais) {
    //Creo el div general
    const divGeneral = document.createElement("div");
    divGeneral.classList.add("contenedorClima");

    //Creo el div para el nombre
    const divNombre = document.createElement("div");
    divNombre.classList.add("contenedorNombre");

    //Creo el nombre y pais de la ciudad
    const nombrePais = document.createElement("p");
    nombrePais.classList.add("nombreCiudad");
    nombrePais.textContent = `${clima.name}, ${pais}`;

    //Creo el div para la imagen, temperatura y la descripcion
    const divImagenTempDescripcion = document.createElement("div");
    divImagenTempDescripcion.classList.add("contenedorImagenTempDescripcion");

    //Creo el div general de la imagen y las temperaturas
    const divImagenTemp = document.createElement("div");
    divImagenTemp.classList.add("contenedorImagenTemp");

    //Creo el div para temperatura y sensacion
    const divTempSensacion = document.createElement("div");
    divTempSensacion.classList.add("contenedorTempSensacion");

    //Creo la imagen y le doy clases
    const imagen = document.createElement("img");
    imagen.classList.add("imagenClima");
    imagen.src = `https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`;
    imagen.alt = clima.weather[0].description;

    //Creo la temperatura
    const temperatura = document.createElement("p");
    temperatura.classList.add("temperatura");
    temperatura.textContent = `${clima.main.temp} °C`;

    //Creo sensacion termica
    const sensacion = document.createElement("p");
    sensacion.classList.add("sensacion");
    sensacion.textContent = `Sensación termica: ${clima.main.feels_like} °C`;


    //Creo la descripcion del clima
    const descripcion = document.createElement("p");
    descripcion.classList.add("descripcionClima");
    const descripcionClima = clima.weather[0].description;
    descripcion.textContent = descripcionClima.charAt(0).toUpperCase() + descripcionClima.slice(1);

    //Creo div para humedad y viento
    const divHumedadViento = document.createElement("div");
    divHumedadViento.classList.add("contenedorHumedadViento");

    //Creo el div para la humedad
    const divHumedad = document.createElement("div");
    divHumedad.classList.add("contenedorHumedad");

    //Creo la humedad
    const textoHumedad = document.createElement("p");
    textoHumedad.textContent = "Humedad";

    const humedad = document.createElement("p");
    humedad.classList.add("humedad");
    humedad.textContent = `💧${clima.main.humidity}%`;

    //Creo el div para el viento
    const divViento = document.createElement("div");
    divViento.classList.add("contenedorViento");

    //Creo el viento
    const textoViento = document.createElement("p");
    textoViento.textContent = "Viento";

    const viento = document.createElement("p");
    viento.classList.add("viento");
    viento.textContent = `💨${(clima.wind.speed * 3.6).toFixed(1)} k/h`;

    const hr = document.createElement("hr");


    divNombre.appendChild(nombrePais);
    divTempSensacion.appendChild(temperatura);
    divTempSensacion.appendChild(sensacion);
    divImagenTemp.appendChild(imagen);
    divImagenTemp.appendChild(divTempSensacion);

    divHumedad.appendChild(textoHumedad);
    divHumedad.appendChild(humedad);

    divViento.appendChild(textoViento);
    divViento.appendChild(viento);

    divHumedadViento.appendChild(divHumedad);
    divHumedadViento.appendChild(divViento);

    divImagenTempDescripcion.appendChild(divImagenTemp);
    divImagenTempDescripcion.appendChild(descripcion);

    divGeneral.appendChild(divNombre);
    divGeneral.appendChild(hr);
    divGeneral.appendChild(divImagenTempDescripcion);
    divGeneral.appendChild(divHumedadViento);

    resultado.appendChild(divGeneral);
}
