const mixtape = require('..')
const expect = require('expect');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf')
const ffmetadata = require('ffmetadata')

describe('mixtape', () => {
  context("when no tracks supplied", () =>{
    it("should return null", () => {
      expect(mixtape([])).toEqual(null)
    })
  })

  context("when one track supplied", () => {
    beforeEach(() => {
      this.options = { out: 'test/tmp', name: 'MyMixTape' }
      fs.mkdirSync(this.options.out)
    })

    it("should create an mp3 track", (done) => {
      const videoName = "Introducing Google Trips"
      const expectedPath = path.resolve(__dirname, 'tmp' , this.options.name, videoName + '.mp3')
      const tracks = ['https://www.youtube.com/watch?v=ign2GmVEflw']

      mixtape(tracks, this.options).then(() => {
        // this is needed due to deadlock issues.
        setTimeout(()=>{
          // check that file created
          expect(fs.existsSync(expectedPath)).toEqual(true)

          // check that meta is correct
          ffmetadata.read(expectedPath, (err, data) => {
            expect(data).toInclude({
              album: this.options.name,
              artist: 'Various Artists',
              title: videoName,
              track: '1'
            })
            done()
          });
        }, 100)
      })
    })

    afterEach(() => {
      // resolve to mixtape/test/MyMixTape/file.mp3
      rimraf(path.resolve(__dirname, 'tmp' ,this.options.name), {}, () => {})
    })
  })

});
