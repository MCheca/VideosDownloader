const { download } = require('./downloadManager');

(async () => {
  const { inputType, url, outputType, cpuCount, downloadsFolder } = process.env;

  await download(inputType, url, outputType, cpuCount, downloadsFolder);
})();
