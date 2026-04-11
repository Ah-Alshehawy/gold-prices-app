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
            if(data.gold24 !== undefined) {
                document.getElementById('input-gold24-price').value = typeof data.gold24 === 'object' ? data.gold24.sell : data.gold24;
            }
            if(data.gold21 !== undefined) {
                document.getElementById('input-gold21-price').value = typeof data.gold21 === 'object' ? data.gold21.sell : data.gold21;
            }
            if(data.gold18 !== undefined) {
                document.getElementById('input-gold18-price').value = typeof data.gold18 === 'object' ? data.gold18.sell : data.gold18;
            }
            if(data.pound !== undefined) {
                document.getElementById('input-pound-price').value = typeof data.pound === 'object' ? data.pound.sell : data.pound;
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
            gold24: Number(document.getElementById('input-gold24-price').value),
            gold21: Number(document.getElementById('input-gold21-price').value),
            gold18: Number(document.getElementById('input-gold18-price').value),
            pound: Number(document.getElementById('input-pound-price').value)
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
