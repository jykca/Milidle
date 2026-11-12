const inputBox = document.querySelector('.input');
const songContainer = document.querySelector('.songContainer');
const audioFile = document.querySelector('.audioFile');
const audioPlayer = document.querySelector('.audioPlayer');
const playButton = document.querySelector('.playButton');
const audioContainer = playButton.parentElement;
const dayNavigation = document.querySelector('.dayNavigation');
const dayCounter = document.querySelector('.dayCounter');
const previousDayButton = document.querySelector('.previousDayButton');
const nextDayButton = document.querySelector('.nextDayButton');
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
const lyricButton = document.querySelector('.lyricButton');
const reloadAudioButton = document.querySelector('.reloadAudioButton');
const scoreCounter = document.querySelector('.scoreCounter');
const endlessList = document.querySelector('.endlessList');
const lyricGuessList = document.querySelector('.lyricGuessList');
const restartButton = document.querySelector('.restartButton');
const information = document.querySelector('.information');
const information1 = document.querySelector('.information1');
const information2 = document.querySelector('.information2');
const ostToggle = document.querySelector('#ostToggle');
const everythingToggle = document.querySelector('#everythingToggle');
const choice = document.querySelector('.choice');
const volumeIcon = document.querySelector('.volumeIcon i');

const AUDIO_API = "https://milidle-audio.jykcajj.workers.dev";
const DAILY_CLIP_LENGTHS = [1, 2, 3, 5, 10]; // seconds for guesses 1-5

let endlessNonce = "";

function generateEndlessNonce() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

audioPlayer.preload = 'auto';

function getStoredInteger(key, fallback, min, max) {
    const value = Number.parseInt(localStorage.getItem(key), 10);

    if (!Number.isInteger(value)) {
        return fallback;
    }

    return Math.min(Math.max(value, min), max);
}

audioPlayer.addEventListener('waiting', () => {
    if (!audioPlayer.paused) {
        playButton.innerHTML = ". . .";
    }
});

let guessCount = getStoredInteger("guessCount", 0, 0, 5);
let correctToggle = localStorage.getItem("correctToggle") === "true";
let normalWrongGuesses = [];
let focusIndex = -1;
let maxStreak = getStoredInteger("streak", 0, 0, Number.MAX_SAFE_INTEGER);
let currentStreak = 0;
let livesLeft = 5;
let newEndlessSong = false;
let endlessSong = null;
let mode = 0; //0 = normal mode, 1 = endless, more to come?
let ost = localStorage.getItem("ost") === "true";
let everything = localStorage.getItem("everything") === "true";
let startingLives = Number(localStorage.getItem("startingLives")) || 5;
let dev = false;
let audioReady = false;

//get current date and time
const startingDate = new Date(2026, 7, 12);
const startingLyricDate = new Date(2026, 9, 26);
const DAY_OVERRIDE_KEY = "a";
const DAY_NAV_MODE_KEY = "dayNavigationMode";
const dayOverride = sessionStorage.getItem(DAY_OVERRIDE_KEY);

let currentDate = new Date();

if (dayOverride) {
    currentDate = new Date(`${dayOverride}T12:00:00`);
}

const dateString = currentDate.toLocaleDateString();
const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;
const today = new Date();
today.setHours(0, 0, 0, 0);

function loadSavedState(key) {
    const savedState = localStorage.getItem(key);
    if (!savedState) {
        return null;
    }

    try {
        return JSON.parse(savedState);
    } catch (error) {
        console.error(`Unable to restore saved game from ${key}:`, error);
        return null;
    }
}

function loadSavedGuesses(key) {
    try {
        const guesses = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(guesses)) {
            return guesses.filter(guess => typeof guess === "string");
        }
    } catch (error) {
        console.error(`Unable to restore saved guesses from ${key}:`, error);
    }

    return [];
}

const normalGameStateKey = `normalGameState-${dateKey}`;
const lyricGameStateKey = `lyricGameState-${dateKey}`;

function getDayOffset(date, startDate) {
    const dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const startUtc = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    return Math.round((dateUtc - startUtc) / 86400000);
}

let daysPassed = getDayOffset(currentDate, startingDate);
let daysPassedLyric = getDayOffset(currentDate, startingLyricDate);

function jumpToDay(day){

    if (day === undefined) {
        sessionStorage.removeItem(DAY_OVERRIDE_KEY);
        window.location.reload();
        return;
    }

    let targetDate;
    if (Number.isSafeInteger(day) && day > 0) {
        targetDate = new Date(startingDate);
        targetDate.setDate(targetDate.getDate() + day - 1);

    } else if (typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day)) {
        const [year, month, date] = day.split("-").map(Number);
        targetDate = new Date(year, month - 1, date, 12);

        if (targetDate.getFullYear() !== year || targetDate.getMonth() !== month - 1 || targetDate.getDate() !== date) {
            throw new RangeError("Invalid date.");
        }

    } else {
        throw new TypeError("Use a positive day number, a YYYY-MM-DD date, or no argument to return to today.");
    }

    if (!Number.isFinite(targetDate.getTime())) {
        throw new RangeError("Invalid date.");
    }

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const date = String(targetDate.getDate()).padStart(2, "0");
    sessionStorage.setItem(DAY_OVERRIDE_KEY, `${year}-${month}-${date}`);

    window.location.reload();
};

function navigateDay(offset) {

    if (mode !== 0 && mode !== 2) {
        return;
    }

    const targetDate = new Date(currentDate);
    targetDate.setDate(targetDate.getDate() + offset);
    const firstDay = new Date(getFirstDay());
    firstDay.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    if (targetDate < firstDay || targetDate > today) {
        return;
    }

    if (mode === 2) {
        sessionStorage.setItem(DAY_NAV_MODE_KEY, "lyric");
    } else {
        sessionStorage.setItem(DAY_NAV_MODE_KEY, "normal");
    }

    if (targetDate.getTime() === today.getTime()) {
        sessionStorage.removeItem(DAY_OVERRIDE_KEY);
    } else {
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, "0");
        const date = String(targetDate.getDate()).padStart(2, "0");
        sessionStorage.setItem(DAY_OVERRIDE_KEY, `${year}-${month}-${date}`);
    }

    window.location.reload();
}

function getFirstDay() {
    if (mode === 2) {
        return startingLyricDate;
    }

    return startingDate;
}

function updateDayNavigation() {
    if (mode !== 0 && mode !== 2) {
        dayNavigation.style.display = "none";
        return;
    }

    const firstDay = new Date(getFirstDay());
    firstDay.setHours(0, 0, 0, 0);
    const selectedDay = new Date(currentDate);
    selectedDay.setHours(0, 0, 0, 0);

    dayNavigation.style.display = "flex";
    previousDayButton.disabled = selectedDay <= firstDay;
    nextDayButton.disabled = selectedDay >= today;
}

previousDayButton.addEventListener("click", () => navigateDay(-1));
nextDayButton.addEventListener("click", () => navigateDay(1));

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
let endlessStartTime = 0;
let endlessEndTime = 0;
let previousIndexs = [];

let lyricEntries = [];
let lyricCompleted = false;
let allSongs = [];
let dailyLyricEntry = null;
let dailyLyricSections = [];
let dailyLyricStartIndex = 0;
let lyricGuessCount = 0;
let lyricWrongGuesses = [];
let lyricWon = false;
lyricButton.disabled = true;

const LYRIC_TITLE_ALIASES = {
    "NENTEN_JP": "-NENTEN-",
    "NENTEN_CN": "-NENTEN-",
    "With a Billion Worldful of Heart": "With a Billion Worldful of <3"
};

function fetchSongList(path) {
    return fetch(path).then(response => {
        if (!response.ok) {
            throw new Error(`Unable to load ${path}: ${response.status}`);
        }

        return response.text();
    });
}

Promise.all([
    fetchSongList("songLists/normalSongs.txt"),
    fetchSongList("songLists/ostSongs.txt"),
    fetchSongList("songLists/nicheSongs.txt"),
    fetchSongList("lyricOrder")
]).then(([normalData, ostData, nicheData, lyricOrderData]) => {

    normalList = parseSongs(normalData);
    ostList = parseSongs(ostData);
    nicheList = parseSongs(nicheData);
    allSongs = [...normalList, ...ostList, ...nicheList];
    lyricEntries = lyricOrderData.split(/\r?\n/).map(name => name.trim()).filter(Boolean).map(fileName => {
        const title = LYRIC_TITLE_ALIASES[fileName] || fileName;
        const song = allSongs.find(candidate => candidate.name === title)
            || allSongs.find(candidate => normalizeSongName(candidate.name) === normalizeSongName(title));

        return {
            fileName: fileName,
            song: song || { name: title, id: "" }
        };
    });

    const dailyIndex = ((daysPassedLyric % lyricEntries.length) + lyricEntries.length) % lyricEntries.length;
    dailyLyricEntry = lyricEntries[dailyIndex];
    currentSong = dailyLyricEntry.song;

    ostToggle.checked = ost;
    if (ost) {
        addList(ostList);
    }

    const monthDay = (currentDate.getMonth() + 1) + "-" + currentDate.getDate();

    everythingToggle.checked = everything;
    if (everything || monthDay == "4-1") {
        addList(nicheList);
    }

    songList = [...normalList];

    // pick today's song using only normal
    const songIndex = daysPassed % normalList.length;
    songToday = normalList[songIndex];

    if (monthDay == "10-31") {
        songToday = normalList.find(song => song.name === "Phantomcat of Meowloween");
    } else if (monthDay == "4-1") {
        songToday = nicheList.find(song => song.name === "TOTO Washlet");
    } else if (monthDay == "6-17") {
        songToday = normalList.find(song => song.name === "Ga1ahad and Scientific Witchery");
    } else if (monthDay == "9-8") {
        songToday = normalList.find(song => song.name === "Nine Point Eight");
    } else if (monthDay == "2-7") {
        songToday = normalList.find(song => song.name === "Children of the City");
    } else if (monthDay == "7-27") {
        songToday = normalList.find(song => song.name === "Peach Pit and Cyanide");
    } else if (monthDay == "2-14") {
        songToday = normalList.find(song => song.name === "From a Place of Love");
    } else if (monthDay == "12-21") {
        songToday = normalList.find(song => song.name === "Mirror Mirror");
    }

    currentSong = songToday;

    // sort dropdown
    songList = [...songList].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    return fetchSongList(`lyrics/${encodeURIComponent(dailyLyricEntry.fileName)}.txt`);

}).then(lyricText => {

    const sections = getLyricSections(lyricText, dailyLyricEntry.song.name);

    dailyLyricSections = sections;
    dailyLyricStartIndex = daysPassedLyric % Math.max(1, sections.length - 2);
    displaySongs(getGuessableSongs());
    loadGameState();
    loadNormal();
    lyricButton.disabled = false;

    if (sessionStorage.getItem(DAY_NAV_MODE_KEY) === "lyric") {
        sessionStorage.removeItem(DAY_NAV_MODE_KEY);
        switchMode(lyricButton);
    } else {
        sessionStorage.removeItem(DAY_NAV_MODE_KEY);
    }

}).catch(error => {
    console.error("Unable to initialize songs and today's lyric:", error);
    dayCounter.textContent = "Songs did not load :(";
    inputBox.disabled = true;
    playButton.disabled = true;
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
    
    audioReady = true;
    playButton.disabled = false;
    playButton.innerHTML = "&#9654;";

    setGuessTime();

    audioPlayer.pause();
    progressBar.value = 0;
});

//volume bar
audioPlayer.volume = volumeBar.value;
volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value; 

    if (volumeBar.value == 0) {
        volumeIcon.classList.remove("fa-volume-down");
        volumeIcon.classList.remove("fa-volume-up");
        volumeIcon.classList.add("fa-volume-off");

    } else if (volumeBar.value > 0 && volumeBar.value <= 0.5) {
        volumeIcon.classList.add("fa-volume-down");
        volumeIcon.classList.remove("fa-volume-up");
        volumeIcon.classList.remove("fa-volume-off");
        
    } else {
        volumeIcon.classList.remove("fa-volume-down");
        volumeIcon.classList.add("fa-volume-up");
        volumeIcon.classList.remove("fa-volume-off");
    }
});

function mute() {
    if (audioPlayer.volume > 0) {
        volumeBar.value = 0;
        audioPlayer.volume = volumeBar.value; 
        volumeIcon.classList.remove("fa-volume-down");
        volumeIcon.classList.add("fa-volume-off");
    }
}

audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.seeking || seekingProgress) {
        return;
    }

    if (audioPlayer.currentTime > endTime) {
        audioPlayer.pause();
        audioPlayer.currentTime = endTime;
        progressBar.value = progressBar.max;
    } else if (audioPlayer.currentTime < startTime) {
        audioPlayer.pause();
        audioPlayer.currentTime = startTime;
    }
});

audioPlayer.addEventListener('ended', () => {
    progressBar.value = progressBar.max;
    playButton.innerHTML = "&#9654;";
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        audioPlayer.pause();
        playButton.innerHTML = "&#9654;";
    }
});

//source of image
torinoImage.addEventListener("click", () => {
    window.open("https://x.com/july_sp_/status/1666155624068153344", "_blank");
});

let seekingProgress = false;

progressBar.addEventListener('pointerdown', () => {
    seekingProgress = true;
});

progressBar.addEventListener('pointerup', () => {
    seekingProgress = false;
});

progressBar.addEventListener('pointercancel', () => {
    seekingProgress = false;
});

progressBar.addEventListener('change', () => {
    const targetTime = startTime + parseFloat(progressBar.value);
    seekAudioTo(targetTime, !audioPlayer.paused);
});


//creates 5 boxes for the guess tracker
for (let i = 0; i < 5; i++) {
    const box = document.createElement("div");
    box.className = "guessBox";
    guessTracker.appendChild(box);
}

const boxes = document.querySelectorAll('.guessBox');

const lyricDisplay = document.createElement("div");
lyricDisplay.className = "lyricDisplay";
lyricDisplay.hidden = true;
guessTracker.appendChild(lyricDisplay);

const lyricHintDisplay = document.createElement("div");
lyricHintDisplay.className = "lyricHintDisplay";
lyricHintDisplay.hidden = true;
lyricHintDisplay.style.marginTop = "20px";
guessTracker.appendChild(lyricHintDisplay);

//creates 5 lives for the endless mode 
for (let i = 0; i < 5; i++) {
    const life = document.createElement("div");
    life.className = "heart";
    life.innerHTML = '<i class="fa fa-heart" style="font-size:40px;color:rgb(237, 96, 96)"></i>';
    life.style.display = "none";

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
    inputBox.classList.add("active");
    focusIndex = -1;
}

inputBox.onblur = () => {
    songContainer.classList.remove("active");
    inputBox.classList.remove("active");
    focusIndex = -1;
}

inputBox.addEventListener('keydown', (event) => {
    
    if (correctToggle && mode == 0 || guessCount == 5 && mode == 0 || livesLeft == 0 && mode == 1 || mode == 2 && lyricCompleted) {
        return; // if the correct song is already guessed, stop taking more guesses
    }

    const guess = inputBox.value.trim();

    if (event.key === 'Enter' && guess.toLowerCase() === currentSong.name.toLowerCase() && focusIndex == -1) {

        console.log("Correct song entered!");
        displaySongs(getGuessableSongs());

        if (mode == 0) {

            correctToggle = true;
            boxes[guessCount].style.backgroundColor = "#68c168"; // Change to green
            renderNormalProgress();
            inputBox.disabled = true;
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

        } else if (mode == 2) {

            lyricCompleted = true;
            lyricWon = true;
            lyricGuessCount++;
            renderLyricProgress();
            saveLyricState();
            localStorage.setItem("lyricCompletedDate", dateString);
            inputBox.disabled = true;
            printResults();

        }
        
        if (mode === 0) {
            saveGameState();
        }
        songContainer.classList.remove("active");
        
    } else if (event.key === 'Enter' && guess.toLowerCase() !== currentSong.name.toLowerCase() && focusIndex == -1) {

        //checks if the guess is a real guess
        const songExists = getGuessableSongs().some(song =>
            song.name.toLowerCase() === guess.toLowerCase()
        );

        if (songExists === false) {
            console.log("That song doesn't exist!");
            return;
        }

        console.log("Incorrect song entered.");
        displaySongs(getGuessableSongs());

        if (mode == 0){
            boxes[guessCount].style.backgroundColor = "#d44c4c"; // Change to red
            normalWrongGuesses.push(guess);
            renderNormalProgress();
            
            if (guessCount === 4) {
                printResults();
            }

            guessCount++;
            loadSong(currentSong);

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

        } else if (mode == 2) {
            lyricGuessCount++;
            lyricWrongGuesses.push(guess);
            renderLyricProgress();

            if (lyricGuessCount === 5) {
                lyricCompleted = true;
                lyricWon = false;
                localStorage.setItem("lyricCompletedDate", dateString);
                inputBox.disabled = true;
                printResults();
            }
            saveLyricState();
        }

        inputBox.value = ""; //clear input

        if (mode === 0) {
            saveGameState();
        }
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
        audioPlayer.pause();
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
    } else if (mode == 2) {
        shareMessageAndLink = "Day #" + (daysPassedLyric + 1) + " - " + shareMessage.innerText + "\nhttps://milidle.vercel.app/";
    }
    
    copyTextToClipboard(shareMessageAndLink);
});

//reorder the dropdown based on the input
inputBox.addEventListener('input', () => {
    const search = inputBox.value.toLowerCase();
    const filteredSongs = getGuessableSongs().filter(song => song.name.toLowerCase().includes(search));
    displaySongs(filteredSongs);
});

playButton.addEventListener("click", () => {

    if (!audioReady) {
        return;
    }

    if (audioPlayer.paused && audioPlayer.currentTime >= endTime - 0.05) {

        // If the audio has finished playing, reset to start time and play again
        seekAudioTo(startTime, true);

    } else if (audioPlayer.paused) {

        audioPlayer.play().then(() => {
            playButton.innerHTML = "&#10074;&#10074;";
            requestAnimationFrame(updateProgress);
        }).catch(error => {
            if (error.name !== "AbortError") {
                console.error("Audio play error:", error);
            }
        });

    } else {

        audioPlayer.pause();    
        playButton.innerHTML = "&#9654;"; // Change to play icon
    }
});

function reloadSong(){
    if (currentSong) {
        loadSong(currentSong);
    }
}

function displaySongs(songList) {
    //clear whatever was there before
    songContainer.innerHTML = ""; 

    songList.forEach(song => {
        const li = document.createElement("li");
        li.className = "song";
        li.textContent = song.name;

        li.addEventListener("mousedown", (event) => {
            event.preventDefault();
            inputBox.value = song.name;
        });

        songContainer.appendChild(li);
    });
}

function updateProgress() {
    if (!audioPlayer.paused) {
        const progress = audioPlayer.currentTime - startTime;

        if (!seekingProgress) {
            progressBar.value = progress;
        }

        if (audioPlayer.currentTime >= endTime) {
            progressBar.value = progressBar.max;
            audioPlayer.pause();
            playButton.innerHTML = "&#9654;";
            return;
        }

        requestAnimationFrame(updateProgress);
    }
}

async function copyTextToClipboard(text) {

    try {
        if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            console.log("Text successfully copied to clipboard!");
            return;
        }

        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
        console.log("Text successfully copied to clipboard!");
    } catch (err) {
        console.error("Failed to share/copy text:", err);
    }

    if (navigator.share) {
        try {
            await navigator.share({ text });
            console.log("Text shared successfully!");
            return;
        } catch (err) {
            if (err.name === "AbortError") {
                return;
            }
        }
    }
}

function setGuessTime() {
    startTime = 0;
    endTime = getClipLength();
    progressBar.max = endTime;
    audioPlayer.currentTime = 0;

    if (dev == true) {
        console.log("Clip length:", endTime);
        console.log("Loaded:", currentSong.name);
        console.log("File:", songString);
    }
};

function getClipLength() {
    if (mode == 2) {
        return DAILY_CLIP_LENGTHS[DAILY_CLIP_LENGTHS.length - 1];
    }

    if (mode == 0) {
        return DAILY_CLIP_LENGTHS[Math.min(guessCount, DAILY_CLIP_LENGTHS.length - 1)];
    }

    if (currentStreak <= 5) {
        return 10;
    } else if (currentStreak <= 10) {
        return 7;
    } else if (currentStreak <= 20) {
        return 5;
    } else if (currentStreak <= 100) {
        return 3;
    } else {
        return 1;
    }
}

function saveGameState(){
    const savedState = {
        guessCount: guessCount,
        correctToggle: correctToggle,
        wrongGuesses: normalWrongGuesses
    };
    localStorage.setItem(normalGameStateKey, JSON.stringify(savedState));
    localStorage.setItem("guessCount", guessCount);
    localStorage.setItem("correctToggle", correctToggle);
    localStorage.setItem("date", dateString);
    localStorage.setItem("normalWrongGuesses", JSON.stringify(normalWrongGuesses));
    localStorage.setItem("streak", maxStreak)
}

function loadGameState() {
    if (mode == 0){
        let savedState = loadSavedState(normalGameStateKey);
        if (!savedState && localStorage.getItem("date") === dateString) {
            savedState = {
                guessCount: Number.parseInt(localStorage.getItem("guessCount"), 10),
                correctToggle: localStorage.getItem("correctToggle") === "true",
                wrongGuesses: loadSavedGuesses("normalWrongGuesses")
            };
        }

        guessCount = 0;
        correctToggle = false;
        normalWrongGuesses = [];
        if (savedState) {
            if (Number.isInteger(savedState.guessCount)) {
                guessCount = Math.min(Math.max(savedState.guessCount, 0), 5);
            }

            correctToggle = savedState.correctToggle === true;
            if (Array.isArray(savedState.wrongGuesses)) {
                normalWrongGuesses = savedState.wrongGuesses.filter(guess => typeof guess === "string");
            }
        }

        renderNormalProgress();
    }
}

function renderNormalProgress() {
    lyricGuessList.innerHTML = "";

    for (let i = 0; i < guessCount; i++) {
        boxes[i].style.backgroundColor = "#d44c4c";
    }

    if (correctToggle && guessCount < boxes.length) {
        boxes[guessCount].style.backgroundColor = "#68c168";
        inputBox.disabled = true;
        printResults();
    } else if (correctToggle) {
        correctToggle = false;
        localStorage.setItem("correctToggle", "false");
    }

    if (guessCount == 5) {
        inputBox.disabled = true;
        resultsButton.style.display = "flex";
    }

    normalWrongGuesses.forEach(guess => {
        const wrong = document.createElement("div");
        wrong.className = "endlessGuess wrong";
        wrong.textContent = guess;
        wrong.style.backgroundColor = "#d44c4c";
        lyricGuessList.prepend(wrong);
    });

    if (correctToggle) {
        const correct = document.createElement("div");
        correct.className = "endlessGuess correct";
        correct.textContent = currentSong.name;
        correct.style.backgroundColor = "#37c054";
        lyricGuessList.prepend(correct);
    }

    lyricGuessList.style.display = normalWrongGuesses.length > 0 || correctToggle
        ? "block"
        : "none";
}

function printResults() {

    resultContainer.classList.add("active");
    resultsButton.style.display = "flex";

    if (mode == 0){
        //console.log(resultsButton);

        reslts.style.display = "block";
        shareButton.textContent = "Share";

        reslts.innerHTML = `The correct answer was: <b>${songToday.name}</b>`;

        if (correctToggle) {
            if (guessCount == 0) {
                shareMessage.innerHTML = `I guessed today's Mili song in 1 guess!`;
            } else if (guessCount > 0) {
                shareMessage.innerHTML = `I guessed today's Mili song in ${guessCount + 1} guesses!`;
            }
        } else {
            shareMessage.textContent = `I couldn't guess today's Mili song...`;
        }
    } else if (mode == 1){

        reslts.style.display = "none";
        shareButton.textContent = "Share";

        restartButton.style.display = "flex";

        if (previousIndexs.length >= songList.length) {
            let livesUsed = startingLives - livesLeft;
            shareMessage.innerHTML =  `I beat endless mode! I got ${currentStreak}/${songList.length} songs correct!<br>`;
            return;
        }

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
    } else if (mode == 2) {

        if (lyricWon && lyricGuessCount == 1) {
            shareMessage.innerHTML = `I guessed today's lyric in 1 guess!`;
        } else if (lyricWon && lyricGuessCount>1){
            shareMessage.innerHTML = `I guessed today's lyric in ${lyricGuessCount} guesses!`;
        } else {
            shareMessage.innerHTML = `I couldn't guess today's lyric...`;
        }

        reslts.style.display = "block";
        reslts.innerHTML = `The correct answer was: <b>${currentSong.name}</b>`;
        shareButton.textContent = "Share";

        playButton.style.display = "block";
        playButton.disabled = !currentSong.id;
        playButton.innerHTML = "&#9654;";

        resultContainer.insertBefore(playButton, shareButton.nextSibling);
        resultsButton.style.display = "flex";
        
        loadSong(currentSong);
    }
    
}

function reset() {
    localStorage.clear();
    location.reload();
}

endlessButton.addEventListener("click", () => switchMode(endlessButton));
lyricButton.addEventListener("click", () => switchMode(lyricButton));

//button switches with the mode it left
function switchMode(button) {
    const modeNames = ["Normal Mode", "Endless Mode", "Lyric Mode"];
    const nextMode = modeNames.indexOf(button.textContent.trim());

    if (nextMode < 0 || nextMode == mode) {
        return;
    }

    const previousMode = mode;
    mode = nextMode;
    button.textContent = modeNames[previousMode];
    //button.classList.toggle("normal", button.textContent == "Normal Mode");
    body.classList.toggle("endlessMode", mode == 1);
    body.classList.toggle("lyricMode", mode == 2);

    if (mode == 0) {
        loadNormal();
    } else if (mode == 1) {
        loadEndless();
    } else {
        loadLyric();
    }
}

function loadEndless(){

    updateDayNavigation();
    audioContainer.appendChild(playButton);
    displaySongs(getGuessableSongs());
    shareButton.textContent = "Share";
    lyricGuessList.style.display = "none";
    inputBox.disabled = false;
    playButton.style.display = "block";
    volumeBar.style.display = "block";
    volumeIcon.style.display = "block";
    progressBar.style.display = "block";
    audioContainer.style.display = "flex";
    volumeBar.parentElement.style.display = "flex";
    scoreCounter.style.display = "block";
    guessTracker.classList.remove("lyricMode");
    lyricDisplay.hidden = true;
    guessTracker.style.height = "50px";
    lyricHintDisplay.hidden = true;
    inputBox.value = "";

    livesLeft = Math.min(livesLeft, startingLives);

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

    loadRandomSong();
}

function loadNormal() {

    updateDayNavigation();
    audioContainer.appendChild(playButton);
    displaySongs(getGuessableSongs());
    shareButton.textContent = "Share";
    lyricGuessList.style.display = "none";
    inputBox.disabled = false;
    playButton.style.display = "block";
    volumeBar.style.display = "block";
    volumeIcon.style.display = "block";
    progressBar.style.display = "block";
    audioContainer.style.display = "flex";
    volumeBar.parentElement.style.display = "flex";
    scoreCounter.style.display = "block";
    guessTracker.classList.remove("lyricMode");
    lyricDisplay.hidden = true;
    guessTracker.style.height = "50px";
    lyricHintDisplay.hidden = true;
    inputBox.value = "";

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

function loadLyric(){
    updateDayNavigation();
    audioContainer.appendChild(playButton);
    audioPlayer.pause();
    playButton.innerHTML = "&#9654;";

    boxes.forEach(box => {
        box.style.display = "none";
    });

    lives.forEach(life => {
        life.style.display = "none";
    });

    endlessList.style.display = "none";
    lyricGuessList.style.display = "none";
    restartButton.style.display = "none";
    resultsButton.style.display = "none";
    playButton.style.display = "none";
    volumeBar.style.display = "none";
    volumeIcon.style.display = "none";
    progressBar.style.display = "none";
    audioContainer.style.display = "none";
    volumeBar.parentElement.style.display = "none";
    scoreCounter.style.display = "block";
    boxes.forEach(box => {
        box.style.display = "none";
    });

    helpButton.style.backgroundColor = "#87c4cb";
    configButton.style.backgroundColor = "#87c4cb";

    information.textContent = "How To Play Lyric Mode";
    information1.textContent = "Guess the Mili song within 5 tries! ";
    information2.innerHTML = "Enter a song title based on the lyric. <br><br>Wrong guesses will give you additional lyrics! <br><br>After 3 wrong guesses, you will get the first letter. <br><br>After 4 wrong guesses, you will get the amount of letters in the song.";

    guessTracker.classList.add("lyricMode");
    guessTracker.style.height = "auto";
    lyricDisplay.hidden = false;
    resultContainer.classList.remove("active");
    dayCounter.textContent = "Day " + (daysPassedLyric + 1) + " - " + dateString;
    scoreCounter.textContent = "";
    inputBox.value = "";

    displaySongs(getGuessableSongs());
    loadDailyLyric();
}

function loadDailyLyric() {
    currentSong = dailyLyricEntry.song;

    let savedState = loadSavedState(lyricGameStateKey);
    if (!savedState && (localStorage.getItem("lyricGuessDate") === dateString
        || localStorage.getItem("lyricCompletedDate") === dateString)) {
        savedState = {
            guessCount: Number.parseInt(localStorage.getItem("lyricGuessCount"), 10) || 0,
            wrongGuesses: loadSavedGuesses("lyricWrongGuesses"),
            won: localStorage.getItem("lyricWon") === "true",
            completed: localStorage.getItem("lyricCompletedDate") === dateString
        };
    }

    lyricGuessCount = 0;
    lyricWon = false;
    lyricWrongGuesses = [];
    lyricCompleted = false;
    if (savedState) {
        if (Number.isInteger(savedState.guessCount)) {
            lyricGuessCount = Math.min(Math.max(savedState.guessCount, 0), 5);
        }
        lyricWon = savedState.won === true;
        if (Array.isArray(savedState.wrongGuesses)) {
            lyricWrongGuesses = savedState.wrongGuesses.filter(guess => typeof guess === "string");
        }
        lyricCompleted = savedState.completed === true;
    }
    if (lyricGuessCount === 5) {
        lyricCompleted = true;
    }

    if (lyricCompleted && lyricGuessCount === 0) {
        lyricWon = true;
        lyricGuessCount = 1;
    }

    renderLyricProgress();
    inputBox.disabled = lyricCompleted;

    if (lyricCompleted) {
        resultsButton.style.display = "flex";
    } else {
        resultsButton.style.display = "none";
    }

    displaySongs(getGuessableSongs());
}

function saveLyricState() {
    const savedState = {
        guessCount: lyricGuessCount,
        wrongGuesses: lyricWrongGuesses,
        won: lyricWon,
        completed: lyricCompleted
    };
    localStorage.setItem(lyricGameStateKey, JSON.stringify(savedState));
    localStorage.setItem("lyricGuessDate", dateString);
    localStorage.setItem("lyricGuessCount", lyricGuessCount);
    localStorage.setItem("lyricWrongGuesses", JSON.stringify(lyricWrongGuesses));
    localStorage.setItem("lyricWon", lyricWon);
}

function renderLyricProgress() {

    let extraSections = Math.min(lyricWrongGuesses.length,2);

    if (lyricWon) {
        extraSections = 2;
        printResults();
    } 
    
    const visibleSections = dailyLyricSections.slice(
        dailyLyricStartIndex,
        dailyLyricStartIndex + extraSections + 1
    );

    lyricDisplay.textContent = visibleSections.join("\n\n");

    if (lyricWrongGuesses.length >= 4 || lyricWon) {
        lyricHintDisplay.textContent = `${currentSong.name.match(/\p{L}/u)?.[0] || currentSong.name.charAt(0)}` + currentSong.name.replace(/\p{L}/u, "").replace(/\p{L}/gu, "_");
        lyricHintDisplay.hidden = false;
    } else if (lyricWrongGuesses.length >= 3) {
        lyricHintDisplay.textContent = `${currentSong.name.match(/\p{L}/u)?.[0] || currentSong.name.charAt(0)}...`;
        lyricHintDisplay.hidden = false;
    } else {
        lyricHintDisplay.textContent = "";
        lyricHintDisplay.hidden = true;
    }

    lyricGuessList.innerHTML = "";
    lyricWrongGuesses.forEach(guess => {
        const wrong = document.createElement("div");
        wrong.className = "endlessGuess wrong";
        wrong.textContent = guess;
        wrong.style.backgroundColor = "#d44c4c";
        lyricGuessList.prepend(wrong);
    });

    if (lyricWon) {
        const correct = document.createElement("div");
        correct.className = "endlessGuess correct";
        correct.textContent = currentSong.name;
        correct.style.backgroundColor = "#37c054";
        lyricGuessList.prepend(correct);
    }

    if (lyricWrongGuesses.length > 0 || lyricWon) {
        lyricGuessList.style.display = "block";
    } else {
        lyricGuessList.style.display = "none";
    }
}

function getLyricSections(lyricText, songTitle) {
    const escapedTitle = songTitle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const maskedLyrics = lyricText.replace(new RegExp(escapedTitle, "gi"), "_______");

    return maskedLyrics.trim().split(/\r?\n\s*\r?\n/).flatMap(section => {
        const lines = section.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        const chunks = [];

        for (let index = 0; index < lines.length; index += 4) {
            chunks.push(lines.slice(index, index + 4).join("\n"));
        }

        return chunks;
    });
}

function getGuessableSongs() {
    if (mode === 2) {
        return [...new Map(allSongs.map(song => [song.name, song])).values()]
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    return songList;
}

function loadRandomSong(){
     //load a random song into audio player
    if (songList.length === 0) {
        return;
    }

    previousIndexs = previousIndexs.filter(index => index < songList.length);

    if (previousIndexs.length >= songList.length) {
        audioPlayer.pause();
        playButton.innerHTML = "&#9654;";
        printResults();
        restartButton.style.display = "flex";
        resultsButton.style.display = "flex";
        return
    }

    let randomIndex = Math.floor(Math.random() * songList.length);
    
    while (previousIndexs.indexOf(randomIndex) !== -1){
        randomIndex = Math.floor(Math.random() * songList.length);
    }

    //store the last song in endless
    endlessSong = songList[randomIndex];
    endlessNonce = generateEndlessNonce();

    newEndlessSong = true;

    previousIndexs.push(randomIndex);
    //console.log(Number(randomIndex));
    loadSong(songList[randomIndex]);
}

function buildClipUrl(song) {
    if (mode == 0) {
        return `${AUDIO_API}/clip?s=${encodeURIComponent(song.id)}&m=d&g=${Math.min(guessCount, 4)}`;
    }
    if (mode == 2) {
        return `${AUDIO_API}/clip?s=${encodeURIComponent(song.id)}&m=d&g=4`;
    }
    return `${AUDIO_API}/clip?s=${encodeURIComponent(song.id)}&m=e&l=${getClipLength()}&n=${encodeURIComponent(endlessNonce)}`;
}

function loadSong(song) {
    currentSong = song;

    audioReady = false;
    playButton.removeAttribute("title");
    playButton.disabled = true;
    playButton.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    audioPlayer.pause();

    songString = buildClipUrl(song);
    audioFile.src = songString;
    audioPlayer.load();
}

function restartEndless() {
    endlessList.innerHTML = "";
    currentStreak = 0;
    livesLeft = startingLives;
    endlessSong = null;
    previousIndexs = [];
    endlessNonce = generateEndlessNonce();

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
    return data.split("\n").map(l => l.trim()).filter(Boolean).map(line => {
        const [name, id] = line.split("|");
        return { name: name.trim(), id: id.trim() };
    });
}

function normalizeSongName(name) {
    return name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function debug(){
    dev = !dev;
}

audioPlayer.addEventListener('seeking', () => {
    if (dev) {
        console.log("Seeking:", audioPlayer.currentTime);
    }
});

audioPlayer.addEventListener('seeked', () => {
    if (dev) {
        console.log("Seeked:", audioPlayer.currentTime);
    }
});

audioPlayer.addEventListener('playing', () => {
    if (dev) {
        console.log("Played:", audioPlayer.currentTime);
    }
});

audioPlayer.addEventListener('waiting', () => {
    if (dev) {
        console.log("Waiting:", audioPlayer.currentTime);
    }
});

function skip(){
    if (mode == 1 && previousIndexs.length < songList.length) {
        const skip = document.createElement("div");

        skip.className = "endlessGuess skipped";
        skip.textContent = currentSong.name;
        skip.style.backgroundColor = "gray";

        endlessList.prepend(skip);

        loadRandomSong();
        console.log("Skipped song!");

        inputBox.value = "";

        return;
    }
}

function seekAudioTo(targetTime, shouldPlay = false) {
    if (!audioReady) {
        return;
    }

    let maxTime = 0;
    if (Number.isFinite(audioPlayer.duration)) {
        maxTime = audioPlayer.duration;
    }

    const safeTarget = Math.min(Math.max(targetTime, 0), maxTime);

    audioPlayer.pause();
    seekingProgress = true;

    const startPlayback = () => {
        seekingProgress = false;

        if (!shouldPlay) {
            playButton.innerHTML = "&#9654;";
            return;
        }

        audioPlayer.play().then(() => {
            playButton.innerHTML = "&#10074;&#10074;";
            requestAnimationFrame(updateProgress);
        }).catch(error => {
            if (error.name !== "AbortError") {
                console.error("Audio play error:", error);
            }
        });
    };

    const onSeeked = () => {
        audioPlayer.removeEventListener("seeked", onSeeked);
        startPlayback();
    };

    audioPlayer.addEventListener("seeked", onSeeked);

    audioPlayer.currentTime = safeTarget;
}

function load(name) {
    const requestedName = name.trim().toLowerCase();
    const song = songList.find(song => song.name.toLowerCase() === requestedName);

    if (!song) {
        console.log("Not found");
        return;
    }

    loadSong(song);
}




/*TODO:

Make it so mobile does not have a blank pause before playing
make the help popup show up on the users first visit ever
confetti!
organize code + comments
Links on bottom of the page linking to github repo & mili's socials
swapping off the base audio element bar
Top buttons seem hard to press on mobile?
Make the endless mode copy message shorten after a certain amount of songs.
I Am a Fluff is quiet. 
give them the full song after getting the song in the normal mode.

******Large tasks:

Somehow prevent name drops in the audio clips?

*/
