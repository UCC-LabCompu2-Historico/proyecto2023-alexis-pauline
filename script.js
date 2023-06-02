/**
 •     * Descripción de que hace la función
 •     * @method afficherMessageErreur
 •     * @param {string} nomDuChamp - Explicación de que valor almacena ParámetroA
 •     * @param {number} ParámetroB - Explicación de que valor almacena ParámetroB
 •     * @return Valor que retorna
 •     */

let val = "";
let nom = "";

function afficherMessageErreur() {
    nom = document.getElementById("nomDuChamp");
    let messageErreur = document.getElementById("messageErreur");
    if (nom.value === "") {
        messageErreur.style.display = "block";
    } else {
        val = document.querySelector('input[name="tema"]:checked');
        window.location.href = "reja.html";
    }
}

/**
 •     * Descripción de que hace la función
 •     * @method Nombre de la función
 •     * @param {string} ParámetroA - Explicación de que valor almacena ParámetroA
 •     * @param {number} ParámetroB - Explicación de que valor almacena ParámetroB
 •     * @return Valor que retorna
 •     */

function retourMenu() {
    window.location.href = "index.html";
}

/**
 •     * Descripción de que hace la función
 •     * @method Nombre de la función
 •     * @param {string} ParámetroA - Explicación de que valor almacena ParámetroA
 •     * @param {number} ParámetroB - Explicación de que valor almacena ParámetroB
 •     * @return Valor que retorna
 •     */

function dessinerCanvas() {

    // Variables locales
    var canvas = document.getElementById('gameCanvas');
    var context = canvas.getContext('2d');
    var nombreTours = document.getElementById("nombreTours");

    var cardWidth = 80;
    var cardHeight = 80;
    var cardSpacing = 20;
    var numRows = 3;
    var numCols = 8;
    var selectedCards = [];
    var matchedCards = [];
    var cards;
    var turns = 0;

    if (val === "a") {
        cards = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐯', '🦁', '🐮', '🐷'];
    } else if (val === "b") {
        cards = ['🔵', '🟠', '🟡', '🟢', '🔴', '🟣', '🟤', '⚫️', '⚪️', '🟠', '🔵', '🟢'];
    } else {
        cards = ['🍎', '🍓', '🍌', '🍊', '🍇', '🍏', '🍉', '🍐', '🍑', '🍒', '🍍', '🥝'];
    }

    var shuffledCards = shuffle(cards.concat(cards));

    //chronomètre
    var timerId; // Identifiant du chronomètre
    var startTime; // Heure de départ du chronomètre
    var elapsedTime = 0; // Temps écoulé depuis le démarrage du chronomètre

// Mélange le tableau de cartes
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

// Dessine une carte sur le canvas
    function drawCard(x, y, value, visible) {
        context.fillStyle = visible ? '#fff' : '#000';
        context.fillRect(x, y, cardWidth, cardHeight);
        if (visible) {
            context.fillStyle = '#000';
            context.font = '40px Arial';
            context.fillText(value, x + cardWidth / 2, y + cardHeight / 2 + 15);
        }
    }

// Dessine le plateau de jeu
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

// Gère le clic sur une carte
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
                        alert('Félicitations ' + nom + '! \nVous avez terminé le jeu en ' + turns.toString() + ' tours.\n\nRejouez en changeant de thème!');
                    }
                }, 1000);

            }
        }
    }

// Ajoute un gestionnaire d'événement pour le clic sur le canvas
    canvas.addEventListener('click', handleClick);

// Dessine le plateau de jeu initial
    drawBoard();




// Fonction pour mettre à jour le chronomètre
    function updateTimer() {
        var timer = document.getElementById("timer");
        var currentTime = new Date().getTime();
        var deltaTime = currentTime - startTime + elapsedTime;

        var hours = Math.floor(deltaTime / (1000 * 60 * 60));
        var minutes = Math.floor((deltaTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((deltaTime % (1000 * 60)) / 1000);

        timer.textContent = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);

    }

// Fonction pour formater les chiffres du chronomètre avec un zéro devant si nécessaire
    function formatTime(time) {
        return time < 10 ? "0" + time : time;
    }

// Fonction d'activation automatique du chronomètre
    function startAutomaticTimer() {
        startTime = new Date().getTime();
        timerId = setInterval(updateTimer, 1000);
    }

// Appel de la fonction d'activation automatique du chronomètre
    startAutomaticTimer();

}




