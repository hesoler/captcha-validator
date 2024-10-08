init()

function init(letterCount) {
    letterCount ||= 6;
    generateCaptcha(letterCount);

    let input = document.getElementById('input');
    input && input.addEventListener('keypress', keyPress);
    if (input)
        input.dataset.letters = letterCount;

    let btnRefresh = document.querySelector('.captcha-refresh');
    btnRefresh && btnRefresh.addEventListener('click', function () {
        generateCaptcha(letterCount)
    });

    let btnValidator = document.querySelector('.captcha-validator');
    btnValidator && btnValidator.addEventListener('click', function () {
        validateCaptcha()
    });
}

function generateCaptcha(letterCount) {
    letterCount ||= 6;
    let canvas = document.getElementById('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 60;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = '#000';

    let captchaText = generateText(letterCount);

    // Estilo del texto
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPattern(ctx, canvas.width, canvas.height);
    drawWarpedText(ctx, canvas, captchaText);
    $(canvas).data('captcha', captchaText);
};

// Función para generar un color aleatorio
function generateText(letterCount) {
    letterCount ||= 6;
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaText = '';
    for (let i = 0; i < letterCount; i++) {
        captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return captchaText;
};

// Función para generar un color aleatorio
function generateRandomColor() {
    const letras = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Función para dibujar el patrón
function drawPattern(ctx, width, height) {
    ctx.lineWidth = 2; // Ancho de línea

    for (let i = 0; i < 5; i++) { // Número de ondas
        ctx.beginPath();
        ctx.strokeStyle = generateRandomColor(); // Color aleatorio para cada línea
        const yOffset = Math.random() * height; // Desplazamiento vertical aleatorio
        const amplitude = Math.random() * 20 + 10; // Amplitud de la onda
        const frequency = Math.random() * 0.05 + 0.02; // Frecuencia de la onda

        for (let x = 0; x < width; x++) {
            const y = yOffset + amplitude * Math.sin(frequency * (x + i * 50)); // Ecuación de la onda
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
};

function drawWarpedText(ctx, canvas, texto) {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < texto.length; i++) {
        // Calcular la posición x para cada letra
        const x = (canvas.width / 2) - (texto.length * 15) + (i * 30);
        const y = canvas.height / 2;

        // Aplicar transformaciones para deformar la letra
        ctx.save(); // Guardar el estado del contexto
        ctx.translate(x, y); // Mover el contexto a la posición de la letra
        ctx.rotate(Math.random() * 0.3 - 0.15); // Rotar aleatoriamente
        ctx.scale(1 + Math.random() * 0.5, 1 + Math.random() * 0.5); // Escalar aleatoriamente
        ctx.fillText(texto[i], 0, 0); // Dibujar la letra
        ctx.restore(); // Restaurar el estado del contexto
    }
};

function validateCaptcha() {
    let inputEl = document.getElementById('input');
    let letterCount = inputEl.dataset.letters;
    let input = inputEl.value;
    let canvas = document.getElementById('canvas');
    let captcha = $(canvas).data('captcha');

    if (input.toLowerCase() === captcha.toLowerCase()) {
        alert("Valid CAPTCHA! ✅")
    } else {
        document.getElementById('input').value = '';
        alert("Invalid CAPTCHA! ❌")
        generateCaptcha(letterCount);
    }
};

function keyPress(event) {
    let charCode = event.which || event.keyCode;
    if (charCode == 13) validateCaptcha();
};
