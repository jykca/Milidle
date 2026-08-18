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
const configContainer = document.querySelector('.configContainer');
const configButton = document.querySelector('.configButton');
const torinoImage = document.querySelector('.torino');
const body = document.querySelector('body');
const endlessButton = document.querySelector('.endlessButton');
const scoreCounter = document.querySelector('.scoreCounter');
const endlessList = document.querySelector('.endlessList');
const restartButton = document.querySelector('.restartButton');
const information = document.querySelector('.information');
const information1 = document.querySelector('.information1');
const information2 = document.querySelector('.information2');
const ostToggle = document.querySelector('#ostToggle');
const everythingToggle = document.querySelector('#everythingToggle');
const choice = document.querySelector('.choice');


let guessCount = Number(localStorage.getItem("guessCount")) || 0;
let correctToggle = localStorage.getItem("correctToggle") === "true";
let focusIndex = -1;
let maxStreak = Number(localStorage.getItem("streak")) || 0;;
let currentStreak = 0;
let livesLeft = 5;
let newEndlessSong = false;
let endlessSong = null;
let mode = 0; //0 = normal mode, 1 = endless, more to come?
let ost = localStorage.getItem("ost") === "true";
let everything = localStorage.getItem("everything") === "true";
let startingLives = Number(localStorage.getItem("startingLives")) || 5;
let dev = false;

//get current date and time
const startingDate = new Date("2026-8-12");
const currentDate = new Date();
const dateString = currentDate.toLocaleDateString();

let daysPassed = Math.floor((currentDate - startingDate) / (1000 * 60 * 60 * 24));

let songToday;
let currentSong;
let songString = '';

//global variables for changing the progress bar
let startTime = 0;
let endTime = 5;
let songLength = 0;

let songList = [];
let normalList = [];
let ostList = [];
let nicheList = [];
let displayList = [];

Promise.all([
    fetch("songLists/normalSongs.txt").then(response => response.text()),
    fetch("songLists/ostSongs.txt").then(response => response.text()),
    fetch("songLists/nicheSongs.txt").then(response => response.text())
]).then(([normalData, ostData, nicheData]) => {

    normalList = parseSongs(normalData);
    ostList = parseSongs(ostData);
    nicheList = parseSongs(nicheData);

    songList = [...normalList];

    ostToggle.checked = ost;
    if (ost) {
        addList(ostList);
    }

    everythingToggle.checked = everything;
    if (everything) {
        addList(nicheList);
    }

    // pick today's song using only normal
    const songIndex = daysPassed % normalList.length;
    songToday = normalList[songIndex];
    currentSong = songToday;

    loadSong(songToday);

    // sort dropdown
    songList = [...songList].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    displaySongs(songList);

    loadGameState();
    loadNormal();
});

ostToggle.addEventListener('change', () => {
    console.log("OST toggle:", ostToggle.checked);
    localStorage.setItem("ost", ostToggle.checked);

    if (ostToggle.checked == true){
        addList(ostList);
    } else {
        removeList(ostList);
    }
});

everythingToggle.addEventListener('change', () => {
    console.log("Everything toggle:", everythingToggle.checked);
    localStorage.setItem("everything", everythingToggle.checked);

    if (everythingToggle.checked == true){
        addList(nicheList);
    } else {
        removeList(nicheList);
    }
});

audioPlayer.addEventListener('loadedmetadata', () => {
    songLength = audioPlayer.duration;

    setGuessTime();

    audioPlayer.pause();
    progressBar.value = 0;

    


    playButton.innerHTML = "&#9654;";
});

//volume bar
audioPlayer.volume = volumeBar.value;
volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value; 
});

//source of image
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

  //progressBar.value = audioPlayer.currentTime - startTime;
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


for (let i = 0; i < 5; i++) {
    const liveButton = document.createElement("button");
    liveButton.className = "livesButton";
    liveButton.innerHTML = i+1 ;

    if (startingLives == liveButton.innerText) {
        liveButton.classList.toggle("active");
    }

    choice.appendChild(liveButton);
}

const liveButtons = document.querySelectorAll('.livesButton');


liveButtons.forEach(button => {
    button.addEventListener("click", () => {
        liveButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.toggle("active");
        startingLives = Number(button.innerText);
        localStorage.setItem("startingLives", startingLives);
        if (mode == 1) {
            loadEndless();
            restartEndless();
        }
    });
});


//top buttons
helpButton.addEventListener("click", () => {
    helpContainer.classList.toggle("active");
});

configButton.addEventListener("click", () => {
    configContainer.classList.toggle("active");
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
        return; // if the correct song is already guessed, stop taking more guesses
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
            setGuessTime();

        } else if (mode == 1) {

            if (!dev){
                lives[livesLeft-1].style.opacity = 0;
                livesLeft--;
            }  else {
                currentStreak++;
            }
            
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

            if(livesLeft == 0) {
                printResults();
                restartButton.style.display = "flex";
                resultsButton.style.display = "flex";
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
    //clicking outside hides the container
    if (resultContainer.classList.contains("active") && !resultContainer.contains(event.target)) {
        resultContainer.classList.remove("active");
    }
    if (helpContainer.classList.contains("active") && !helpContainer.contains(event.target)) {
        helpContainer.classList.remove("active");
    }
    if (configContainer.classList.contains("active") && !configContainer.contains(event.target)) {
        configContainer.classList.remove("active");
    }
});

shareButton.addEventListener("click", () => {
    let shareMessageAndLink = "";
    if (mode == 0){
        shareMessageAndLink = "Day #" + (daysPassed + 1) + " - " + shareMessage.innerText + "\nhttps://milidle.vercel.app/";
    } else if (mode == 1) {
        shareMessageAndLink = shareMessage.innerText + "\nhttps://milidle.vercel.app/";
    }
    
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

        audioPlayer.play().then(() => {
            playButton.innerHTML = "&#10074;&#10074;";
            requestAnimationFrame(updateProgress);
        }).catch(error => {
            console.error("Error:", error);
        });

      } else if (audioPlayer.paused) {

        audioPlayer.play().then(() => {
            playButton.innerHTML = "&#10074;&#10074;";
            requestAnimationFrame(updateProgress);
        }).catch(error => {
            console.error("Error:", error);
        });

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
            endTime = startTime + 2;
            progressBar.max = 2;
        } else if (guessCount === 1) {
            startTime = 0.4 * songLength;
            endTime = startTime + 3;
            progressBar.max = 3;
        } else if (guessCount === 2) {
            startTime = 0.6 * songLength;
            endTime = startTime + 4;
            progressBar.max = 4;
        } else if (guessCount === 3) {
            startTime = 0.8 * songLength;
            endTime = startTime + 5;
            progressBar.max = 5;
        } else if (guessCount === 4 || guessCount === 5) {
            startTime = 0.5 * songLength;
            endTime = startTime + 10;
            progressBar.max = 10;
        }

        audioPlayer.currentTime = startTime;

    } else if (mode == 1){
        if (newEndlessSong){

            let snippitLength = 0;

            if (currentStreak <= 5) {
                snippitLength = 10;
                
            } else if (currentStreak <= 10) {
                snippitLength = 7;

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

            newEndlessSong = false

        } else {
            startTime = endlessStartTime;
            endTime = endlessEndTime;

            progressBar.max = endlessEndTime - endlessStartTime;
        }
        
        audioPlayer.currentTime = startTime;
    }

    if (dev == true){
    console.log("Start Time: ", startTime);
    console.log("End Time: ", endTime);
    console.log("Metadata loaded!");
    console.log("Loaded:", currentSong.name);
    console.log("File:", songString);
    console.log("Duration:", audioPlayer.duration);
    //console.log("New song?", newEndlessSong);
    //console.log("Lives Left:", livesLeft);
    }

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

        setGuessTime();

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

        let counter = 0;

        const items = Array.from(endlessList.querySelectorAll('.endlessGuess')).reverse();
    
        items.forEach(item => {

            if (item.classList.contains("right")) {
                shareMessage.innerHTML += `<br>✅ ${item.textContent}`;
            }
            else if (item.classList.contains("wrong")) {
                const guess = item.children[0].textContent;
                const answer = item.children[1].textContent;

                counter++;
                if (counter == startingLives){
                    shareMessage.innerHTML += `<br>💀 ${guess} → ${answer}`;
                } else {
                    shareMessage.innerHTML += `<br>❌ ${guess} → ${answer}`;
                }
                
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

    let counter = 0;

    lives.forEach(life => {
        life.style.display = "none";
        counter++;
        if (counter <= startingLives){
            life.style.display = "block";
        }
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
    configButton.style.backgroundColor = "#74c0c9";
    information.textContent = "How To Play Endless"
    information1.textContent = "Get as many Mili Songs as you can!";
    information2.innerHTML = "  You can listen to the song by pressing the play button. <br><br>Your guess has to be an existing song.  <br><br>As you get more score, the length of the song snippit will decrease.<br><br>Click the gear icon in the top left for customization settings.<br>";

    if (endlessSong == null) {

        loadRandomSong();

    } else {
        newEndlessSong = false;
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
    configButton.style.backgroundColor = "lightblue";

    information.textContent = "How To Play"
    information1.textContent = "Guess the Mili song within 5 tries! ";
    information2.innerHTML = "You can listen to the song by pressing the play button. <br><br>Your guess has to be an existing song.  <br><br>AWAAWA songs, and some songs related to Mili may also be included. <br><br>Instrumental songs (Ender Lillies & Ender Magnolia soundtracks) are mostly excluded";

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

    newEndlessSong = true;

    previousIndexs.push(randomIndex);
    //console.log(Number(randomIndex));
    loadSong(songList[randomIndex]);
}


function loadSong(song) {
    currentSong = song;

    audioPlayer.pause();
    audioPlayer.currentTime = 0;

    songString = 'https://pub-8e84e65d1165460e8d46caac325947e4.r2.dev/' + song.file;
    audioFile.src = songString;
    audioPlayer.load();
}

function restartEndless() {
    endlessList.innerHTML = "";
    currentStreak = 0;
    livesLeft = startingLives;
    endlessSong = null;
    previousIndexs = [];

    scoreCounter.textContent = "Current Streak: " + currentStreak;
    inputBox.value = "";

    resultContainer.classList.remove("active");

    resultsButton.style.display = "none";
    restartButton.style.display = "none";

    let counter = 0;

    lives.forEach(life => {
        counter++
        if (counter <= startingLives){
            life.style.opacity = 1;
        }
    });

    loadRandomSong();
}

function addList(songArray){
    songList.push(...songArray)
    //console.log(songList.length); 
    if (mode == 1){
        restartEndless();
    }
}

function removeList(songArray){
    songList = songList.filter(song => !songArray.some(extra => extra.name === song.name));
    if (mode == 1){
        restartEndless();
    }
}

function parseSongs(data) {
        return data
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "")
            .map(line => {
                const [name, file] = line.split("|");

                return {
                    name: name.trim(),
                    file: file.trim()
                };
            });
}

function debug(){
    dev = !dev;
    
    audioPlayer.addEventListener('seeking', () => {
        console.log("Seeking:", audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('seeked', () => {
        console.log("Seeked:", audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('playing', () => {
        console.log("Played:", audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('waiting', () => {
        console.log("Waiting:", audioPlayer.currentTime);
    });
}

function skip(){
    if (mode == 1){
        loadRandomSong();
        console.log("Skipped song!");
        return;
    }
}