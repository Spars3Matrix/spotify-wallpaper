const fs = require('fs');
const path = require('path');
const configuration = require('./configuration');
const logPath = path.join(__dirname, '../' , configuration.log);

const logMessage = message => {
    if (!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, '');
    }

    fs.appendFileSync(logPath, `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}: ${message}\n`, e => null);
}

module.exports = {
    log: message => {
        if (message == null) return;
        logMessage(message);
    },
    logError: error => {
        if (error == null) return;
        logMessage(`an error has occured ${JSON.stringify(error)}`);
    }
}