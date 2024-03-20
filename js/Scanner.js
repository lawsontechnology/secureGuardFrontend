function domReady(fn) {
    if (
        document.readyState === "complete" ||
        document.readyState === "interactive"
    ) {
        setTimeout(fn, 1000);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

domReady(function () {

    function onScanSuccess(decodeText, decodeResult) {
        const id = extractIdFromQRCode(decodeText);

        if (id) {
            const apiUrl = `https://localhost:7075/api/Visitor/Visit/Id?visitId=${id}`;

            fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`API Response: ${JSON.stringify(data)}`);
                if (data && data.id !== null) {
                    sessionStorage.setItem('apiResponseData', JSON.stringify(data));        
                    window.location.href = 'displayData.html';
                } else {
                    Toastify({
                        text: 'No data found for the scanned QR code.',
                        backgroundColor: 'red',
                    }).showToast();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Toastify({
                    text: 'Error making API request.',
                    backgroundColor: 'red',
                }).showToast();
            });
        } else {
            Toastify({
                text: 'Unable to extract ID from QR code.',
                backgroundColor: 'red',
            }).showToast();
        }
    }

    function extractIdFromQRCode(text) {
        const regex = /VisitId:\s*([\w-]+)/;
        const match = text.match(regex);
        return match ? match[1] : null;
    }

    let htmlscanner = new Html5QrcodeScanner(
        "my-qr-reader",
        { fps: 10, qrbos: 250 }
    );
    htmlscanner.render(onScanSuccess);
});
document.addEventListener('DOMContentLoaded', function () {
    
    const signOutBtn = document.getElementById('signOutBtn');

    if (signOutBtn) {
        signOutBtn.addEventListener('click', function (event) {
            event.preventDefault(); 
            localStorage.removeItem('jwtToken');
            window.location.href = 'login.html';
        });
    }
});