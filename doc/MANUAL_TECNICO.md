# Manual Tecnico - Proyecto 2 IA1
# 201906053 - Jose Rodrigo Rodas Palencia

Este manual proporciona una guía técnica para la aplicacion desarrollada como parte del proyecto 2 del curso de Inteligencia Artificial 1, el codigo fue desarrollado con el lenguaje de Javascript, con el uso de HTML y CSS. Este utiliza la biblioteca TytusJS para entrenamiento de modelos de regresión lineal y multipolinomial. La aplicación permite al usuario cargar un archivo CSV, seleccionar el tipo de modelo y visualizar los resultados de la predicción en tablas y gráficos, usando Google Charts para la generacion de graficas. 

La aplicación consta de las siguientes funciones:

- procesarCSV(): Carga y lee el archivo CSV.
- entrenarModelo(): Controla el flujo de entrenamiento según el modelo seleccionado.
- procesarCSVDataLineal() y procesarCSVDataPoly(): Procesan datos para los modelos de regresión lineal y multipolinomial, respectivamente.
- regresionLineal() y regresionPolynomial(): Entrenan el modelo lineal y el modelo polinomial, respectivamente.
- mostrarTablaEntrenamiento() y mostrarTablaEntrenamientoPoly(): Despliegan en tablas los datos de entrenamiento y predicciones.
- drawChart(): Genera los gráficos de las predicciones.
- guardarSeleccion(): Almacena el modelo seleccionado en el navegador.
- clean() y toggleInput(): Limpian los campos de entrada y alternan la visibilidad de elementos según el modelo.

## Explicacion de Funciones

### Carga y Procesamiento del CSV

El método procesarCSV() permite cargar un archivo CSV, procesar su contenido y almacenarlo en una variable llamada `datos`. La lectura del archivo se realiza mediante FileReader, y se almacena el contenido en texto.

    function procesarCSV() {
        const fileInput = document.getElementById('csvFile');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                datos = e.target.result;
            };
            reader.readAsText(file);
        } else {
            alert("Por favor, cargue un archivo CSV.");
        }
    }

Los archivos CSV deben de llevar las siguientes estrcuturas para los modelos de Regresion Lineal

    XTrain;YTrain
    dato1;dato2
    .
    .
    .
    datoN;datoM

Los archivos deben de llevar las siguientes estrcuturas para los modelos de Regresion Mutipolinomial

    XTrain;YTrain;XToPredict
    dato1;dato2;dato3
    .
    .
    .
    datoN;datoM;datoL

### Selección y Entrenamiento del Modelo

La función entrenarModelo() recupera el modelo guardado en el almacenamiento local y, en base a la selección, ejecuta el entrenamiento con regresionLineal() o regresionPolynomial().

    function entrenarModelo() {
        const modelo = localStorage.getItem("modeloSeleccionado");
        if (datos === "") {
            alert("Por favor, cargue un archivo CSV.");
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

### Procesamiento de Datos para Entrenamiento

Las funciones procesarCSVDataLineal() y procesarCSVDataPoly() preparan los datos de entrenamiento en base al tipo de modelo, limpiando valores extraños y separando los datos en conjuntos xTrain y yTrain.

## Implementación de los Modelos

### Regresión Lineal

regresionLineal() utiliza TytusJS.LinearRegression para entrenar un modelo de regresión lineal. Los datos procesados se utilizan para hacer predicciones (yPredict) y generar una tabla y un gráfico de dispersión con la línea de regresión.

    function regresionLineal(contenidoCSV){
        var {xTrain, yTrain} = procesarCSVDataLineal(contenidoCSV);
        var linear = new LinearRegression();
        linear.fit(xTrain, yTrain);
        yPredict = linear.predict(xTrain);
        mostrarTablaEntrenamiento(xTrain, yTrain, yPredict);
        google.charts.setOnLoadCallback(drawChart);
    }

### Regresión Multipolinomial

regresionPolynomial() permite seleccionar el grado del polinomio mediante un input, y se utiliza TytusJS.PolynomialRegression para realizar el ajuste del modelo. La predicción generada se despliega en una tabla junto con un gráfico.

    function regresionPolynomial(contenidoCSV){
        const gradoInput = document.getElementById('gradoPolinomial');
        var grado = Number(gradoInput.value);
        var {xTrain, yTrain, predictArray} = procesarCSVDataPoly(contenidoCSV);
        var polynomial = new PolynomialRegression();
        polynomial.fit(xTrain, yTrain, grado);
        yPredict = polynomial.predict(predictArray);
        mostrarTablaEntrenamientoPoly(xTrain, yTrain, predictArray, yPredict, grado);
        google.charts.setOnLoadCallback(drawChart);
    }

## Interfaz de Usuario (UI)

La interfaz permite cargar un archivo CSV, seleccionar el tipo de modelo de regresión mediante un select, e ingresar el grado del polinomio para la regresión polinomial.

Mostrar y Ocultar Campo de Grado: La función toggleInput() muestra el campo para seleccionar el grado solo si el modelo seleccionado es de regresión multipolinomial.

    function toggleInput() {
        const select = document.getElementById('seleccionModelo');
        const inputGrado = document.getElementById("input-grado");
        inputGrado.style.display = (select.value === "regresionPolinomial") ? "block" : "none";
    }

    <select id="seleccionModelo" onchange="guardarSeleccion()">
        <option value="">Selecciona una opción</option>
        <option value="regresionLineal">Regresion Lineal</option>
        <option value="regresionPolinomial">Regresion Polinomial</option>
    </select>

    <div class="file-upload">
        <label for="csvFile">Selecciona Archivo:</label>
        <input type="file" id="csvFile" accept=".csv" onchange="procesarCSV()">
    </div>

## Visualización de Resultados

Se utiliza la API de Google Charts para generar gráficos de los datos y predicciones. Que son desplegados en el div de resultados.

    function drawChart() {
        var data = google.visualization.arrayToDataTable(a);
        var options = {
            seriesType : 'scatter',
            series: {1: {type: 'line'}}
        };  
        var chart = new google.visualization.ComboChart(document.getElementById('resultadosGraficos'));
        chart.draw(data, options);         
    }

    <div id="resultadosGraficos" class="resultados">
        <!-- Aquí se insertarán los gráficos o resultados -->
        <div id="chart_div" style="width: 900px; height: 500px;"></div>
    </div>

## Manejo de Errores y Limpieza

Para mejorar la experiencia del usuario, se implementan varias validaciones de entrada, y clean() limpia los elementos de la interfaz y restablece el estado de la aplicación.

    function clean() {
        document.getElementById('csvFile').value = "";
        document.getElementById('seleccionModelo').value = "";
        document.getElementById('resultados').innerHTML = ""; 
        document.getElementById('log').innerHTML = ""; 
        document.getElementById('gradoPolinomial').value = "";
        document.getElementById('resultadosGraficos').innerHTML = '<div id="chart_div" style="width: 900px; height: 500px;"></div>';
        localStorage.setItem('modeloSeleccionado', null);
        toggleInput();
    }
