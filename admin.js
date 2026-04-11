document.addEventListener("DOMContentLoaded", () => {
    const loading = document.getElementById('loading');
    const toast = document.getElementById('toast');
    const adminForm = document.getElementById('adminForm');
    
    if (!database) {
        loading.innerHTML = "يرجى إضافة إعدادات Firebase!";
        return;
    }

    const dbRef = database.ref('prices');

    // Fetch initial data to populate form
    dbRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            if(data.gold24) {
                document.getElementById('input-gold24-buy').value = data.gold24.buy;
                document.getElementById('input-gold24-sell').value = data.gold24.sell;
            }
            if(data.gold21) {
                document.getElementById('input-gold21-buy').value = data.gold21.buy;
                document.getElementById('input-gold21-sell').value = data.gold21.sell;
            }
            if(data.gold18) {
                document.getElementById('input-gold18-buy').value = data.gold18.buy;
                document.getElementById('input-gold18-sell').value = data.gold18.sell;
            }
            if(data.pound) {
                document.getElementById('input-pound-buy').value = data.pound.buy;
                document.getElementById('input-pound-sell').value = data.pound.sell;
            }
        }
        loading.classList.add('hidden');
    }, (error) => {
        console.error(error);
        loading.innerHTML = "خطأ في الاتصال!";
    });

    // Handle form submit
    adminForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const updatedPrices = {
            gold24: {
                buy: Number(document.getElementById('input-gold24-buy').value),
                sell: Number(document.getElementById('input-gold24-sell').value)
            },
            gold21: {
                buy: Number(document.getElementById('input-gold21-buy').value),
                sell: Number(document.getElementById('input-gold21-sell').value)
            },
            gold18: {
                buy: Number(document.getElementById('input-gold18-buy').value),
                sell: Number(document.getElementById('input-gold18-sell').value)
            },
            pound: {
                buy: Number(document.getElementById('input-pound-buy').value),
                sell: Number(document.getElementById('input-pound-sell').value)
            }
        };

        // Disable button during save
        const btn = adminForm.querySelector('.btn-save');
        btn.disabled = true;
        btn.textContent = "جاري الحفظ...";

        dbRef.set(updatedPrices)
            .then(() => {
                // Show success toast
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            })
            .catch((error) => {
                alert("حدث خطأ أثناء الحفظ: " + error.message);
            })
            .finally(() => {
                btn.disabled = false;
                btn.textContent = "حفظ وتحديث الأسعار";
            });
    });
});
