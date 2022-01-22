const gen = require('./generate')
const puppeteer = require('./puppeteer');
const {
    workerData
} = require('worker_threads')

async function main() {
    console.log('starting')
    await gen.generateRepl('1nchhh/reputilv43928748793264982364897623', 's%3AemE6pcfvOK6cRy7GaQxs5gB0OFBJ9qY9.wQvEzCgSMb1w8i3peXzMiH2XmA592xOm7GeXOZbK2tU')
    console.log('made repl')
    main()
}

puppeteer.init(workerData.id).then(() => {
    for (let i = 0; i < workerData.count; i++) {
        main()
    }
})
