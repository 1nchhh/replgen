const gen = require('./generate')
const puppeteer = require('./puppeteer');
const {
    workerData
} = require('worker_threads')

async function main() {
    console.log('starting')
    await gen.generateRepl('1nchhh/reputilv43928748793264982364897623', '')
    console.log('made repl')
    main()
}

puppeteer.init(workerData.id).then(() => {
    for (let i = 0; i < workerData.count; i++) {
        main()
    }
})