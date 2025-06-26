// Variabel global
let is24HourFormat = false;
let isDarkMode = true;
let currentMode = 'clock'; // 'clock', 'stopwatch', 'timer'
let stopwatchInterval = null;
let stopwatchSeconds = 0;
let timerInterval = null;
let timerSeconds = 0;
let clockInterval = null;
let alarms = []; // Array untuk menyimpan alarm
let alarmAudio = null;
let timerAudio = null;
let alarmCheckInterval = null;

// Elemen DOM
const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const timezoneElement = document.getElementById('timezone');
const hourHand = document.getElementById('hourHand');
const minuteHand = document.getElementById('minuteHand');
const secondHand = document.getElementById('secondHand');
const themeToggle = document.getElementById('themeToggle');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const timeFormatBtn = document.getElementById('timeFormatBtn');
const stopwatchBtn = document.getElementById('stopwatchBtn');
const timerBtn = document.getElementById('timerBtn');
const alarmBtn = document.getElementById('alarmBtn');
const alarmModal = document.getElementById('alarmModal');
const alarmTimeInput = document.getElementById('alarmTime');
const setAlarmBtn = document.getElementById('setAlarmBtn');
const cancelAlarmBtn = document.getElementById('cancelAlarmBtn');
const alarmActiveModal = document.getElementById('alarmActiveModal');
const stopAlarmBtn = document.getElementById('stopAlarmBtn');
const alarmActiveText = document.getElementById('alarmActiveText');
const alarmList = document.getElementById('alarmList');
const timerActiveModal = document.getElementById('timerActiveModal');
const stopTimerBtn = document.getElementById('stopTimerBtn');
const timerActiveText = document.getElementById('timerActiveText');
const body = document.body;
const analogClock = document.querySelector('.analog-clock');

// Format tanggal Indonesia
const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// Fungsi untuk memulai jam
function startClock() {
    // Hentikan interval yang ada
    if (clockInterval) {
        clearInterval(clockInterval);
    }
    
    // Mulai interval baru
    clockInterval = setInterval(updateClock, 1000);
    updateClock(); // Panggil segera untuk update pertama
}

// Update jam
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Format 12/24 jam
    let timeString;
    if (is24HourFormat) {
        timeString = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;
    } else {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        timeString = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    }
    
    clockElement.textContent = timeString;
    
    // Update tanggal
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();
    dateElement.textContent = `${dayName}, ${date} ${monthName} ${year}`;
    
    // Update timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    timezoneElement.textContent = `Zona Waktu: ${timezone}`;
    
    // Update jam analog
    updateAnalogClock(now);
    
    // Cek alarm
    checkAlarms(now);
}

// Update jam analog
function updateAnalogClock(now) {
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const hourDegrees = (hours * 30) + (minutes * 0.5);
    const minuteDegrees = minutes * 6;
    const secondDegrees = seconds * 6;
    
    hourHand.style.transform = `rotate(${hourDegrees}deg)`;
    minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
    secondHand.style.transform = `rotate(${secondDegrees}deg)`;
}

// Kembali ke mode jam
function returnToClockMode() {
    // Hentikan semua interval yang mungkin berjalan
    if (stopwatchInterval) {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Reset tombol ke state awal
    stopwatchBtn.textContent = 'Stopwatch';
    timerBtn.textContent = 'Timer';
    
    // Set mode ke clock
    currentMode = 'clock';
    analogClock.style.display = 'block';
    startClock();
}

// Toggle tema gelap/terang
function toggleTheme() {
    isDarkMode = !isDarkMode;
    body.classList.toggle('light-mode', !isDarkMode);
    
    // Perbarui partikel untuk tema yang sesuai
    particlesJS("particles-js", {
        "particles": {
            "color": {
                "value": isDarkMode ? "#3b82f6" : "#1e40af"
            },
            "line_linked": {
                "color": isDarkMode ? "#3b82f6" : "#1e40af"
            }
        }
    });
}

// Toggle format waktu 12/24 jam
function toggleTimeFormat() {
    is24HourFormat = !is24HourFormat;
    timeFormatBtn.textContent = is24HourFormat ? 'Format 12 Jam' : 'Format 24 Jam';
    if (currentMode === 'clock') {
        updateClock();
    }
}

// Mode layar penuh
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen: ${err.message}`);
        });
        fullscreenBtn.textContent = 'Keluar dari Layar Penuh';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullscreenBtn.textContent = 'Mode Layar Penuh';
        }
    }
}

// Stopwatch
function toggleStopwatch() {
    // Jika sedang dalam mode stopwatch, kembali ke mode jam
    if (currentMode === 'stopwatch') {
        returnToClockMode();
        return;
    }
    
    // Hentikan mode sebelumnya
    if (currentMode === 'timer') {
        clearInterval(timerInterval);
        timerInterval = null;
        timerBtn.textContent = 'Timer';
    } else if (currentMode === 'clock') {
        clearInterval(clockInterval);
    }
    
    // Mulai stopwatch
    currentMode = 'stopwatch';
    stopwatchBtn.textContent = 'Berhenti';
    stopwatchSeconds = 0;
    updateStopwatchDisplay();
    
    stopwatchInterval = setInterval(() => {
        stopwatchSeconds++;
        updateStopwatchDisplay();
    }, 1000);
    
    // Sembunyikan jam analog
    analogClock.style.display = 'none';
}

function updateStopwatchDisplay() {
    const hours = Math.floor(stopwatchSeconds / 3600);
    const minutes = Math.floor((stopwatchSeconds % 3600) / 60);
    const seconds = stopwatchSeconds % 60;
    
    clockElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    dateElement.textContent = 'Stopwatch';
    timezoneElement.textContent = '';
}

// Timer
function toggleTimer() {
    // Jika sedang dalam mode timer, kembali ke mode jam
    if (currentMode === 'timer') {
        returnToClockMode();
        return;
    }
    
    // Hentikan mode sebelumnya
    if (currentMode === 'stopwatch') {
        clearInterval(stopwatchInterval);
        stopwatchInterval = null;
        stopwatchBtn.textContent = 'Stopwatch';
    } else if (currentMode === 'clock') {
        clearInterval(clockInterval);
    }
    
    // Minta input waktu timer
    const input = prompt('Masukkan waktu timer (dalam menit):', '1');
    const minutes = parseInt(input);
    
    if (isNaN(minutes) || minutes <= 0) {
        alert('Masukkan angka yang valid!');
        startClock(); // Kembali ke mode jam jika input tidak valid
        return;
    }
    
    // Mulai timer
    currentMode = 'timer';
    timerBtn.textContent = 'Berhenti';
    timerSeconds = minutes * 60;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        
        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            triggerTimerEnd();
        }
    }, 1000);
    
    // Sembunyikan jam analog
    analogClock.style.display = 'none';
}

function updateTimerDisplay() {
    const hours = Math.floor(timerSeconds / 3600);
    const minutes = Math.floor((timerSeconds % 3600) / 60);
    const seconds = timerSeconds % 60;
    
    clockElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    dateElement.textContent = 'Timer';
    timezoneElement.textContent = '';
}

function triggerTimerEnd() {
    // Tampilkan modal timer selesai
    timerActiveText.textContent = 'Waktu timer telah habis!';
    timerActiveModal.style.display = 'flex';
    
    // Mainkan suara timer
    playTimerSound();
    
    // Aktifkan getar jika didukung
    if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200, 100, 500]);
    }
}

function stopTimer() {
    timerActiveModal.style.display = 'none';
    
    // Hentikan suara timer jika sedang diputar
    if (timerAudio) {
        timerAudio.pause();
        timerAudio.currentTime = 0;
        timerAudio = null;
    }
    
    // Hentikan getar
    if ('vibrate' in navigator) {
        navigator.vibrate(0);
    }
    
    // Kembali ke mode jam
    returnToClockMode();
}

function playTimerSound() {
    // Buat elemen audio jika belum ada
    if (!timerAudio) {
        timerAudio = new Audio();
        timerAudio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3';
        timerAudio.loop = true;
        timerAudio.play().catch(e => {
            console.error('Gagal memainkan suara timer:', e);
            beepTimer();
        });
    } else {
        timerAudio.play();
    }
}

function beepTimer() {
    const beepInterval = setInterval(() => {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 1000;
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
            }, 200);
        }
    }, 500);
    
    stopTimerBtn.addEventListener('click', () => {
        clearInterval(beepInterval);
    }, { once: true });
}

// Alarm functions
function showAlarmModal() {
    alarmModal.style.display = 'flex';
    updateAlarmList();
}

function hideAlarmModal() {
    alarmModal.style.display = 'none';
}

function setAlarm() {
    const alarmTimeValue = alarmTimeInput.value;
    if (!alarmTimeValue) {
        alert('Silakan masukkan waktu alarm!');
        return;
    }
    
    const [hours, minutes] = alarmTimeValue.split(':').map(Number);
    
    // Buat objek alarm baru
    const newAlarm = {
        id: Date.now(), // ID unik berdasarkan timestamp
        hours: hours,
        minutes: minutes,
        timeString: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    };
    
    // Tambahkan ke array alarms
    alarms.push(newAlarm);
    
    // Update tampilan daftar alarm
    updateAlarmList();
    
    // Reset input
    alarmTimeInput.value = '';
    
    // Mulai memeriksa alarm jika belum berjalan
    if (!alarmCheckInterval) {
        alarmCheckInterval = setInterval(() => {
            checkAlarms(new Date());
        }, 1000);
    }
}

function updateAlarmList() {
    // Kosongkan daftar alarm
    alarmList.innerHTML = '';
    
    // Tambahkan setiap alarm ke daftar
    alarms.forEach(alarm => {
        const alarmItem = document.createElement('div');
        alarmItem.className = 'alarm-item';
        alarmItem.innerHTML = `
            <span>${alarm.timeString}</span>
            <button class="delete-alarm" data-id="${alarm.id}">Hapus</button>
        `;
        alarmList.appendChild(alarmItem);
    });
    
    // Tambahkan event listener untuk tombol hapus
    document.querySelectorAll('.delete-alarm').forEach(button => {
        button.addEventListener('click', function() {
            const alarmId = parseInt(this.getAttribute('data-id'));
            deleteAlarm(alarmId);
        });
    });
    
    // Update teks tombol alarm
    alarmBtn.textContent = alarms.length > 0 ? `Alarm (${alarms.length})` : 'Alarm';
    alarmBtn.style.backgroundColor = alarms.length > 0 ? 'var(--accent-color)' : 'var(--primary-color)';
}

function deleteAlarm(alarmId) {
    // Hapus alarm dari array
    alarms = alarms.filter(alarm => alarm.id !== alarmId);
    
    // Update tampilan daftar alarm
    updateAlarmList();
    
    // Jika tidak ada alarm lagi, hentikan pemeriksaan
    if (alarms.length === 0 && alarmCheckInterval) {
        clearInterval(alarmCheckInterval);
        alarmCheckInterval = null;
    }
}

function checkAlarms(now) {
    if (alarms.length === 0) return;
    
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    
    // Cek setiap alarm
    alarms.forEach(alarm => {
        if (currentHours === alarm.hours && 
            currentMinutes === alarm.minutes && 
            currentSeconds === 0) {
            triggerAlarm(alarm);
        }
    });
}

function triggerAlarm(alarm) {
    // Tampilkan modal alarm
    alarmActiveText.textContent = `Alarm pada ${alarm.timeString}`;
    alarmActiveModal.style.display = 'flex';
    
    // Coba memainkan suara alarm
    playAlarmSound();
    
    // Coba mengaktifkan getar jika didukung
    if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200, 100, 200, 100, 500]);
    }
}

function stopAlarm() {
    alarmActiveModal.style.display = 'none';
    
    // Hentikan suara alarm jika sedang diputar
    if (alarmAudio) {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
        alarmAudio = null;
    }
    
    // Hentikan getar
    if ('vibrate' in navigator) {
        navigator.vibrate(0);
    }
}

function playAlarmSound() {
    // Buat elemen audio jika belum ada
    if (!alarmAudio) {
        alarmAudio = new Audio();
        alarmAudio.src = 'https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3';
        alarmAudio.loop = true;
        alarmAudio.play().catch(e => {
            console.error('Gagal memainkan suara alarm:', e);
            beepAlarm();
        });
    } else {
        alarmAudio.play();
    }
}

function beepAlarm() {
    const beepInterval = setInterval(() => {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            setTimeout(() => {
                oscillator.stop();
            }, 200);
        }
    }, 500);
    
    stopAlarmBtn.addEventListener('click', () => {
        clearInterval(beepInterval);
    }, { once: true });
}

// Event listeners
themeToggle.addEventListener('click', toggleTheme);
timeFormatBtn.addEventListener('click', toggleTimeFormat);
fullscreenBtn.addEventListener('click', toggleFullscreen);
stopwatchBtn.addEventListener('click', toggleStopwatch);
timerBtn.addEventListener('click', toggleTimer);
alarmBtn.addEventListener('click', showAlarmModal);
setAlarmBtn.addEventListener('click', setAlarm);
cancelAlarmBtn.addEventListener('click', hideAlarmModal);
stopAlarmBtn.addEventListener('click', stopAlarm);
stopTimerBtn.addEventListener('click', stopTimer);

// Mulai jam saat pertama kali load
startClock();

// Periksa perubahan layar penuh
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenBtn.textContent = 'Mode Layar Penuh';
    }
});