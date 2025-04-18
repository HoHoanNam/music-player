/*
  1. Render songs 
  2. Scroll top 
  3. Play/pause / seek (tua)
  4. CD-rotate 
  5. Next / prev 
  6. Random 
  7. Next / Repeat when ended 
  8. Active song 
  9. Scroll active song into view 
  10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},

  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },

  songs: [
    {
      name: 'Hồng Không gai',
      singer: 'Winno ft. SpideyBoy',
      path: './assets/music/song1.mp3',
      image: './assets/image/song1.jpg',
    },
    {
      name: 'Sài Gòn ơi',
      singer: 'Obito',
      path: './assets/music/song3.mp3',
      image: './assets/image/song3.jpg',
    },
    {
      name: 'Sài Gòn ơi',
      singer: 'Obito',
      path: './assets/music/song3.mp3',
      image: './assets/image/song3.jpg',
    },
    {
      name: 'Sài Gòn ơi',
      singer: 'Obito',
      path: './assets/music/song3.mp3',
      image: './assets/image/song3.jpg',
    },
    {
      name: 'Sài Gòn ơi',
      singer: 'Obito',
      path: './assets/music/song3.mp3',
      image: './assets/image/song3.jpg',
    },
    {
      name: 'Sài Gòn ơi',
      singer: 'Obito',
      path: './assets/music/song3.mp3',
      image: './assets/image/song3.jpg',
    },
    {
      name: 'Sài Gòn ơi',
      singer: 'Obito',
      path: './assets/music/song3.mp3',
      image: './assets/image/song3.jpg',
    },
    {
      name: 'Sài Gòn ơi',
      singer: 'Obito',
      path: './assets/music/song3.mp3',
      image: './assets/image/song3.jpg',
    },
    {
      name: 'Sài Gòn ơi',
      singer: 'Obito',
      path: './assets/music/song3.mp3',
      image: './assets/image/song3.jpg',
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${
          index === this.currentIndex ? 'active' : ''
        }" data-index=${index}>
        <div
          class="thumb"
          style="
            background-image: url('${song.image}');
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      `;
    });

    playlist.innerHTML = htmls.join('');
  },

  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: 'rotate(360deg)',
        },
      ],
      {
        duration: 10000, // 10 seconds
        iterations: Infinity,
      }
    );

    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    document.onscroll = function () {
      const scroll = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scroll;

      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (this.duration) {
        const progressPercent = Math.floor(
          (this.currentTime / this.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lý khi tua song
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lý bật / tắt random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);

      // Đối số thứ hai: là kiểu dữ liệu boolean
      // True -> add class
      // False -> remove class
      randomBtn.classList.toggle('active', _this.isRandom);
    };

    // Xử lý phát lại một song
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active', _this.isRepeat);
    };

    // Xử lý next song khi audio ended
    // onended là sự kiện của bài hát khi nó kết thúc
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');

      // closest(): trả về chính cái element
      // hoặc là thẻ cha của nó

      if (songNode || e.target.closest('.option')) {
        // Xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lý khi click vào song option
        if (e.target.closest('.option')) {
        }
      }
    };
  },

  scrollToActiveSong: function () {
    const _this = this;
    setTimeout(function () {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        // Kéo đến phạm vi nhìn thấy gần nhất trên màn hình
        block: [0, 1, 2].includes(_this.currentIndex) ? 'center' : 'nearest',
      });
    }, 300);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = `${this.currentSong.path}`;
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe và xử lý các sự kiện (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat & random
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
  },
};
app.start();
