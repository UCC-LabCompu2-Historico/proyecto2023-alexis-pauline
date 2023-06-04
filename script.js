/**
 •     * mostrar mensaje error y permite ir a la reja de juego
 •     * @method afficherMessageErreur
 •     * @return nada
 •     */
function afficherMessageErreur() {
    const nom = document.getElementById("nomDuChamp").value;
    let messageErreur = document.getElementById("messageErreur");
    if (nom === "") {
        messageErreur.style.display = "block";
    } else {
        const val = document.querySelector('input[name="tema"]:checked').value;
        localStorage.setItem("val", val);
        localStorage.setItem("nom", nom);
        window.location.href = "reja.html";
    }
}

/**
 •     * Permite volver al menu
 •     * @method retourMenu
 •     * @return nada
 •     */
function retourMenu() {
    window.location.href = "index.html";
}

/**
 •     *recuperar los valores val y name almacenados en el localStorage y asignarlos a las variables locales correspondientes.
 •     * @method dessinerCanvas
 •     * @return nada
 •     */
function dessinerCanvas() {
    const val = localStorage.getItem("val");
    const nom = localStorage.getItem("nom");

    // Variables locales
    var canvas = document.getElementById('gameCanvas');
    var context = canvas.getContext('2d');
    var nombreTours = document.getElementById("nombreTours");

    const cardWidth = 80;
    const cardHeight = 80;
    const cardSpacing = 20;
    const numRows = 3;
    const numCols = 8;
    var selectedCards = [];
    var matchedCards = [];
    var cards;
    var turns = 0;

    if (val === "a") {
        cards = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐯', '🦁', '🐮', '🐷'];
    } else if (val === "b") {
        cards = ['🔵',' 🟦 ', '🟨', '🟡', '🟥', '🔴', '🟤', '🟫️', '🟧', '🟠', '🟩 ', '🟢'];
    } else {
        cards = ['🍎', '🍓', '🍌', '🍊', '🍇', '🍏', '🍉', '🍐', '🍑', '🍒', '🍍', '🥝'];
    }

    // mezcla un arreglo de cartas al concatenarlo consigo mismo y luego mezclar el arreglo resultante
    var shuffledCards = shuffle(cards.concat(cards));

    //cronómetro
    var timerId; // Identificador del cronómetro
    var startTime; // Hora de inicio del cronómetro
    var elapsedTime = 0; // Tiempo transcurrido desde el inicio del cronómetro

    /**
     •     * Mezcla las cartas al asar
     •     * @method  function shuffle
     •     * @param {array} - cuadro que se mezclará
     •     * @return Se devuelve el cuadro mixto.
     •     */
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    /**
     •     * Dibujar un mapa en el canvas
     •     * @method drawCard
     •     * @param {number} x - coordenada del lugar donde se dibujará el mapa
     •     * @param {number} y - coordenadas del lugar donde se dibujará el mapa
     •     * @param {number} value - representa el valor de la carta
     •     * @param {boolean} visible - determina si la carta debe ser visible o no.
     •     * @return nada
     •     */
    function drawCard(x, y, value, visible) {
        context.fillStyle = visible ? '#fff' : '#000';
        context.fillRect(x, y, cardWidth, cardHeight);
        if (visible) {
            context.fillStyle = '#000';
            context.font = '40px Arial';
            context.fillText(value, x + cardWidth / 2, y + cardHeight / 2 + 15);
        }
    }

    /**
     •     * Dibuja el tablero de juego
     •     * @method drawBoard
     •     * @return nada
     •     */
    function drawBoard() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (var row = 0; row < numRows; row++) {
            for (var col = 0; col < numCols; col++) {
                var index = row * numCols + col;
                var x = col * (cardWidth + cardSpacing) + cardSpacing;
                var y = row * (cardHeight + cardSpacing) + cardSpacing;

                var card = shuffledCards[index];
                var visible = selectedCards.includes(index) || matchedCards.includes(index);

                drawCard(x, y, card, visible);
            }
        }
    }

    /**
     •     * gestiona los clics  en el canva
     •     * @method handleClick
     •     * @param {MouseEvent} event - el objeto de evento generado cuando se hace clic
     •     * @return nada
     •     */
    function handleClick(event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;

        var col = Math.floor(x / (cardWidth + cardSpacing));
        var row = Math.floor(y / (cardHeight + cardSpacing));

        var index = row * numCols + col;

        if (selectedCards.length < 2 && !selectedCards.includes(index) && !matchedCards.includes(index)) {
            selectedCards.push(index);
            drawBoard();

            if (selectedCards.length === 2) {
                turns++;
                nombreTours.textContent = turns.toString();

                var card1 = shuffledCards[selectedCards[0]];
                var card2 = shuffledCards[selectedCards[1]];

                if (card1 === card2) {
                    matchedCards.push(selectedCards[0]);
                    matchedCards.push(selectedCards[1]);
                }

                selectedCards = [];

                setTimeout(function () {
                    drawBoard();

                    if (matchedCards.length === shuffledCards.length) {
                        clearInterval(timerId);
                        alert('Felicidades ' + nom + ' ! \nHas completado el juego en ' + turns.toString() + ' turnos.\n\nRepetición con otro tema!');
                    }
                }, 1000);
            }
        }
    }

// Añade un controlador de eventos para hacer clic en el canva
    canvas.addEventListener('click', handleClick);

// Dibuja el tablero de juego inicial
    drawBoard();

    /**
     •     * Dactualiza la visualización del cronómetro en tiempo real en la página web
     •     * @method updateTimer
     •     * @return no devuelve nada pero actualiza la pantalla del cronómetro
     •     */
    function updateTimer() {
        var timer = document.getElementById("timer");
        var currentTime = new Date().getTime();
        var deltaTime = currentTime - startTime + elapsedTime;

        var hours = Math.floor(deltaTime / (1000 * 60 * 60));
        var minutes = Math.floor((deltaTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((deltaTime % (1000 * 60)) / 1000);

        timer.textContent = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
    }

    /**
     •     * formatear los dígitos del cronómetro con un cero a la izquierda si es necesario
     •     * @method formatTime
     •     * @param {number} time - Explicación de que valor almacena ParámetroA
     •     * @return string
     •     */
    function formatTime(time) {
        return time < 10 ? "0" + time : time;
    }

    /**
     •     * activación automática del cronómetro
     •     * @method startAutomaticTimer
     •     * @return nada
     •     */
    function startAutomaticTimer() {
        startTime = new Date().getTime();
        timerId = setInterval(updateTimer, 1000);
    }

// Activación de la función de cronómetro automático
    startAutomaticTimer();
}