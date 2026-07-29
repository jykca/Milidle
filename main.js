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


let guessCount = 0;
let correctToggle = false;

const songList = [
    {
        name: "Not My Paradiso",
        file: "not_my_paradiso.ogg"
    },
    {
        name: "Summoning 101",
        file: "summoning_101.ogg"
    },
    {
        name: "A Turtle's Heart",
        file: "a_turtles_heart.ogg"
    },
    {
        name: "Bathtub Mermaid",
        file: "bathtub_mermaid.ogg"
    },
    {
        name: "Boys in Kaleidosphere",
        file: "boys_in_kaleidosphere.ogg"
    },
    {
        name: "Camelia",
        file: "camelia.ogg"
    },
    {
        name: "Cerebrite",
        file: "cerebrite.ogg"
    },
    {
        name: "Chocological",
        file: "chocological.ogg"
    },
    {
        name: "Colorful",
        file: "colorful.ogg"
    },
    {
        name: "Ephemeral",
        file: "ephemeral.ogg"
    },
    {
        name: "Every Other Ghost",
        file: "every_other_ghost.ogg"
    },
    {
        name: "Excαlibur",
        file: "excalibur.ogg"
    },
    {
        name: "Fable",
        file: "fable.ogg"
    },
    {
        name: "Fossil",
        file: "fossil.ogg"
    },
    {
        name: "Friction",
        file: "friction.ogg"
    },
    {
        name: "Ga1ahad and Scientific Witchery",
        file: "ga1ahad_and_scientific_witchery.ogg"
    },
    {
        name: "Gertrauda",
        file: "gertrauda.ogg"
    },
    {
        name: "Imagined Flight",
        file: "imagined_flight.ogg"
    },
    {
        name: "Komm Süsser Tod",
        file: "komm_susser_tod.ogg"
    },
    {
        name: "Lemonade",
        file: "lemonade.ogg"
    },
    {
        name: "Let the Maggots Sing",
        file: "let_the_maggots_sing.ogg"
    },
    {
        name: "Maroma Samsa",
        file: "maroma_samsa.ogg"
    },
    {
        name: "Meatball Submarine",
        file: "meatball_submarine.ogg"
    },
    {
        name: "Milk",
        file: "milk.ogg"
    },
    {
        name: "Mirror Mirror",
        file: "mirror_mirror.ogg"
    },
    {
        name: "Mushrooms",
        file: "mushrooms.ogg"
    },
    {
        name: "NENTEN",
        file: "nenten.ogg"
    },
    {
        name: "Nine Point Eight",
        file: "nine_point_eight.ogg"
    },
    {
        name: "Nine Point Eight -special edit-",
        file: "nine_point_eight_special_edit.ogg"
    },
    {
        name: "Painful Death for the Lactose Intolerant",
        file: "painful_death_for_the_lactose_intolerant.ogg"
    },
    {
        name: "Past the Stargazing Season",
        file: "past_the_stargazing_season.ogg"
    },
    {
        name: "Red Dahlia",
        file: "red_dahlia.ogg"
    },
    {
        name: "Rosetta",
        file: "rosetta.ogg"
    },
    {
        name: "RTRT",
        file: "rtrt.ogg"
    },
    {
        name: "Rubber Human",
        file: "rubber_human.ogg"
    },
    {
        name: "Sacramentum: Unaccompanied Hymn for Torino",
        file: "sacramentum_unaccompanied_hymn_for_torino.ogg"
    },
    {
        name: "Shitty Flowers",
        file: "shitty_flowers.ogg"
    },
    {
        name: "Sl0t",
        file: "sl0t.ogg"
    },
    {
        name: "Space Colony",
        file: "space_colony.ogg"
    },
    {
        name: "Still Alive",
        file: "still_alive.ogg"
    },
    {
        name: "String Theocracy",
        file: "string_theocracy.ogg"
    },
    {
        name: "TOKYO NEON",
        file: "tokyo_neon.ogg"
    },
    {
        name: "Unidentified Flavourful Object",
        file: "unidentified_flavourful_object.ogg"
    },
    {
        name: "Utopiosphere",
        file: "utopiosphere.ogg"
    },
    {
        name: "Utopiosphere -Platonism-",
        file: "utopiosphere_platonism.ogg"
    },
    {
        name: "Vulnerability",
        file: "vulnerability.ogg"
    },
    {
        name: "With a Billion Worldful of <3",
        file: "with_a_billion_worldful_of_heart.ogg"
    },
    {
        name: "Witch's Invitation",
        file: "witchs_invitation.ogg"
    },
    {
        name: "world.execute(me);",
        file: "world_execute_me.ogg"
    },
    {
        name: "world.search(you);",
        file: "world_search_you.ogg"
    },
    {
        name: "YUBIKIRI-GENMAN",
        file: "yubikiri_genman.ogg"
    },
    {
        name: "YUBIKIRI-GENMAN -special edit-",
        file: "yubikiri_genman_special_edit.ogg"
    },
    {
        name: "Vitamins",
        file: "vitamins.ogg"
    }
];

//get current date and time
const startingDate = new Date("2026-7-28");
const currentDate = new Date();
const dateString = currentDate.toLocaleDateString();

let daysPassed = Math.floor((currentDate - startingDate) / (1000 * 60 * 60 * 24));
dayCounter.textContent = "Day " + (daysPassed + 1) + " - " + dateString;

//picks a song based on the number of days passed since the starting date
const songIndex = daysPassed % songList.length;
const songToday = songList[songIndex];
let songString = 'Music/' + songToday.file;

//loads the song into the audio player
audioFile.src = songString;
audioFile.parentElement.load();

const startTime = 83; // 1:23
const endTime = 88;   // 1:28

// When metadata is loaded, jump to the start
audioPlayer.addEventListener('loadedmetadata', () => {
  audioPlayer.currentTime = startTime;
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

//creates the dropdown list of songs in alphabetical order
songList.sort((a, b) => a.name.localeCompare(b.name));

displaySongs(songList);

inputBox.onfocus = () => {
    console.log(songString);
    songContainer.classList.toggle("active");
}

inputBox.onblur = () => {
    songContainer.classList.toggle("active");
}

inputBox.addEventListener('keydown', (event) => {

    if (correctToggle) {
        return; // if the correct songle is already guessed, stop taking more guesses
    }

    if (event.key === 'Enter' && inputBox.value === songToday.name) {
        console.log("Correct song entered!");
        resultContainer.classList.add("active");
        correctToggle = true;
        shareMessage.textContent = `I guessed today's Mili song in ${guessCount + 1} guesses!`;
        boxes[guessCount].style.backgroundColor = "#00ff00"; // Change to green
        guessCount++;
    } else if (event.key === 'Enter' && inputBox.value !== songToday.name) {
        console.log("Incorrect song entered.");
        resultContainer.classList.remove("active");
        inputBox.value = ""; //clear input
        boxes[guessCount].style.backgroundColor = "#ff0000"; // Change to red
        guessCount++;
    } 
});

document.addEventListener("mousedown", (event) => {
    //clicking outside hides the result container
    if (resultContainer.classList.contains("active") && !resultContainer.contains(event.target)) {
        resultContainer.classList.remove("active");
    }
});

shareButton.addEventListener("click", () => {
    copyTextToClipboard(shareMessage.textContent);
});

//reorder the dropdown based on the input
inputBox.addEventListener('input', () => {
    const search = inputBox.value.toLowerCase();
    const filteredSongs = songList.filter(song => song.name.toLowerCase().includes(search));
    displaySongs(filteredSongs);
});

playButton.addEventListener("mousedown", () => {
      if (audioPlayer.paused && audioPlayer.currentTime >= endTime) {

        // If the audio has finished playing, reset to start time and play again
        audioPlayer.currentTime = startTime;
        audioPlayer.play();
        playButton.innerHTML = "&#10074;&#10074;";
        requestAnimationFrame(updateProgress);

      } else if (audioPlayer.paused) {

        console.log(songString);
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