const inputBox = document.querySelector('.input');
const songContainer = document.querySelector('.songContainer');
const audioFile = document.querySelector('.audioFile');
const audioPlayer = document.querySelector('.audioPlayer');
const playButton = document.querySelector('.playButton');
const dayCounter = document.querySelector('.dayCounter');
const resultContainer = document.querySelector('.resultContainer');
const guessTracker = document.querySelector('.guessTracker');
const progressBar = document.querySelector('.progressBar');
const shareButton = document.querySelector('.shareButton');
const shareMessage = document.querySelector('.shareMessage');
const volumeBar = document.querySelector('.volumeBar');
const resultsButton = document.querySelector('.resultsButton');
const reslts = document.querySelector('.reslts');
const helpContainer = document.querySelector('.helpContainer');
const helpButton = document.querySelector('.helpButton');
//const resultsBar = document.querySelector('.resultsBar');
//const resultsPlayButton = document.querySelector('.resultsPlayButton');
const torinoImage = document.querySelector('.torino');
const body = document.querySelector('body');
const endlessButton = document.querySelector('.endlessButton');
const scoreCounter = document.querySelector('.scoreCounter');
const endlessList = document.querySelector('.endlessList');
const restartButton = document.querySelector('.restartButton');
const information = document.querySelector('.information');
const information1 = document.querySelector('.information1');
const information2 = document.querySelector('.information2');


let guessCount = Number(localStorage.getItem("guessCount")) || 0;
let correctToggle = localStorage.getItem("correctToggle") === "true";
let focusIndex = -1;
let maxStreak = Number(localStorage.getItem("streak")) || 0;;
let currentStreak = 0;
let livesLeft = 5;
let endlessOngoing = false;
let endlessSong = null;

const songList = [
    { name: "Space Colony", file: "space_colony.mp3" },
    { name: "Mushrooms", file: "mushrooms.mp3" },
    { name: "Mitsubachi", file: "mitsubachi.mp3" },
    { name: "Fushicho", file: "fushicho.mp3" },
    { name: "MEN I LOVE", file: "men_i_love.mp3" },
    { name: "Gunners in the Rain", file: "gunners_in_the_rain.mp3" },
   // { name: "Amusement Park", file: "" },
    { name: "Imagined Flight", file: "imagined_flight.mp3" },
    { name: "RTRT", file: "rtrt.mp3" },
    { name: "Birthday Kid", file: "birthday_kid.mp3" },
    { name: "Compass", file: "compass.mp3" },
    { name: "Phantomcat of Meowloween", file: "phantomcat_of_meowloween.mp3" },
// { name: "It's a wonderful world", file: "PLACEHOLDER" },
    { name: "With a Billion Worldful of <3", file: "with_a_billion_worldful_of_heart.mp3" },
    { name: "GIVE ME RICE", file: "give_me_rice.mp3" },
    { name: "Rubber Human", file: "rubber_human.mp3" },
    { name: "Fable", file: "fable.mp3" },
    { name: "Salt, Pepper, Birds, and the Thought Police", file: "salt_pepper_birds_and_the_thought_police.mp3" },
    { name: "To Your Oblivion", file: "to_your_oblivion.mp3" },
    { name: "Let the Maggots Sing", file: "let_the_maggots_sing.mp3" },
    { name: "Utopiosphere", file: "utopiosphere.mp3" },
    { name: "Fossil", file: "fossil.mp3" },
    { name: "Ikutoshitsuki", file: "ikutoshitsuki.mp3" },
    { name: "Mirror Mirror", file: "mirror_mirror.mp3" },
    { name: "Iron Lotus", file: "iron_lotus.mp3" },
    { name: "Dancing Ghost's Ball Jointed Darling", file: "dancing_ghosts_ball_jointed_darling.mp3" },
    { name: "Between Two Worlds", file: "between_two_worlds.mp3" },
    { name: "Ocean Bby", file: "ocean_bby.mp3" },
    { name: "Komm Süsser Tod", file: "komm_susser_tod.mp3" },
    { name: "world.execute(me);", file: "world_execute_me.mp3" },
    { name: "Extension of You", file: "extension_of_you.mp3" },
    { name: "Within", file: "within.mp3" },
    { name: "Bathtub Mermaid", file: "bathtub_mermaid.mp3" },
    { name: "Life We Sow", file: "life_we_sow.mp3" },
    { name: "Gertrauda", file: "gertrauda.mp3" },
    { name: "Fly, My Wings", file: "fly_my_wings.mp3" },
    { name: "Sacramentum: Unaccompanied Hymn for Torino", file: "sacramentum_unaccompanied_hymn_for_torino.mp3" },
    { name: "Bulbel", file: "bulbel.mp3" },
    { name: "Friction", file: "friction.mp3" },
    { name: "Vulnerability", file: "vulnerability.mp3" },
    { name: "Nine Point Eight", file: "nine_point_eight.mp3" },
    { name: "Chocological", file: "chocological.mp3" },
    { name: "1000x1000", file: "1000x1000.mp3" },
    { name: "Grown-up's Paradise", file: "grown_ups_paradise.mp3" },
    { name: "TIE HUA FEI", file: "tie_hua_fei.mp3" },
    { name: "Shitty Flowers", file: "shitty_flowers.mp3" },
    { name: "Opium", file: "opium.mp3" },
    { name: "Duetting Solo", file: "duetting_solo.mp3" },
    // { name: "WHAT ROBOTS NEED", file: "what_robots_need.mp3" },
    { name: "Hero", file: "hero.mp3" },
    { name: "Children of the City", file: "children_of_the_city.mp3" },
    { name: "Bento Box Bivouac", file: "bento_box_bivouac.mp3" },
    { name: "Petrolea", file: "petrolea.mp3" },
    { name: "Through Patches of Violet", file: "through_patches_of_violet.mp3" },
    { name: "Peach Pit and Cyanide", file: "peach_pit_and_cyanide.mp3" },
    { name: "Static", file: "static.mp3" },
    { name: "Red Dahlia", file: "red_dahlia.mp3" },
    { name: "Cerebrite", file: "cerebrite.mp3" },
    { name: "A Turtle's Heart", file: "a_turtles_heart.mp3" },
    { name: "Witch's Invitation", file: "witchs_invitation.mp3" },
    { name: "And Then is Heard No More", file: "and_then_is_heard_no_more.mp3" },
    // { name: "Between Two Worlds (Let's Lament)", file: "between_two_worlds_lets_lament.mp3" },
    { name: "Victim", file: "victim.mp3" },
    { name: "Ephemeral", file: "ephemeral.mp3" },
    { name: "Gluttony", file: "gluttony.mp3" },
    { name: "Rightfully", file: "rightfully.mp3" },
    // { name: "Origin", file: "PLACEHOLDER" },
    { name: "Mortal with You", file: "mortal_with_you.mp3" },
    { name: "Flowerworks", file: "flowerworks.mp3" },
    { name: "Painful Death for the Lactose Intolerant", file: "painful_death_for_the_lactose_intolerant.mp3" },
    { name: "Classroom Dreamer", file: "classroom_dreamer.mp3" },
    { name: "Skin-Deep Comedy", file: "skin_deep_comedy.mp3" },
    { name: "Excalibur", file: "excalibur.mp3" },
    // { name: "In Hell We Live, Lament (Let's Lament)", file: "in_hell_we_live_lament_lets_lament.mp3" },
    { name: "Unidentified Flavourful Object", file: "unidentified_flavourful_object.mp3" },
    { name: "Maroma Samsa", file: "maroma_samsa.mp3" },
    { name: "War of Shame", file: "war_of_shame.mp3" },
    { name: "Process", file: "process.mp3" },
    { name: "My Creator", file: "my_creator.mp3" },
    { name: "Vitamins", file: "vitamins.mp3" },
    { name: "String Theocracy", file: "string_theocracy.mp3" },
    { name: "Poems of a Machine", file: "poems_of_a_machine.mp3" },
    { name: "Year N", file: "year_n.mp3" },
    { name: "Until Our Sky Is Blue", file: "until_our_sky_is_blue.mp3" },
    { name: "What the Ripple Sees", file: "what_the_ripple_sees.mp3" },
   // { name: "Still Alive", file: "" },
    { name: "Lullaby for salvation", file: "lullaby_for_salvation.mp3" },
    { name: "world.search(you);", file: "world_search_you.mp3" },
    { name: "Meatball Submarine", file: "meatball_submarine.mp3" },
    { name: "In Hell We Live, Lament", file: "in_hell_we_live_lament.mp3" },
    { name: "Whiteout", file: "whiteout.mp3" },
    { name: "Milk", file: "milk.mp3" },
    { name: "Lemonade", file: "lemonade.mp3" },
    { name: "Ame to Taieki to Nioi", file: "ame_to_taieki_to_nioi.mp3" },
    { name: "From a Place of Love", file: "from_a_place_of_love.mp3" },
    { name: "Ga1ahad and Scientific Witchery", file: "ga1ahad_and_scientific_witchery.mp3" },
    { name: "Sl0t", file: "sl0t.mp3" },
    { name: "Boys in Kaleidosphere", file: "boys_in_kaleidosphere.mp3" },
    { name: "Not My Paradiso", file: "not_my_paradiso.mp3" },
    { name: "sustain++;", file: "sustain_plus_plus.mp3" },
    { name: "HUA YU", file: "hua_yu.mp3" },
    { name: "TOKYO NEON", file: "tokyo_neon.mp3" },
   // { name: "TOTO Washlet", file: "" },
    { name: "Summoning 101", file: "summoning_101.mp3" },
    { name: "Paper Bouquet", file: "paper_bouquet.mp3" },
    { name: "I Am a Fluff", file: "i_am_a_fluff.mp3" },
    { name: "Gone Angels", file: "gone_angels.mp3" },
    { name: "Holy and Darkness 1", file: "holy_and_darkness_1.mp3" },
    { name: "Sleep Talk Metropolis", file: "sleep_talk_metropolis.mp3" },
    { name: "Though Our Paths May Diverge", file: "though_our_paths_may_diverge.mp3" },
    { name: "Cast Me a Spell", file: "cast_me_a_spell.mp3" },
    { name: "Dandelion Girls, Dandelion Boys", file: "dandelion_girls_dandelion_boys.mp3" },
    { name: "Sloth", file: "sloth.mp3" },
    { name: "Rosetta", file: "rosetta.mp3" },
    { name: "YUBIKIRI-GENMAN", file: "yubikiri_genman.mp3" },
    // { name: "Kapura's Theme", file: "kapuras_theme.mp3" },
    { name: "Camelia", file: "camelia.mp3" },
    { name: "DK", file: "dk.mp3" },
    { name: "TIAN TIAN", file: "tian_tian.mp3" },
    { name: "SAIKAI", file: "saikai.mp3" },
    { name: "Colorful", file: "colorful.mp3" },
    { name: "Main theme", file: "main_theme.mp3" },
    { name: "Sideshow Duckling", file: "sideshow_duckling.mp3" },
    { name: "Past the Stargazing Season", file: "past_the_stargazing_season.mp3" },
    { name: "Every Other Ghost", file: "every_other_ghost.mp3" },
    { name: "Entertainment", file: "entertainment.mp3" },
    { name: "Monsters in the Woods", file: "monsters_in_the_woods.mp3" },
    { name: "-NENTEN-", file: "nenten.mp3" }
];

let mode = 0; //0 = normal mode, 1 = endless, more to come?

//get current date and time
const startingDate = new Date("2026-8-1");
const currentDate = new Date();
const dateString = currentDate.toLocaleDateString();

let daysPassed = Math.floor((currentDate - startingDate) / (1000 * 60 * 60 * 24));

//picks a song based on the number of days passed since the starting date
const songIndex = daysPassed % songList.length;
const songToday = songList[songIndex];
let currentSong = songToday;
let songString = '';

//loads the song into the audio player
loadSong(songToday);

let startTime = 0;
let endTime = 5;
let songLength = 0;

audioPlayer.addEventListener('loadedmetadata', () => {
    songLength = audioPlayer.duration;

    audioPlayer.currentTime = startTime;
    progressBar.value = 0;

    console.log("Metadata loaded!");
    console.log("Loaded:", currentSong.name);
    console.log("File:", songString);
    console.log("Duration:", audioPlayer.duration);

    playButton.innerHTML = "&#9654;";

    setGuessTime();
});

//volume bar
audioPlayer.volume = volumeBar.value;
volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value; 
});

torinoImage.addEventListener("click", () => {
    window.open("https://x.com/july_sp_/status/1666155624068153344", "_blank");
});

// Stop playback after 5 seconds
audioPlayer.addEventListener('timeupdate', () => {
  if (audioPlayer.currentTime >= endTime) {
    audioPlayer.pause();
    audioPlayer.currentTime = endTime;
    playButton.innerHTML = "&#9654;";
  } 
  
});



progressBar.addEventListener('input', () => {
    audioPlayer.currentTime = startTime + parseFloat(progressBar.value);
});

//creates 5 boxes for the guess tracker
for (let i = 0; i < 5; i++) {
    const box = document.createElement("div");
    box.className = "guessBox";
    guessTracker.appendChild(box);
}

const boxes = document.querySelectorAll('.guessBox');

//creates 5 lives for the endless mode 
for (let i = 0; i < 5; i++) {
    const life = document.createElement("div");
    life.className = "heart";
    life.innerHTML = '❤️';

    guessTracker.appendChild(life);
}

const lives = document.querySelectorAll('.heart');

loadGameState();
loadNormal();

//creates the dropdown list of songs in alphabetical order
songList.sort((a, b) => a.name.localeCompare(b.name));

displaySongs(songList);

helpButton.addEventListener("click", () => {
    helpContainer.classList.toggle("active");
});


inputBox.onfocus = () => {
    //console.log(songString);
    songContainer.classList.add("active");
    focusIndex = -1;
}

inputBox.onblur = () => {
    songContainer.classList.remove("active");
    focusIndex = -1;
}

inputBox.addEventListener('keydown', (event) => {
    
    if (correctToggle && mode == 0 || guessCount == 5 && mode == 0 || livesLeft == 0 && mode == 1) {
        return; // if the correct songle is already guessed, stop taking more guesses
    }

    if (event.key === 'Enter' && inputBox.value.toLowerCase() === currentSong.name.toLowerCase() && focusIndex == -1) {

        console.log("Correct song entered!");
        displaySongs(songList);

        if (mode == 0) {
            correctToggle = true;
            boxes[guessCount].style.backgroundColor = "#68c168"; // Change to green
            printResults();

        } else if (mode == 1) {
            currentStreak++;
            if (currentStreak>maxStreak) {
                maxStreak = currentStreak;
            }

            const right = document.createElement("div");

            right.className = "endlessGuess right";
            right.textContent = inputBox.value;
            right.style.backgroundColor = "#68c168";

            endlessList.prepend(right);

            inputBox.value = "";
            dayCounter.textContent = "Highest Streak: " + maxStreak;
            scoreCounter.textContent = "Current Streak: " + currentStreak;

            endlessOngoing = true;

            loadRandomSong();
        }
        
        saveGameState();
        songContainer.classList.remove("active");
        
    } else if (event.key === 'Enter' && inputBox.value.toLowerCase() !== currentSong.name.toLowerCase() && focusIndex == -1) {

        //checks if the guess is a real guess
        const songExists = songList.some(song => song.name.toLowerCase() === inputBox.value.toLowerCase());

        if (songExists === false) {
            console.log("That song doesn't exist!");
            return;
        }

        console.log("Incorrect song entered.");
        displaySongs(songList);

        if (mode == 0){
            boxes[guessCount].style.backgroundColor = "#d44c4c"; // Change to red
            
            if (guessCount === 4) {
                printResults();
            }
            guessCount++;

        } else if (mode == 1) {
            lives[livesLeft-1].style.opacity = 0;
            livesLeft--;

            //add result to the endlessList 
            const wrong = document.createElement("div");
            wrong.className = "endlessGuess wrong";
            wrong.style.backgroundColor = "#d44c4c";

            const guess = document.createElement("div");
            guess.textContent = inputBox.value;
            guess.style.color = "#431919";

            const answer = document.createElement("div");
            answer.textContent = currentSong.name;
            answer.style.color = "white";

            wrong.appendChild(guess);
            wrong.appendChild(answer);

            endlessList.prepend(wrong);

            endlessOngoing = true;

            if(livesLeft == 0) {
                printResults();
                restartButton.style.display = "flex";
                resultsButton.style.display = "flex";
                endlessOngoing = false;
            } else {
                loadRandomSong();
            }
        }

        inputBox.value = ""; //clear input

        saveGameState();
    } 

    //lets the user navigate the dropdown with arrow keys
    const songItems = document.querySelectorAll('.song');

    if ((event.key === "ArrowDown" || event.key === "ArrowUp") && focusIndex < 0) {
        focusIndex = 0;
    } else if (event.key === "ArrowDown") {
        songItems[focusIndex].classList.remove('focused');
        focusIndex = (focusIndex + 1) % songItems.length;
    } else if (event.key === "ArrowUp") {
        songItems[focusIndex].classList.remove('focused');
        focusIndex = (focusIndex - 1 + songItems.length) % songItems.length;
    } else if (event.key === "Enter" && focusIndex >= 0) {
        songItems[focusIndex].classList.remove('focused');
        if (focusIndex >= 0 && focusIndex < songItems.length) {
                inputBox.value = songItems[focusIndex].textContent;
                focusIndex = -1;
        }
    }

    //console.log("Focus index:", focusIndex);
    if (focusIndex >= 0 && focusIndex < songItems.length) {
        songItems[focusIndex].classList.add('focused');
    }
});

document.addEventListener("mousedown", (event) => {
    //clicking outside hides the result container
    if (resultContainer.classList.contains("active") && !resultContainer.contains(event.target)) {
        resultContainer.classList.remove("active");
    }
    if (helpContainer.classList.contains("active") && !helpContainer.contains(event.target)) {
        helpContainer.classList.remove("active");
    }
});

shareButton.addEventListener("click", () => {
    let shareMessageAndLink = shareMessage.innerText + "\nhttps://jykca.github.io/";
    copyTextToClipboard(shareMessageAndLink);
});

//reorder the dropdown based on the input
inputBox.addEventListener('input', () => {
    const search = inputBox.value.toLowerCase();
    const filteredSongs = songList.filter(song => song.name.toLowerCase().includes(search));
    displaySongs(filteredSongs);
});

playButton.addEventListener("mousedown", () => {
      if (audioPlayer.paused && audioPlayer.currentTime + 1 >= endTime) {

        // If the audio has finished playing, reset to start time and play again
        audioPlayer.currentTime = startTime;
        audioPlayer.play();
        playButton.innerHTML = "&#10074;&#10074;";
        requestAnimationFrame(updateProgress);

      } else if (audioPlayer.paused) {

        audioPlayer.play();
        playButton.innerHTML = "&#10074;&#10074;"; // Change to pause icon
        requestAnimationFrame(updateProgress);

    } else {

        audioPlayer.pause();    
        playButton.innerHTML = "&#9654;"; // Change to play icon
    }
});

function displaySongs(songList) {
    //clear whatever was there before
    songContainer.innerHTML = ""; 

    songList.forEach(song => {
        const li = document.createElement("li");
        li.className = "song";
        li.textContent = song.name;

        li.addEventListener("mousedown", () => {
            event.preventDefault();
            inputBox.value = song.name;
        });

        songContainer.appendChild(li);
    });
}

function updateProgress() {
    if (!audioPlayer.paused) {
        const progress = audioPlayer.currentTime - startTime;
        progressBar.value = progress;

        if (audioPlayer.currentTime >= endTime) {
            audioPlayer.pause();
            playButton.innerHTML = "&#9654;";
            return;
        }

        requestAnimationFrame(updateProgress);
    }
}

function copyTextToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Text successfully copied to clipboard!');
        })
        .catch(err => {
        console.error('Failed to copy text: ', err);
        });
    
    }
}

let endlessStartTime = 0;
let endlessEndTime = 0;

function setGuessTime() {
    if (mode == 0) {
        if (guessCount === 0) {
            startTime = 0.2 * songLength;
            endTime = startTime + 5;
        } else if (guessCount === 1) {
            startTime = 0.4 * songLength;
            endTime = startTime + 5;
        } else if (guessCount === 2) {
            startTime = 0.6 * songLength;
            endTime = startTime + 5;
        } else if (guessCount === 3) {
            startTime = 0.8 * songLength;
            endTime = startTime + 5;
        } else if (guessCount === 4) {
            startTime = 0;
            endTime = songLength;
            progressBar.max = songLength;
        }

        audioPlayer.currentTime = startTime;

    } else if (mode == 1){
        if (endlessOngoing == false){

            let snippitLength = 0;

            if (currentStreak <= 5) {
                snippitLength = 15;
                
            } else if (currentStreak <= 10) {
                snippitLength = 10;

            } else if (currentStreak <= 20) {
                snippitLength = 5;

            } else if (currentStreak <= 100) {
                snippitLength = 3;

            } else if (currentStreak <= 200) {
                snippitLength = 1;
            } 

            progressBar.max = snippitLength;

            let randomStartPoint = Math.floor(Math.random() * (songLength-snippitLength-20)); //avoids the first 10s/last10s, also ensures the startPoint wont overflow

            startTime = randomStartPoint + 10;
            endTime = startTime + snippitLength;

            //for restoring purposes
            endlessStartTime = startTime;
            endlessEndTime = endTime;

        } else {
            startTime = endlessStartTime;
            endTime = endlessEndTime;
        }
        
        audioPlayer.currentTime = startTime;
    }

    console.log("Start Time: ", startTime);
    console.log("End Time: ", endTime);
};

function saveGameState(){
    localStorage.setItem("guessCount", guessCount);
    localStorage.setItem("correctToggle", correctToggle);
    localStorage.setItem("date", dateString);
    localStorage.setItem("streak", maxStreak)
}

function loadGameState() {
    if (mode == 0){
        if (localStorage.getItem("date") !== dateString) {
            guessCount = 0;
            correctToggle = false;
            return;
        }

        for (let i = 0; i < guessCount; i++) {
            boxes[i].style.backgroundColor = "#d44c4c";
        }

        if (correctToggle) {
            boxes[guessCount].style.backgroundColor = "#68c168";
            printResults();
        }

        if (guessCount == 5) {
            resultsButton.style.display = "flex";
        }
    } else if (mode == 1) {
        //TODO: load current game
        
    }
}

function printResults() {

    resultContainer.classList.add("active");
    resultsButton.style.display = "flex";

    if (mode == 0){
        //console.log(resultsButton);

        reslts.style.display = "block";

        reslts.innerHTML = `The correct answer was: <b>${songToday.name}</b>`;

        if (correctToggle) {
            if (guessCount === 0) {
                shareMessage.innerHTML = `I guessed today's Mili song in 1 guess!`;
            } else if (guessCount > 0) {
                shareMessage.innerHTML = `I guessed today's Mili song in ${guessCount + 1} guesses!`;
            }
        } else {
            shareMessage.textContent = `I couldn't guess today's Mili song...`;
        }
    } else if (mode == 1){

        reslts.style.display = "none";

        restartButton.style.display = "flex";

        if (currentStreak == 0) {
            shareMessage.innerHTML = `I didnt get any Mili songs in endless mode...<br>`;
        } else if (currentStreak == 1) {
            shareMessage.innerHTML = `I guessed 1 Mili song in endless mode!<br>`;
        } else if (currentStreak > 1) {
            shareMessage.innerHTML = `I guessed ${currentStreak} Mili songs in endless mode!<br>`;
        }

        endlessList.querySelectorAll('.endlessGuess').forEach(item => {
    
            if (item.classList.contains("right")) {
                shareMessage.innerHTML += `<br>✅ ${item.textContent}`;
            }

            else if (item.classList.contains("wrong")) {
                const guess = item.children[0].textContent;
                const answer = item.children[1].textContent;

                shareMessage.innerHTML += `<br>❌ ${guess} → ${answer}`;
            }
        });
    }
    
}

function reset() {
    localStorage.clear();
    location.reload();
}

function switchMode() {
    //console.log(endlessButton.textContent);

    if (endlessButton.textContent == 'Endless Mode') {
        mode = 1;

        loadEndless();

        endlessButton.classList.add("normal");
        body.classList.add("endlessMode");
        endlessButton.textContent = 'Normal Mode';
    } else {
        mode = 0;

        loadNormal();

        endlessButton.classList.remove("normal");
        body.classList.remove("endlessMode");
        endlessButton.textContent = 'Endless Mode';
    }
}

function loadEndless(){

    boxes.forEach(box => {
        box.style.display = "none";
    });

    lives.forEach(life => {
        life.style.display = "block";
    });

    inputBox.value = "";

    endlessList.style.display = "block"

    if (livesLeft !== 0) {
        restartButton.style.display = "none";
        resultsButton.style.display = "none";
    } else {
        restartButton.style.display = "flex";
        resultsButton.style.display = "flex";
    }

    dayCounter.textContent = "Highest Streak: " + maxStreak;
    scoreCounter.textContent = "Current Streak: " + currentStreak;

    helpButton.style.backgroundColor = "#74c0c9";
    information.textContent = "How To Play Endless"
    information1.textContent = "Get as many Mili Songs with 5 lives!";
    information2.innerHTML = "  You can listen to the song by pressing the play button. <br><br>Your guess has to be an existing song.  <br>As you get more score, the length of the song snippit will decrease.<br><br><br><br><br>";

    if (endlessSong == null) {
        endlessOngoing = false;
        loadRandomSong();
    } else {
        endlessOngoing = true;
        loadSong(endlessSong);
    }
}

function loadNormal() {

    boxes.forEach(box => {
        box.style.display = "block";
    });

    lives.forEach(life => {
        life.style.display = "none";
    });

    endlessList.style.display = "none"
    restartButton.style.display = "none";

    if (correctToggle){
        resultsButton.style.display = "block";
    } else {
        resultsButton.style.display = "none";
    };

    dayCounter.textContent = "Day " + (daysPassed + 1) + " - " + dateString;
    scoreCounter.textContent = '';
    loadSong(songToday);

    helpButton.style.backgroundColor = "lightblue";
    information.textContent = "How To Play"
    information1.textContent = "Guess the Mili song within 5 tries! ";
    information2.innerHTML = "You can listen to the song by pressing the play button. <br><br>Your guess has to be an existing song.  <br><br>AWAAWA songs, and some songs before Mili are also included. <br><br>Instrumental songs (Ender Lillies & Ender Magnolia soundtracks) are mostly excluded";

    loadGameState();
}

let previousIndexs = [];

function loadRandomSong(){
     //load a random song into audio player
    if (previousIndexs.length === songList.length) {
        previousIndexs = []; //TODO: add smth cool for getting all the songs!!
    }

    let randomIndex = Math.floor(Math.random() * songList.length);
    
    while (previousIndexs.indexOf(randomIndex) !== -1){
        randomIndex = Math.floor(Math.random() * songList.length);
    }

    //store the last song in endless
    endlessSong = songList[randomIndex];

    previousIndexs.push(randomIndex);
    //console.log(Number(randomIndex));
    loadSong(songList[randomIndex]);
}


function loadSong(song) {
    currentSong = song;

    songString = 'Music/' + song.file;
    audioFile.src = songString;
    audioPlayer.load();
}

function restartEndless() {
    endlessList.innerHTML = "";
    currentStreak = 0;
    livesLeft = 5;
    endlessSong = null;
    endlessOngoing = false;
    previousIndexs = [];

    scoreCounter.textContent = "Current Streak: " + currentStreak;
    inputBox.value = "";

    resultContainer.classList.remove("active");

    resultsButton.style.display = "none";
    restartButton.style.display = "none";

    lives.forEach(life => {
        life.style.opacity = 1;
    });

    loadRandomSong();
}