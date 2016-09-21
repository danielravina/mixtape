const fs = require('fs');
const getArtistTitle = require('get-artist-title')
const ytdl = require('youtube-dl')
const ffmetadata = require('ffmetadata')
const username = require('username');
const path = require('path')

const mixtape = (trackUrls = [], options = {}) => {
  if(!trackUrls.length) { return null }

  const mixtapeName = options.name || 'Mixtape'
  const mixtapeDir = `${options.out || process.cwd()}/${mixtapeName}`
  const artistName = 'Various Artists'
  const ytdOptions = [
    '-x',
    '--audio-format', 'mp3',
    '--write-thumbnail',
    '--out', `${mixtapeDir}/%(id)s.%(ext)s`
  ]

  const downloadTrack = (trackUrl) => (
    new Promise((resolve, reject) => {
      ytdl.exec(trackUrl, ytdOptions, {}, (err) => {
        if (err) { throw err; }
        ytdl.getInfo(trackUrl, (err, track) => resolve(track))
      })
    })
  )

  const setMeta = (track, trackNum) => {
    const { id, title } = track

    const filePath = `${mixtapeDir}/${id}.mp3`
    const imagePath = `${mixtapeDir}/${id}.jpg`

    const meta = {
      artist: artistName, // itunes bla
      title: title,
      track: trackNum,
      album: mixtapeName,
    }

    const options = {
      attachments: [imagePath],
    }

    return new Promise((resolve, reject) => {
      ffmetadata.write(filePath, meta, options, (err) => {
        if (err) { console.error("Error writing cover art"); reject()}
        fs.unlinkSync(imagePath)
        resolve()
      });
    })
  }

  const renameFile = (track) => {
    try {
      const { id, title } = track

      const artistTitle = getArtistTitle(title)
      const normalized = artistTitle ? artistTitle.join(' - ') : title
      const src = `${mixtapeDir}/${id}.mp3`
      const target = `${mixtapeDir}/${normalized}.mp3`

      fs.renameSync(src, target)
    } catch(err) { console.log(err)}
  }

  const prepareDirectory = (name) => {
    if(!fs.existsSync(name)) {
      fs.mkdirSync(name)
    }
  }

  const postDownload = (tracks) => {
    tracks.forEach((track, i) => {
      setMeta(track, i + 1).then(() => {
        renameFile(track)
      })
    })
  }

  const run = () => {
    prepareDirectory(mixtapeDir)
    return Promise.all(
      trackUrls.map((trackUrl) => downloadTrack(trackUrl))
    ).then((infos) => postDownload(infos))
  }

  return new Promise ((resolve, reject) =>{
    run().then(()=> resolve(mixtapeDir))
  })
}

module.exports = mixtape
