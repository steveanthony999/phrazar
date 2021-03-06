import React, { useState } from 'react';
import {
  Select,
  FormControl,
  InputLabel,
  makeStyles,
  Button,
  Grid,
  Paper,
  Container,
  Typography
} from '@material-ui/core';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import BgImg from './bg.jpg';
import BgAnim from './Nt6v.gif';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(4),
    minWidth: 200,
    display: 'flex'
  },
  selectEmpty: {
    marginTop: theme.spacing(4)
  },
  btn: {
    marginTop: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    marginTop: theme.spacing(4)
  },
  speech: {
    cursor: 'pointer'
  },
  transliterate: {
    width: '100%'
  }
}));

const TranslateGoogleApi = () => {
  const classes = useStyles();

  const [lang, setLang] = useState('');
  const [langCode, setLangCode] = useState('');
  const [speakerVoice, setSpeakerVoice] = useState(31);

  const handleChange = event => {
    const parsed = JSON.parse(event.target.value);
    const lang = parsed.short_lang;
    const code = parsed.code;
    const voicing = parsed.voice;
    setLang(lang);
    setLangCode(code);
    setSpeakerVoice(voicing);
  };

  const handleClick = e => {
    loadPhrases();
  };

  function loadPhrases(e) {
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === this.DONE) {
        const parsed = JSON.parse(this.responseText);
        const response = parsed[0];
        // console.log(response.quote);

        document.getElementById('phrases').innerHTML = response.quote;
        document.getElementById('movie').innerHTML = response.author;

        loadTranslations(response.quote);
      }
    });

    const movieQuotes =
      'https://andruxnet-random-famous-quotes.p.rapidapi.com/?cat=movies&count=1';
    const movieQuotesKey = process.env.REACT_APP_RAPID_API_MOVIE_QUOTES_KEY;

    xhr.open('GET', movieQuotes);
    xhr.setRequestHeader(
      'x-rapidapi-host',
      'andruxnet-random-famous-quotes.p.rapidapi.com'
    );
    xhr.setRequestHeader('x-rapidapi-key', movieQuotesKey);

    xhr.send(data);
  }

  function loadTranslations(phr) {
    const textToTranslate = phr;

    const langDirection = `en-${lang}`;

    const yandexKey = process.env.REACT_APP_YANDEX_KEY;

    const translateUrl = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexKey}&text=${textToTranslate}&lang=${langDirection}`;

    const xhr = new XMLHttpRequest();

    xhr.open('GET', translateUrl, true);

    xhr.onload = function() {
      if (this.status === 200) {
        const response = JSON.parse(this.responseText);
        document.getElementById(
          'translations'
        ).innerHTML = response.text.toString();

        loadTransliterations(response.text.toString());
      }
    };

    xhr.send();
  }

  function loadTransliterations(phr) {
    var data = JSON.stringify([
      {
        Text: phr
      }
    ]);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === this.DONE) {
        if (lang === 'es' || lang === 'fr') {
          document.getElementById('transliterations').innerHTML = '';
        } else {
          const parsed = JSON.parse(this.responseText);
          const response = parsed[0];
          document.getElementById('transliterations').innerHTML = response.text;
          console.log(response);
        }
      }
    });

    const rapidApiKey = process.env.REACT_APP_RAPID_API_TRANSLITERATION_KEY;

    xhr.open(
      'POST',
      `https://microsoft-azure-microsoft-text-translation-3-0-v1.p.rapidapi.com/transliterate?language=${lang}&fromscript=${langCode}&toScript=latn&api-version=3.0`
    );
    xhr.setRequestHeader(
      'x-rapidapi-host',
      'microsoft-azure-microsoft-text-translation-3-0-v1.p.rapidapi.com'
    );
    xhr.setRequestHeader('x-rapidapi-key', rapidApiKey);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('accept', 'application/json');

    xhr.send(data);
  }

  var synth = window.speechSynthesis;

  const handleSpeechClick = e => {
    txtFld = document.getElementById('translations');
    talk();
    if (!window.speechSynthesis) {
      speakBtn.disabled = true;
      document.getElementById('warning').style.display = 'block';
    }
    document.getElementById('bg-play').style.display = 'inline-block';
    document.getElementById('bg-stop').style.display = 'none';
  };

  let speakBtn, txtFld;
  var voices = [];

  function talk() {
    voices = synth.getVoices();
    let sval = speakerVoice;
    let u = new SpeechSynthesisUtterance();
    u.voice = voices[sval];
    u.rate = 0.5;
    u.text = txtFld.innerHTML;

    speechSynthesis.speak(u);
    u.onend = e => {
      console.log('done speaking');
      document.getElementById('bg-play').style.display = 'none';
      document.getElementById('bg-stop').style.display = 'inline-block';
    };
  }

  return (
    <div>
      <Paper className={classes.paper}>
        <FormControl variant='outlined' className={classes.formControl}>
          <InputLabel>Target Language</InputLabel>
          <Select native label='Target Language' onChange={handleChange}>
            <option value='' />
            <option value='{"short_lang": "es", "code": "Latn", "voice": 31}'>
              Spanish
            </option>
            <option value='{"short_lang": "th", "code": "Thai", "voice": 16}'>
              Thai
            </option>
            <option value='{"short_lang": "ja", "code": "Jpan", "voice": 18}'>
              Japanese
            </option>
            <option value='{"short_lang": "fr", "code": "Latn", "voice": 3}'>
              French
            </option>
          </Select>

          <Button
            variant='outlined'
            color='primary'
            className={classes.btn}
            onClick={handleClick}
          >
            Get movie quotes
          </Button>
        </FormControl>
      </Paper>

      <Paper className={classes.paper}>
        <Typography variant='h6' id='phrases'>
          Choose your target language and click 'GET MOVIE QUOTES'
        </Typography>
      </Paper>

      <Paper className={classes.paper}>
        <Typography variant='h6' id='translations'>
          Translation...
        </Typography>
      </Paper>

      <Paper className={classes.paper}>
        <Typography
          variant='h6'
          id='transliterations'
          className={classes.transliterate}
          // noWrap
          style={{ overflow: 'scroll' }}
        >
          Transliteration...
        </Typography>
        {/* <h1 id='transliterations'>This is where transliterations will go</h1> */}
      </Paper>

      <Paper className={classes.paper}>
        <Typography variant='h6'>
          Movie: <span id='movie'></span>
        </Typography>
      </Paper>

      <Paper className={classes.paper}>
        <p id='warning' style={{ display: 'none' }}>
          Sorry, your browser does not support the Web Speech API.
        </p>
        <VolumeUpIcon
          id='speakBtn'
          className={classes.speech}
          onClick={handleSpeechClick}
        />
      </Paper>

      <Paper className={classes.paper}>
        <div id='bg-play' style={{ display: 'none' }}>
          <img src={BgAnim} width='260px' />
        </div>
        <div id='bg-stop' style={{ display: 'inline-block' }}>
          <img src={BgImg} width='260px' />
        </div>
      </Paper>
    </div>
  );
};

export default TranslateGoogleApi;
