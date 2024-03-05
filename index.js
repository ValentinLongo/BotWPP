const express = require('express');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const app = express();

// Crear cliente de WhatsApp
const client = new Client();

// Configurar middleware para el análisis de solicitudes JSON
app.use(express.json());

// Ruta para generar y mostrar el código QR
app.get('/qr', (req, res) => {
    try {
        // Generar la URL del código QR
        client.on('qr', qr => {
            qrcode.toDataURL(qr, (err, url) => {
                if (err) {
                    console.error('Error al generar el código QR:', err);
                    res.status(500).send('Error al generar el código QR');
                } else {
                    // Enviar la URL de la imagen del código QR como respuesta
                    res.send(`<img src="${url}" alt="QR Code">`);
                }
            });
        });

        // Iniciar sesión
        client.initialize();
    } catch (error) {
        console.error('Error al obtener el código QR:', error);
        res.status(500).send('Error al obtener el código QR');
    }
});

// Ruta para enviar un mensaje
app.post('/enviar-mensaje', async (req, res) => {
    try {
        const mensaje = req.body.mensaje;
        const numeroDestino = req.body.numero;

        if (numeroDestino && mensaje) {
            await client.sendMessage(numeroDestino, mensaje);
            res.status(200).json({ status: 'Mensaje enviado correctamente' });
        } else {
            res.status(400).json({ error: 'Falta el número de destino o el mensaje' });
        }
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        res.status(500).json({ error: 'Ocurrió un error al enviar el mensaje' });
    }
});

// Evento cuando la sesión es autenticada
client.on('authenticated', (session) => {
    console.log('Autenticado correctamente!');
    console.log('Guarda esta información de sesión para iniciar sesión nuevamente:');
    console.log(session);
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});