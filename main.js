var cards = [];
var player_numbers = [];

//Start of the game
function initGame() {
    clearTable();

    var tmp = [];
    for (i = 0; i < 52; i++) {
        tmp.push(i);
    }

    var len = 52;
    cards = [];
    while(len) {
        cards.push(tmp.splice(Math.floor(Math.random()*len--),1));
    }

    //render two cards to the player
    //The first number in the array is scored, the second number is calculated with A as 11
    player_numbers = [0, 0];
    drawCard();
    drawCard();
}


function conv_cards(num) {
    //Decide card type
    var kinds = ['dyer', 'spade', 'heart', 'clover'];
    return [kinds[Math.floor(num / 13)], (num % 13 + 1)];
}

//render cards
function drawCard() {
    var number = cards.pop();
    var card= conv_cards(number);
    var root = document.getElementById('player');
    var element = document.createElement('span');
    drawTrump(element, card[0], card[1]);
    root.appendChild(element);

    calc(player_numbers, card[1]);

    if (player_numbers[0] > 21) {
        var root = document.getElementById('message');
        root.innerHTML = "player burst";
        root = document.getElementById('drawCard');
        root.disabled = true;
        root = document.getElementById('finGame');
        root.disabled = true;
    }
}

//calculation
function calc(numbers, number) {
    //add numbers
    switch(number) {
        case 1:
            numbers[0] += 11;
            numbers[1] += 1;
            break;
        case 11:
        case 12:
        case 13:
            numbers[0] += 10;
            break;
        default:
            numbers[0] += number;
            break;
    }

    //If it exceeds 21, subtract 1 if it subtracts 1
    if (numbers[0] > 21 && numbers[1] > 0) {
        numbers[0] -= 10;
        numbers[1] -= 1;
    }
}


//End of game · Dealer draw starts
function finGame() {
    var dealer_numbers = [0, 0];

    while(true) {
        var number = cards.pop();
        var card= conv_cards(number);
        var root = document.getElementById('dealer');
        var element = document.createElement('span');
        drawTrump(element, card[0], card[1]);
        root.appendChild(element);

        calc(dealer_numbers, card[1]);

        if (dealer_numbers[0] > 21) {
            var root = document.getElementById('message');
            root.innerHTML = "Dealer burst";
            root = document.getElementById('drawCard');
            root.disabled = true;
            root = document.getElementById('finGame');
            root.disabled = true;
            return;
        } else if (dealer_numbers[0] > 16){
            break;
        }
    }

    var msg = "Player wins";

    if (player_numbers[0] < dealer_numbers[0]) {
        msg = "Dealer wins";
    } else if (player_numbers[0] < dealer_numbers[0]) {
        msg = "draw";
    }

    var root = document.getElementById('message');
    root.innerHTML = msg;
    root = document.getElementById('drawCard');
    root.disabled = true;
    root = document.getElementById('finGame');
    root.disabled = true;

}

function clearTable() {
    var root = document.getElementById('player');
    var child;
    while(child = root.firstChild) {
        root.removeChild(child);
    }

    root = document.getElementById('dealer');
    while(child = root.firstChild) {
        root.removeChild(child);
    }

    root = document.getElementById('message');
    root.innerHTML = "";

    root = document.getElementById('drawCard');
    root.disabled = false;
    root = document.getElementById('finGame');
    root.disabled = false;
}


//Trumpcards
function drawTrump(root, kind, number) {
    var card = Raphael(root, 150, 200);

    //Draw border
    var rect = card.rect(0, 0, 150, 200);

    //fill color
    rect.attr("fill", "none");
    //black border
    rect.attr("stroke", "bluck");
    //border bold
    rect.attr("stroke-width", "5");

    //show the card
    switch (kind) {
        case 'dyer': drawDyer(card); break;
        case 'clover': drawClover(card); break;
        case 'heart': drawHeart(card); break;
        case 'spade': drawSpade(card);break;
    }

    //Number of the card to be displayed

    var disp_number = number;
    switch (number) {
        case 1: disp_number = "A"; break;
        case 11: disp_number = "J"; break;
        case 12: disp_number = "Q"; break;
        case 13: disp_number = "K"; break;
    }


    var number_text = card.text(135, 180, disp_number);
    number_text.attr("font-size", "90");
    number_text.attr("text-anchor", "end");
}

//Drawing a diamond
function drawDyer(card) {
    var dyer = card.path("M50 10 L10 60 L50 110 L90 60");
    dyer.attr("fill", "red");
    dyer.attr("stroke", "none");
}

//drawing Clover
function drawClover(card) {
    var st = card.set();
    st.push(
        card.circle(50, 30, 17),
        card.circle(30, 60, 17),
        card.circle(70, 60, 17),
        card.path("M50 40 L40 100 L60 100")
    );
    st.attr({fill: "bluck"});
}

//drawing hart
function drawHeart(card) {
    var st = card.set();
    st.push(
        card.path("M20 70 A20 25 0 1 1 50 40 A20 25 0 1 1 80 70 L50 110 Z")
    );
    st.attr({fill: "red", stroke : "none"});
}

//Drawing of spades
function drawSpade(card) {
    var st = card.set();
    st.push(
        card.path("M15 50 A20 20 0 1 0 50 70 A20 20 0 1 0 85 50 L50 10 Z"),
        card.path("M50 60 L40 100 L60 100")
    );
    st.attr({fill: "bluck"});
}
