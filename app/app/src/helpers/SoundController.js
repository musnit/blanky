// jscs:disable
define(function(require, exports, module) {

    function SoundController(isApp) {
      this.isApp = isApp;
      if(!isApp){
        this.Sound = require('soundjs');
      }
      this.mediasPlaying = [];
    }
    SoundController.prototype.createSounds = function(manifest) {
      if (self.isApp){
        manifest = undefined;
      }
      var self = this;
      self.manifest = manifest;
      var audioPath = './content/sounds/';
      if (manifest){
        if (self.isApp){
          self.mediasPlaying = [];
          manifest.forEach(function(sound) {
            alert('smedia');
            alert('Media' + typeof Media);

            var soundMedia = new Media(audioPath + sound.src);
            soundMedia.setVolume(parseFloat(sound.volume));
            soundMedia.play({ numberOfLoops: parseInt(sound.loop) });
            self.mediasPlaying.push(soundMedia);
          });
        }
        else {
          self.Sound.alternateExtensions = ['mp3'];
          var handleLoad = function(event) {
              var soundObject = self.manifest.filter(function(sound) {
                  return (event.src === (audioPath + sound.src));
              })[0];
              self.Sound.play(audioPath + soundObject.src, {
                  loop: soundObject.loop,
                  volume: soundObject.volume
              });
          };
          self.Sound.addEventListener('fileload', handleLoad);
          self.Sound.registerSounds(manifest, audioPath);
        }
      }
    };
    SoundController.prototype.clearSounds = function() {
      if (this.isApp){
        this.mediasPlaying.forEach(function(media) {
          media.stop();
          media.release();
        });
        this.mediasPlaying = [];
      }
      else {
        this.Sound.removeAllSounds();
      }
      this.manifest = null;
    };
    module.exports = SoundController;
});
