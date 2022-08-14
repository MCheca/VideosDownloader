const youtubedl = require('youtube-dl-exec');
const path = require('path');

const downloadsFolder = path.join(__dirname, '../downloads');

const download = async (inputType, url, outputType, cpuCount) => {
  try {
    let settings = {
      ...(outputType === 'video' ? { recodeVideo: 'mp4' } : {}),
      ...(outputType === 'audio'
        ? {
            audioFormat: 'mp3',
            extractAudio: true,
            audioFormat: 'mp3',
            audioQuality: 0,
            addMetadata: true,
            ffmpegLocation: path.join(__dirname, '../ffmpeg'),
          }
        : {}),
    };

    if (inputType === 'playlist') {
      const PLAYLIST_ELEMENTS = await getPlaylistElementsCount(url);

      const ELEMENTS_PER_CPU = Math.ceil(PLAYLIST_ELEMENTS / cpuCount);

      let batchStep = parseInt(process.env.processId);

      const start =
        batchStep === 1 ? 1 : ELEMENTS_PER_CPU * (batchStep - 1) + 1;
      const end =
        batchStep === 1
          ? batchStep + ELEMENTS_PER_CPU - 1
          : ELEMENTS_PER_CPU * (batchStep - 1) + ELEMENTS_PER_CPU >
            PLAYLIST_ELEMENTS
          ? PLAYLIST_ELEMENTS
          : ELEMENTS_PER_CPU * (batchStep - 1) + ELEMENTS_PER_CPU;

      settings = {
        ...settings,
        playlistStart: start,
        playlistEnd: end,
      };
    }

    await youtubedl(url, settings, { cwd: downloadsFolder });
  } catch (error) {
    console.log(error);
  }
};

const getPlaylistElementsCount = async (playlistUrl) => {
  const playlist = await youtubedl(playlistUrl, {
    flatPlaylist: true,
    getId: true,
  });

  const elementsCount = playlist.replace(/\n/g, ',').split(',').length;

  return elementsCount;
};

module.exports = { download };
