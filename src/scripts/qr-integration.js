// This file handles the integration of QR code functionality, including generating and scanning QR codes for attendance or other purposes.

document.addEventListener('DOMContentLoaded', () => {
    const qrCodeContainer = document.getElementById('qrcode-container');
    const qrCodeCanvas = document.getElementById('qrcode');
    const generateQrButton = document.getElementById('generate-qr-btn');
    const scannerModal = document.getElementById('scanner-modal');
    const closeScannerButton = document.getElementById('close-scanner-modal');
    let html5QrCode;

    generateQrButton.addEventListener('click', () => {
        const classId = document.getElementById('class-select').value;
        const token = `${classId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const qrData = JSON.stringify({ classId, token });

        QRCode.toCanvas(qrCodeCanvas, qrData, { width: 200 }, (error) => {
            if (error) {
                console.error('Error generating QR code:', error);
                return;
            }
            qrCodeContainer.classList.remove('hidden');
            showToast(`QR Code generated for class: ${classId}`, 'success');
        });
    });

    document.querySelectorAll('.scan-qr-btn').forEach(button => {
        button.addEventListener('click', () => {
            startScanner();
        });
    });

    function startScanner() {
        scannerModal.classList.remove('hidden');

        if (html5QrCode) {
            html5QrCode.stop().catch(err => console.error('Failed to stop scanner:', err));
        }

        html5QrCode = new Html5Qrcode("qr-reader");

        const onScanSuccess = (decodedText) => {
            const data = JSON.parse(decodedText);
            if (data.classId && data.token) {
                html5QrCode.stop().then(() => {
                    scannerModal.classList.add('hidden');
                    markAttendance(data.classId);
                }).catch(err => {
                    console.error('Failed to stop scanner after success:', err);
                    scannerModal.classList.add('hidden');
                    markAttendance(data.classId);
                });
            } else {
                showToast('Invalid QR Code. Please try again.', 'error');
            }
        };

        const onScanFailure = (error) => {
            console.warn('QR code scan failed:', error);
        };

        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
            .catch(err => {
                console.error('Unable to start scanning:', err);
                showToast('Could not start camera. Please grant permissions.', 'error');
                scannerModal.classList.add('hidden');
            });
    }

    closeScannerButton.addEventListener('click', () => {
        if (html5QrCode) {
            html5QrCode.stop().catch(err => console.error('Failed to stop scanner on close:', err));
        }
        scannerModal.classList.add('hidden');
    });

    function markAttendance(classId) {
        // Logic to mark attendance based on the scanned QR code
        showToast(`Attendance marked for class: ${classId}`, 'success');
    }
});