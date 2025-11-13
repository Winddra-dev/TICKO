document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen HTML Utama ---
    const loginScreen = document.getElementById('login-screen');
    const mainMenu = document.getElementById('main-menu');
    const gameScreen = document.getElementById('game-screen');
    const cells = document.querySelectorAll('.cell');
    const gameInfo = document.getElementById('game-info');
    const backButton = document.getElementById('back-button');

    // --- Elemen Menu & Level ---
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const welcomeMessage = document.getElementById('welcome-message');
    const levelButtons = document.querySelectorAll('.level-button');
    const startSoloGameButton = document.getElementById('start-solo-game');
    const selectedLevelDisplay = document.getElementById('selected-level-display');
    const botLevelDisplay = document.getElementById('bot-level-display');
    const currentMode = document.getElementById('current-mode');
    
    // --- Elemen Mini-Game Modal ---
    const minigameModal = document.getElementById('minigame-modal');
    const submitAnswerButton = document.getElementById('submit-answer-button');
    const closeModalButton = document.getElementById('close-modal-button');
    const quizAnswerInput = document.getElementById('quiz-answer');
    const quizStatus = document.getElementById('quiz-status');
    const quizQuestionDisplay = document.getElementById('quiz-question');
    const minigameLevelDisplay = document.getElementById('minigame-level-display');


    // --- Status Game ---
    let currentPlayer = 'X';
    let gameActive = true;
    let boardState = ['', '', '', '', '', '', '', '', ''];
    let selectedLevel = null;
    let currentCellIndex = null;
    let currentQuestion = { q: '', a: '' };

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    const allLevels = ['medium', 'intermediate', 'hard', 'expert', 'sensei'];

    // --- BANK SOAL DIPERBARUI (LEBIH BANYAK DAN LEBIH SULIT UNTUK MATEMATIKA) ---
    const questionBank = {
        'math': {
            'medium': [
                { q: "Berapa hasil dari 9 x 8?", a: 72 },
                { q: "Jika Anda memiliki 25 kelereng dan kehilangan 9, berapa sisa kelereng?", a: 16 },
                { q: "Berapa hasil dari 150 dibagi 3?", a: 50 },
                { q: "Berapa hasil dari 11 + 13 - 4?", a: 20 },
                { q: "Berapa kuadrat dari 5 (5^2)?", a: 25 },
            ],
            'intermediate': [
                { q: "Berapa hasil dari 15 kuadrat (15^2)?", a: 225 },
                { q: "Berapa akar kuadrat dari 100?", a: 10 },
                { q: "Jika 2x = 18, berapakah nilai x?", a: 9 },
                { q: "Hitung: 6 x (10 - 2)", a: 48 },
                { q: "Berapa hasil dari 4/5 + 1/5?", a: 1 },
                { q: "Hitung: 121 dikurangi 49.", a: 72 },
            ],
            'hard': [
                { q: "Berapa hasil dari 15 + 6 x 2 - 5? (Perhatikan urutan operasi)", a: 22 },
                { q: "Berapa volume kubus dengan panjang sisi 5 cm?", a: 125 },
                { q: "Berapa akar kuadrat dari 144?", a: 12 },
                { q: "Berapa 15% dari 200?", a: 30 },
                { q: "Jika 4x - 10 = 30, berapakah nilai x?", a: 10 },
                { q: "Berapa hasil dari 1/2 dari 360?", a: 180 },
            ],
            'expert': [
                { q: "Berapa akar kuadrat dari 225?", a: 15 },
                { q: "Berapa volume kubus dengan panjang sisi 6 cm?", a: 216 },
                { q: "Jika 5x + 12 = 47, berapakah nilai x?", a: 7 },
                { q: "Hitung: 100 - (5 x 10 + 2)", a: 48 },
                { q: "Berapa 25% dari 480?", a: 120 },
                { q: "Berapa hasil dari 1/4 + 3/4 x 2?", a: 7/4 }, // Jawaban: 1.75
                { q: "Berapa hasil dari 1/4 + 3/4 x 2?", a: "1.75" },
            ],
            'sensei': [
                { q: "Berapa volume kubus dengan panjang sisi 8 cm?", a: 512 },
                { q: "Hitung: 200 / (5 x 4) + 10", a: 20 },
                { q: "Berapa akar kuadrat dari 324?", a: 18 },
                { q: "Jika 7x - 5 = 100, berapakah nilai x?", a: 15 },
                { q: "Berapa hasil dari 0.75 x 400?", a: 300 },
                { q: "Berapa volume balok dengan panjang 4, lebar 3, dan tinggi 5?", a: 60 },
                { q: "Hitung: (1/3) + (1/6) dalam bentuk pecahan sederhana.", a: "1/2" },
            ]
        },
        'general': {
            'medium': [
                { q: "Apa nama planet terdekat dengan matahari?", a: "Merkurius" },
                { q: "Apa ibukota Indonesia?", a: "Jakarta" },
                { q: "Warna apa yang dihasilkan dari pencampuran warna kuning dan biru?", a: "Hijau" },
                { q: "Alat musik apa yang dimainkan dengan cara ditiup?", a: "Suling" },
                { q: "Apa yang dikeluarkan oleh lebah?", a: "Madu" },
            ],
            'intermediate': [
                { q: "Siapa nama presiden pertama Republik Indonesia?", a: "Soekarno" },
                { q: "Di negara mana letak Tembok Besar (Great Wall)?", a: "Tiongkok" },
                { q: "Apa nama tulang yang melindungi otak manusia?", a: "Tengkorak" },
                { q: "Berapa jumlah hari dalam satu tahun kabisat?", a: 366 },
                { q: "Siapa penemu listrik?", a: "Michael Faraday" },
            ],
            'hard': [
                { q: "Berapa jumlah benua di dunia?", a: 7 },
                { q: "Apa nama gas yang paling banyak terdapat di atmosfer bumi?", a: "Nitrogen" },
                { q: "Apa mata uang Jepang?", a: "Yen" },
                { q: "Apa nama ibukota Thailand?", a: "Bangkok" },
                { q: "Siapa penulis novel 'Laskar Pelangi'?", a: "Andrea Hirata" },
                { q: "Pada tanggal berapa Hari Pahlawan Nasional diperingati?", a: "10 November" },
            ],
            'expert': [
                { q: "Apa satuan dasar untuk gaya dalam sistem SI?", a: "Newton" },
                { q: "Apa nama ibukota Kanada?", a: "Ottawa" },
                { q: "Siapa ilmuwan yang merumuskan Teori Relativitas?", a: "Albert Einstein" },
                { q: "Berapa lama periode revolusi bumi mengelilingi matahari?", a: "365.25 hari" },
                { q: "Apa nama pigmen yang memberi warna hijau pada tumbuhan?", a: "Klorofil" },
                { q: "Apa nama samudra terbesar di dunia?", a: "Pasifik" },
            ],
            'sensei': [
                { q: "Pada tahun berapa Perang Dunia II berakhir?", a: 1945 },
                { q: "Apa nama struktur di sel tumbuhan yang berfungsi melakukan fotosintesis?", a: "Kloroplas" },
                { q: "Apa nama garis lintang 0 derajat?", a: "Ekuator" },
                { q: "Siapa nama arsitek yang merancang Candi Borobudur (di masa modern)?", a: "Theodoor van Erp" },
                { q: "Apa nama unsur kimia dengan simbol Fe?", a: "Besi" },
                { q: "Siapa penulis drama tragedi 'Romeo and Juliet'?", a: "William Shakespeare" },
                { q: "Apa nama cabang ilmu biologi yang mempelajari serangga?", a: "Entomologi" },
            ]
        },
        'logic': {
            'medium': [
                { q: "Jika kemarin adalah hari Rabu, hari apakah lusa?", a: "Jumat" },
                { q: "Saya selalu di depan, tetapi tidak pernah tiba. Apakah saya?", a: "Masa Depan" },
                { q: "Apa yang selalu basah saat dikeringkan?", a: "Handuk" },
                { q: "Seekor kucing masuk ke dalam rumah. Apa yang pertama ia injak?", a: "Lantai" },
                { q: "Ada 12 bulan, 7 di antaranya memiliki 31 hari. Berapa bulan yang memiliki 28 hari?", a: 12 },
            ],
            'intermediate': [
                { q: "Ada ibu, ayah, dan 3 anak perempuan. Setiap anak perempuan punya 1 saudara laki-laki. Berapa jumlah orang dalam keluarga itu?", a: 6 },
                { q: "Semakin banyak diambil, semakin banyak yang tersisa. Apakah itu?", a: "Lubang" },
                { q: "Apa yang bisa keliling dunia tanpa meninggalkan pojok?", a: "Perangko" },
                { q: "Saya memiliki kota, tetapi tidak ada rumah. Saya memiliki gunung, tetapi tidak ada pohon. Saya memiliki air, tetapi tidak ada ikan. Apakah saya?", a: "Peta" },
                { q: "Angka apakah yang jika dibalik nilainya tetap sama?", a: 8 },
            ],
            'hard': [
                { q: "Tiga orang sedang berjalan di bawah satu payung kecil. Mengapa tidak ada yang basah?", a: "Tidak hujan" },
                { q: "Apa yang bisa dipecahkan, tetapi tidak bisa dipegang?", a: "Janji" },
                { q: "Terdapat 10 ekor burung di atas pohon. Ditembak 1, berapa sisanya?", a: 1 },
                { q: "Ayah Rina punya 5 anak: Nana, Nene, Nini, Nono. Siapa nama anak kelima?", a: "Rina" },
                { q: "Apa yang memiliki leher tetapi tidak memiliki kepala?", a: "Baju" },
            ],
            'expert': [
                { q: "Jika Anda menjatuhkan bola merah ke laut biru, apa yang terjadi?", a: "Basah" },
                { q: "Apa yang selalu datang tetapi tidak pernah tiba?", a: "Hari Esok" },
                { q: "Jika ada 4 lilin menyala, 2 padam. Berapa lilin yang tersisa?", a: 2 },
                { q: "Apa yang naik tetapi tidak pernah turun?", a: "Usia" },
                { q: "Lima saudara perempuan sedang sibuk. Anna membaca, Bella memasak, Cindy bermain catur, Donna mencuci. Apa yang dilakukan oleh saudara kelima?", a: "Bermain catur" },
            ],
            'sensei': [
                { q: "Sebuah kapal penuh penumpang, tetapi tidak ada satu orang pun di atasnya. Mengapa?", a: "Kapal Udara" },
                { q: "Saya dimulai dengan 'e', diakhiri dengan 'e', dan hanya memiliki satu huruf. Apakah saya?", a: "Envelope" },
                { q: "Apa yang bisa Anda ambil dengan tangan kiri, tetapi tidak bisa Anda ambil dengan tangan kanan?", a: "Siku kanan" },
                { q: "Apa yang dimiliki semua orang, tetapi diberikan ke orang lain saat ia berhenti?", a: "Nama" },
                { q: "Saya adalah angka ganjil. Jika Anda menambahkan satu huruf pada saya, saya menjadi genap. Angka berapakah saya?", a: 7 },
            ]
        }
    };

    // --- Fungsi Utilitas Navigasi & Game ---

    function showScreen(screenToShow) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        screenToShow.classList.add('active');
    }

    function startGame() {
        currentPlayer = 'X';
        gameActive = true;
        boardState = ['', '', '', '', '', '', '', '', ''];
        gameInfo.textContent = `Giliran: ${currentPlayer}`;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('X', 'O', 'blocked');
        });
        botLevelDisplay.textContent = selectedLevel.toUpperCase();
    }

    // --- Logika Pemilihan Soal Berdasarkan Level ---
    
    function getQuestionDifficultyPool(selectedLevel) {
        // Mendapatkan pool tingkat kesulitan yang mungkin
        const levelIndex = allLevels.indexOf(selectedLevel);
        let possibleLevels = [selectedLevel];

        if (levelIndex > 0) {
            possibleLevels.push(allLevels[levelIndex - 1]);
        }
        // Sensei/Expert juga bisa mendapat Hard untuk variasi
        if (selectedLevel === 'sensei' || selectedLevel === 'expert') {
            possibleLevels.push('hard');
        }
        return Array.from(new Set(possibleLevels));
    }

    function generateQuestion(level) {
        const categories = Object.keys(questionBank);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        
        const possibleLevels = getQuestionDifficultyPool(level);
        
        let pool = [];
        let levelToPickFrom = '';

        // Prioritaskan level yang paling sulit dalam pool
        for (let i = possibleLevels.length - 1; i >= 0; i--) {
            const lvl = possibleLevels[i];
            if (questionBank[randomCategory][lvl] && questionBank[randomCategory][lvl].length > 0) {
                pool = questionBank[randomCategory][lvl];
                levelToPickFrom = lvl;
                break;
            }
        }
        
        if (pool.length === 0) {
            pool = questionBank['math']['medium']; 
            levelToPickFrom = 'medium';
        }

        const randomIndex = Math.floor(Math.random() * pool.length);
        const qData = pool[randomIndex];
        
        qData.qLevel = levelToPickFrom;
        qData.a = String(qData.a).toLowerCase().trim();

        return qData;
    }

    // --- Mini-Game Logic ---

    function showMinigameModal(cellIndex) {
        currentCellIndex = cellIndex;
        
        currentQuestion = generateQuestion(selectedLevel);

        quizQuestionDisplay.textContent = currentQuestion.q;
        minigameLevelDisplay.textContent = currentQuestion.qLevel.toUpperCase();
        quizAnswerInput.value = '';
        quizStatus.textContent = '';
        submitAnswerButton.classList.remove('hidden');
        closeModalButton.classList.add('hidden');

        minigameModal.classList.add('active');
        quizAnswerInput.focus();
    }

    function handleSubmitAnswer() {
        const userAnswer = String(quizAnswerInput.value).toLowerCase().trim();
        const correctAnswer = currentQuestion.a; 
        
        // Blokir input setelah tombol submit diklik/ditekan
        quizAnswerInput.disabled = true;

        if (userAnswer === correctAnswer) {
            quizStatus.textContent = 'BENAR! Tanda berhasil Anda pasang.';
            quizStatus.classList.remove('wrong');
            quizStatus.classList.add('correct');
            
            handleCellMark(cells[currentCellIndex], currentCellIndex);
            
            submitAnswerButton.classList.add('hidden');
            // Sedikit delay sebelum tutup agar user melihat status
            setTimeout(() => {
                minigameModal.classList.remove('active');
                quizAnswerInput.disabled = false; // Reset input status
            }, 500);

        } else {
            quizStatus.textContent = 'SALAH! Giliran pindah ke Bot.';
            quizStatus.classList.remove('correct');
            quizStatus.classList.add('wrong');
            
            handlePlayerChange();
            
            submitAnswerButton.classList.add('hidden');
            closeModalButton.classList.remove('hidden');
            cells[currentCellIndex].classList.add('blocked');
        }
    }

    // Event listener untuk tombol Kirim Jawaban
    submitAnswerButton.addEventListener('click', handleSubmitAnswer);

    closeModalButton.addEventListener('click', () => {
        minigameModal.classList.remove('active');
        quizAnswerInput.disabled = false; // Reset input status
    });

    // --- FUNGSI ENTER KEYBOARD ---
    document.addEventListener('keydown', (event) => {
        // Cek jika modal aktif dan tombol Enter ditekan
        if (minigameModal.classList.contains('active') && event.key === 'Enter') {
            event.preventDefault(); // Mencegah form submit default
            
            // Prioritas 1: Kirim Jawaban
            if (!submitAnswerButton.classList.contains('hidden')) {
                handleSubmitAnswer(); 
            // Prioritas 2: Tutup Modal (Setelah jawaban salah)
            } else if (!closeModalButton.classList.contains('hidden')) {
                closeModalButton.click(); 
            }
        }
    });

    // --- Game Engine Logic (Tic-Tac-Toe) ---

    function checkResult() {
        let roundWon = false;
        for (const condition of winningConditions) {
            let [a, b, c] = condition;
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            gameInfo.textContent = `Pemain ${currentPlayer} MENANG! 🎉`;
            gameActive = false;
            return true;
        }

        if (!boardState.includes('')) {
            gameInfo.textContent = 'SERI!';
            gameActive = false;
            return true;
        }
        return false;
    }

    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameInfo.textContent = `Giliran: ${currentPlayer}`;

        if (gameActive && currentPlayer === 'O') {
            setTimeout(botMove, 700);
        }
    }
    
    function handleCellMark(clickedCell, clickedCellIndex) {
        boardState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer);
        clickedCell.classList.remove('blocked'); 

        if (!checkResult()) {
            handlePlayerChange();
        }
    }

    cells.forEach(cell => {
        cell.addEventListener('click', (event) => {
            const clickedCell = event.target;
            const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
            
            if (boardState[clickedCellIndex] !== '' || !gameActive || currentPlayer !== 'X' || clickedCell.classList.contains('blocked')) {
                return;
            }
            
            showMinigameModal(clickedCellIndex);
        });
    });

    // --- Logika Bot Bertingkat (AI Simulasi Strategi) ---

    const getEmptyCells = () => boardState.map((val, index) => val === '' ? index : null).filter(val => val !== null);
    
    function findStrategicSpot(player, opponent, isBlocking = false) {
        for (const condition of winningConditions) {
            const [a, b, c] = condition;
            
            const pCount = [a, b, c].filter(i => boardState[i] === player).length;
            const oCount = [a, b, c].filter(i => boardState[i] === opponent).length;
            const emptyCell = [a, b, c].find(i => boardState[i] === '');

            if (!isBlocking && pCount === 2 && oCount === 0 && emptyCell !== undefined) {
                return emptyCell; // Win Move
            }

            if (isBlocking && oCount === 2 && pCount === 0 && emptyCell !== undefined) {
                 return emptyCell; // Block Move
            }
        }
        return null;
    }

    function botMove() {
        if (!gameActive || currentPlayer !== 'O') return;

        let move = null;
        const emptyCells = getEmptyCells();

        if (emptyCells.length === 0) return;

        const winMove = findStrategicSpot('O', 'X', false);
        const blockMove = findStrategicSpot('X', 'O', true);
        const center = 4;
        const corners = [0, 2, 6, 8].filter(i => boardState[i] === '');
        const randomEmpty = emptyCells[Math.floor(Math.random() * emptyCells.length)];

        switch (selectedLevel) {
            case 'medium':
                if (Math.random() < 0.5 && winMove !== null) { move = winMove; }
                else { move = randomEmpty; }
                break;
            
            case 'intermediate':
                move = winMove || blockMove || randomEmpty;
                break;

            case 'hard':
                move = winMove || blockMove;
                if (move === null && boardState[center] === '') move = center;
                if (move === null) move = randomEmpty;
                break;
            
            case 'expert':
                move = winMove || blockMove;
                if (move === null && boardState[center] === '') move = center;
                if (move === null && corners.length > 0) move = corners[Math.floor(Math.random() * corners.length)];
                if (move === null) move = randomEmpty;
                break;

            case 'sensei':
                move = winMove || blockMove;
                if (move === null && boardState[center] === '') move = center;
                if (move === null && corners.length > 0) move = corners[0]; 
                if (move === null) move = emptyCells[0]; 
                break;
        }

        if (move !== null && move !== undefined) {
            // Bot selalu 'memenangkan' mini-game secara instan
            const botCell = cells[move];
            handleCellMark(botCell, move);
        }
    }
    
    // --- Event Listener Navigasi & Login ---

    loginButton.addEventListener('click', () => {
        const username = usernameInput.value.trim() || 'TICKO Player';
        welcomeMessage.textContent = `Selamat Datang, ${username}!`;
        showScreen(mainMenu);
    });

    backButton.addEventListener('click', () => {
        showScreen(mainMenu);
    });
    
    // --- Pemilihan Level Bot ---

    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            levelButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            selectedLevel = button.getAttribute('data-level');
            selectedLevelDisplay.textContent = selectedLevel.toUpperCase();
            startSoloGameButton.disabled = false;
        });
    });

    startSoloGameButton.addEventListener('click', () => {
        if (!selectedLevel) return;
        currentMode.textContent = 'Solo';
        showScreen(gameScreen);
        startGame();
    });

    // Inisialisasi: Tampilkan layar login/profile
    showScreen(loginScreen);
});