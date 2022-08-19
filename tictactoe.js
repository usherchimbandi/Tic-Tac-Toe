const submit = document.querySelector('.submit-details');
const restart = document.querySelector('.restart');
let SUBMIT_BUTTON_PRESSED = false;

// -------------------------------------WHAT HAPPENS AFTER THE SUBMIT BUTTON IS CLICKED----------------------------------------------------------------------------------------

submit.addEventListener('click', submitted);


// -----------------------------------------------------FUNCTION FOR WHAT HAPPENS AFTER SUBMIT BUTTON IS CLICKED----------------------------------------------
function submitted() {
    submit.style.display = 'none';
    restart.style.display = 'block';
    SUBMIT_BUTTON_PRESSED = true;

    const input = document.querySelector('#player1-name');
    const input2 = document.querySelector('#player2-name');

    const Allplayers = players(input.value, input2.value); 
    const player1 = Allplayers.player1;
    const player2 = Allplayers.player2;


    const turn = turn_creation();
    turn.whos_turn = player1;

    restart.addEventListener('click', e => {
        submit.style.display = 'block';
        restart.style.display = 'none';
        restart_game(player1, player2);
        turn.whos_turn = player1;
    });

    inputs();   // makes the inputs uneditable and changes their background color
    const h2 = document.querySelector('h2');
    h2.textContent = `Turn:  ${player1.name}`;


    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block) => {
        block.addEventListener('click', e => {
            if(SUBMIT_BUTTON_PRESSED) {
                /* For some reason, the player1.name and player2.name values change to the first original values when i play another game with different names, that's why I am 
                changing them here. When they change, the turn.second_player object also changes. */
                player1.name = input.value;
                player2.name = input2.value;

                if(block.getAttribute('data-status') == 'active') {  // 'active' means the block hasn't been clicked on

                    block.setAttribute('data-status', 'inactive'); // 'inactive' means the block has been clicked on
                    // We can only click a block that has a status of 'active'
                    if(turn.whos_turn == player1)  h2.textContent = `Turn:  ${player2.name}`;
                    else h2.textContent = `Turn:  ${player1.name}`;


                    const block_value = Number(block.getAttribute('value'));
                    turn.whos_turn.arr.push(block_value); // pushes the value of the block clicked on by the player to that player's personal array

                    block.textContent = turn.their_type; // shows either the o or x on the board/block 
                    gameboardModule.gameboard.push(turn.their_type); // a mutual array for both players that tracks all x's and o's made

                    const a = check(turn.whos_turn.arr); // Checks if the current move played wins the game for the player. Checks for 3 in a row

                    if((typeof a) == 'object') {  // If there's a winner(that's what this if statement is saying)
                        winner(turn.whos_turn.name);
                        player1.arr = [];
                        player2.arr = [];
                    } else {
                        if(gameboardModule.gameboard.length == 9 && (typeof a) !== 'object') {
                            tie();
                            turn.whos_turn = player1;
                            player1.arr = [];
                            player2.arr = [];
                        } 
                        else if(turn.whos_turn == player1) turn.whos_turn = player2;
                        else turn.whos_turn = player1;                 
                    }
                }
            }
        });
    });
}



// ----------------------------------------GAMEBOARD MODULE-------------------------------------------------------------------------------------

const gameboardModule = (function(){
    return {
        gameboard: []
    }
})()


// -----------------------------------------PLAYER CREATION FACTORY FUNCTION------------------------------------------------------------------------------------

const players = function(player1, player2) {
    return {
        player1: {
            name: player1,
            type: 'x',
            arr: []
        },
        player2: {
            name: player2,
            type: 'o',
            arr: []
        }
    }
}

// ---------------RETURN AN OBJECT THAT DECIDES WHO'S TURN IT IS TO PLAY AND MAKES BOTH PLAYER OBJECTS ACCESSIBLE INSIDE THIS OBJECT-----------------------------

function turn_creation() {
    return {
        whos_turn: undefined,
        get their_type() {
            return this.whos_turn.type;
        }
    }


}





// ------------------------------FUNCTION TO MAKE INPUTS UNEDITABLE AND ALSO CHANGES THE BACKGROUNd COLOR OF THE INPUTS-------------------------

function inputs() {
    const input = document.querySelector('#player1-name');
    const input2 = document.querySelector('#player2-name');

    input.setAttribute('readonly', 'readonly');
    input.style.backgroundColor = '#999';
    input.style.borderColor = '#999';

    input2.setAttribute('readonly', 'readonly');
    input2.style.backgroundColor = '#999';
    input2.style.borderColor = '#999';

}

// -----------------------------FUNCTION TO MAKE INPUTS EDITABLE AGAIN AND ALSO CHANGES THE BACKGROUNd COLOR OF THE INPUTS-------------------------

function input_off() {
    const input = document.querySelector('#player1-name');
    const input2 = document.querySelector('#player2-name');

    input.removeAttribute('readonly');
    input.style.backgroundColor = 'white';
    input.style.borderColor = 'white';

    input2.removeAttribute('readonly');
    input2.style.backgroundColor = 'white';
    input2.style.borderColor = 'white';

}

// ----------------------------------------FUNCTION TO CHECK FOR 3 IN A ROW-------------------------------------------------------------------------------------


/* 
This function is executed every time a move is made, but it only takes effect when each player's array reaches 3 elements.
This function combines all the 3 number combinations possible for each of the player's arrays and adds them to the new_arr array. This function
is ran every time each player makes a move but only after that specific player's array has reached 3 elements.
e.g: If a player has made 4 moves and the game is still not over, this function will take all the 3 number combinations and check to see if 
one of them is the winningg combination that wins the game for the player.
*/
function check(arr) {
    const ops = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]]
    const new_arr = [];
    if(arr.length >= 3) {
        for(let i = 0; i < arr.length; i++) {
            for(let j = 0; j < 6; j++) {
                const arr2 = [];
                while(arr2.length != 3) {
                    random_num = arr[Math.floor((Math.random() * arr.length))]
                    if(!arr2.includes(random_num)) arr2.push(random_num)
                }
                new_arr.push(arr2);
            }
        }





        /* HERE IS AN EXPLANATION OF THE CODE BELOW
        First we loop through new_arr which is an array that has multiple 3-length arrays in it. These arrays are all the 3-number combinations
        present in the player-specific arrays which may have more than 3 elements in them.
        In each iteration of the new_arr, we sort the current array in order from smallest to largest.
        Then we loop through the ops array which is an array that has all the winning combinations possible in a tic tac toe game with 9 blocks.
        And lastly, we compare the current iteration of new_arr to each array inside the ops array to check if they are identical.
        If they are identical, then it means that the current iteration of new_arr, is the winning combination, and then whichever player
        is responsile for that combination, wins the game. We then return that combination
        */
       
        for(let i = 0; i < new_arr.length; i++) {
            const sorted = new_arr[i].sort((a, b) => a - b); //[4, 5, 6]
            for(let j = 0; j < ops.length; j++){ // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]]
                if(sorted[0] == ops[j][0] && sorted[1] == ops[j][1] && sorted[2] == ops[j][2]){
                    return sorted;
                }
            }
        }
    }
}


// -------------------------------------------FUNCTION TO CREATE BACKGROUND OVERLAY----------------------------------------------------------------------------------

function winner(player) {
    SUBMIT_BUTTON_PRESSED = false;
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".text").textContent = `${player} HAS WON!`
    let btn = document.querySelector(".bbtn")
    btn.addEventListener('click', e => {    
        submit.style.display = 'block';
        restart.style.display = 'none'; 
        off();

        input_off();

        reset_blocks_and_array();

    });
}

// -------------------------------------------FUNCTION TO REMOVE BACKGROUND OVERLAY----------------------------------------------------------------------------------

  
function off() {
    document.querySelector(".overlay").style.display = "none";
}

// --------------------------------------FUNCTION TO CREATE BACKGROUND OVERLAY OF A TIED GAME----------------------------------------------------------------------------------


function tie() {
    SUBMIT_BUTTON_PRESSED = false;
    document.querySelector(".overlay").style.display = "block";
    document.querySelector(".text").textContent = `IT'S A TIE`;
    let btn = document.querySelector(".bbtn")
    btn.addEventListener('click', e => { 
        submit.style.display = 'block';
        restart.style.display = 'none';
        off();

        input_off();

        reset_blocks_and_array();

    });
}

// -------------------------------------------FUNCTION TO RESET ALL BLOCKS AND THE GAMEBOARD ARRAY----------------------------------------------------------------------------------


function reset_blocks_and_array() {
    const blocks = document.querySelectorAll('.block');
        blocks.forEach((block) => {
            block.textContent = '';
            block.setAttribute('data-status', 'active');
        });
        document.querySelector('h2').textContent = '';
        gameboardModule.gameboard = [];
}


function restart_game(p1, p2) {
    SUBMIT_BUTTON_PRESSED = false;
    input_off();
    p1.arr = [];
    p2.arr = [];
    const blocks = document.querySelectorAll('.block');
        blocks.forEach((block) => {
            block.textContent = '';
            block.setAttribute('data-status', 'active');
        });
        document.querySelector('h2').textContent = '';
        gameboardModule.gameboard = [];
}
// -----------------------------------------------------------------------------------------------------------------------------




class Person{
    constructor(name, age) {
        this.name = name;
        this.age = age
    }
    get details() {
        return (`My name is ${this.name} and I am ${this.age}`)
    }
}


let p1 = new Person('amo', 18);