'use strict';

let Player = function () {
    this.currentIndex = 0;
    this.trackAudio = $('#audio');
    this.playButton = $('#play');
    this.playButtonIcon = $('span', this.playButton);
    this.backButton = $('#back');
    this.forwardButton = $('#forward');
    this.durationRange = $('#durationRange');
    this.volumeRange = $('#volumeRange');
    this.trackImage = $('#trackImg');
    this.trackList = $('#trackList');
    this.trackTitle = $('#trackTitle');
    this.background = $('.background');

    this.buildTrackList();
    this.plugEvents();
};

Player.prototype =
    {
        buildTrackList: function () {
            trackList.forEach(function (track) {
                this.trackList.append('<li>' + track.title + ' - ' + track.artist + ' - ' + this.toMinutes(track.duration) + '</li>');
            }, this);
        },

        plugEvents: function () {
            this.playButton.on('click', this.onClickPlay.bind(this));
            this.trackImage.on('click', this.onClickPlay.bind(this));
            $(this.trackList, 'li').on('click', this.onClickTrackListOnPage.bind(this));
            this.backButton.on('click', this.onClickBack.bind(this));
            this.forwardButton.on('click', this.onClickForward.bind(this));
            this.volumeRange.on('change', this.volumeChange.bind(this));
            this.durationRange.on('change', this.durationChange.bind(this));
            this.trackAudio.on('timeupdate', this.progressBar.bind(this));
            //----   next song AUTOPLAY   ----
            this.trackAudio.on('ended', this.onClickForward.bind(this));
        },

        toMinutes: function (duration) {
            var minutes = Math.floor(duration / 60);
            var seconds = duration - minutes * 60;
            var durationMinutes = minutes + ':' + seconds;

            return durationMinutes;
        },
        //----   BUTTONS clicks   ----
        onClickPlay: function () {
            if (this.trackAudio[0].paused !== false) {
                this.playButtonIcon.addClass('fa-pause-circle').removeClass('fa-play-circle');
                this.trackAudio[0].play();
            }
            else {
                this.playButtonIcon.addClass('fa-play-circle').removeClass('fa-pause-circle');
                this.trackAudio[0].pause();
            }
        },

        onClickForward: function () {
            this.currentIndex++;
            if (this.currentIndex == trackList.length) {
                this.currentIndex = 0;
            }

            this.refreshPlayer();
            this.onClickPlay();
        },

        onClickBack: function () {
            this.currentIndex--;

            if (this.currentIndex == -1) {
                this.currentIndex = trackList.length - 1;
            }

            this.refreshPlayer();
            this.onClickPlay();
        },

        //----   clicking LIST os songs  ----
        onClickTrackListOnPage: function (event) {
            this.currentIndex = $(event.target).index();
            this.refreshPlayer();
            this.onClickPlay();
        },

        // ----   VOLUME change on slider   ----
        volumeChange: function (event) {
            this.trackAudio[0].volume = event.currentTarget.value;
        },

        // ----   DURATION change on slider   ----
        durationChange: function (event) {
            this.trackAudio[0].currentTime = 0.01 * event.currentTarget.value * this.trackAudio[0].duration;
        },

        // ----   Progress bar MOVEMENT   ----
        progressBar: function () {
            var percentage = 100 * this.trackAudio[0].currentTime / this.trackAudio[0].duration;
            if (!isNaN(percentage)) {
                this.durationRange.val(percentage);
            }
        },

        refreshPlayer: function () {
            this.trackImage.attr('src', trackList[this.currentIndex].image);;
            this.trackTitle.text(trackList[this.currentIndex].title);
            this.trackAudio.attr('src', trackList[this.currentIndex].file);
            this.background.css('background-image', 'url(' + trackList[this.currentIndex].image + ')');
        },
    };