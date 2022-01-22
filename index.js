const {
    Worker
} = require('worker_threads');
const input = require('input');

input.text('threads').then(threads => {
    let t = parseInt(threads)
    function initWorker(i) {
        const worker = new Worker('./worker.js', {
            workerData: {
                count: process.argv[2],
                id: i
            }
        });
        worker.on('message', message => {
            console.log(message);
        });
        worker.on('error', error => {
            console.log(error);
            initWorker(i)
        })
        worker.on('exit', code => {
            console.log(`Worker stopped with exit code ${code}`);
            initWorker(i)
        });
    }
    for (let i = 0; i < t; i++) {
        initWorker(i)
    }
});