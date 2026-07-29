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
    "Not my Paradiso",
    "Summoning 101",
    "A Turtle's Heart",
    "Nine Point Eight",
    "Utopiosphere",
    "Friction",
    "Chocological",
    "YUBIKIRI-GENMAN",
    "Sacramentum: Unaccompanied Hymn for Torino",
    "Ephemeral",
    "Imagined Flight",
    "Fable",
    "Rosetta",
    "Maroma Samsa",
    "Witch's Invitation",
    "Red Dahlia",
    "Ga1ahad and Scientific Witchery",
    "RTRT",
    "Unidentified Flavourful Object",
    "Meatball Submarine",
    "Vulnerability",
    "NENTEN",
    "Bathtub Mermaid",
    "Cerebrite",
    "Space Colony",
    "world.execute(me);",
    "Utopiosphere -Platonism-",
    "Painful Death for the Lactose Intolerant",
    "YUBIKIRI-GENMAN -special edit-",
    "Sl0t",
    "Past the Stargazing Season",
    "Colorful",
    "Komm Süsser Tod",
    "Shitty Flowers",
    "Boys in Kaleidosphere",
    "Camelia",
    "Vitamins",
    "Lemonade",
    "Milk",
    "world.search(you);",
    "Mushrooms",
    "Gertrauda",
    "TOKYO NEON",
    "Extension of You",
    "Mirror Mirror",
    "With a Billion Worldful of <3",
    "Every Other Ghost",
    "Fossil",
    "Rubber Human",
    "Excαlibur",
    "Let the Maggots Sing",
    "Nine Point Eight -special edit-",
    "Still Alive"
];

const filteredSongs = songList; // Create a copy of the songList for filtering

//get current date and time
const startingDate = new Date("2026-7-28");
const currentDate = new Date();
const dateString = currentDate.toLocaleDateString();

let daysPassed = Math.floor((currentDate - startingDate) / (1000 * 60 * 60 * 24));
dayCounter.textContent = "Day " + (daysPassed + 1) + " - " + dateString;

//picks a song based on the number of days passed since the starting date
const songIndex = daysPassed % songList.length;
const songToday = songList[songIndex];
let songString = 'Music/' + songToday + '.ogg';

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
songList.sort((a, b) => a.localeCompare(b));

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

    if (event.key === 'Enter' && inputBox.value === songToday) {
        console.log("Correct song entered!");
        resultContainer.classList.add("active");
        correctToggle = true;
        shareMessage.textContent = `I guessed today's Mili song in ${guessCount + 1} guesses!`;
        boxes[guessCount].style.backgroundColor = "#00ff00"; // Change to green
        guessCount++;
    } else if (event.key === 'Enter' && inputBox.value !== songToday) {
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
    const filteredSongs = songList.filter(song => song.toLowerCase().includes(search));
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
        li.textContent = song;

        li.addEventListener("mousedown", () => {
            event.preventDefault();
            inputBox.value = song;
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