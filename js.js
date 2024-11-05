let correctCountry;
let options = [];
let correctCount = 0;
let wrongCount = 0;
let timer;
let timeLeft = 30;

function startTimer() {
    timeLeft = 30;
    document.getElementById('timer').textContent = `Tempo: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Tempo: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null); // Marca como incorreto se o tempo acabar
        }
    }, 1000);
}

function resetGame() {
    document.getElementById('result').innerHTML = '';
    document.getElementById('nextButton').style.display = 'none';
    startTimer();
    getRandomCountries();
}

function displayQuestion() {
    if (correctCountry) {
        // Exibe a bandeira do país correto
        document.getElementById('flagImage').src = correctCountry.flags.png;
        document.getElementById('flagImage').style.display = 'block';

        const optionsDiv = document.getElementById('options');
        optionsDiv.innerHTML = ''; // Limpa as opções anteriores

        // Cria botões para as opções de países
        options.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('btn', 'btn-outline-primary', 'm-2');
            button.innerText = getCountryNameInPortuguese(option);
            button.onclick = () => checkAnswer(option);
            optionsDiv.appendChild(button);
        });
    }
}

function getCountryNameInPortuguese(country) {
    // Verifica se há tradução para português
    return country.translations && country.translations.por
        ? country.translations.por.common
        : country.name.common;
}

function getRandomCountries() {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            // Seleciona um país aleatório como o correto
            const randomIndex = Math.floor(Math.random() * data.length);
            correctCountry = data[randomIndex];
            options = [correctCountry];

            // Adiciona mais 3 opções aleatórias de países
            while (options.length < 4) {
                const randomOption = data[Math.floor(Math.random() * data.length)];
                if (!options.includes(randomOption)) {
                    options.push(randomOption);
                }
            }

            // Embaralha as opções
            options.sort(() => Math.random() - 0.5);

            displayQuestion();
        })
        .catch(error => console.error('Erro ao carregar países:', error));
}

function checkAnswer(selected) {
    clearInterval(timer);
    const resultDiv = document.getElementById('result');
    
    // Desabilita todos os botões após a seleção de uma resposta
    const optionButtons = document.querySelectorAll('#options button');
    optionButtons.forEach(button => button.disabled = true);

    if (selected && selected.name.common === correctCountry.name.common) {
        resultDiv.innerHTML = '<p class="text-success">Correto!</p>';
        correctCount++;
        document.getElementById('correctCount').textContent = correctCount;
    } else {
        resultDiv.innerHTML = `<p class="text-danger">Incorreto! O país correto era: ${getCountryNameInPortuguese(correctCountry)}</p>`;
        wrongCount++;
        document.getElementById('wrongCount').textContent = wrongCount;
    }
    
    document.getElementById('nextButton').style.display = 'block';
}

// Configura o evento do botão "Próximo"
document.getElementById('nextButton').onclick = () => {
    resetGame();
};

// Inicializa o quiz
resetGame();
