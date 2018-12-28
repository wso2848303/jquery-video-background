;(function ($) {
  var JVideoBackground = function (config) {
    var that = this;
    var defaults = {
      $el: null, // jquery element
      autoPlay: 'true', // is video played automatic
      loop: 'true', // is video played looped
      muted: 'true', // is video played silent
      src: null, // source of video, recommend url,
      styleId: 'c-j-video-back',
      mask: 'true',
      zIndex: '-1'
    };
    var options = $.extend(defaults, config);
    for (var i in options) {
      that[i] = options[i];
    }
    var initialize = function () {
      if (that.checkBaseConfig()) {
        var $el = that.$el;
        that.width = $el.width();
        that.height = $el.height();
        that.id = that.getNewVideoId();
        that.checkStyle();
        that.setVideo();
      } else {
        that.warn('init fail because of config errors');
      }
    };
    initialize();
    return that;
  };
  JVideoBackground.prototype = {
    /**
     * console a warn message
     * @param text {string} message
     */
    warn: function (text) {
      console.log('warn: ' + text);
    },
    /**
     * console a error message
     * @param text {string} message
     */
    error: function (text) {
      console.log('error: ' + text);
    },
    /**
     * check configs is legal
     * @returns {boolean} result
     */
    checkBaseConfig: function () {
      var that = this, ret = true;
      if (!that.$el || !that.$el.length) {
        ret = false;
        that.error('no jquery element!');
      }
      if (!that.src) {
        ret = false;
        that.error('no video source!');
      }
      return ret;
    },
    setVideo: function (src) {
      var that = this, $el = that.$el, $video = $el.find('#' + that.id);
      that.src = src || that.src;
      if ($video && $video.length) {
        $video.remove();
      } else {
        $video = that.getVideoElement();
        $el.append($video);
      }
    },
    getVideoElement: function () {
      var that = this;
      var $ret = $('<div class="' + that.styleId + '"></div>');
      var $video;
      if (that.muted === 'true') {
        $video = $('<video class="back-video" muted></video>');
      } else {
        $video = $('<video class="back-video"></video>');
      }
      $video.attr('autoplay', that.autoPlay === 'true');
      $video.attr('loop', that.loop === 'true');
      $video.attr('id', that.getNewVideoId());
      var $source = $('<source src="' + that.src + '" />');
      $video.append($source);
      $ret.append($video);
      if (that.mask === 'true') {
        var $mask = $('<div class="back-video-mask"></div>');
        $ret.append($mask);
      }
      return $ret;
    },
    getNewVideoId: function () {
      return new Date().getTime();
    },
    checkStyle: function () {
      var elPostion = this.$el.css('position');
      if (elPostion !== 'relative' && elPostion !== 'absolute' && elPostion !== 'fixed') {
        this.$el.css('position', 'relative');
      }
      if (!$('#' + this.styleId).length) {
        $([
          '<style id="' + this.styleId + '">',
          '.' + this.styleId + ' { overflow: hidden; width: 100%; height: 100%; position: absolute; left: 0; top: 0; z-index: ' + this.zIndex + ' }',
          '.' + this.styleId + ' .back-video { width: 100%; z-index: ' + (Number(this.zIndex) - 2) + '; position: relative; }',
          '.' + this.styleId + ' .back-video-mask { width: 100%; height: 100%; background: rgba(0, 0, 0, .5); z-index: ' + (Number(this.zIndex) - 1) + '; position: absolute; top: 0; left: 0;}',
          '</style>'
        ].join('')).appendTo('head');
      }
    }
  };
  $.fn.J_video_background = JVideoBackground;
})(jQuery);