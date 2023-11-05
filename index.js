const cluster = require('cluster');
const os = require('os');
const fs = require('fs');

const inquirer = require('inquirer');

const getDateString = require('./utils/getDateFormat');
const { download } = require('./utils/downloadManager');

const questions = [
  {
    type: 'list',
    name: 'inputType',
    message: 'What are you going to download?',
    choices: [
      { name: 'Single video', value: 'single' },
      { name: 'Playlist', value: 'playlist' },
    ],
  },
  {
    type: 'input',
    name: 'url',
    message: "Url of the video/playlist you're going to download",
  },
  {
    type: 'list',
    name: 'outputType',
    message: 'What do you want to download?',
    choices: [
      { name: 'Only audio', value: 'audio' },
      { name: 'Audio and video', value: 'video' },
    ],
  },
];

const cpuCount = os.cpus().length;

(async () => {
  const downloadsFolder = `./downloads/${getDateString()}`;

  fs.mkdirSync(downloadsFolder);

  const { inputType, url, outputType } = await inquirer.prompt(questions);

  if (inputType === 'playlist') {
    cluster.settings = {
      exec: './utils/multiThreadDownload.js',
    };

    for (let i = 1; i <= cpuCount; i++) {
      const childProcess = cluster.fork({
        processId: i,
        inputType,
        url,
        outputType,
        cpuCount,
        downloadsFolder,
      });

      childProcess.disconnect();
    }
  } else {
    await download(inputType, url, outputType, cpuCount, downloadsFolder);
  }
})();
