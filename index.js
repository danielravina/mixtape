const fs = require('fs');
const getArtistTitle = require('get-artist-title');
const ytdl = require('youtube-dl');
const ffmetadata = require('ffmetadata');
const request = require('request');

const mixtape = (trackUrls = [], options = {}) => {
  if (!trackUrls.length) { return null; }

  const mixtapeName = options.name || 'Mixtape';
  const mixtapeDir = `${options.out || process.cwd()}/${mixtapeName}`;
  const artist = 'Various Artists';
  const ytdOptions = [
    '-x',
    '--audio-format', 'mp3',
    '--out', `${mixtapeDir}/%(id)s.%(ext)s`
  ];

  const downloadTrack = (trackUrl) => (
    new Promise((resolve, reject) => {
      ytdl.exec(trackUrl, ytdOptions, {}, (err) => {
        if (err) { throw err; }
        ytdl.getInfo(trackUrl, (err, track) => resolve(track));
      });
    })
  );

  const getImage = (id) => (
    new Promise((resolve, reject) => {
      const uri = `http://img.youtube.com/vi/${id}/maxresdefault.jpg`;
      const filename = `${mixtapeDir}/${id}.jpg`;
      request(uri).pipe(fs.createWriteStream(filename)).on('close', (() => resolve(filename)));
    })
  );

  const setMeta = (info, track) => (
    new Promise((resolve, reject) => {
      const { id, title } = info;

      const filePath = `${mixtapeDir}/${id}.mp3`;
      getImage(id).then((imagePath) => {

        const meta = {
          artist, // itunes bla
          title,
          track,
          album: mixtapeName,
        };

        const metaOptions = {
          attachments: [ imagePath ],
        };

        ffmetadata.write(filePath, meta, metaOptions, (err) => {
          if (err) { console.error('Error writing cover art'); reject();}
          fs.unlinkSync(imagePath);
          resolve();
        });
      });
    })
  );

  const renameFile = (info) => {
    try {
      const { id, title } = info;

      const artistTitle = getArtistTitle(title);
      const normalized = artistTitle ? artistTitle.join(' - ') : title;
      const src = `${mixtapeDir}/${id}.mp3`;
      const target = `${mixtapeDir}/${normalized}.mp3`;

      fs.renameSync(src, target);
    } catch (err) { console.log(err);}
  };

  const prepareDirectory = (name) => {
    if (!fs.existsSync(name)) {
      fs.mkdirSync(name);
    }
  };

  const postDownload = (infos) => {
    infos.forEach((info, i) => {
      setMeta(info, i + 1).then(() => {
        renameFile(info);
      });
    });
  };

  const run = () => {
    prepareDirectory(mixtapeDir);
    return Promise.all(
      trackUrls.map((trackUrl) => downloadTrack(trackUrl))
    ).then((infos) => postDownload(infos));
  };

  return new Promise((resolve, reject) => {
    run().then(() => resolve(mixtapeDir));
  });
};

module.exports = mixtape;
