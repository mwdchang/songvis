# songvis
A visualization of your team's playlist, leveraging Spotify's track attributes and other analytics.


## Getting data
### Requirements
We need the following to run the parsers and the web application
- We need a Spotify account and API-access key to retrieve song attributes, see https://developer.spotify.com/documentation/web-api/quick-start/
- NodeJS 12+
- Python 3.7/3.8

### Input file
A CSV formatted file with 3-coumns, tracking the person, song/track id, and the lyrics. Note the lyrics are surrounded by speical pipe(|) character in order to mark start/end boundaries. See provided "sample.csv".
```
<name a>,<trackId>,|<lyrics>|
<name b>,<trackId>,|<lyrics>|
<name c>,<trackId>,|<lyrics>|
...
<name a>,<trackId>,|<lyrics>|
```

### Track analysis
Track data are fetched via Spotify's API.
```
cd parsers

# Rename sample.env to .env and fill out the access credentials

npm install
node extracter.js <input.csv> > tracks.tsv
```

### Lyrics analysis
Lyrical similarity and others. Using GenSim
```
cd parsers
pip3 install -r requirements.txt
python3 vectorize.py <input.csv> > lyrics.tsv
```


## Running
Running the application. Place the fiels "tracks.tsv" and "lyrics.tsv" into the public folder.
```
npm install
npm run serve
```

The application will be available on http://localhost:8000, it will take a few seonds to load and process the data.
