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

let guessCount = 0;
let correctToggle = false;
let focusIndex = -1;

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
    { name: "Utopiosphere -Platonism-", file: "utopiosphere.mp3" },
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

//get current date and time
const startingDate = new Date("2026-8-1");
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

let startTime = 0;
let endTime = 5;
let songLength = 0;

audioPlayer.addEventListener('loadedmetadata', () => {
    console.log("Metadata loaded!");
    console.log("Duration:", audioFile.duration);

    songLength = audioPlayer.duration;

    console.log("songLength:", songLength);

    setGuessTime();
});

//volume bar
audioPlayer.volume = volumeBar.value;
volumeBar.addEventListener('input', () => {
    audioPlayer.volume = volumeBar.value; 
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
    focusIndex = -1;
}

inputBox.addEventListener('keydown', (event) => {

    if (correctToggle) {
        return; // if the correct songle is already guessed, stop taking more guesses
    }

    if (event.key === 'Enter' && inputBox.value === songToday.name && focusIndex == -1) {
        console.log("Correct song entered!");
        resultContainer.classList.add("active");
        correctToggle = true;
        shareMessage.textContent = `I guessed today's Mili song in ${guessCount + 1} guesses!`;
        boxes[guessCount].style.backgroundColor = "#00ff00"; // Change to green
        guessCount++;
    } else if (event.key === 'Enter' && inputBox.value !== songToday.name && focusIndex == -1) {
        console.log("Incorrect song entered.");
        resultContainer.classList.remove("active");
        inputBox.value = ""; //clear input
        boxes[guessCount].style.backgroundColor = "#ff0000"; // Change to red
        guessCount++;
        setGuessTime();
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
    } else if (event.key === "Enter") {
        songItems[focusIndex].classList.remove('focused');
        if (focusIndex >= 0 && focusIndex < songItems.length) {
                inputBox.value = songItems[focusIndex].textContent;
                focusIndex = -1;
        }
    }

    console.log("Focus index:", focusIndex);
    songItems[focusIndex].classList.add('focused');
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

function setGuessTime() {

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
    console.log(`Guess ${guessCount + 1}: Start time set to ${startTime.toFixed(2)} seconds, End time set to ${endTime.toFixed(2)} seconds.`);
    console.log(`Song length: ${songLength.toFixed(2)} seconds.`);
};

