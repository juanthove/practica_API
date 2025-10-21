const apiWeather = "https://api.openweathermap.org/data/2.5/weather";
const apiLocation = "http://api.openweathermap.org/geo/1.0/direct";
const apiCountry = "https://restcountries.com/v3.1/";

const apiKey = "631b42d3e508302042423318acbb2c34";

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

    //Creo el div para el nombre e imagen
    const divNombreImagen = document.createElement("div");
    divNombreImagen.classList.add("contenedorNombreImagen");

    //Creo el nombre y pais de la ciudad
    const nombrePais = document.createElement("p");
    nombrePais.classList.add("nombreCiudad");
    nombrePais.textContent = `${clima.name}, ${pais}`;

    //Creo la imagen y le doy clases
    const imagen = document.createElement("img");
    imagen.classList.add("imagenClima");
    imagen.src = `https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png`;
    imagen.alt = clima.weather[0].description;


    //Creo el div para la temperatura y la descripción
    const divTemperaturaDescripcion = document.createElement("div");
    divTemperaturaDescripcion.classList.add("contenedorTemperaturaDescripcion");

    //Creo la temperatura minima
    const temperaturaMin = document.createElement("p");
    temperaturaMin.classList.add("temperaturaMin");
    temperaturaMin.textContent = `↓${clima.main.temp_min}°C`;

    //Creo la temperatura maxima
    const temperaturaMax = document.createElement("p");
    temperaturaMax.classList.add("temperaturaMax");
    temperaturaMax.textContent = `↑${clima.main.temp_max}°C`;

    //Creo la descripcion del clima
    const descripcion = document.createElement("p");
    descripcion.classList.add("descripcionClima");
    const descripcionClima = clima.weather[0].description;
    descripcion.textContent = descripcionClima.charAt(0).toUpperCase() + descripcionClima.slice(1);
    

    divNombreImagen.appendChild(nombrePais);
    divNombreImagen.appendChild(imagen);

    divTemperaturaDescripcion.appendChild(temperaturaMin);
    divTemperaturaDescripcion.appendChild(temperaturaMax);
    divTemperaturaDescripcion.appendChild(descripcion);

    divGeneral.appendChild(divNombreImagen);
    divGeneral.appendChild(divTemperaturaDescripcion);

    resultado.appendChild(divGeneral);
}
