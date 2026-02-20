import app from './App.js';
import { networkInterfaces } from 'os';
import open from 'open';

function getLocalIp() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

const startServer = (port) => {
    const server = app.listen(port, () => {
        const ip = getLocalIp();
        const localUrl = `http://localhost:${port}`;
        console.log('\x1b[32mEonMove Node.js Server Started!\x1b[0m\n');
        console.log(`  Local:            ${localUrl}`);
        console.log(`  On Your Network:  http://${ip}:${port}\n`);

        // open(localUrl).catch(() => { });
    });

    server.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            startServer(port + 1);
        } else {
            console.error(e);
        }
    });
};

const INITIAL_PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
startServer(INITIAL_PORT);
