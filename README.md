# Mixtape
Are you tired of music streaming services? No sufficient wifi at the gym? Need some entertainment in your morning commute? If you answered YES to any of these questions, you should try mixtape. mixtape is a simple command line tool that allows you to create your own playlists directly from youtube. All you need is a text file with youtube urls and a catchy name. It will download the videos as `mp3`, figure out the songs metadata (to its best ability), add album artwork and organize it nicely in your computer. Take advantage of the enormous amount of content youtube offers, and build your favourite, private, _offline_ treasures. Just like the Good Ol' Days 💽 📼 📀

## Install
Make sure you have these software installed before proceeding:
- Nodejs (version 6 or higher)
- npm (comes with node)
- ffmpeg (download from http://ffmpeg.org)

To install, run:
```bash
$ npm install -g mixtape-cli
```

Once installed when you call `mixtape` from anywhere. There are few option you can pass to it:
```
--tracks, -T    A text file containing a list of youtube video urls.
--out, -O       Output directory. default is current directory
--help, -H      Print help.
--version, -V   Print the current version
```

## How to use mixtape?
1. Browse youtube and pick the videos/songs you want to save.
2. Copy/Paste the url into a plain text file and call it `Oldies.txt`. (The album name will be the filename)
The file should look like that:

  ```
  https://www.youtube.com/watch?v=dQw4w9WgXcQ
  https://youtu.be/cYMCLz5PQVw
  https://www.youtube.com/watch?v=PDZcqBgCS74
  ```
3. Create your mixtape!
```
$ mixtape --tracks Oldies.txt --out ~/Music
⠦ Creating your mixtape.. Hold tight!
✔ All Done! You can find your mixtape here: /Users/johnny/Music/Oldies
```

And this is what you get:

```
$ tree ~/Music
.
├── Oldies
    ├── David Bowie - Space Oddity.mp3
    ├── Lionel Richie - Hello.mp3
    └── Rick Astley - Never Gonna Give You Up.mp3

1 directory, 3 files
```
Enjoy. 🎧

## Use it as a node package

if you would like to use mixtape in your project, it is very easy to do so:
```js
const mixtape = require('mixtape-cli')

const tracks = [
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://youtu.be/cYMCLz5PQVw',
  'https://www.youtube.com/watch?v=PDZcqBgCS74'
]

const options = {
  name: 'Oldies'
}

mixtape(tracks, options).then((outDir) => {
  console.log("All Done!");
  console.log(`your mixtape is saved in ${outDir}`);)
})
```

### Contribute
Send me a pull request.
