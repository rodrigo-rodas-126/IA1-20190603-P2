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
    }
    
}

function regresionLineal(contenidoCSV){
    console.log("Entrenando Modelo regresionLineal");

    var xTrain = [];
    var yTrain = [];

    var datosProcesar = contenidoCSV.replace(/\r/g, "");
    const filas = datosProcesar.split("\n");
    console.log("Filas ", filas)
    filas.forEach(fila => {
        const [valor1, valor2] = fila.split(";");
        if (!isNaN(valor1) && !isNaN(valor2)) {
            xTrain.push(Number(valor1));
            yTrain.push(Number(valor2));
        }
    });

    var linear = new LinearRegression()
    linear.fit(xTrain, yTrain)
    yPredict = linear.predict(xTrain)
    document.getElementById("log").innerHTML+='<br>X Train:   '+xTrain+'<br>Y Train:   '+yTrain+'<br>Y Predict: '+yPredict
    a = joinArrays('x',xTrain,'yTrain',yTrain,'yPredict',yPredict)

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);
}


function guardarSeleccion() {
    const select = document.getElementById('seleccionModelo');
    const opcionSeleccionada = select.value;

    if (opcionSeleccionada) {
        console.log("Opción seleccionada:", opcionSeleccionada);
        localStorage.setItem('modeloSeleccionado', opcionSeleccionada);
        mostrarResultado(`Has seleccionado: ${opcionSeleccionada}`);
    }
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
    const chart = document.getElementById('resultadosGraficos');
    chart.innerHTML = '<div id="chart_div" style="width: 900px; height: 500px;"></div>';
    localStorage.setItem('modeloSeleccionado', null);
}