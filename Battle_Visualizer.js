import initialData from './Battles/Battle_1.json' with { type: 'json' };

let data = initialData;
let fileName = 'Battle_1.json';

let C1_data = data.Combatants.C_1;
let C2_data = data.Combatants.C_2;
let record = data.Rounds;
const arena = document.getElementById("Arena");
const movementLayer = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
);
const C1_display = createCombatant("C_1", C1_data.Name);
const C2_display = createCombatant("C_2", C2_data.Name);
const PIXELS_PER_FOOT = 4;

let curr_record_num = 0;
let is_playing = false;
let timer = null;

// Buttons -------
const start_button = document.getElementById('StartButton');
const next_button = document.getElementById('NextButton');
const play_button = document.getElementById('PlayPauseButton');
const back_button = document.getElementById('BackButton');
const end_button = document.getElementById('EndButton');
const submit_button = document.getElementById('ChooseFighters');

// Bars -------
const C1_HP_Bar = document.getElementById('hpBar1');
const C1_ST_Bar = document.getElementById('stBar1');
const C1_OP_Bar = document.getElementById('opBar1');
const C2_HP_Bar = document.getElementById('hpBar2');
const C2_ST_Bar = document.getElementById('stBar2');
const C2_OP_Bar = document.getElementById('opBar2');

// Values ------
const speed = document.getElementById('nextSpeed');
const C1_HP = document.getElementById('hpBarText1');
const C1_ST = document.getElementById('stBarText1');
const C1_OP = document.getElementById('opBarText1');
const C2_HP = document.getElementById('hpBarText2');
const C2_ST = document.getElementById('stBarText2');
const C2_OP = document.getElementById('opBarText2');
const fighter1 = document.getElementById('c1');
const fighter2 = document.getElementById('c2');

movementLayer.id = "movementLayer";
movementLayer.setAttribute("viewBox", "0 0 400 400");   // create space for movement of characters

arena.appendChild(movementLayer);

const battleLogs = [    // all possible battle matchups and their files
  {
    "C1": "Strov",
    "C2": "Aegis",
    "File": "Battle_1.json"
  },
  {
    "C1": "Strov (Hybrid)",
    "C2": "Aegis",
    "File": "Battle_2.json"
  },
  {
    "C1": "Strov (Bison)",
    "C2": "Aegis",
    "File": "Battle_3.json"
  },
  {
    "C1": "Tsukiko",
    "C2": "Aegis",
    "File": "Battle_4.json"
  },
  {
    "C1": "Iyashi",
    "C2": "Aegis",
    "File": "Battle_5.json"
  },
  {
    "C1": "Rhana",
    "C2": "Aegis",
    "File": "Battle_6.json"
  },
  {
    "C1": "Rhana (Water)",
    "C2": "Aegis",
    "File": "Battle_7.json"
  },
  {
    "C1": "Rocky",
    "C2": "Aegis",
    "File": "Battle_8.json"
  },
  {
    "C1": "Strov",
    "C2": "Tsukiko",
    "File": "Battle_9.json"
  },
  {
    "C1": "Strov (Hybrid)",
    "C2": "Tsukiko",
    "File": "Battle_10.json"
  },
  {
    "C1": "Strov (Bison)",
    "C2": "Tsukiko",
    "File": "Battle_11.json"
  },
  {
    "C1": "Iyashi",
    "C2": "Tsukiko",
    "File": "Battle_12.json"
  },
  {
    "C1": "Rhana",
    "C2": "Tsukiko",
    "File": "Battle_13.json"
  },
  {
    "C1": "Rhana (Water)",
    "C2": "Tsukiko",
    "File": "Battle_14.json"
  },
  {
    "C1": "Rocky",
    "C2": "Tsukiko",
    "File": "Battle_15.json"
  },
  {
    "C1": "Strov",
    "C2": "Iyashi",
    "File": "Battle_16.json"
  },
  {
    "C1": "Strov (Hybrid)",
    "C2": "Iyashi",
    "File": "Battle_17.json"
  },
  {
    "C1": "Strov (Bison)",
    "C2": "Iyashi",
    "File": "Battle_18.json"
  },
  {
    "C1": "Rhana",
    "C2": "Iyashi",
    "File": "Battle_19.json"
  },
  {
    "C1": "Rhana (Water)",
    "C2": "Iyashi",
    "File": "Battle_20.json"
  },
  {
    "C1": "Rocky",
    "C2": "Iyashi",
    "File": "Battle_21.json"
  },
  {
    "C1": "Strov",
    "C2": "Rhana",
    "File": "Battle_22.json"
  },
  {
    "C1": "Strov (Hybrid)",
    "C2": "Rhana",
    "File": "Battle_23.json"
  },
  {
    "C1": "Strov (Bison)",
    "C2": "Rhana",
    "File": "Battle_24.json"
  },
  {
    "C1": "Rocky",
    "C2": "Rhana",
    "File": "Battle_25.json"
  },
  {
    "C1": "Strov",
    "C2": "Rhana (Water)",
    "File": "Battle_26.json"
  },
  {
    "C1": "Strov (Hybrid)",
    "C2": "Rhana (Water)",
    "File": "Battle_27.json"
  },
  {
    "C1": "Strov (Bison)",
    "C2": "Rhana (Water)",
    "File": "Battle_28.json"
  },
  {
    "C1": "Rocky",
    "C2": "Rhana (Water)",
    "File": "Battle_29.json"
  },
  {
    "C1": "Strov",
    "C2": "Rocky",
    "File": "Battle_30.json"
  },
  {
    "C1": "Strov (Hybrid)",
    "C2": "Rocky",
    "File": "Battle_31.json"
  },
  {
    "C1": "Strov (Bison)",
    "C2": "Rocky",
    "File": "Battle_32.json"
  }
];

displayMessage();
matchupNames();

function matchupNames() {   // finds all matchups and updates values in dropdown for matchups
    fighter2.innerHTML = '';  // clear options from fighter2 list
    for(let i=0; i < battleLogs.length; i++) {    // for values from i = 0 to i = length of "battleLogs"...
        if(battleLogs[i].C1 == fighter1.value) {    // if "fighter1" value matches "C1" at the current index of "battleLogs"...
            let name = battleLogs[i].C2;              
            fighter2.add(new Option(name, name));   // add "C2" value to "fighter2" list
        }
        else if(battleLogs[i].C2 == fighter1.value) { // if "fighter1" value matches "C2" at the current index of "battleLogs"...
            let name = battleLogs[i].C1;
            fighter2.add(new Option(name, name));     // add "C1" value to "fighter2" list
        }
    }
}

function startButton() {    // go back to first record
    curr_record_num = 0;  // set record index to 0 (beginning of the record)
    displayMessage();
}

function nextButton() {     // go to next record
    if (curr_record_num < record.length -1) {   // if the current index is before the end of the record...
        curr_record_num += 1;   // go to the next index
        displayMessage();
    }
}

function playButton() {     // play or pause
    if (is_playing) {   // if it's currently playing...
        Pause();          // pause it
    }
    else {              // otherwise...
        Play();           // play it
    }
}

function backButton() {     // show previous record
    if (curr_record_num > 0) {  // if the index is after the beginning...
        curr_record_num -= 1;     // go to the previous index
        displayMessage();
    }
}

function endButton() {      // show final record
    curr_record_num = record.length - 1;  // set index to final entry
    displayMessage();
}

function displayMessage() {     // display message for record
    document.getElementById("description").textContent = record[curr_record_num].Message;   // set text content of "description" to current record's message
    displayArena(); 
    updateBars();
}

function Play() {   // show all records in sequence
  let delay = 1000 / speed.value;   // Default delay is 1 second. "Speed" value determines how much faster or slower it goes.
    if(is_playing) return;  // if it's playing, don't do anything.
    if(curr_record_num >= record.length - 1) {  // if the record is at/past the end...
        curr_record_num = 0;    // reset the record to the beginning
        displayMessage();
    }
    is_playing = true;
    play_button.textContent = "Pause";  // change the "Play" button's text to "Pause"
    timer = setInterval(() => {   // this part will repeat the next portion of code
        if(curr_record_num >= record.length - 1) {  // if the record is at/past the end...
            Pause();  // pause the record
            return;   // break out of the loop
        }
        curr_record_num += 1;   // go to the next record
        displayMessage();
    }, delay)
}

function Pause() {  // pause record playing
    is_playing = false;
    clearInterval(timer);   // stop the "setInterval" in the "Play" function
    timer = null;           // clears the "timer" from the "Play" function
    play_button.textContent = "Play";   // set the text in the "Pause" button to "Play"
}

function createCombatant(id, name) {    // show a combatant in the arena (takes in "id" and "name", returns an object including "dot" and "label")
    const dot = document.createElement("div");  // creates an element for a dot in the document
    dot.className = "combatant";  // give the dot the "combatant" class name
    dot.id = id;  // set its id to the value given when the function is called

    const label = document.createElement("div");  // create an element for a label in the document
    label.className = "combatant-label";  // give the label the "combatant-label" class name
    label.textContent = name; // set its id to the value given when the function is called

    arena.append(dot, label); // add the dot and the label to "arena"

    return { dot, label}; // returns an object containing "dot" and "label"
}

function updateCombatant(display, position){    // show where a combatant is in the arena (takes in "display" and "position")
    const x = position.X * PIXELS_PER_FOOT;   // determine x position (in pixels) of the combatant in "arena"
    const y = position.Y * PIXELS_PER_FOOT;   // determine y position (in pixels) of the combatant in "arena"

    display.dot.style.left = `${x}px`;  // puts x position for "dot" into css
    display.dot.style.top = `${y}px`;   // puts y position for "dot" into css

    display.label.style.left = `${x}px`;  // puts x position for "label" into css
    display.label.style.top = `${y}px`;   // puts y position for "label" into css
}

function displayArena() {   // update arena with current record
    const current = record[curr_record_num];  // get current record data

    updateCombatant(C1_display, current.C1.Position);   // update the "C1" combatant dot in the arena
    updateCombatant(C2_display, current.C2.Position);   // update the "C2" combatant dot in the arena

    drawMovementHistory();
}

function drawMovementLine(from, to, color) {    // draw a line to represent movement
    if(from.X === to.X && from.Y === to.Y) return;  // if no movement, do nothing

    const line = document.createElementNS(  // creates an element for the line in the document
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute("x1", from.X * PIXELS_PER_FOOT);  // determines the starting "x" position of the line (in pixels)
    line.setAttribute("y1", from.Y * PIXELS_PER_FOOT);  // determines the starting "y" position of the line (in pixels)
    line.setAttribute("x2", to.X * PIXELS_PER_FOOT);    // determines the ending "x" position of the line (in pixels)
    line.setAttribute("y2", to.Y * PIXELS_PER_FOOT);    // determines the ending "y" position of the line (in pixels)

    line.setAttribute("stroke", color);             // set color of the line with css
    line.setAttribute("stroke-width", "3");         // set line width with css
    line.setAttribute("stroke-linecap", "round");   // round the ends of the line

    movementLayer.appendChild(line);                // add the line to the movement layer
}

function drawMovementHistory() {    // if a combatant moved, draw a line to show to/from where
    movementLayer.replaceChildren();  // if there's already a line in the movement layer, replace it

    if (curr_record_num === 0) return;  // if the record is at the beginning, do nothing

    const previous = record[curr_record_num - 1];   // look at the previous record
    const current = record[curr_record_num];        // look at the current record

    if (  // if C1 moved...
        previous.C1.Position.X !== current.C1.Position.X ||
        previous.C1.Position.Y !== current.C1.Position.Y
    ) {
        drawMovementLine(   // draw the line to represent the movement
            previous.C1.Position,
            current.C1.Position,
            "#2678e8"
        );
    }

    if (  // if C2 moved...
        previous.C2.Position.X !== current.C2.Position.X ||
        previous.C2.Position.Y !== current.C2.Position.Y
    ) {
        drawMovementLine(   // draw the line to represent the movement
            previous.C2.Position,
            current.C2.Position,
            "#e04444"
        );
    }
}

function updateBars() {     // updates player values (hp, op, st) and their respective bars
    let curr_record = record[curr_record_num];  // look at current record
    let C1_OP_initial;  // initialize C1_OP_initial (we can't assign it a value yet)
    let C2_OP_initial;  // initialize C1_OP_initial (we can't assign it a value yet)
    let c1HP = Math.max(0, curr_record.C1.HP);  // C1's HP Bar will have a width of 0 if it's negative
    let c1ST = Math.max(0, curr_record.C1.Stamina);   // C1's ST Bar will have a width of 0 if it's negative
    let c2HP = Math.max(0, curr_record.C2.HP);  // C2's HP Bar will have a width of 0 if it's negative
    let c2ST = Math.max(0, curr_record.C2.Stamina);   // C2's ST Bar will have a width of 0 if it's negative

    for(let i = curr_record_num; i >= 0; i--) {   // for all records from now to the beginning...
        if(record[i].Action == 0) {   // if the record's action value is 0...
            C1_OP_initial = record[i].C1.OP;  // record C1's initial OP value
            C2_OP_initial = record[i].C2.OP;  // record C2's initial OP value
            break;  // break out of the for loop
        }
    }

    C1_HP_Bar.style.width = `${c1HP/0.6}%`;                                // set C1's HP bar width using css
    C1_OP_Bar.style.width = `${curr_record.C1.OP*100/C1_OP_initial}%`;                  // set C1's OP bar width using css
    C1_ST_Bar.style.width = `${c1ST*100/C1_data.Initial_Stamina}%`;   // set C1's ST bar width using css
    C2_HP_Bar.style.width = `${c2HP/0.6}%`;                                // set C2's HP bar width using css
    C2_OP_Bar.style.width = `${curr_record.C2.OP*100/C2_OP_initial}%`;                  // set C2's OP bar width using css
    C2_ST_Bar.style.width = `${c2ST*100/C2_data.Initial_Stamina}%`;   // set C2's ST bar width using css

    C1_HP.textContent = `${C1_data.Name} HP: ${curr_record.C1.HP} / 60`;                                // display the value of C1's HP
    C1_OP.textContent = `${C1_data.Name} OP: ${curr_record.C1.OP} / ${C1_OP_initial}`;                  // display the value of C1's OP
    C1_ST.textContent = `${C1_data.Name} ST: ${curr_record.C1.Stamina} / ${C1_data.Initial_Stamina}`;   // display the value of C1's ST
    C2_HP.textContent = `${C2_data.Name} HP: ${curr_record.C2.HP} / 60`;                                // display the value of C2's HP
    C2_OP.textContent = `${C2_data.Name} OP: ${curr_record.C2.OP} / ${C2_OP_initial}`;                  // display the value of C2's OP
    C2_ST.textContent = `${C2_data.Name} ST: ${curr_record.C2.Stamina} / ${C2_data.Initial_Stamina}`;   // display the value of C2's ST
}

async function changeFile() {   // change the file if the user wants to look at a different fight
    // Find the selected matchup, regardless of selection order.
    const matchup = battleLogs.find(({ C1, C2 }) =>
        (C1 === fighter1.value && C2 === fighter2.value) ||
        (C1 === fighter2.value && C2 === fighter1.value)
    );

    // Don't load anything if this matchup doesn't exist.
    if (!matchup) {
        console.error("No battle log exists for this matchup.");
        return;
    }

    // Stop any playback from the previous battle.
    Pause();

    // Fix any missing or invalid filename.
    if (!matchup.File) {
        console.error("No valid file specified for this matchup:", matchup);
        return;
    }

    try {
        // Load and parse the selected JSON file.
        const response = await fetch(
            new URL(`./Battles/${matchup.File}`, import.meta.url)
        );

        if (!response.ok) {
            throw new Error(
                `Failed to load ${matchup.File}: HTTP ${response.status}`
            );
        }

        const newData = await response.json();

        // Update the currently loaded battle.
        data = newData;
        fileName = matchup.File;
        C1_data = data.Combatants.C_1;
        C2_data = data.Combatants.C_2;
        record = data.Rounds;

        // Update the combatant labels.
        C1_display.label.textContent = C1_data.Name;
        C2_display.label.textContent = C2_data.Name;

        // Start the new battle at its first record.
        curr_record_num = 0;
        displayMessage();

        console.log(`Loaded ${fileName}`);
    } catch (error) {
        console.error("Error loading battle:", error);
    }
}

// vv ---- assigning functions to buttons ---- vv
start_button.addEventListener('click', startButton)
next_button.addEventListener('click', nextButton)
play_button.addEventListener('click', playButton)
back_button.addEventListener('click', backButton)
end_button.addEventListener('click', endButton)
submit_button.addEventListener('click', changeFile)
fighter1.onchange = function(){matchupNames()}
