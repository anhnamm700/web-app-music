const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $('.playlist'); 
const player = $('.player');
const togglePlay = $('.btn-toggle-play');
const audio = $('#audio');
const header = $('header h2');
const cdThumb = $('.cd-thumb');
const cd = $('.cd');
const nextSong = $('.btn-next');
const prevSong = $('.btn-prev');
const progressBar = $('.progressBar');
const timerStart = $('.timerStart');
const timerEnd = $('.timerEnd');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');

const app = {
    isPlay: false,
    isRepeat: false,
    isRandom: false,
    currentIndex: 0,
    songs: [
        {
            id: 0,
            name: "Back To You",
            singer: "Louis Tomlinson ft. Bebe Rexha, Digital Farm Animals",
            thumb: "./assets/thumbnail/BackToYou.jpg",
            source: "./assets/songs/BackToYou.mp3"
        },
        {
            id: 1,
            name: "Rude",
            singer: "MAGIC!",
            thumb: "./assets/thumbnail/Rude.jpg",
            source: "./assets/songs/Rude.mp3"
        },
        {
            id: 2,
            name: "Don't Look Down",
            singer: "Martin Garrix feat. Usher",
            thumb: "./assets/thumbnail/DontLookDown.jpg",
            source: "./assets/songs/DontLookDown.mp3"
        },
        {
            id: 3,
            name: "High On Life",
            singer: "Martin Garrix feat. Bonn",
            thumb: "./assets/thumbnail/HighOnLight.jpg",
            source: "./assets/songs/HighOnLight.mp3"
        },
        {
            id: 4,
            name: "Used To Love",
            singer: "Martin Garrix & Dean Lewis",
            thumb: "./assets/thumbnail/UsedToLove.jpg",
            source: "./assets/songs/UsedToLove.mp3"
        },
        {
            id: 5,
            name: "Burn Out",
            singer: "Martin Garrix & Justin Mylo",
            thumb: "./assets/thumbnail/BurnOut.jpg",
            source: "./assets/songs/BurnOut.mp3"
        },
        {
            id: 6,
            name: "These Are The Times",
            singer: "Martin Garrix feat. JRM",
            thumb: "./assets/thumbnail/TATT.jpg",
            source: "./assets/songs/TheseAreTheTimes.mp3"
        },
    ],
    handleEvents() {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // Xử lí cd thu nhỏ / to.
        document.onscroll = function() {
            let scrollTop = window.scrollY || document.documentElement.scrollTop;
            let newWidth = cdWidth - scrollTop;
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cdThumb.style.opacity = newWidth / cdWidth;
        }

        // CD rotate
        const animatePause = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        });

        // Play / Pause button handle
        togglePlay.onclick = function() {
            if (!_this.isPlay) {
                _this.isPlay = true;
                _this.pauseSong();
                animatePause.pause();
            } else {
                _this.isPlay = false;
               _this.playSong();
               animatePause.play();
            }
        }

        // next button handle
        nextSong.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }

           audio.play();
        }

        // prev button handle
        prevSong.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }

            audio.play();
        }

        // // update time in progress bar
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progressBar.value = progressPercent;
                timerStart.textContent = _this.convert(Math.floor(audio.currentTime));

                audio.onended = function() {
                    if (_this.isRepeat) {
                        _this.playCurrentSong();
                    } else {
                        nextSong.click();
                    }
                    
                   
                }
            }
        }

        // seek time
        progressBar.onclick = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // reapeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            $('.control .btn-repeat').classList.toggle('active', _this.isRepeat);
        }

        // random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            $('.control .btn-random').classList.toggle('active', _this.isRandom);
        }

        // clicking playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            const optionNode = e.target.closest('.option');

            if (songNode || optionNode) {
                if (songNode && !optionNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.playCurrentSong();
                    _this.render();
                    audio.play();
                }

                if (optionNode) {
                    console.log('bar');
                }
            }
        }

    },
    pauseSong() {
        player.classList.remove('playing');
        audio.pause();
    },
    playSong() {
        player.classList.add('playing');
        audio.play();
    },
    nextSong() {
        this.currentIndex++;

        if (this.currentIndex === this.songs.length) {
            this.currentIndex = 0;
        }

        this.playCurrentSong();
    },
    prevSong() {
        this.currentIndex--;

        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.playCurrentSong();
    },
    getCurrentSong() {
        return this.songs[this.currentIndex];
    },
    convert(value) {
        return Math.floor(value / 60) + ":" + (value % 60 ? value % 60 : '00');
    },
    playCurrentSong() {
        const _this = this;
        const currentSong = this.getCurrentSong();
        audio.onloadedmetadata = function() {
            timerEnd.textContent = _this.convert(Math.floor(audio.duration));
        };
        
        header.textContent = currentSong.name;
        cdThumb.style.backgroundImage = `url(${currentSong.thumb})`;
        audio.src = currentSong.source;
        this.render();
        this.scrollIntoView();
    },
    playRandomSong() {
        let randomSongIndex;
        do {
            randomSongIndex = Math.floor(Math.random() * this.songs.length);
        } while (randomSongIndex === this.currentIndex);

        this.currentIndex = randomSongIndex;
        this.playCurrentSong();
        
    },
    scrollIntoView() {
        $('.song.active').scrollIntoView(
            {
                behavior: "smooth", 
                block: "center"
            }
        );
    },
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${this.currentIndex === index ? 'active' : ''}" data-index=${index}>
                    <div style="display: flex;">
                        <img class="thumb" src="${song.thumb}" aLt="${song.name}"/>
                        <div>
                            <h6 class="title">${song.name}</h6>
                            <p class="author">${song.singer}</p>
                        </div>
                    </div>

                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `;
        })

        playlist.innerHTML = htmls.join('');
    },
    start() {
        this.playCurrentSong();
        this.handleEvents();
        this.render();
    }
};

app.start();