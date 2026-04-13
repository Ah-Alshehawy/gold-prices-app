document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById('loading');
    
    if (!database) {
        loading.innerHTML = "يرجى إضافة إعدادات Firebase!";
        return;
    }

    const dbRef = database.ref('prices');

    // Update Date and Time
    const updateDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', numberingSystem: 'arab' };
        document.getElementById('dateDisplay').textContent = new Date().toLocaleString('ar-EG', options);
    };
    updateDate();
    setInterval(updateDate, 1000); // update every second for the clock

    // Fullscreen logic
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    });

    // Layout Toggle logic
    const layoutBtn = document.getElementById('layoutBtn');
    let isRotated = localStorage.getItem('isRotated') === 'true';
    
    // Initial setup
    if (isRotated) {
        document.body.classList.add('rotated-mode');
    } else {
        document.body.classList.remove('rotated-mode');
    }

    // Toggle click
    layoutBtn.addEventListener('click', () => {
        isRotated = !isRotated;
        localStorage.setItem('isRotated', isRotated);
        if (isRotated) {
            document.body.classList.add('rotated-mode');
        } else {
            document.body.classList.remove('rotated-mode');
        }
    });

    // Custom Scroll Logic for Rotated Mode (Fix freeze issue)
    const appContainer = document.querySelector('.app-container');
    
    // 1. Mouse Wheel fix
    window.addEventListener('wheel', (e) => {
        if (document.body.classList.contains('rotated-mode')) {
            appContainer.scrollTop += e.deltaY;
        }
    });

    // 2. Touch fix for mobile and smart screens
    let touchStartY = 0;
    appContainer.addEventListener('touchstart', (e) => {
        if (document.body.classList.contains('rotated-mode')) {
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: false });

    appContainer.addEventListener('touchmove', (e) => {
        if (document.body.classList.contains('rotated-mode')) {
            e.preventDefault(); // Stop native frozen scroll
            const touchY = e.touches[0].clientY;
            appContainer.scrollTop += (touchStartY - touchY);
            touchStartY = touchY;
        }
    }, { passive: false });

    // 3. TV Remote / Keyboard fix
    window.addEventListener('keydown', (e) => {
        if (document.body.classList.contains('rotated-mode')) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                appContainer.scrollTop += 60;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                appContainer.scrollTop -= 60;
            }
        }
    });

    // Realtime Data Fetching
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Update UI
            if(data.gold24 !== undefined) {
                document.getElementById('gold24-price').textContent = typeof data.gold24 === 'object' ? data.gold24.sell : data.gold24;
            }
            if(data.gold21 !== undefined) {
                document.getElementById('gold21-price').textContent = typeof data.gold21 === 'object' ? data.gold21.sell : data.gold21;
            }
            if(data.gold18 !== undefined) {
                document.getElementById('gold18-price').textContent = typeof data.gold18 === 'object' ? data.gold18.sell : data.gold18;
            }

        } else {
            // First time setup if database is empty
            dbRef.set({
                gold24: 0,
                gold21: 0,
                gold18: 0,

            });
        }
        
        // Hide loading
        loading.classList.add('hidden');
    }, (error) => {
        console.error("Error fetching data:", error);
        loading.innerHTML = "خطأ في الاتصال بقاعدة البيانات!";
    });
});
