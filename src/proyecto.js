var datos = ""
var a = ""

function procesarCSV() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const csvContent = e.target.result;
            console.log("Contenido del CSV:", csvContent);
            datos = csvContent;
        };
        reader.readAsText(file);
    } else {
        alert("Por favor, cargue un archivo CSV.");
    }
}

function entrenarModelo() {
    const modelo = localStorage.getItem("modeloSeleccionado");
    console.log("Modelo Seleccionado ", modelo);
    if (datos === "") {
        alert("Por favor, cargue un archivo CSV.")
        return;
    }
    if (modelo === "regresionLineal"){
        regresionLineal(datos);
    } else if (modelo === "regresionPolinomial"){
        regresionPolynomial(datos);
    } else {
        alert("Seleccione un modelo");
        return;
    }
}

function procesarCSVDataLineal(csvdata){
    var xTrain = [];
    var yTrain = [];
    var datosProcesar = csvdata.replace(/\r/g, "");
    const filas = datosProcesar.split("\n");
    console.log("Filas ", filas)
    filas.forEach(fila => {
        const [valor1, valor2] = fila.split(";");
        if (!isNaN(valor1) && !isNaN(valor2)) {
            xTrain.push(Number(valor1));
            yTrain.push(Number(valor2));
        }
    });
    console.log("Datos procesados: ", xTrain, yTrain);
    return {xTrain, yTrain};
}

function regresionLineal(contenidoCSV){
    console.log("Entrenando Modelo regresionLineal");

    var {xTrain, yTrain} = procesarCSVDataLineal(contenidoCSV);
    console.log("Datos recibidos: ", xTrain, yTrain);

    var linear = new LinearRegression()
    linear.fit(xTrain, yTrain)
    yPredict = linear.predict(xTrain)
    mostrarTablaEntrenamiento(xTrain, yTrain, yPredict);

    a = joinArrays('x',xTrain,'yTrain',yTrain,'yPredict',yPredict)

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}

function mostrarTablaEntrenamiento(array1, array2, array3) {
    // Crear tabla de datos de entrenamiento
    const tabla = document.createElement("table");
    tabla.style.borderCollapse = "collapse";
    tabla.style.width = "40%";
    const encabezado = tabla.insertRow();
    const encabezadoCol1 = encabezado.insertCell();
    const encabezadoCol2 = encabezado.insertCell();
    encabezadoCol1.textContent = "X Entrenamiento";
    encabezadoCol2.textContent = "Y Entrenamiento";
    encabezadoCol1.style.border = "1px solid #000";
    encabezadoCol2.style.border = "1px solid #000";
    encabezadoCol1.style.padding = "8px";
    encabezadoCol2.style.padding = "8px";
    encabezadoCol1.style.fontWeight = "bold";
    encabezadoCol2.style.fontWeight = "bold";
    for (let i = 0; i < array1.length; i++) {
        const fila = tabla.insertRow();
        const celda1 = fila.insertCell();
        const celda2 = fila.insertCell();
        celda1.textContent = array1[i];
        celda2.textContent = array2[i];
        celda1.style.border = "1px solid #000";
        celda2.style.border = "1px solid #000";
        celda1.style.padding = "8px";
        celda2.style.padding = "8px";
    }
    document.getElementById("log").appendChild(tabla);
    // Crear tabla de predicciones
    const tablaPrediccion = document.createElement("table");
    tablaPrediccion.style.borderCollapse = "collapse";
    tablaPrediccion.style.width = "40%";
    tablaPrediccion.style.marginTop = "20px";
    const encabezadoPrediccion = tablaPrediccion.insertRow();
    const encabezadoCol1Prediccion = encabezadoPrediccion.insertCell();
    const encabezadoCol2Prediccion = encabezadoPrediccion.insertCell();
    encabezadoCol1Prediccion.textContent = "X";
    encabezadoCol2Prediccion.textContent = "Y-Prediccion";
    encabezadoCol1Prediccion.style.border = "1px solid #000";
    encabezadoCol2Prediccion.style.border = "1px solid #000";
    encabezadoCol1Prediccion.style.padding = "8px";
    encabezadoCol2Prediccion.style.padding = "8px";
    encabezadoCol1Prediccion.style.fontWeight = "bold";
    encabezadoCol2Prediccion.style.fontWeight = "bold";
    for (let i = 0; i < array1.length; i++) {
        const fila = tablaPrediccion.insertRow();
        const celda1 = fila.insertCell();
        const celda2 = fila.insertCell();
        celda1.textContent = array1[i];
        celda2.textContent = array3[i];
        celda1.style.border = "1px solid #000";
        celda2.style.border = "1px solid #000";
        celda1.style.padding = "8px";
        celda2.style.padding = "8px";
    }
    document.getElementById("log").appendChild(tablaPrediccion);
}

function procesarCSVDataPoly(csvdata){
    var xTrain = [];
    var yTrain = [];
    var predictArray = [];
    var datosProcesar = csvdata.replace(/\r/g, "");
    const filas = datosProcesar.split("\n");
    console.log("Filas ", filas)
    filas.forEach(fila => {
        const [valor1, valor2, valor3] = fila.split(";");
        if (!isNaN(valor1) && !isNaN(valor2)) {
            xTrain.push(Number(valor1));
            yTrain.push(Number(valor2));
            predictArray.push(Number(valor3));
        }
    });
    return {xTrain, yTrain, predictArray};
}

function regresionPolynomial(contenidoCSV){
    console.log("Entrenando Modelo regresionPolynomial");
    const gradoInput = document.getElementById('gradoPolinomial');
    var grado = Number(gradoInput.value);

    if (grado < 2 || grado > 4 || !grado) {
        alert("Ingrese un valor de grado valido");
        return;
    }

    var {xTrain, yTrain, predictArray} = procesarCSVDataPoly(contenidoCSV)

    var polynomial = new PolynomialRegression(contenidoCSV);
    polynomial.fit(xTrain, yTrain, grado);
    yPredict = polynomial.predict(predictArray);
    gradoError = polynomial.getError();
    mostrarTablaEntrenamientoPoly(xTrain, yTrain, predictArray, yPredict, grado, gradoError);

    a = joinArrays('x', xTrain, 'yTrain', yTrain, `Prediction Grado ${grado}`, yPredict)

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}


function mostrarTablaEntrenamientoPoly(array1, array2, array3, array4, grado, error) {
    // Crear tabla de datos de entrenamiento
    const tabla = document.createElement("table");
    tabla.style.borderCollapse = "collapse";
    tabla.style.width = "40%";
    const encabezado = tabla.insertRow();
    const encabezadoCol1 = encabezado.insertCell();
    const encabezadoCol2 = encabezado.insertCell();
    const encabezadoCol3 = encabezado.insertCell();
    encabezadoCol1.textContent = "X Entrenamiento";
    encabezadoCol2.textContent = "Y Entrenamiento";
    encabezadoCol3.textContent = "X a Predecir";
    encabezadoCol1.style.border = "1px solid #000";
    encabezadoCol2.style.border = "1px solid #000";
    encabezadoCol3.style.border = "1px solid #000";
    encabezadoCol1.style.padding = "8px";
    encabezadoCol2.style.padding = "8px";
    encabezadoCol3.style.padding = "8px";
    encabezadoCol1.style.fontWeight = "bold";
    encabezadoCol2.style.fontWeight = "bold";
    encabezadoCol3.style.fontWeight = "bold";

    for (let i = 0; i < array1.length; i++) {
        const fila = tabla.insertRow();
        const celda1 = fila.insertCell();
        const celda2 = fila.insertCell();
        const celda3 = fila.insertCell();
        celda1.textContent = array1[i];
        celda2.textContent = array2[i];
        celda3.textContent = array3[i];
        celda1.style.border = "1px solid #000";
        celda2.style.border = "1px solid #000";
        celda1.style.padding = "8px";
        celda2.style.padding = "8px";
        celda3.style.border = "1px solid #000";
        celda3.style.padding = "8px";
    }
    document.getElementById("log").appendChild(tabla);
    // Crear tabla de predicciones
    const tablaPrediccion = document.createElement("table");
    tablaPrediccion.style.borderCollapse = "collapse";
    tablaPrediccion.style.width = "40%";
    tablaPrediccion.style.marginTop = "20px";
    const encabezadoPrediccion = tablaPrediccion.insertRow();
    const encabezadoCol1Prediccion = encabezadoPrediccion.insertCell();
    const encabezadoCol2Prediccion = encabezadoPrediccion.insertCell();
    encabezadoCol1Prediccion.textContent = "X";
    encabezadoCol2Prediccion.textContent = `Y-Prediccion Grado ${grado}`;
    encabezadoCol1Prediccion.style.border = "1px solid #000";
    encabezadoCol2Prediccion.style.border = "1px solid #000";
    encabezadoCol1Prediccion.style.padding = "8px";
    encabezadoCol2Prediccion.style.padding = "8px";
    encabezadoCol1Prediccion.style.fontWeight = "bold";
    encabezadoCol2Prediccion.style.fontWeight = "bold";
    for (let i = 0; i < array1.length; i++) {
        const fila = tablaPrediccion.insertRow();
        const celda1 = fila.insertCell();
        const celda2 = fila.insertCell();
        celda1.textContent = array1[i];
        celda2.textContent = array4[i];
        celda1.style.border = "1px solid #000";
        celda2.style.border = "1px solid #000";
        celda1.style.padding = "8px";
        celda2.style.padding = "8px";
    }
    document.getElementById("log").appendChild(tablaPrediccion);
    const valorError = document.createElement("p");
    valorError.value = error;
    document.getElementById("log").appendChild(valorError);
}


function guardarSeleccion() {
    const select = document.getElementById('seleccionModelo');
    const opcionSeleccionada = select.value;

    if (opcionSeleccionada) {
        console.log("Opción seleccionada:", opcionSeleccionada);
        localStorage.setItem('modeloSeleccionado', opcionSeleccionada);
        mostrarResultado(`Has seleccionado: ${opcionSeleccionada}`);
    }
    toggleInput();
}

function mostrarResultado(contenido) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = `<p>${contenido}</p>`;
}

function drawChart() {
    var data = google.visualization.arrayToDataTable(a);
    var options = {
        seriesType : 'scatter',
        series: {1: {type: 'line'}}
    };  
    var chart = new google.visualization.ComboChart(document.getElementById('resultadosGraficos'));
    chart.draw(data, options);         
}

function clean() {
    const fileInput = document.getElementById('csvFile');
    fileInput.value = "";
    const select = document.getElementById('seleccionModelo');
    select.value = "";
    const resultados = document.getElementById('resultados');
    resultados.innerHTML = ""; 
    const log = document.getElementById('log');
    log.innerHTML = ""; 
    const gradoInput = document.getElementById('gradoPolinomial');
    gradoInput.value = "";
    const chart = document.getElementById('resultadosGraficos');
    chart.innerHTML = '<div id="chart_div" style="width: 900px; height: 500px;"></div>';
    localStorage.setItem('modeloSeleccionado', null);
    toggleInput();
}

function toggleInput() {
    const select = document.getElementById('seleccionModelo');
    const opcionSeleccionada = select.value;
    const inputGrado = document.getElementById("input-grado");
    if (opcionSeleccionada === "regresionPolinomial") {
        inputGrado.style.display = "block";
    } else {
        inputGrado.style.display = "none";
    }
}

toggleInput();