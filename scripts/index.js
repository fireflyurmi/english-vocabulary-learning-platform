// for the display of synonyms
const createElements = (arr)=>{
    const htmlElements = arr.map((el)=> `<span class="btn">${el}</span>`);
    return (htmlElements.join(" "));
};
// for speaker
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// spinner
const manageSpinner = (status)=>{
    if(status===true){
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    }else{
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
}

loadLessons=()=>{
    fetch("https://openapi.programming-hero.com/api/levels/all") // Promise of response
    .then((res)=> res.json()) // Promise of json data
    .then((json)=> displayLessons(json.data));
};

const removeActive=()=>{
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    lessonButtons.forEach((btn)=> btn.classList.remove("active"));
}

const loadLevelWord=(id)=>{
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then((res)=> res.json())
    .then((data)=> {
        removeActive(); // remove all active class
        const clickBtn = document.getElementById(`lesson-btn-${id}`);
        clickBtn.classList.add("active"); // add active class
        displayLevelWords(data.data)
    });
};

const loadWordDetail= async(id)=>{
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
};

const displayWordDetails=(word)=>{
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
            <div class="">
                <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})</h2>
            </div>
            <div class="">
                <h2 class="font-bold">Meaning</h2>
                <p>${word.meaning}</p>
            </div>
            <div class="">
                <h2 class="font-bold">Example</h2>
                <p>${word.sentence}</p>
            </div>
            <div class="">
                <h2 class="font-bold">Synonyms</h2>
                <div class="">${createElements(word.synonyms)}</div>
            </div>
    ` ;
    document.getElementById("word_modal").showModal();
};

const displayLevelWords=(words)=>{
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "" ;

    if(words.length === 0){
        wordContainer.innerHTML = `
        <div class="text-center col-span-full space-y-6 bg-sky-100 rounded-xl py-10 font-bangla">
            <img class="mx-auto" src="./assets/alert-error.png">
            <p class="text-[#45454884] font-semibold">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="font-bold text-3xl">নেক্সট Lesson এ যান</h2>
        </div>
        ` ;
        manageSpinner(false);
        return ;
    }

    words.forEach(word => {
        const card = document.createElement("div");
        card.innerHTML = `
        <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-3">
            <h2 class="text-2xl font-bold">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
            <p class="font-medium">Meaning /Pronunciation</p>
            <div class="font-bangla font-semibold text-2xl text-[#18181bb9]">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#c9ddf0] hover:bg-[#70b1ef]"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-[#c9ddf0] hover:bg-[#70b1ef]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        `;
        wordContainer.append(card);
    });
    manageSpinner(false);
};

const displayLessons = (lessons) => {
    // get the container & empty it
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "" ;
    // get into every lessons
    for(let lesson of lessons){
        // create element
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn">
            <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no} 
        </button>
        `;
        // append the element
        levelContainer.append(btnDiv);
    }
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", ()=>{
    removeActive();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res)=>res.json())
    .then((data)=>{
        const allWords = data.data ;
        const filterWords = allWords.filter(word=> word.word.toLowerCase().includes(searchValue));
        displayLevelWords(filterWords);
    });
});



