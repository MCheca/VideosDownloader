const { download } = require('./downloadManager');

(async () => {
  const { inputType, url, outputType, cpuCount } = process.env;

  await download(inputType, url, outputType, cpuCount);
})();
