document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById('loading');
    
    if (!database) {
        loading.innerHTML = "يرجى إضافة إعدادات Firebase!";
        return;
    }

    const dbRef = database.ref('prices');

    // Update Date
    const updateDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('dateDisplay').textContent = new Date().toLocaleDateString('ar-EG', options);
    };
    updateDate();
    setInterval(updateDate, 60000); // update every minute

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

    // Realtime Data Fetching
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Update UI
            if(data.gold24) {
                document.getElementById('gold24-buy').textContent = data.gold24.buy;
                document.getElementById('gold24-sell').textContent = data.gold24.sell;
            }
            if(data.gold21) {
                document.getElementById('gold21-buy').textContent = data.gold21.buy;
                document.getElementById('gold21-sell').textContent = data.gold21.sell;
            }
            if(data.gold18) {
                document.getElementById('gold18-buy').textContent = data.gold18.buy;
                document.getElementById('gold18-sell').textContent = data.gold18.sell;
            }
            if(data.pound) {
                document.getElementById('pound-buy').textContent = data.pound.buy;
                document.getElementById('pound-sell').textContent = data.pound.sell;
            }
        } else {
            // First time setup if database is empty
            dbRef.set({
                gold24: { buy: 0, sell: 0 },
                gold21: { buy: 0, sell: 0 },
                gold18: { buy: 0, sell: 0 },
                pound: { buy: 0, sell: 0 }
            });
        }
        
        // Hide loading
        loading.classList.add('hidden');
    }, (error) => {
        console.error("Error fetching data:", error);
        loading.innerHTML = "خطأ في الاتصال بقاعدة البيانات!";
    });
});
