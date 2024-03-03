var mainScript = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/howler/dist/howler.js
  var require_howler = __commonJS({
    "node_modules/howler/dist/howler.js"(exports) {
      (function() {
        "use strict";
        var HowlerGlobal2 = function() {
          this.init();
        };
        HowlerGlobal2.prototype = {
          /**
           * Initialize the global Howler object.
           * @return {Howler}
           */
          init: function() {
            var self = this || Howler2;
            self._counter = 1e3;
            self._html5AudioPool = [];
            self.html5PoolSize = 10;
            self._codecs = {};
            self._howls = [];
            self._muted = false;
            self._volume = 1;
            self._canPlayEvent = "canplaythrough";
            self._navigator = typeof window !== "undefined" && window.navigator ? window.navigator : null;
            self.masterGain = null;
            self.noAudio = false;
            self.usingWebAudio = true;
            self.autoSuspend = true;
            self.ctx = null;
            self.autoUnlock = true;
            self._setup();
            return self;
          },
          /**
           * Get/set the global volume for all sounds.
           * @param  {Float} vol Volume from 0.0 to 1.0.
           * @return {Howler/Float}     Returns self or current volume.
           */
          volume: function(vol) {
            var self = this || Howler2;
            vol = parseFloat(vol);
            if (!self.ctx) {
              setupAudioContext();
            }
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              self._volume = vol;
              if (self._muted) {
                return self;
              }
              if (self.usingWebAudio) {
                self.masterGain.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
              }
              for (var i = 0; i < self._howls.length; i++) {
                if (!self._howls[i]._webAudio) {
                  var ids = self._howls[i]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound = self._howls[i]._soundById(ids[j]);
                    if (sound && sound._node) {
                      sound._node.volume = sound._volume * vol;
                    }
                  }
                }
              }
              return self;
            }
            return self._volume;
          },
          /**
           * Handle muting and unmuting globally.
           * @param  {Boolean} muted Is muted or not.
           */
          mute: function(muted) {
            var self = this || Howler2;
            if (!self.ctx) {
              setupAudioContext();
            }
            self._muted = muted;
            if (self.usingWebAudio) {
              self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler2.ctx.currentTime);
            }
            for (var i = 0; i < self._howls.length; i++) {
              if (!self._howls[i]._webAudio) {
                var ids = self._howls[i]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound = self._howls[i]._soundById(ids[j]);
                  if (sound && sound._node) {
                    sound._node.muted = muted ? true : sound._muted;
                  }
                }
              }
            }
            return self;
          },
          /**
           * Handle stopping all sounds globally.
           */
          stop: function() {
            var self = this || Howler2;
            for (var i = 0; i < self._howls.length; i++) {
              self._howls[i].stop();
            }
            return self;
          },
          /**
           * Unload and destroy all currently loaded Howl objects.
           * @return {Howler}
           */
          unload: function() {
            var self = this || Howler2;
            for (var i = self._howls.length - 1; i >= 0; i--) {
              self._howls[i].unload();
            }
            if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== "undefined") {
              self.ctx.close();
              self.ctx = null;
              setupAudioContext();
            }
            return self;
          },
          /**
           * Check for codec support of specific extension.
           * @param  {String} ext Audio file extention.
           * @return {Boolean}
           */
          codecs: function(ext) {
            return (this || Howler2)._codecs[ext.replace(/^x-/, "")];
          },
          /**
           * Setup various state values for global tracking.
           * @return {Howler}
           */
          _setup: function() {
            var self = this || Howler2;
            self.state = self.ctx ? self.ctx.state || "suspended" : "suspended";
            self._autoSuspend();
            if (!self.usingWebAudio) {
              if (typeof Audio !== "undefined") {
                try {
                  var test = new Audio();
                  if (typeof test.oncanplaythrough === "undefined") {
                    self._canPlayEvent = "canplay";
                  }
                } catch (e) {
                  self.noAudio = true;
                }
              } else {
                self.noAudio = true;
              }
            }
            try {
              var test = new Audio();
              if (test.muted) {
                self.noAudio = true;
              }
            } catch (e) {
            }
            if (!self.noAudio) {
              self._setupCodecs();
            }
            return self;
          },
          /**
           * Check for browser support for various codecs and cache the results.
           * @return {Howler}
           */
          _setupCodecs: function() {
            var self = this || Howler2;
            var audioTest = null;
            try {
              audioTest = typeof Audio !== "undefined" ? new Audio() : null;
            } catch (err) {
              return self;
            }
            if (!audioTest || typeof audioTest.canPlayType !== "function") {
              return self;
            }
            var mpegTest = audioTest.canPlayType("audio/mpeg;").replace(/^no$/, "");
            var ua = self._navigator ? self._navigator.userAgent : "";
            var checkOpera = ua.match(/OPR\/(\d+)/g);
            var isOldOpera = checkOpera && parseInt(checkOpera[0].split("/")[1], 10) < 33;
            var checkSafari = ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1;
            var safariVersion = ua.match(/Version\/(.*?) /);
            var isOldSafari = checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15;
            self._codecs = {
              mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType("audio/mp3;").replace(/^no$/, ""))),
              mpeg: !!mpegTest,
              opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
              ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType("audio/wav")).replace(/^no$/, ""),
              aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
              caf: !!audioTest.canPlayType("audio/x-caf;").replace(/^no$/, ""),
              m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              m4b: !!(audioTest.canPlayType("audio/x-m4b;") || audioTest.canPlayType("audio/m4b;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
              flac: !!(audioTest.canPlayType("audio/x-flac;") || audioTest.canPlayType("audio/flac;")).replace(/^no$/, "")
            };
            return self;
          },
          /**
           * Some browsers/devices will only allow audio to be played after a user interaction.
           * Attempt to automatically unlock audio on the first user interaction.
           * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
           * @return {Howler}
           */
          _unlockAudio: function() {
            var self = this || Howler2;
            if (self._audioUnlocked || !self.ctx) {
              return;
            }
            self._audioUnlocked = false;
            self.autoUnlock = false;
            if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
              self._mobileUnloaded = true;
              self.unload();
            }
            self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);
            var unlock = function(e) {
              while (self._html5AudioPool.length < self.html5PoolSize) {
                try {
                  var audioNode = new Audio();
                  audioNode._unlocked = true;
                  self._releaseHtml5Audio(audioNode);
                } catch (e2) {
                  self.noAudio = true;
                  break;
                }
              }
              for (var i = 0; i < self._howls.length; i++) {
                if (!self._howls[i]._webAudio) {
                  var ids = self._howls[i]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound = self._howls[i]._soundById(ids[j]);
                    if (sound && sound._node && !sound._node._unlocked) {
                      sound._node._unlocked = true;
                      sound._node.load();
                    }
                  }
                }
              }
              self._autoResume();
              var source = self.ctx.createBufferSource();
              source.buffer = self._scratchBuffer;
              source.connect(self.ctx.destination);
              if (typeof source.start === "undefined") {
                source.noteOn(0);
              } else {
                source.start(0);
              }
              if (typeof self.ctx.resume === "function") {
                self.ctx.resume();
              }
              source.onended = function() {
                source.disconnect(0);
                self._audioUnlocked = true;
                document.removeEventListener("touchstart", unlock, true);
                document.removeEventListener("touchend", unlock, true);
                document.removeEventListener("click", unlock, true);
                document.removeEventListener("keydown", unlock, true);
                for (var i2 = 0; i2 < self._howls.length; i2++) {
                  self._howls[i2]._emit("unlock");
                }
              };
            };
            document.addEventListener("touchstart", unlock, true);
            document.addEventListener("touchend", unlock, true);
            document.addEventListener("click", unlock, true);
            document.addEventListener("keydown", unlock, true);
            return self;
          },
          /**
           * Get an unlocked HTML5 Audio object from the pool. If none are left,
           * return a new Audio object and throw a warning.
           * @return {Audio} HTML5 Audio object.
           */
          _obtainHtml5Audio: function() {
            var self = this || Howler2;
            if (self._html5AudioPool.length) {
              return self._html5AudioPool.pop();
            }
            var testPlay = new Audio().play();
            if (testPlay && typeof Promise !== "undefined" && (testPlay instanceof Promise || typeof testPlay.then === "function")) {
              testPlay.catch(function() {
                console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
              });
            }
            return new Audio();
          },
          /**
           * Return an activated HTML5 Audio object to the pool.
           * @return {Howler}
           */
          _releaseHtml5Audio: function(audio) {
            var self = this || Howler2;
            if (audio._unlocked) {
              self._html5AudioPool.push(audio);
            }
            return self;
          },
          /**
           * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
           * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
           * @return {Howler}
           */
          _autoSuspend: function() {
            var self = this;
            if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === "undefined" || !Howler2.usingWebAudio) {
              return;
            }
            for (var i = 0; i < self._howls.length; i++) {
              if (self._howls[i]._webAudio) {
                for (var j = 0; j < self._howls[i]._sounds.length; j++) {
                  if (!self._howls[i]._sounds[j]._paused) {
                    return self;
                  }
                }
              }
            }
            if (self._suspendTimer) {
              clearTimeout(self._suspendTimer);
            }
            self._suspendTimer = setTimeout(function() {
              if (!self.autoSuspend) {
                return;
              }
              self._suspendTimer = null;
              self.state = "suspending";
              var handleSuspension = function() {
                self.state = "suspended";
                if (self._resumeAfterSuspend) {
                  delete self._resumeAfterSuspend;
                  self._autoResume();
                }
              };
              self.ctx.suspend().then(handleSuspension, handleSuspension);
            }, 3e4);
            return self;
          },
          /**
           * Automatically resume the Web Audio AudioContext when a new sound is played.
           * @return {Howler}
           */
          _autoResume: function() {
            var self = this;
            if (!self.ctx || typeof self.ctx.resume === "undefined" || !Howler2.usingWebAudio) {
              return;
            }
            if (self.state === "running" && self.ctx.state !== "interrupted" && self._suspendTimer) {
              clearTimeout(self._suspendTimer);
              self._suspendTimer = null;
            } else if (self.state === "suspended" || self.state === "running" && self.ctx.state === "interrupted") {
              self.ctx.resume().then(function() {
                self.state = "running";
                for (var i = 0; i < self._howls.length; i++) {
                  self._howls[i]._emit("resume");
                }
              });
              if (self._suspendTimer) {
                clearTimeout(self._suspendTimer);
                self._suspendTimer = null;
              }
            } else if (self.state === "suspending") {
              self._resumeAfterSuspend = true;
            }
            return self;
          }
        };
        var Howler2 = new HowlerGlobal2();
        var Howl3 = function(o) {
          var self = this;
          if (!o.src || o.src.length === 0) {
            console.error("An array of source files must be passed with any new Howl.");
            return;
          }
          self.init(o);
        };
        Howl3.prototype = {
          /**
           * Initialize a new Howl group object.
           * @param  {Object} o Passed in properties for this group.
           * @return {Howl}
           */
          init: function(o) {
            var self = this;
            if (!Howler2.ctx) {
              setupAudioContext();
            }
            self._autoplay = o.autoplay || false;
            self._format = typeof o.format !== "string" ? o.format : [o.format];
            self._html5 = o.html5 || false;
            self._muted = o.mute || false;
            self._loop = o.loop || false;
            self._pool = o.pool || 5;
            self._preload = typeof o.preload === "boolean" || o.preload === "metadata" ? o.preload : true;
            self._rate = o.rate || 1;
            self._sprite = o.sprite || {};
            self._src = typeof o.src !== "string" ? o.src : [o.src];
            self._volume = o.volume !== void 0 ? o.volume : 1;
            self._xhr = {
              method: o.xhr && o.xhr.method ? o.xhr.method : "GET",
              headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
              withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false
            };
            self._duration = 0;
            self._state = "unloaded";
            self._sounds = [];
            self._endTimers = {};
            self._queue = [];
            self._playLock = false;
            self._onend = o.onend ? [{ fn: o.onend }] : [];
            self._onfade = o.onfade ? [{ fn: o.onfade }] : [];
            self._onload = o.onload ? [{ fn: o.onload }] : [];
            self._onloaderror = o.onloaderror ? [{ fn: o.onloaderror }] : [];
            self._onplayerror = o.onplayerror ? [{ fn: o.onplayerror }] : [];
            self._onpause = o.onpause ? [{ fn: o.onpause }] : [];
            self._onplay = o.onplay ? [{ fn: o.onplay }] : [];
            self._onstop = o.onstop ? [{ fn: o.onstop }] : [];
            self._onmute = o.onmute ? [{ fn: o.onmute }] : [];
            self._onvolume = o.onvolume ? [{ fn: o.onvolume }] : [];
            self._onrate = o.onrate ? [{ fn: o.onrate }] : [];
            self._onseek = o.onseek ? [{ fn: o.onseek }] : [];
            self._onunlock = o.onunlock ? [{ fn: o.onunlock }] : [];
            self._onresume = [];
            self._webAudio = Howler2.usingWebAudio && !self._html5;
            if (typeof Howler2.ctx !== "undefined" && Howler2.ctx && Howler2.autoUnlock) {
              Howler2._unlockAudio();
            }
            Howler2._howls.push(self);
            if (self._autoplay) {
              self._queue.push({
                event: "play",
                action: function() {
                  self.play();
                }
              });
            }
            if (self._preload && self._preload !== "none") {
              self.load();
            }
            return self;
          },
          /**
           * Load the audio file.
           * @return {Howler}
           */
          load: function() {
            var self = this;
            var url = null;
            if (Howler2.noAudio) {
              self._emit("loaderror", null, "No audio support.");
              return;
            }
            if (typeof self._src === "string") {
              self._src = [self._src];
            }
            for (var i = 0; i < self._src.length; i++) {
              var ext, str;
              if (self._format && self._format[i]) {
                ext = self._format[i];
              } else {
                str = self._src[i];
                if (typeof str !== "string") {
                  self._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                  continue;
                }
                ext = /^data:audio\/([^;,]+);/i.exec(str);
                if (!ext) {
                  ext = /\.([^.]+)$/.exec(str.split("?", 1)[0]);
                }
                if (ext) {
                  ext = ext[1].toLowerCase();
                }
              }
              if (!ext) {
                console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
              }
              if (ext && Howler2.codecs(ext)) {
                url = self._src[i];
                break;
              }
            }
            if (!url) {
              self._emit("loaderror", null, "No codec support for selected audio sources.");
              return;
            }
            self._src = url;
            self._state = "loading";
            if (window.location.protocol === "https:" && url.slice(0, 5) === "http:") {
              self._html5 = true;
              self._webAudio = false;
            }
            new Sound2(self);
            if (self._webAudio) {
              loadBuffer(self);
            }
            return self;
          },
          /**
           * Play a sound or resume previous playback.
           * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
           * @param  {Boolean} internal Internal Use: true prevents event firing.
           * @return {Number}          Sound ID.
           */
          play: function(sprite, internal) {
            var self = this;
            var id = null;
            if (typeof sprite === "number") {
              id = sprite;
              sprite = null;
            } else if (typeof sprite === "string" && self._state === "loaded" && !self._sprite[sprite]) {
              return null;
            } else if (typeof sprite === "undefined") {
              sprite = "__default";
              if (!self._playLock) {
                var num = 0;
                for (var i = 0; i < self._sounds.length; i++) {
                  if (self._sounds[i]._paused && !self._sounds[i]._ended) {
                    num++;
                    id = self._sounds[i]._id;
                  }
                }
                if (num === 1) {
                  sprite = null;
                } else {
                  id = null;
                }
              }
            }
            var sound = id ? self._soundById(id) : self._inactiveSound();
            if (!sound) {
              return null;
            }
            if (id && !sprite) {
              sprite = sound._sprite || "__default";
            }
            if (self._state !== "loaded") {
              sound._sprite = sprite;
              sound._ended = false;
              var soundId = sound._id;
              self._queue.push({
                event: "play",
                action: function() {
                  self.play(soundId);
                }
              });
              return soundId;
            }
            if (id && !sound._paused) {
              if (!internal) {
                self._loadQueue("play");
              }
              return sound._id;
            }
            if (self._webAudio) {
              Howler2._autoResume();
            }
            var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1e3);
            var duration = Math.max(0, (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3 - seek);
            var timeout = duration * 1e3 / Math.abs(sound._rate);
            var start = self._sprite[sprite][0] / 1e3;
            var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3;
            sound._sprite = sprite;
            sound._ended = false;
            var setParams = function() {
              sound._paused = false;
              sound._seek = seek;
              sound._start = start;
              sound._stop = stop;
              sound._loop = !!(sound._loop || self._sprite[sprite][2]);
            };
            if (seek >= stop) {
              self._ended(sound);
              return;
            }
            var node = sound._node;
            if (self._webAudio) {
              var playWebAudio = function() {
                self._playLock = false;
                setParams();
                self._refreshBuffer(sound);
                var vol = sound._muted || self._muted ? 0 : sound._volume;
                node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                sound._playStart = Howler2.ctx.currentTime;
                if (typeof node.bufferSource.start === "undefined") {
                  sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
                } else {
                  sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
                }
                if (timeout !== Infinity) {
                  self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
                }
                if (!internal) {
                  setTimeout(function() {
                    self._emit("play", sound._id);
                    self._loadQueue();
                  }, 0);
                }
              };
              if (Howler2.state === "running" && Howler2.ctx.state !== "interrupted") {
                playWebAudio();
              } else {
                self._playLock = true;
                self.once("resume", playWebAudio);
                self._clearTimer(sound._id);
              }
            } else {
              var playHtml5 = function() {
                node.currentTime = seek;
                node.muted = sound._muted || self._muted || Howler2._muted || node.muted;
                node.volume = sound._volume * Howler2.volume();
                node.playbackRate = sound._rate;
                try {
                  var play = node.play();
                  if (play && typeof Promise !== "undefined" && (play instanceof Promise || typeof play.then === "function")) {
                    self._playLock = true;
                    setParams();
                    play.then(function() {
                      self._playLock = false;
                      node._unlocked = true;
                      if (!internal) {
                        self._emit("play", sound._id);
                      } else {
                        self._loadQueue();
                      }
                    }).catch(function() {
                      self._playLock = false;
                      self._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                      sound._ended = true;
                      sound._paused = true;
                    });
                  } else if (!internal) {
                    self._playLock = false;
                    setParams();
                    self._emit("play", sound._id);
                  }
                  node.playbackRate = sound._rate;
                  if (node.paused) {
                    self._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                    return;
                  }
                  if (sprite !== "__default" || sound._loop) {
                    self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
                  } else {
                    self._endTimers[sound._id] = function() {
                      self._ended(sound);
                      node.removeEventListener("ended", self._endTimers[sound._id], false);
                    };
                    node.addEventListener("ended", self._endTimers[sound._id], false);
                  }
                } catch (err) {
                  self._emit("playerror", sound._id, err);
                }
              };
              if (node.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA") {
                node.src = self._src;
                node.load();
              }
              var loadedNoReadyState = window && window.ejecta || !node.readyState && Howler2._navigator.isCocoonJS;
              if (node.readyState >= 3 || loadedNoReadyState) {
                playHtml5();
              } else {
                self._playLock = true;
                self._state = "loading";
                var listener = function() {
                  self._state = "loaded";
                  playHtml5();
                  node.removeEventListener(Howler2._canPlayEvent, listener, false);
                };
                node.addEventListener(Howler2._canPlayEvent, listener, false);
                self._clearTimer(sound._id);
              }
            }
            return sound._id;
          },
          /**
           * Pause playback and save current position.
           * @param  {Number} id The sound ID (empty to pause all in group).
           * @return {Howl}
           */
          pause: function(id) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "pause",
                action: function() {
                  self.pause(id);
                }
              });
              return self;
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              self._clearTimer(ids[i]);
              var sound = self._soundById(ids[i]);
              if (sound && !sound._paused) {
                sound._seek = self.seek(ids[i]);
                sound._rateSeek = 0;
                sound._paused = true;
                self._stopFade(ids[i]);
                if (sound._node) {
                  if (self._webAudio) {
                    if (!sound._node.bufferSource) {
                      continue;
                    }
                    if (typeof sound._node.bufferSource.stop === "undefined") {
                      sound._node.bufferSource.noteOff(0);
                    } else {
                      sound._node.bufferSource.stop(0);
                    }
                    self._cleanBuffer(sound._node);
                  } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                    sound._node.pause();
                  }
                }
              }
              if (!arguments[1]) {
                self._emit("pause", sound ? sound._id : null);
              }
            }
            return self;
          },
          /**
           * Stop playback and reset to start.
           * @param  {Number} id The sound ID (empty to stop all in group).
           * @param  {Boolean} internal Internal Use: true prevents event firing.
           * @return {Howl}
           */
          stop: function(id, internal) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "stop",
                action: function() {
                  self.stop(id);
                }
              });
              return self;
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              self._clearTimer(ids[i]);
              var sound = self._soundById(ids[i]);
              if (sound) {
                sound._seek = sound._start || 0;
                sound._rateSeek = 0;
                sound._paused = true;
                sound._ended = true;
                self._stopFade(ids[i]);
                if (sound._node) {
                  if (self._webAudio) {
                    if (sound._node.bufferSource) {
                      if (typeof sound._node.bufferSource.stop === "undefined") {
                        sound._node.bufferSource.noteOff(0);
                      } else {
                        sound._node.bufferSource.stop(0);
                      }
                      self._cleanBuffer(sound._node);
                    }
                  } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                    sound._node.currentTime = sound._start || 0;
                    sound._node.pause();
                    if (sound._node.duration === Infinity) {
                      self._clearSound(sound._node);
                    }
                  }
                }
                if (!internal) {
                  self._emit("stop", sound._id);
                }
              }
            }
            return self;
          },
          /**
           * Mute/unmute a single sound or all sounds in this Howl group.
           * @param  {Boolean} muted Set to true to mute and false to unmute.
           * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
           * @return {Howl}
           */
          mute: function(muted, id) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "mute",
                action: function() {
                  self.mute(muted, id);
                }
              });
              return self;
            }
            if (typeof id === "undefined") {
              if (typeof muted === "boolean") {
                self._muted = muted;
              } else {
                return self._muted;
              }
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              var sound = self._soundById(ids[i]);
              if (sound) {
                sound._muted = muted;
                if (sound._interval) {
                  self._stopFade(sound._id);
                }
                if (self._webAudio && sound._node) {
                  sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler2.ctx.currentTime);
                } else if (sound._node) {
                  sound._node.muted = Howler2._muted ? true : muted;
                }
                self._emit("mute", sound._id);
              }
            }
            return self;
          },
          /**
           * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
           *   volume() -> Returns the group's volume value.
           *   volume(id) -> Returns the sound id's current volume.
           *   volume(vol) -> Sets the volume of all sounds in this Howl group.
           *   volume(vol, id) -> Sets the volume of passed sound id.
           * @return {Howl/Number} Returns self or current volume.
           */
          volume: function() {
            var self = this;
            var args = arguments;
            var vol, id;
            if (args.length === 0) {
              return self._volume;
            } else if (args.length === 1 || args.length === 2 && typeof args[1] === "undefined") {
              var ids = self._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                vol = parseFloat(args[0]);
              }
            } else if (args.length >= 2) {
              vol = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound;
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              if (self._state !== "loaded" || self._playLock) {
                self._queue.push({
                  event: "volume",
                  action: function() {
                    self.volume.apply(self, args);
                  }
                });
                return self;
              }
              if (typeof id === "undefined") {
                self._volume = vol;
              }
              id = self._getSoundIds(id);
              for (var i = 0; i < id.length; i++) {
                sound = self._soundById(id[i]);
                if (sound) {
                  sound._volume = vol;
                  if (!args[2]) {
                    self._stopFade(id[i]);
                  }
                  if (self._webAudio && sound._node && !sound._muted) {
                    sound._node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                  } else if (sound._node && !sound._muted) {
                    sound._node.volume = vol * Howler2.volume();
                  }
                  self._emit("volume", sound._id);
                }
              }
            } else {
              sound = id ? self._soundById(id) : self._sounds[0];
              return sound ? sound._volume : 0;
            }
            return self;
          },
          /**
           * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
           * @param  {Number} from The value to fade from (0.0 to 1.0).
           * @param  {Number} to   The volume to fade to (0.0 to 1.0).
           * @param  {Number} len  Time in milliseconds to fade.
           * @param  {Number} id   The sound id (omit to fade all sounds).
           * @return {Howl}
           */
          fade: function(from, to, len, id) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "fade",
                action: function() {
                  self.fade(from, to, len, id);
                }
              });
              return self;
            }
            from = Math.min(Math.max(0, parseFloat(from)), 1);
            to = Math.min(Math.max(0, parseFloat(to)), 1);
            len = parseFloat(len);
            self.volume(from, id);
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              var sound = self._soundById(ids[i]);
              if (sound) {
                if (!id) {
                  self._stopFade(ids[i]);
                }
                if (self._webAudio && !sound._muted) {
                  var currentTime = Howler2.ctx.currentTime;
                  var end = currentTime + len / 1e3;
                  sound._volume = from;
                  sound._node.gain.setValueAtTime(from, currentTime);
                  sound._node.gain.linearRampToValueAtTime(to, end);
                }
                self._startFadeInterval(sound, from, to, len, ids[i], typeof id === "undefined");
              }
            }
            return self;
          },
          /**
           * Starts the internal interval to fade a sound.
           * @param  {Object} sound Reference to sound to fade.
           * @param  {Number} from The value to fade from (0.0 to 1.0).
           * @param  {Number} to   The volume to fade to (0.0 to 1.0).
           * @param  {Number} len  Time in milliseconds to fade.
           * @param  {Number} id   The sound id to fade.
           * @param  {Boolean} isGroup   If true, set the volume on the group.
           */
          _startFadeInterval: function(sound, from, to, len, id, isGroup) {
            var self = this;
            var vol = from;
            var diff = to - from;
            var steps = Math.abs(diff / 0.01);
            var stepLen = Math.max(4, steps > 0 ? len / steps : len);
            var lastTick = Date.now();
            sound._fadeTo = to;
            sound._interval = setInterval(function() {
              var tick = (Date.now() - lastTick) / len;
              lastTick = Date.now();
              vol += diff * tick;
              vol = Math.round(vol * 100) / 100;
              if (diff < 0) {
                vol = Math.max(to, vol);
              } else {
                vol = Math.min(to, vol);
              }
              if (self._webAudio) {
                sound._volume = vol;
              } else {
                self.volume(vol, sound._id, true);
              }
              if (isGroup) {
                self._volume = vol;
              }
              if (to < from && vol <= to || to > from && vol >= to) {
                clearInterval(sound._interval);
                sound._interval = null;
                sound._fadeTo = null;
                self.volume(to, sound._id);
                self._emit("fade", sound._id);
              }
            }, stepLen);
          },
          /**
           * Internal method that stops the currently playing fade when
           * a new fade starts, volume is changed or the sound is stopped.
           * @param  {Number} id The sound id.
           * @return {Howl}
           */
          _stopFade: function(id) {
            var self = this;
            var sound = self._soundById(id);
            if (sound && sound._interval) {
              if (self._webAudio) {
                sound._node.gain.cancelScheduledValues(Howler2.ctx.currentTime);
              }
              clearInterval(sound._interval);
              sound._interval = null;
              self.volume(sound._fadeTo, id);
              sound._fadeTo = null;
              self._emit("fade", id);
            }
            return self;
          },
          /**
           * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
           *   loop() -> Returns the group's loop value.
           *   loop(id) -> Returns the sound id's loop value.
           *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
           *   loop(loop, id) -> Sets the loop value of passed sound id.
           * @return {Howl/Boolean} Returns self or current loop value.
           */
          loop: function() {
            var self = this;
            var args = arguments;
            var loop, id, sound;
            if (args.length === 0) {
              return self._loop;
            } else if (args.length === 1) {
              if (typeof args[0] === "boolean") {
                loop = args[0];
                self._loop = loop;
              } else {
                sound = self._soundById(parseInt(args[0], 10));
                return sound ? sound._loop : false;
              }
            } else if (args.length === 2) {
              loop = args[0];
              id = parseInt(args[1], 10);
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              sound = self._soundById(ids[i]);
              if (sound) {
                sound._loop = loop;
                if (self._webAudio && sound._node && sound._node.bufferSource) {
                  sound._node.bufferSource.loop = loop;
                  if (loop) {
                    sound._node.bufferSource.loopStart = sound._start || 0;
                    sound._node.bufferSource.loopEnd = sound._stop;
                    if (self.playing(ids[i])) {
                      self.pause(ids[i], true);
                      self.play(ids[i], true);
                    }
                  }
                }
              }
            }
            return self;
          },
          /**
           * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
           *   rate() -> Returns the first sound node's current playback rate.
           *   rate(id) -> Returns the sound id's current playback rate.
           *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
           *   rate(rate, id) -> Sets the playback rate of passed sound id.
           * @return {Howl/Number} Returns self or the current playback rate.
           */
          rate: function() {
            var self = this;
            var args = arguments;
            var rate, id;
            if (args.length === 0) {
              id = self._sounds[0]._id;
            } else if (args.length === 1) {
              var ids = self._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                rate = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              rate = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound;
            if (typeof rate === "number") {
              if (self._state !== "loaded" || self._playLock) {
                self._queue.push({
                  event: "rate",
                  action: function() {
                    self.rate.apply(self, args);
                  }
                });
                return self;
              }
              if (typeof id === "undefined") {
                self._rate = rate;
              }
              id = self._getSoundIds(id);
              for (var i = 0; i < id.length; i++) {
                sound = self._soundById(id[i]);
                if (sound) {
                  if (self.playing(id[i])) {
                    sound._rateSeek = self.seek(id[i]);
                    sound._playStart = self._webAudio ? Howler2.ctx.currentTime : sound._playStart;
                  }
                  sound._rate = rate;
                  if (self._webAudio && sound._node && sound._node.bufferSource) {
                    sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler2.ctx.currentTime);
                  } else if (sound._node) {
                    sound._node.playbackRate = rate;
                  }
                  var seek = self.seek(id[i]);
                  var duration = (self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1e3 - seek;
                  var timeout = duration * 1e3 / Math.abs(sound._rate);
                  if (self._endTimers[id[i]] || !sound._paused) {
                    self._clearTimer(id[i]);
                    self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
                  }
                  self._emit("rate", sound._id);
                }
              }
            } else {
              sound = self._soundById(id);
              return sound ? sound._rate : self._rate;
            }
            return self;
          },
          /**
           * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
           *   seek() -> Returns the first sound node's current seek position.
           *   seek(id) -> Returns the sound id's current seek position.
           *   seek(seek) -> Sets the seek position of the first sound node.
           *   seek(seek, id) -> Sets the seek position of passed sound id.
           * @return {Howl/Number} Returns self or the current seek position.
           */
          seek: function() {
            var self = this;
            var args = arguments;
            var seek, id;
            if (args.length === 0) {
              if (self._sounds.length) {
                id = self._sounds[0]._id;
              }
            } else if (args.length === 1) {
              var ids = self._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else if (self._sounds.length) {
                id = self._sounds[0]._id;
                seek = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              seek = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            if (typeof id === "undefined") {
              return 0;
            }
            if (typeof seek === "number" && (self._state !== "loaded" || self._playLock)) {
              self._queue.push({
                event: "seek",
                action: function() {
                  self.seek.apply(self, args);
                }
              });
              return self;
            }
            var sound = self._soundById(id);
            if (sound) {
              if (typeof seek === "number" && seek >= 0) {
                var playing = self.playing(id);
                if (playing) {
                  self.pause(id, true);
                }
                sound._seek = seek;
                sound._ended = false;
                self._clearTimer(id);
                if (!self._webAudio && sound._node && !isNaN(sound._node.duration)) {
                  sound._node.currentTime = seek;
                }
                var seekAndEmit = function() {
                  if (playing) {
                    self.play(id, true);
                  }
                  self._emit("seek", id);
                };
                if (playing && !self._webAudio) {
                  var emitSeek = function() {
                    if (!self._playLock) {
                      seekAndEmit();
                    } else {
                      setTimeout(emitSeek, 0);
                    }
                  };
                  setTimeout(emitSeek, 0);
                } else {
                  seekAndEmit();
                }
              } else {
                if (self._webAudio) {
                  var realTime = self.playing(id) ? Howler2.ctx.currentTime - sound._playStart : 0;
                  var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
                  return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
                } else {
                  return sound._node.currentTime;
                }
              }
            }
            return self;
          },
          /**
           * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
           * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
           * @return {Boolean} True if playing and false if not.
           */
          playing: function(id) {
            var self = this;
            if (typeof id === "number") {
              var sound = self._soundById(id);
              return sound ? !sound._paused : false;
            }
            for (var i = 0; i < self._sounds.length; i++) {
              if (!self._sounds[i]._paused) {
                return true;
              }
            }
            return false;
          },
          /**
           * Get the duration of this sound. Passing a sound id will return the sprite duration.
           * @param  {Number} id The sound id to check. If none is passed, return full source duration.
           * @return {Number} Audio duration in seconds.
           */
          duration: function(id) {
            var self = this;
            var duration = self._duration;
            var sound = self._soundById(id);
            if (sound) {
              duration = self._sprite[sound._sprite][1] / 1e3;
            }
            return duration;
          },
          /**
           * Returns the current loaded state of this Howl.
           * @return {String} 'unloaded', 'loading', 'loaded'
           */
          state: function() {
            return this._state;
          },
          /**
           * Unload and destroy the current Howl object.
           * This will immediately stop all sound instances attached to this group.
           */
          unload: function() {
            var self = this;
            var sounds = self._sounds;
            for (var i = 0; i < sounds.length; i++) {
              if (!sounds[i]._paused) {
                self.stop(sounds[i]._id);
              }
              if (!self._webAudio) {
                self._clearSound(sounds[i]._node);
                sounds[i]._node.removeEventListener("error", sounds[i]._errorFn, false);
                sounds[i]._node.removeEventListener(Howler2._canPlayEvent, sounds[i]._loadFn, false);
                sounds[i]._node.removeEventListener("ended", sounds[i]._endFn, false);
                Howler2._releaseHtml5Audio(sounds[i]._node);
              }
              delete sounds[i]._node;
              self._clearTimer(sounds[i]._id);
            }
            var index = Howler2._howls.indexOf(self);
            if (index >= 0) {
              Howler2._howls.splice(index, 1);
            }
            var remCache = true;
            for (i = 0; i < Howler2._howls.length; i++) {
              if (Howler2._howls[i]._src === self._src || self._src.indexOf(Howler2._howls[i]._src) >= 0) {
                remCache = false;
                break;
              }
            }
            if (cache && remCache) {
              delete cache[self._src];
            }
            Howler2.noAudio = false;
            self._state = "unloaded";
            self._sounds = [];
            self = null;
            return null;
          },
          /**
           * Listen to a custom event.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to call.
           * @param  {Number}   id    (optional) Only listen to events for this sound.
           * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
           * @return {Howl}
           */
          on: function(event, fn, id, once) {
            var self = this;
            var events = self["_on" + event];
            if (typeof fn === "function") {
              events.push(once ? { id, fn, once } : { id, fn });
            }
            return self;
          },
          /**
           * Remove a custom event. Call without parameters to remove all events.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to remove. Leave empty to remove all.
           * @param  {Number}   id    (optional) Only remove events for this sound.
           * @return {Howl}
           */
          off: function(event, fn, id) {
            var self = this;
            var events = self["_on" + event];
            var i = 0;
            if (typeof fn === "number") {
              id = fn;
              fn = null;
            }
            if (fn || id) {
              for (i = 0; i < events.length; i++) {
                var isId = id === events[i].id;
                if (fn === events[i].fn && isId || !fn && isId) {
                  events.splice(i, 1);
                  break;
                }
              }
            } else if (event) {
              self["_on" + event] = [];
            } else {
              var keys = Object.keys(self);
              for (i = 0; i < keys.length; i++) {
                if (keys[i].indexOf("_on") === 0 && Array.isArray(self[keys[i]])) {
                  self[keys[i]] = [];
                }
              }
            }
            return self;
          },
          /**
           * Listen to a custom event and remove it once fired.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to call.
           * @param  {Number}   id    (optional) Only listen to events for this sound.
           * @return {Howl}
           */
          once: function(event, fn, id) {
            var self = this;
            self.on(event, fn, id, 1);
            return self;
          },
          /**
           * Emit all events of a specific type and pass the sound id.
           * @param  {String} event Event name.
           * @param  {Number} id    Sound ID.
           * @param  {Number} msg   Message to go with event.
           * @return {Howl}
           */
          _emit: function(event, id, msg) {
            var self = this;
            var events = self["_on" + event];
            for (var i = events.length - 1; i >= 0; i--) {
              if (!events[i].id || events[i].id === id || event === "load") {
                setTimeout(function(fn) {
                  fn.call(this, id, msg);
                }.bind(self, events[i].fn), 0);
                if (events[i].once) {
                  self.off(event, events[i].fn, events[i].id);
                }
              }
            }
            self._loadQueue(event);
            return self;
          },
          /**
           * Queue of actions initiated before the sound has loaded.
           * These will be called in sequence, with the next only firing
           * after the previous has finished executing (even if async like play).
           * @return {Howl}
           */
          _loadQueue: function(event) {
            var self = this;
            if (self._queue.length > 0) {
              var task = self._queue[0];
              if (task.event === event) {
                self._queue.shift();
                self._loadQueue();
              }
              if (!event) {
                task.action();
              }
            }
            return self;
          },
          /**
           * Fired when playback ends at the end of the duration.
           * @param  {Sound} sound The sound object to work with.
           * @return {Howl}
           */
          _ended: function(sound) {
            var self = this;
            var sprite = sound._sprite;
            if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
              setTimeout(self._ended.bind(self, sound), 100);
              return self;
            }
            var loop = !!(sound._loop || self._sprite[sprite][2]);
            self._emit("end", sound._id);
            if (!self._webAudio && loop) {
              self.stop(sound._id, true).play(sound._id);
            }
            if (self._webAudio && loop) {
              self._emit("play", sound._id);
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              sound._playStart = Howler2.ctx.currentTime;
              var timeout = (sound._stop - sound._start) * 1e3 / Math.abs(sound._rate);
              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
            }
            if (self._webAudio && !loop) {
              sound._paused = true;
              sound._ended = true;
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              self._clearTimer(sound._id);
              self._cleanBuffer(sound._node);
              Howler2._autoSuspend();
            }
            if (!self._webAudio && !loop) {
              self.stop(sound._id, true);
            }
            return self;
          },
          /**
           * Clear the end timer for a sound playback.
           * @param  {Number} id The sound ID.
           * @return {Howl}
           */
          _clearTimer: function(id) {
            var self = this;
            if (self._endTimers[id]) {
              if (typeof self._endTimers[id] !== "function") {
                clearTimeout(self._endTimers[id]);
              } else {
                var sound = self._soundById(id);
                if (sound && sound._node) {
                  sound._node.removeEventListener("ended", self._endTimers[id], false);
                }
              }
              delete self._endTimers[id];
            }
            return self;
          },
          /**
           * Return the sound identified by this ID, or return null.
           * @param  {Number} id Sound ID
           * @return {Object}    Sound object or null.
           */
          _soundById: function(id) {
            var self = this;
            for (var i = 0; i < self._sounds.length; i++) {
              if (id === self._sounds[i]._id) {
                return self._sounds[i];
              }
            }
            return null;
          },
          /**
           * Return an inactive sound from the pool or create a new one.
           * @return {Sound} Sound playback object.
           */
          _inactiveSound: function() {
            var self = this;
            self._drain();
            for (var i = 0; i < self._sounds.length; i++) {
              if (self._sounds[i]._ended) {
                return self._sounds[i].reset();
              }
            }
            return new Sound2(self);
          },
          /**
           * Drain excess inactive sounds from the pool.
           */
          _drain: function() {
            var self = this;
            var limit = self._pool;
            var cnt = 0;
            var i = 0;
            if (self._sounds.length < limit) {
              return;
            }
            for (i = 0; i < self._sounds.length; i++) {
              if (self._sounds[i]._ended) {
                cnt++;
              }
            }
            for (i = self._sounds.length - 1; i >= 0; i--) {
              if (cnt <= limit) {
                return;
              }
              if (self._sounds[i]._ended) {
                if (self._webAudio && self._sounds[i]._node) {
                  self._sounds[i]._node.disconnect(0);
                }
                self._sounds.splice(i, 1);
                cnt--;
              }
            }
          },
          /**
           * Get all ID's from the sounds pool.
           * @param  {Number} id Only return one ID if one is passed.
           * @return {Array}    Array of IDs.
           */
          _getSoundIds: function(id) {
            var self = this;
            if (typeof id === "undefined") {
              var ids = [];
              for (var i = 0; i < self._sounds.length; i++) {
                ids.push(self._sounds[i]._id);
              }
              return ids;
            } else {
              return [id];
            }
          },
          /**
           * Load the sound back into the buffer source.
           * @param  {Sound} sound The sound object to work with.
           * @return {Howl}
           */
          _refreshBuffer: function(sound) {
            var self = this;
            sound._node.bufferSource = Howler2.ctx.createBufferSource();
            sound._node.bufferSource.buffer = cache[self._src];
            if (sound._panner) {
              sound._node.bufferSource.connect(sound._panner);
            } else {
              sound._node.bufferSource.connect(sound._node);
            }
            sound._node.bufferSource.loop = sound._loop;
            if (sound._loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop || 0;
            }
            sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler2.ctx.currentTime);
            return self;
          },
          /**
           * Prevent memory leaks by cleaning up the buffer source after playback.
           * @param  {Object} node Sound's audio node containing the buffer source.
           * @return {Howl}
           */
          _cleanBuffer: function(node) {
            var self = this;
            var isIOS = Howler2._navigator && Howler2._navigator.vendor.indexOf("Apple") >= 0;
            if (!node.bufferSource) {
              return self;
            }
            if (Howler2._scratchBuffer && node.bufferSource) {
              node.bufferSource.onended = null;
              node.bufferSource.disconnect(0);
              if (isIOS) {
                try {
                  node.bufferSource.buffer = Howler2._scratchBuffer;
                } catch (e) {
                }
              }
            }
            node.bufferSource = null;
            return self;
          },
          /**
           * Set the source to a 0-second silence to stop any downloading (except in IE).
           * @param  {Object} node Audio node to clear.
           */
          _clearSound: function(node) {
            var checkIE = /MSIE |Trident\//.test(Howler2._navigator && Howler2._navigator.userAgent);
            if (!checkIE) {
              node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
            }
          }
        };
        var Sound2 = function(howl) {
          this._parent = howl;
          this.init();
        };
        Sound2.prototype = {
          /**
           * Initialize a new Sound object.
           * @return {Sound}
           */
          init: function() {
            var self = this;
            var parent = self._parent;
            self._muted = parent._muted;
            self._loop = parent._loop;
            self._volume = parent._volume;
            self._rate = parent._rate;
            self._seek = 0;
            self._paused = true;
            self._ended = true;
            self._sprite = "__default";
            self._id = ++Howler2._counter;
            parent._sounds.push(self);
            self.create();
            return self;
          },
          /**
           * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
           * @return {Sound}
           */
          create: function() {
            var self = this;
            var parent = self._parent;
            var volume = Howler2._muted || self._muted || self._parent._muted ? 0 : self._volume;
            if (parent._webAudio) {
              self._node = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
              self._node.gain.setValueAtTime(volume, Howler2.ctx.currentTime);
              self._node.paused = true;
              self._node.connect(Howler2.masterGain);
            } else if (!Howler2.noAudio) {
              self._node = Howler2._obtainHtml5Audio();
              self._errorFn = self._errorListener.bind(self);
              self._node.addEventListener("error", self._errorFn, false);
              self._loadFn = self._loadListener.bind(self);
              self._node.addEventListener(Howler2._canPlayEvent, self._loadFn, false);
              self._endFn = self._endListener.bind(self);
              self._node.addEventListener("ended", self._endFn, false);
              self._node.src = parent._src;
              self._node.preload = parent._preload === true ? "auto" : parent._preload;
              self._node.volume = volume * Howler2.volume();
              self._node.load();
            }
            return self;
          },
          /**
           * Reset the parameters of this sound to the original state (for recycle).
           * @return {Sound}
           */
          reset: function() {
            var self = this;
            var parent = self._parent;
            self._muted = parent._muted;
            self._loop = parent._loop;
            self._volume = parent._volume;
            self._rate = parent._rate;
            self._seek = 0;
            self._rateSeek = 0;
            self._paused = true;
            self._ended = true;
            self._sprite = "__default";
            self._id = ++Howler2._counter;
            return self;
          },
          /**
           * HTML5 Audio error listener callback.
           */
          _errorListener: function() {
            var self = this;
            self._parent._emit("loaderror", self._id, self._node.error ? self._node.error.code : 0);
            self._node.removeEventListener("error", self._errorFn, false);
          },
          /**
           * HTML5 Audio canplaythrough listener callback.
           */
          _loadListener: function() {
            var self = this;
            var parent = self._parent;
            parent._duration = Math.ceil(self._node.duration * 10) / 10;
            if (Object.keys(parent._sprite).length === 0) {
              parent._sprite = { __default: [0, parent._duration * 1e3] };
            }
            if (parent._state !== "loaded") {
              parent._state = "loaded";
              parent._emit("load");
              parent._loadQueue();
            }
            self._node.removeEventListener(Howler2._canPlayEvent, self._loadFn, false);
          },
          /**
           * HTML5 Audio ended listener callback.
           */
          _endListener: function() {
            var self = this;
            var parent = self._parent;
            if (parent._duration === Infinity) {
              parent._duration = Math.ceil(self._node.duration * 10) / 10;
              if (parent._sprite.__default[1] === Infinity) {
                parent._sprite.__default[1] = parent._duration * 1e3;
              }
              parent._ended(self);
            }
            self._node.removeEventListener("ended", self._endFn, false);
          }
        };
        var cache = {};
        var loadBuffer = function(self) {
          var url = self._src;
          if (cache[url]) {
            self._duration = cache[url].duration;
            loadSound(self);
            return;
          }
          if (/^data:[^;]+;base64,/.test(url)) {
            var data = atob(url.split(",")[1]);
            var dataView = new Uint8Array(data.length);
            for (var i = 0; i < data.length; ++i) {
              dataView[i] = data.charCodeAt(i);
            }
            decodeAudioData(dataView.buffer, self);
          } else {
            var xhr = new XMLHttpRequest();
            xhr.open(self._xhr.method, url, true);
            xhr.withCredentials = self._xhr.withCredentials;
            xhr.responseType = "arraybuffer";
            if (self._xhr.headers) {
              Object.keys(self._xhr.headers).forEach(function(key) {
                xhr.setRequestHeader(key, self._xhr.headers[key]);
              });
            }
            xhr.onload = function() {
              var code = (xhr.status + "")[0];
              if (code !== "0" && code !== "2" && code !== "3") {
                self._emit("loaderror", null, "Failed loading audio file with status: " + xhr.status + ".");
                return;
              }
              decodeAudioData(xhr.response, self);
            };
            xhr.onerror = function() {
              if (self._webAudio) {
                self._html5 = true;
                self._webAudio = false;
                self._sounds = [];
                delete cache[url];
                self.load();
              }
            };
            safeXhrSend(xhr);
          }
        };
        var safeXhrSend = function(xhr) {
          try {
            xhr.send();
          } catch (e) {
            xhr.onerror();
          }
        };
        var decodeAudioData = function(arraybuffer, self) {
          var error = function() {
            self._emit("loaderror", null, "Decoding audio data failed.");
          };
          var success = function(buffer) {
            if (buffer && self._sounds.length > 0) {
              cache[self._src] = buffer;
              loadSound(self, buffer);
            } else {
              error();
            }
          };
          if (typeof Promise !== "undefined" && Howler2.ctx.decodeAudioData.length === 1) {
            Howler2.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
          } else {
            Howler2.ctx.decodeAudioData(arraybuffer, success, error);
          }
        };
        var loadSound = function(self, buffer) {
          if (buffer && !self._duration) {
            self._duration = buffer.duration;
          }
          if (Object.keys(self._sprite).length === 0) {
            self._sprite = { __default: [0, self._duration * 1e3] };
          }
          if (self._state !== "loaded") {
            self._state = "loaded";
            self._emit("load");
            self._loadQueue();
          }
        };
        var setupAudioContext = function() {
          if (!Howler2.usingWebAudio) {
            return;
          }
          try {
            if (typeof AudioContext !== "undefined") {
              Howler2.ctx = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
              Howler2.ctx = new webkitAudioContext();
            } else {
              Howler2.usingWebAudio = false;
            }
          } catch (e) {
            Howler2.usingWebAudio = false;
          }
          if (!Howler2.ctx) {
            Howler2.usingWebAudio = false;
          }
          var iOS = /iP(hone|od|ad)/.test(Howler2._navigator && Howler2._navigator.platform);
          var appVersion = Howler2._navigator && Howler2._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
          var version = appVersion ? parseInt(appVersion[1], 10) : null;
          if (iOS && version && version < 9) {
            var safari = /safari/.test(Howler2._navigator && Howler2._navigator.userAgent.toLowerCase());
            if (Howler2._navigator && !safari) {
              Howler2.usingWebAudio = false;
            }
          }
          if (Howler2.usingWebAudio) {
            Howler2.masterGain = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
            Howler2.masterGain.gain.setValueAtTime(Howler2._muted ? 0 : Howler2._volume, Howler2.ctx.currentTime);
            Howler2.masterGain.connect(Howler2.ctx.destination);
          }
          Howler2._setup();
        };
        if (typeof define === "function" && define.amd) {
          define([], function() {
            return {
              Howler: Howler2,
              Howl: Howl3
            };
          });
        }
        if (typeof exports !== "undefined") {
          exports.Howler = Howler2;
          exports.Howl = Howl3;
        }
        if (typeof global !== "undefined") {
          global.HowlerGlobal = HowlerGlobal2;
          global.Howler = Howler2;
          global.Howl = Howl3;
          global.Sound = Sound2;
        } else if (typeof window !== "undefined") {
          window.HowlerGlobal = HowlerGlobal2;
          window.Howler = Howler2;
          window.Howl = Howl3;
          window.Sound = Sound2;
        }
      })();
      (function() {
        "use strict";
        HowlerGlobal.prototype._pos = [0, 0, 0];
        HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
        HowlerGlobal.prototype.stereo = function(pan) {
          var self = this;
          if (!self.ctx || !self.ctx.listener) {
            return self;
          }
          for (var i = self._howls.length - 1; i >= 0; i--) {
            self._howls[i].stereo(pan);
          }
          return self;
        };
        HowlerGlobal.prototype.pos = function(x, y, z) {
          var self = this;
          if (!self.ctx || !self.ctx.listener) {
            return self;
          }
          y = typeof y !== "number" ? self._pos[1] : y;
          z = typeof z !== "number" ? self._pos[2] : z;
          if (typeof x === "number") {
            self._pos = [x, y, z];
            if (typeof self.ctx.listener.positionX !== "undefined") {
              self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
              self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
              self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
            } else {
              self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
            }
          } else {
            return self._pos;
          }
          return self;
        };
        HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
          var self = this;
          if (!self.ctx || !self.ctx.listener) {
            return self;
          }
          var or = self._orientation;
          y = typeof y !== "number" ? or[1] : y;
          z = typeof z !== "number" ? or[2] : z;
          xUp = typeof xUp !== "number" ? or[3] : xUp;
          yUp = typeof yUp !== "number" ? or[4] : yUp;
          zUp = typeof zUp !== "number" ? or[5] : zUp;
          if (typeof x === "number") {
            self._orientation = [x, y, z, xUp, yUp, zUp];
            if (typeof self.ctx.listener.forwardX !== "undefined") {
              self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
            } else {
              self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
            }
          } else {
            return or;
          }
          return self;
        };
        Howl.prototype.init = /* @__PURE__ */ function(_super) {
          return function(o) {
            var self = this;
            self._orientation = o.orientation || [1, 0, 0];
            self._stereo = o.stereo || null;
            self._pos = o.pos || null;
            self._pannerAttr = {
              coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : 360,
              coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : 360,
              coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : 0,
              distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : "inverse",
              maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : 1e4,
              panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : "HRTF",
              refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : 1,
              rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : 1
            };
            self._onstereo = o.onstereo ? [{ fn: o.onstereo }] : [];
            self._onpos = o.onpos ? [{ fn: o.onpos }] : [];
            self._onorientation = o.onorientation ? [{ fn: o.onorientation }] : [];
            return _super.call(this, o);
          };
        }(Howl.prototype.init);
        Howl.prototype.stereo = function(pan, id) {
          var self = this;
          if (!self._webAudio) {
            return self;
          }
          if (self._state !== "loaded") {
            self._queue.push({
              event: "stereo",
              action: function() {
                self.stereo(pan, id);
              }
            });
            return self;
          }
          var pannerType = typeof Howler.ctx.createStereoPanner === "undefined" ? "spatial" : "stereo";
          if (typeof id === "undefined") {
            if (typeof pan === "number") {
              self._stereo = pan;
              self._pos = [pan, 0, 0];
            } else {
              return self._stereo;
            }
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self._soundById(ids[i]);
            if (sound) {
              if (typeof pan === "number") {
                sound._stereo = pan;
                sound._pos = [pan, 0, 0];
                if (sound._node) {
                  sound._pannerAttr.panningModel = "equalpower";
                  if (!sound._panner || !sound._panner.pan) {
                    setupPanner(sound, pannerType);
                  }
                  if (pannerType === "spatial") {
                    if (typeof sound._panner.positionX !== "undefined") {
                      sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                      sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                      sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
                    } else {
                      sound._panner.setPosition(pan, 0, 0);
                    }
                  } else {
                    sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
                  }
                }
                self._emit("stereo", sound._id);
              } else {
                return sound._stereo;
              }
            }
          }
          return self;
        };
        Howl.prototype.pos = function(x, y, z, id) {
          var self = this;
          if (!self._webAudio) {
            return self;
          }
          if (self._state !== "loaded") {
            self._queue.push({
              event: "pos",
              action: function() {
                self.pos(x, y, z, id);
              }
            });
            return self;
          }
          y = typeof y !== "number" ? 0 : y;
          z = typeof z !== "number" ? -0.5 : z;
          if (typeof id === "undefined") {
            if (typeof x === "number") {
              self._pos = [x, y, z];
            } else {
              return self._pos;
            }
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self._soundById(ids[i]);
            if (sound) {
              if (typeof x === "number") {
                sound._pos = [x, y, z];
                if (sound._node) {
                  if (!sound._panner || sound._panner.pan) {
                    setupPanner(sound, "spatial");
                  }
                  if (typeof sound._panner.positionX !== "undefined") {
                    sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
                    sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
                    sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setPosition(x, y, z);
                  }
                }
                self._emit("pos", sound._id);
              } else {
                return sound._pos;
              }
            }
          }
          return self;
        };
        Howl.prototype.orientation = function(x, y, z, id) {
          var self = this;
          if (!self._webAudio) {
            return self;
          }
          if (self._state !== "loaded") {
            self._queue.push({
              event: "orientation",
              action: function() {
                self.orientation(x, y, z, id);
              }
            });
            return self;
          }
          y = typeof y !== "number" ? self._orientation[1] : y;
          z = typeof z !== "number" ? self._orientation[2] : z;
          if (typeof id === "undefined") {
            if (typeof x === "number") {
              self._orientation = [x, y, z];
            } else {
              return self._orientation;
            }
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self._soundById(ids[i]);
            if (sound) {
              if (typeof x === "number") {
                sound._orientation = [x, y, z];
                if (sound._node) {
                  if (!sound._panner) {
                    if (!sound._pos) {
                      sound._pos = self._pos || [0, 0, -0.5];
                    }
                    setupPanner(sound, "spatial");
                  }
                  if (typeof sound._panner.orientationX !== "undefined") {
                    sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
                    sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
                    sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setOrientation(x, y, z);
                  }
                }
                self._emit("orientation", sound._id);
              } else {
                return sound._orientation;
              }
            }
          }
          return self;
        };
        Howl.prototype.pannerAttr = function() {
          var self = this;
          var args = arguments;
          var o, id, sound;
          if (!self._webAudio) {
            return self;
          }
          if (args.length === 0) {
            return self._pannerAttr;
          } else if (args.length === 1) {
            if (typeof args[0] === "object") {
              o = args[0];
              if (typeof id === "undefined") {
                if (!o.pannerAttr) {
                  o.pannerAttr = {
                    coneInnerAngle: o.coneInnerAngle,
                    coneOuterAngle: o.coneOuterAngle,
                    coneOuterGain: o.coneOuterGain,
                    distanceModel: o.distanceModel,
                    maxDistance: o.maxDistance,
                    refDistance: o.refDistance,
                    rolloffFactor: o.rolloffFactor,
                    panningModel: o.panningModel
                  };
                }
                self._pannerAttr = {
                  coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== "undefined" ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
                  coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== "undefined" ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
                  coneOuterGain: typeof o.pannerAttr.coneOuterGain !== "undefined" ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
                  distanceModel: typeof o.pannerAttr.distanceModel !== "undefined" ? o.pannerAttr.distanceModel : self._distanceModel,
                  maxDistance: typeof o.pannerAttr.maxDistance !== "undefined" ? o.pannerAttr.maxDistance : self._maxDistance,
                  refDistance: typeof o.pannerAttr.refDistance !== "undefined" ? o.pannerAttr.refDistance : self._refDistance,
                  rolloffFactor: typeof o.pannerAttr.rolloffFactor !== "undefined" ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
                  panningModel: typeof o.pannerAttr.panningModel !== "undefined" ? o.pannerAttr.panningModel : self._panningModel
                };
              }
            } else {
              sound = self._soundById(parseInt(args[0], 10));
              return sound ? sound._pannerAttr : self._pannerAttr;
            }
          } else if (args.length === 2) {
            o = args[0];
            id = parseInt(args[1], 10);
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            sound = self._soundById(ids[i]);
            if (sound) {
              var pa = sound._pannerAttr;
              pa = {
                coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : pa.coneInnerAngle,
                coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : pa.coneOuterAngle,
                coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : pa.coneOuterGain,
                distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : pa.distanceModel,
                maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : pa.maxDistance,
                refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : pa.refDistance,
                rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : pa.rolloffFactor,
                panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : pa.panningModel
              };
              var panner = sound._panner;
              if (!panner) {
                if (!sound._pos) {
                  sound._pos = self._pos || [0, 0, -0.5];
                }
                setupPanner(sound, "spatial");
                panner = sound._panner;
              }
              panner.coneInnerAngle = pa.coneInnerAngle;
              panner.coneOuterAngle = pa.coneOuterAngle;
              panner.coneOuterGain = pa.coneOuterGain;
              panner.distanceModel = pa.distanceModel;
              panner.maxDistance = pa.maxDistance;
              panner.refDistance = pa.refDistance;
              panner.rolloffFactor = pa.rolloffFactor;
              panner.panningModel = pa.panningModel;
            }
          }
          return self;
        };
        Sound.prototype.init = /* @__PURE__ */ function(_super) {
          return function() {
            var self = this;
            var parent = self._parent;
            self._orientation = parent._orientation;
            self._stereo = parent._stereo;
            self._pos = parent._pos;
            self._pannerAttr = parent._pannerAttr;
            _super.call(this);
            if (self._stereo) {
              parent.stereo(self._stereo);
            } else if (self._pos) {
              parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
            }
          };
        }(Sound.prototype.init);
        Sound.prototype.reset = /* @__PURE__ */ function(_super) {
          return function() {
            var self = this;
            var parent = self._parent;
            self._orientation = parent._orientation;
            self._stereo = parent._stereo;
            self._pos = parent._pos;
            self._pannerAttr = parent._pannerAttr;
            if (self._stereo) {
              parent.stereo(self._stereo);
            } else if (self._pos) {
              parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
            } else if (self._panner) {
              self._panner.disconnect(0);
              self._panner = void 0;
              parent._refreshBuffer(self);
            }
            return _super.call(this);
          };
        }(Sound.prototype.reset);
        var setupPanner = function(sound, type) {
          type = type || "spatial";
          if (type === "spatial") {
            sound._panner = Howler.ctx.createPanner();
            sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
            sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
            sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
            sound._panner.distanceModel = sound._pannerAttr.distanceModel;
            sound._panner.maxDistance = sound._pannerAttr.maxDistance;
            sound._panner.refDistance = sound._pannerAttr.refDistance;
            sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
            sound._panner.panningModel = sound._pannerAttr.panningModel;
            if (typeof sound._panner.positionX !== "undefined") {
              sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
              sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
              sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
            } else {
              sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
            }
            if (typeof sound._panner.orientationX !== "undefined") {
              sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
              sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
              sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
            } else {
              sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
            }
          } else {
            sound._panner = Howler.ctx.createStereoPanner();
            sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
          }
          sound._panner.connect(sound._node);
          if (!sound._paused) {
            sound._parent.pause(sound._id, true).play(sound._id, true);
          }
        };
      })();
    }
  });

  // index.js
  var scriptFolder_exports = {};
  __export(scriptFolder_exports, {
    addMenuPanels: () => addMenuPanels,
    genFact: () => genFact,
    musicManager: () => musicManager,
    toggleDropdown: () => toggleDropdown
  });

  // music.ts
  var import_howler = __toESM(require_howler());
  function addMaxVolume(howl, maxVolume) {
    howl["maxVolume"] = maxVolume;
    return howl;
  }
  var introMusic = [
    new import_howler.Howl({
      src: ["/static/assets/roaming_two.ogg"],
      loop: true,
      rate: 1,
      html5: true,
      preload: "metadata"
    })
  ];
  var waterMusic = [
    addMaxVolume(new import_howler.Howl({
      src: ["/static/assets/river1.ogg"],
      loop: true,
      rate: 1,
      html5: true,
      preload: "metadata"
    }), 1.5)
  ];
  var swimmingMusic = [
    new import_howler.Howl({
      src: ["/static/assets/swimming.ogg"],
      loop: true,
      rate: 1,
      html5: true,
      preload: "metadata"
    })
  ];
  var binauralBeats = [
    new import_howler.Howl({
      src: ["/static/assets/binaural_beats.ogg"],
      loop: true,
      rate: 1,
      html5: true,
      preload: "metadata"
    })
  ];
  var synthwave = [
    new import_howler.Howl({
      src: ["/static/assets/synthwave.ogg"],
      loop: true,
      rate: 1,
      html5: true,
      preload: "metadata"
    })
  ];
  var piano = [
    new import_howler.Howl({
      src: ["/static/assets/piano.ogg"],
      loop: true,
      rate: 1,
      html5: true,
      preload: "metadata"
    })
  ];
  var musicManager = {
    activeSoundtracks: [],
    soundtracks: [introMusic, waterMusic, swimmingMusic, binauralBeats, synthwave, piano],
    playSoundtrack: function(whichSoundtrack) {
      this.soundtracks[whichSoundtrack].forEach((howl) => {
        let maxVolume = howl["maxVolume"];
        if (maxVolume === void 0) {
          maxVolume = 1;
        }
        if (howl.state() === "unloaded") {
          howl.load();
        }
        howl.play();
      });
      this.activeSoundtracks.push(whichSoundtrack);
    },
    pauseSoundtrack: function(whichSoundtrack) {
      this.soundtracks[whichSoundtrack].forEach((howl) => {
        howl.pause();
      });
      this.activeSoundtracks.splice(this.activeSoundtracks.indexOf(whichSoundtrack), 1);
    },
    toggleSoundtrack: function(whichSoundtrack) {
      if (!this.activeSoundtracks.includes(whichSoundtrack)) {
        this.playSoundtrack(whichSoundtrack);
      } else {
        this.pauseSoundtrack(whichSoundtrack);
      }
    },
    pauseAll: function() {
      for (let i = 0; i < this.soundtracks.length; i++) {
        this.soundtracks[i].forEach((howl) => {
          howl.pause();
        });
      }
      this.activeSoundtracks = [];
    }
  };

  // utility.ts
  function toggleDropdown(containerName) {
    const button = document.querySelector("#" + containerName + " > button");
    button?.addEventListener("click", (event) => {
      const dropdown = document.querySelector("#" + containerName + " > .dropdown-content");
      if (dropdown === null) {
        return;
      }
      if (dropdown.classList.contains("hidden")) {
        dropdown.classList.remove("hidden");
        button.innerText = button.innerText + " \u21AA";
      } else {
        dropdown.classList.add("hidden");
        button.innerText = button.innerText.substring(0, button.innerText.length - 2);
      }
    });
  }

  // addMenuPanels.ts
  function openMenuPanel(event) {
    const identifier = event.target.getAttribute("identifier");
    const replacer = document.querySelector(".panelFull[identifier='" + identifier + "']");
    if (replacer === null) {
      console.error("Replacelink without replacer!");
      console.error(event.target);
      return;
    }
    replacer.classList.remove("hidden");
  }
  function editMenuPanel(menuPanel) {
    const closeButton = document.createElement("button");
    closeButton.innerText = "X";
    closeButton.type = "button";
    closeButton.classList.add("closeButton");
    closeButton.addEventListener("click", () => {
      menuPanel.classList.add("hidden");
    });
    menuPanel.prepend(closeButton);
  }
  function addMenuPanels() {
    Array.from(document.getElementsByClassName("panelOpener")).forEach((e) => {
      e.addEventListener("click", openMenuPanel);
    });
    Array.from(document.getElementsByClassName("panelFull")).forEach((e) => {
      editMenuPanel(e);
    });
  }

  // motivation.ts
  var facts = [
    "A goldfish's attention span is three seconds.",
    "Animals that lay eggs don't have belly buttons.",
    "Beavers can hold their breath for 45 minutes under water.",
    "Slugs have four noses.",
    "Camels have three eyelids.",
    "A honey bee can fly at 15mph.",
    "A queen bee can lay 800-1,500 eggs per day.",
    "A bee has five eyelids.",
    "The average speed of a housefly is 4.5 mph.",
    "Mosquitoes are attracted to people who just ate bananas.",
    "Flamingos turn pink from eating shrimp.",
    "Emus and kangaroos cannot walk backward.",
    "Cats have over 100 vocal cords.",
    "Camel's milk does not curdle.",
    "All porcupines float in water.",
    "The world's termites outweigh the world's humans about 10 to 1.",
    "A hummingbird weighs less than a penny.",
    "A jellyfish is approximately 95% water.",
    "Children tend to grow faster in the spring.",
    "Broccoli is the only vegetable that is also a flower.",
    "Peaches are members of the almond family.",
    "Alaska has the highest percentage of people who walk to work.",
    "The San Francisco cable cars are the only mobile national monument.",
    "The state of Maine has 62 lighthouses.",
    "The only food that does not spoil is honey.",
    "The Hawaiian alphabet has only 12 letters.",
    "A ball of glass will bounce higher than a ball of rubber.",
    "Chewing gum while peeling onions will prevent you from crying.",
    "On average a human being will spend up to 2 weeks kissing in his/her lifetime.",
    "Fish have eyelids.",
    "The average human eats 8 spiders in his/her lifetime while sleeping.",
    "There are one million ants to every human in the world.",
    "Termites eat through wood two times faster when listening to rock music!",
    "If you keep a goldfish in a dark room it will eventually turn white.",
    "Elephants only sleep two hours a day.",
    "A duck's quack doesn't echo.",
    "A snail breathes through its foot.",
    "Fish cough.",
    "An ant's sense of smell is stronger than a dog's.",
    "It is possible to lead a cow up stairs but not down.",
    "Shrimp can only swim backward.",
    "Frogs cannot swallow with their eyes open.",
    "A cat's lower jaw cannot move sideways.",
    "The bullfrog is the only animal that never sleeps.",
    "Elephants are capable of swimming 20 miles per day.",
    "Elephants are the only mammals that can't jump.",
    "Giraffes have no vocal cords.",
    "Cats can hear ultrasound.",
    "Despite its hump, a camel has a straight spine.",
    "Mosquitoes have 47 teeth.",
    "There are 63,360 inches in a mile.",
    "About 11% of the people in the world are left-handed.",
    "The average woman consumes six pounds of lipstick in her lifetime.",
    "The average smell weighs 760 nanograms.",
    "A human brain weighs about three pounds.",
    "1/4 of the bones in your body are in your feet.",
    "You blink over 10,000,000 times a year.",
    "A sneeze travels out of your mouth at over 100 miles an hour.",
    "Brain waves can be used to power an electric train.",
    "The tongue is the fastest healing part of the body.",
    "Pigs can get sunburn.",
    "The life span of a taste bud is about ten days.",
    "The average human produces 10,000 gallons of saliva in a lifetime.",
    "Strawberries contain more vitamin C than oranges.",
    "A one-day weather forecast requires about 10 billion math calculations.",
    "Americans, on average, eat 18 acres of pizza a day.",
    "There are 18 different animal shapes in the animal cracker zoo.",
    'The longest one-syllable word is "screeched."',
    "No word in the English language rhymes with month.",
    "Caller ID is illegal in California.",
    'There is a town called "Big Ugly" in West Virginia.',
    "The average person uses 150 gallons of water per day for personal use.",
    "The average person spends 2 weeks over his/her lifetime waiting for a traffic light to change.",
    "You share your birthday with at least 9 million other people in the world.",
    "The average person makes 1,140 phone calls per year.",
    "The average person spends about 2 years on the phone in a lifetime.",
    "No piece of paper can be folded more than seven times.",
    "Alaska is the most eastern and western state in the U.S.",
    "There are 119 grooves on the edge of a quarter.",
    "About 18 percent of animal owners share their bed with their pet.",
    "Alaska has more caribou than people.",
    "August has the highest percentage of births.",
    "Googol is a number (1 followed by 100 zeros).",
    "Oysters can change from one gender to another and back again.",
    "The Mona Lisa has no eyebrows.",
    "Until the 19th century, solid blocks of tea were used as money in Siberia.",
    "A mile on the ocean and a mile on land are not the same distance.",
    "A ten gallon hat holds less than one gallon of liquid.",
    "The average American walks 18,000 steps a day.",
    "The average raindrop falls at seven mph.",
    "There are more telephones than people in Washington, D.C.",
    "Fish can drown.",
    "A kangaroo can jump 30 feet.",
    "Lizards communicate by doing push-ups.",
    "Squids can have eyes the size of a volleyball.",
    "The average American will eat 35,000 cookies in his/her lifetime.",
    "A turkey can run at 20 mph.",
    "When the moon is directly overhead, you weigh slightly less.",
    "You burn about 20 calories per hour chewing gum.",
    "In a year, the average person walks four miles making his or her bed.",
    "About half of all Americans are on a diet on any given day.",
    "A one-minute kiss burns 26 calories.",
    "Frowning burns more calories than smiling.",
    "There are more than 30,000 diets on public record.",
    "You will burn about 7% more calories walking on hard dirt than on pavement.",
    "You would weigh less on the top of a mountain than at sea level.",
    "You burn more calories sleeping than watching TV.",
    "Licking a stamp burns 10 calories.",
    "Smelling apples and/or bananas can help you lose weight.",
    "Frogs never drink.",
    "Only male turkeys gobble.",
    "At birth, a Dalmatian is always pure white.",
    "The fastest recorded speed of a racehorse was over 43 mph.",
    "The oldest known animal was a tortoise, which lived to be 152 years old.",
    "Bamboo makes up 99 percent of a panda's diet.",
    "The largest fish is the whale shark - it can be over 50 feet long and weigh two tons.",
    "The starfish is the only animal that can turn its stomach inside out.",
    "Honeybees are the only insects that create a form of food for humans.",
    "The hummingbird is the only bird that can fly backwards.",
    "The only continent without reptiles or snakes is Antarctica.",
    "The only bird that can swim and not fly is a penguin.",
    "A duck can't walk without bobbing its head.",
    "Beavers were once the size of bears.",
    "Seals sleep only one and a half minutes at a time.",
    "Pigeons have been trained by the U.S. Coast Guard to spot people lost at sea.",
    "A pigeon's feathers are heavier than its bones.",
    "A hummingbird's heart beats 1,400 times a minute.",
    "Dragonflies have six legs but cannot walk.",
    "Dolphins can jump up to 20 feet in the air.",
    "Koalas and humans are the only animals with unique fingerprints.",
    "Penguins have an organ above their eyes that converts seawater to fresh water.",
    "A crocodile cannot move its tongue.",
    "Honeybees navigate by using the sun as a compass.",
    "An ant can lift 50 times its own weight.",
    "A single coffee tree produces only about a pound of coffee beans per year.",
    "Strawberries are the only fruits whose seeds grow on the outside.",
    "The city of Los Angeles has about 3x more automobiles than people.",
    "Hawaii is the only U.S. state that grows coffee commercially.",
    "Hawaii is the only state with one school district.",
    "Holland is the only country with a national dog.",
    "The square dance is the official dance of the state of Washington.",
    "Hawaii is the only U.S. state never to report a temperature of zero degrees F or below.",
    '"Q" is the only letter in the alphabet not appearing in the name of any U.S. state.',
    "Texas is the only state that permits residents to cast absentee ballots from space.",
    "Lake Superior is the world's largest lake.",
    "The smallest county in America is New York County, better known as Manhattan.",
    "Panama is the only place in the world where you can see the sun rise on the Pacific and set on the Atlantic.",
    "The tallest man was 8 ft. 11 in.",
    "Theodore Roosevelt was the only president who was blind in one eye.",
    "The first sport to be filmed was boxing in 1894.",
    "The fastest served ball in tennis was clocked at 154 mph in 1963.",
    "In 1985, the fastest bicyclist was clocked at 154 mph.",
    "The speed limit in NYC was eight mph in 1895.",
    "Americans spend more than $630 million a year on golf balls.",
    "In 1926, the first outdoor mini-golf courses were built on rooftops in NYC.",
    "Swimming pools in the U.S. contain enough water to cover San Francisco.",
    "The first TV soap opera debuted in 1946.",
    'The first MTV video was "Video Killed the Radio Star" by the Buggles.',
    'The first TV show to ever be put into reruns was "The Lone Ranger."',
    `One alternate title that had been considered for NBC's hit "Friends" was "Insomnia Caf'."`,
    'The first TV network kids show in the U.S. was "Captain Kangaroo."',
    "The temperature of the sun can reach up to 15 million degrees Fahrenheit.",
    'The first penny had the motto "Mind your own business."',
    "The first vacuum was so large, it was brought to a house by horses.",
    "Your eye expands up to 45% when looking at something pleasing.",
    "Before mercury, brandy was used to fill thermometers.",
    "You'd have to play ping-pong for about 12 hours to lose one pound.",
    "One brow wrinkle is the result of 200,000 frowns.",
    "The first human-made object to break the sound barrier was a whip.",
    "In 1878, the first telephone book ever issued contained only 50 names.",
    "The most sensitive parts of the body are the mouth and the fingertips.",
    "The eye makes movements 50 times every second.",
    "Chinese is the most spoken language in the world.",
    "The world's biggest pyramid is not in Egypt, but in Mexico.",
    "In 1634, tulip bulbs were a form of currency in Holland.",
    "The first bike was called a hobbyhorse.",
    "The first sailing boats were built in Egypt.",
    "The first ballpoint pens were sold in 1945 for $12.00.",
    "The first lighthouse to use electricity was the Statue of Liberty in 1886.",
    "The first VCR was made in 1956 and was the size of a piano.",
    "The first jukebox was located in San Francisco in 1899.",
    "A rainbow can only be seen in the morning or late afternoon.",
    "The Capitol building in Washington, D.C. has 365 steps to represent every day of the year.",
    "The most used letters in the English language are E, T, A, O, I, and N.",
    "A male kangaroo is called a boomer.",
    "A female kangaroo is called a flyer.",
    "There are over 61,000 pizzerias in the U.S.",
    "Antarctica is the driest, coldest, windiest, and highest continent on earth.",
    "The Sahara Desert stretches farther than the distance from California to New York.",
    "Thailand means 'Land of the Free.'",
    "Popcorn was invented by the American Indians.",
    "Jupiter spins so fast that there is a new sunrise nearly every 10 hours.",
    "The year that read the same upside down was 1961. That won't happen again until 6009.",
    "You don't have to be a lawyer to be a Supreme Court Justice.",
    "Eleven of the 50 U.S. states are named after an actual person.",
    "If you doubled one penny every day for 30 days, you would have $5,368,709.",
    "The first person crossed Niagara Falls by tightrope in 1859.",
    "The U.S. is the largest country named after a real person (Amerigo Vespucci).",
    "The largest cheesecake ever made weighed 57,508 lbs.",
    "The first country to use postcards was Austria.",
    "The only one-syllabled U.S. state is Maine.",
    "The mouth of the Statue of Liberty is 3 feet wide.",
    "Atlantic salmon are capable of leaping 15 feet high.",
    "A stamp shaped like a banana was once issued in the country of Tonga.",
    "For every human being in the world there is approximately one chicken.",
    "Over 1 million Earths would fit inside the Sun.",
    "Before 1687 clocks were made with only an hour hand.",
    "Add up opposing sides of a dice cue, and you'll always get seven.",
    "The largest pumpkin ever grown weighed 1,061 lbs.",
    "1.3 billion pounds of peanuts are produced in Georgia each year.",
    "The average koala sleeps 22 hours each day.",
    "Galapagos turtles can take up to three weeks to digest a meal.",
    "The largest ball of twine in the US weighs over 17,000.",
    "Giraffes can lick their own eyes.",
    "Tennessee banned the use of a lasso to catch fish.",
    "TV dinners originated in the Arctic.",
    "Blackboard chalk contains no chalk.",
    "A jackrabbit can travel more than 12 feet in one hop.",
    "An electric eel can release a charge powerful enough to start 50 cars.",
    "Porcupines each have 30,000 quills.",
    "The game of basketball was first played using a soccer ball and two peach baskets.",
    "Twinkle Twinkle Little Star was composed by Mozart when he was five years old.",
    "The Basenji is the only type of dog that does not bark.",
    "America's 1st roller coaster was built in 1827 to carry coal from a mine to boats below.",
    "There are towns named Sandwich in Illinois and Massachusetts.",
    "13 percent of the world's tea comes from Kenya.",
    "Tsiology is anything written about tea.",
    "There is a town in South Dakota named Tea.",
    "The Caspian Sea is actually a lake.",
    "Caterpillars have over 2,000 muscles.",
    "Detroit has the greatest number of registered bowlers in the U.S.",
    "The blue whale's heart is the size of a small car.",
    "There are seven letters that look the same upside down as right side up.",
    "Great Falls, Montana, is the windiest city in the U.S.",
    "The biggest pig in recorded history weighed almost one ton.",
    "Cows give more milk when they listen to music.",
    "The number of times a cricket chirps in 15 seconds, plus 37, will give you the current air temperature.",
    "An ostrich's brain is smaller than its eye.",
    "Besides humans, elephants are the only animals that can be taught to stand on their head.",
    '"Challenger Deep" is the deepest point on Earth and can hold 25 Empire State Buildings end to end.',
    "The only cactus plantation in the world is in Mississippi.",
    `The Nickname of President Hayes's wife was "Lemonade Lucy."`,
    "If you put all the streets in New York City in a straight line, they would stretch to Japan.",
    "The watermelon seed-spitting world record is about 70 feet.",
    "The first typewriter was called the 'literary piano.'",
    "The 'silk' of a spider is stronger than steel threads of the same diameter.",
    "Britain was the first country to register a patent on polyester.",
    "Snoopy is the most common dog name beginning with the letter S.",
    "The 1st public message to be transmitted via Morse code was 'A patient waiter is no loser.'",
    "Mongolians invented lemonade around 1299 A.D.",
    "There are more French restaurants in New York City than in Paris.",
    "There is a town in Alaska called Chicken.",
    "The first TV remote control, introduced in 1950, was called Lazy Bones.",
    "The only bird who can see the color blue is the owl.",
    "Among North Atlantic lobsters, about 1 in 5,000 is born bright blue.",
    "There are more saunas than cars in Finland.",
    "The first food eaten in space by a U.S. astronaut was applesauce.",
    "Lemon wood is carved into chess pieces.",
    "The original recipe for chocolate contained chili powder instead of sugar.",
    "Underwater hockey is played with a 3-pound puck.",
    "Playing in a marching band is considered moderate exercise.",
    "The act of chewing an apple is a more efficient way to stay awake than caffeine.",
    "Bowling pins need to tip over a mere 7 1/2 degrees to fall down.",
    "Your breathing rate increases when you start to type.",
    "About 90% of all garlic consumed in the U.S. comes from Gilroy, CA.",
    "Manhattan is the only borough in New York City that doesn't have a Main Street.",
    "Double Dutch jump rope is considered a cross-training sport.",
    "One lemon tree will produce about 1,500 lemons a year.",
    "Horseback riding can improve your posture.",
    "Colors like red, yellow, and orange make you hungry.",
    "Dim lights reduce your appetite.",
    "At birth, a human has 350 bones, but only 206 bones when full grown.",
    "Each year, the average American eats about 15 pounds of apples.",
    "All lemons are harvested by hand.",
    "It took the first man to walk around the world four years, three months and 16 days to complete his journey.",
    "Grizzly bears run as fast as the average horse.",
    `Today's "modern" wrestling moves have been seen in tomb drawings from ancient Egypt.`,
    "China only has one time zone.",
    "Canada has the longest coastline of any country in the world.",
    "The amount of concrete used in the Hoover Dam could build a highway from New York to California.",
    "The original name of Nashville, Tennessee was Big Salt Lick.",
    "If you drive from Los Angeles to Reno, NV, you will be heading west.",
    "A compass needle does not point directly north.",
    "Mt. Everest has grown one foot over the last 100 years.",
    "In ancient Rome, lemons were used as an antidote to all poisons.",
    "The height of the Eiffel Tower varies by as much as 6 inches depending on the temperature.",
    "Wisconsin has points located farther east than parts of Florida.",
    "Four Corners, AZ, is the only place where a person can stand in 4 states at the same time.",
    "In 1908, the first lollipop-making machine started in New Haven, CT.",
    "One out of every eight residents in the U.S. lives in California.",
    "Africa is divided into more countries than any other continent.",
    "Heavier, not bigger lemons, produce more juice.",
    "Vermont is the only New England state without a seacoast.",
    "No only child has been a U.S. President.",
    "Leonardo da Vinci could draw with one hand while writing with the other.",
    "In 1860, Abraham Lincoln grew a beard at the suggestion of an 11-year-old girl.",
    "David Rice Atchison was President of the United States for only one day.",
    "The sailfish has been clocked at speeds of over 60 miles per hour.",
    "The Library of Congress has over 600 miles of shelves.",
    "Pennsylvania is misspelled on the Liberty Bell because that is how they spelled it in the 18th century.",
    "William Shakespeare was born and died on the same day: April 23.",
    "Ketchup was once sold as a medicine.",
    "Napoleon suffered from a fear of cats.",
    "In 1900, 1/3 of all automobiles in New York City were powered by electricity.",
    "The 4th Earl of Sandwich invented the sandwich so he could eat and gamble at the same time.",
    "In the Middle Ages, chicken soup was considered an aphrodisiac.",
    "All dog breeds except chow-chows have black lips to prevent them from getting sunburned.",
    "Connecticut was the first state to pass a Lemon Law in 1982.",
    "Ancient Egyptians believed the 'vein of love' ran from the third finger on the left hand to the heart.",
    "The word 'facetious' features all the vowels in alphabetical order.",
    "The standard Chinese typewriter has 1,500 characters.",
    "A flea can jump 30,000 times without stopping.",
    "'O' is the oldest letter of the alphabet, dating back to 3000 B.C.",
    "The Japanese word 'judo' means 'the gentle way.'",
    "No two lip impressions are the same.",
    "It took Leonardo da Vinci 12 years to paint the lips of the Mona Lisa.",
    "Top-performing companies are called 'blue chips' after the costliest chips in casinos.",
    "The name for the space between your eyebrows is 'nasion.'",
    "The word 'purple' does not rhyme with any other word in the English language.",
    "The legs of bats are too weak to support their weight, so they hang upside down.",
    "75% of people wash from top to bottom in the shower.",
    "On average, you'll spend a year of your life looking for misplaced objects.",
    "Chewing gum was invented in New York City in 1870 by Thomas Adams.",
    "The Statue of Liberty features 7 points in her crown- one for each of the continents.",
    "The world's first escalator was built in Coney Island, NY, in 1896.",
    "The top of the Empire State Building was originally built as a place to anchor blimps.",
    "The area code in Cape Canaveral, Fl, is 321.",
    "Ohio is the only U.S. state that does not have a rectangular flag.",
    "Long Island is the largest island in the Continental U.S.",
    "Maine produces more toothpicks than any other state in the U.S.",
    "The last letter to be added to our alphabet was J.",
    "There are more doughnut shops per capita in Canada than in any other country.",
    "There is an underground mushroom in Oregon that measures 3.5 miles across.",
    "Of the 92 counties in Indiana, only 5 observe daylight savings time.",
    "California and Arizona grow approximately 95% of the fresh lemons in the U.S.",
    "The term 007 was derived from 20007, the home zip code of many Washington, D.C. agents.",
    "Leonardo da Vinci discovered that a tree's rings reveal its age.",
    "The popsicle was invented in 1905 by an 11-year-old boy.",
    "The medical term for writer's cramp is graphospasm.",
    "A male firefly's light is twice as bright as a female's.",
    "It is estimated that the world's oceans contain 10 billion tons of gold.",
    "Cold water weighs less than hot water.",
    "Storm clouds hold about 6 trillion raindrops.",
    "The weight of the moon is 81 billion tons.",
    "Bamboo can grow three feet in one day.",
    "A tune that gets stuck in your head is called an earworm.",
    "You exhale air at 15 m.p.h.",
    "A baboon is a variety of lemon.",
    "Butterflies were formerly known by the name Flutterby.",
    "Mexican jumping beans jump to get out of sunlight.",
    '"Arachibutlphobia" is the fear of peanut butter sticking to the roof of your mouth.',
    "Pearls dissolve in vinegar.",
    "Borborygmi is the noise that your stomach makes when you are hungry.",
    "The center of some golf balls contain honey.",
    "International tug of war rules state that the rope must be over 100-feet long.",
    "In 2003, a 6-year-old from Naples, FL was ticketed for not having a permit for her lemonade stand.",
    "On Valentine's Day, there is no charge to get married in the Empire State Building's chapel.",
    "Heat, not sunlight, ripens tomatoes.",
    "A housefly hums in the key of F.",
    "Endocarp is the edible pulp inside a lemon.",
    "Thomas Edison coined the word 'hello' and introduced it as a way to answer the phone.",
    "'Way' is the most frequently used noun in the English language.",
    "The 'high five' was introduced by a professional baseball player in 1977.",
    "'Disco' means 'I learn' in Latin.",
    "It costs the U.S. government 2.5 cents to produce a quarter.",
    "Baboons were once trained by Egyptians to wait on tables.",
    "The official state gem of Washington is petrified wood.",
    "Mount Katahdin in Maine is the first place in the U.S. to get sunlight each morning.",
    "Each year, the average person walks the distance from NY to Miami.",
    "New York City's public school students represent about 188 different countries.",
    "In the U.S., all interstate highways that run east to west are even-numbered.",
    "Three out of every six Americans live within fifty miles of where they were born.",
    "The raised bump reflectors on U.S. roads are named 'Botts dots.'",
    "Nearly 9,000 people injure themselves with a toothpick each year.",
    "It is impossible to sneeze with your eyes open.",
    "The dragonfly can reach speeds of up to 36 mph.",
    "Hippos can open their mouths 180 degrees.",
    "Christopher Columbus brought the first lemon seeds to America.",
    "The East Antarctic Ice Sheet is as thick as the Alps Mountains are high.",
    "The deepest place in the ocean is about seven miles deep.",
    "Panda bears eat up to 16 hours a day.",
    "Bald eagles can swim using a stroke similar to the butterfly stroke.",
    "Lifejackets used to be filled with sunflower seeds for flotation.",
    "Two trees can create enough oxygen for a family of four.",
    "The T-rex's closest living relative is the chicken.",
    "Chameleons can move both their eyes in different directions at the same time.",
    "Many butterflies and moths are able to taste with their feet.",
    "A jiffy is an actual time measurement equaling 1/100th of a second.",
    "Greyhounds can reach speeds of 45 miles per hour.",
    "Apples, peaches and raspberries are all members of the rose family.",
    "U.S. paper currency isn't made of paper ' it's actually a blend of cotton and linen.",
    "The ZIP in the ZIP code stands for Zone Improvement Plan.",
    "Kangaroos can't walk backward.",
    "The Empire State Building has 73 elevators.",
    "Lemons ripen after you pick them, but oranges do not.",
    "There are 118 ridges on the edge of a United States dime.",
    "There are 336 dimples on a regulation American golf ball.",
    "One acre of peanuts will make about 30,000 peanut butter sandwiches.",
    "A twit is the technical term for a pregnant goldfish.",
    "In the U.S., a pig has to weigh more than 180 lbs to be called a hog.",
    "Bloodhounds can track a man by smell for up to 100 miles.",
    "Beavers have orange teeth.",
    "The woodpecker can hammer wood up to 16 times per second.",
    "Mount Everest rises a few millimeters every year.",
    "Snails can sleep for up to three years.",
    "The pupils in goats' eyes are rectangular.",
    "Jousting is the official sport in the state of Maryland.",
    "Bees' wings beat about 11,400 times per minute.",
    "The pound sign, or #, is called an octothorp.",
    "The Statue of Liberty wears a size 879 sandal.",
    "If there are two full moons in a month, the second one is called a blue moon.",
    "You breathe in about 13 pints of air every minute.",
    "Sound travels quicker in water than in air.",
    "A group of cats is called a clowder.",
    "Human eyes have over two million working parts.",
    "There are approximately 9,000 taste buds on your tongue.",
    "Raindrops can fall as fast as 20 miles per hour.",
    "Polar bear fur is transparent, not white.",
    "Lobsters can live up to 50 years.",
    "The first traffic light was in use in London in 1868, before the advent of cars.",
    "Fresh cranberries can be bounced like a rubber ball.",
    "A group of a dozen or more cows is called a 'flink.'",
    "Astronauts actually get taller when in space.",
    "A fifteen-year-old boy invented earmuffs in 1873.",
    "There is a ranch in Texas that is bigger than the entire state of Rhode Island.",
    "The dot over the letter i is called a tittle.",
    "The great white shark can go up to three months between meals.",
    "During the Boston Tea Party, 342 chests of tea were thrown into the harbor.",
    "Pluto takes 248 years to orbit the sun once.",
    "Camels have three eyelids.",
    "454 U.S. dollar bills weigh exactly one pound.",
    "Dairy cows drink up to 50 gallons of water per day.",
    "A nautical mile is 800 feet longer than a land mile.",
    "Antarctica has as much ice as the Atlantic Ocean has water.",
    "Candles will burn longer and drip less if they are placed in the freezer a few hours before using.",
    "Over 50 percent of your body heat is lost through your head and neck.",
    "Smile more ' every two thousand frowns creates one wrinkle.",
    "New York taxi drivers collectively speak about 60 languages.",
    "New York City is made up of 50 islands.",
    "The strike note of The Liberty Bell is E flat.",
    "Pigs were banished from Philadelphia's city streets in 1710.",
    "About 40% of America's population lives within a one day drive to Philadelphia.",
    "It is against the law to put pretzels in bags in Philadelphia.",
    "In the game Monopoly, the properties are named after streets in Atlantic City.",
    "The oldest living animal ever found was a 405 year-old clam, named Ming by researchers.",
    "More than 180 countries celebrate Earth Day together every April 22nd.",
    "At 5 feet, the whooping crane is the tallest bird in North America.",
    "A full-grown tree produces enough oxygen to support a family of four.",
    "Unlike your housecat, the Siberian tiger actually loves to swim!",
    "A tiger's night vision is six times better than a human's.",
    "More Siberian tigers live in zoos than in the wild.",
    "The jaguar, the largest cat in the Western Hemisphere, once lived all over the southern U.S.",
    "The giant panda can eat up to 83 lbs of bamboo a day.",
    "Wildlife Forever has helped plant more than 132,000 trees in America since its founding in 1987.",
    "Manhattan Island was once home to as many different species as Yellowstone National Park.",
    "Dogs can make about 10 sounds, while cats make about 100.",
    "A Pelican can hold more food in its beak than its belly.",
    "The average cat can jump 5 times as high as its tail is long.",
    "Flying fish leap out of the water at 20 mph or more, and can glide for over 500 feet.",
    "The roadrunner chases after its prey at a blurring speed of up to 25 mph.",
    "The archer fish can spit water up to 7 feet to shoot down bugs from overhanging leaves.",
    "The spotted skunk does a handstand to warn off its enemies before it sprays its stench.",
    "A male cricket's ear is located on the tibia of its leg.",
    "Spiny lobsters migrate in groups of 50 or more, forming a conga line on the ocean floor.",
    "The National Park Service manages over 350 parks on 80 million acres of public land.",
    "Stepping out for a walk every day can actually help you sleep better at night.",
    "Recycled paper is made using 40% less energy than normal paper.",
    "Every ton of recycled paper saves about 17 trees.",
    "Steel is 100% recyclable.",
    "Most rechargeable batteries can be recharged up to 1,000 times.",
    "An egg that is fresh will sink in water, but a stale one won't.",
    "A camel can drink 25 gallons of water in less than three minutes.",
    "In one day, a full-grown oak tree expels 7 tons of water through its leaves.",
    "There is a museum of strawberries in Belgium.",
    "Mangoes are the most-consumed fruit in the world.",
    "Strawberries have an average of 200 seeds.",
    "A strawberry is not an actual berry, but a banana is.",
    "Fresh apples float because 25 percent of their volume is air.",
    "The peach was the first fruit to be eaten on the moon.",
    "A pineapple is neither an apple or a pine. It is, in fact, a large berry.",
    "Only female mosquitoes bite.",
    "A polar bear cannot be seen by an infrared camera, due to its transparent fur.",
    "A spider's silk is stronger than steel.",
    "The planet Saturn's density is lower than water; in fact, it would float if placed in water.",
    "Twins have a very high occurrence of left handedness.",
    "The fear of vegetables is called lachanophobia.",
    "There are over 2,000 different species of cactuses.",
    "The chicken is the closest living relative of Tyrannosaurus Rex.",
    "All scorpions glow.",
    "Potatoes have more chromosomes than humans.",
    "A full moon is nine times brighter than a half moon.",
    "The human brain takes up 2% of human body weight but uses 20% of its energy.",
    "Poison Ivy is not Ivy and Poison Oak is not an Oak. They are both part of the Cashew family.",
    "Plants, like humans, can run a fever if they are sick.",
    "Over half of the world's geysers are found in Yellowstone National Park.",
    "A group of geese on the ground is a gaggle, a group of geese in the air is a skein.",
    "Polar bears can smell a seal from 20 miles away.",
    "Armadillos have four babies at a time and they are always all the same sex.",
    "The only insect that can turn its head is a praying mantis.",
    "Alaska was bought from Russia for about 2 cents an acre.",
    "A dog's average body temperature is 101 degrees Fahrenheit.",
    "The common garden worm has five pairs of hearts.",
    "Flamingos can only eat with their heads upside down.",
    "A group of twelve or more cows is called a flink.",
    "A group of goats is called a trip.",
    "An alligator can go through 3,000 teeth in a lifetime.",
    "There are more chickens than people in the world.",
    "Penguins can jump 6 feet.",
    "There are approximately 7,000 feathers on an eagle.",
    "The only lizard that has a voice is the Gecko.",
    "A rhinoceros horn is made of compacted hair.",
    "Dolphins sleep with one eye open.",
    "A duck has three eyelids.",
    "Tigers have striped skin, not just striped fur.",
    "The muzzle of a lion is like a fingerprint - no two lions have the same pattern of whiskers.",
    "The hippopotamus has the capability to remain underwater for as long as five minutes.",
    "Most elephants weigh less than the tongue of a blue whale.",
    "If a sheep and a goat mate, the offspring is called a geep.",
    "Pistol shrimp can make a noise loud enough to break glass.",
    "Mountain goats aren't actually goats. They are antelopes.",
    "Koalas only drink water in extreme heat or drought.",
    "Bees are born fully grown.",
    "Ferret comes from the Latin word for little thief.",
    "Cats have 2 sets of vocal cords: one for purring and one for meowing.",
    "Some bears build nests in trees to sunbathe and rest.",
    "A group of jellyfish is called a smack.",
    "The indentation between the nose and the upper lip is called the philtrum.",
    "The human jaw can generate a force up to 200 pounds on the molars.",
    "The human brain is about 80% water.",
    "The middle finger has the fastest growing nail.",
    "The brain operates on the same amount of power as a 10-watt light bulb.",
    "Like fingerprints, everyone's tongue print is different.",
    "Your big toe only has 2 bones and the rest have 3.",
    "The average person takes 23,000 breaths a day.",
    "It is illegal to run out of gas in Youngstown, Ohio.",
    "Tennessee was previously named Franklin after Benjamin Franklin.",
    "The official color of California's Golden Gate Bridge is International Orange.",
    "It is not possible to tickle yourself.",
    "Antarctica is the only continent with no owls.",
    "There are 293 ways to make change for a dollar.",
    "Shakespeare invented the word assassination and bump.",
    "French author Michel Thayer published a 233-page novel which has no verbs.",
    "Australia is the only continent without an active volcano.",
    "The dots on a domino are called pips.",
    "111,111,111 x 111,111,111 = 12,345,678,987,654,321.",
    "Tug-of-war was an Olympic sport in the early 1900s.",
    "The name of the city we call Bangkok is 115 letters long in the Thai language.",
    "In Ancient Greece, throwing an apple to a woman was considered a marriage proposal.",
    "Karate originated in India.",
    "The infinity sign is called a lemniscate.",
    "Children grow faster during springtime.",
    "It takes an interaction of 72 muscles to produce human speech.",
    "Sailors once thought wearing gold earrings improved eyesight.",
    "Our eyes are always the same size from birth, but our nose and ears never stop growing.",
    "Your skull is made up of 29 different bones.",
    "Every hour more than one billion cells in the body must be replaced.",
    "Women's hearts typically beat faster than men's hearts.",
    "Adults laugh only about 15 to 100 times a day, while six-year-olds laugh an average of 300 times a day.",
    "Children have more taste buds than adults.",
    "Right-handed people tend to chew food on the right side and lefties chew on the left.",
    "A cucumber consists of 96% water.",
    "Vanilla is used to make chocolate.",
    "One lump of sugar is equivalent to three feet of sugar cane.",
    "A lemon contains more sugar than a strawberry.",
    "Until the nineteenth century, solid blocks of tea were used as money in Siberia.",
    "Wild camels once roamed Arizona's deserts.",
    "New York was the first state to require cars to have license plates.",
    "Miami installed the first ATM for rollerbladers.",
    "Hawaii has its own time zone.",
    "Oregon has more ghost towns than any other US state.",
    "Cleveland, OH is home to the first electric traffic lights.",
    "South Carolina is home to the first tea farm in the U.S.",
    "The term rookies comes from a Civil War term, reckie, which was short for recruit.",
    "Taft was the heaviest U.S. President at 329 lbs; Madison was the smallest at 100 lbs.",
    "Harry Truman was the last U.S. President to not have a college degree.",
    `Abraham Lincoln was the tallest U.S. President at 6'4", while James Madison was the shortest at 5'4".`,
    "Franklin Roosevelt was related to 5 U.S. Presidents by blood and 6 by marriage.",
    "Thomas Jefferson invented the coat hanger.",
    "Theodore Roosevelt had a pet bear while in office.",
    "President Warren G. Harding once lost White House china in a poker game.",
    "Ulysses Simpson Grant was fined $20.00 for speeding on his horse.",
    "President William Taft weighed over 300 lbs and once got stuck in the White House bathtub.",
    "President William McKinley had a pet parrot that he named 'Washington Post.'",
    "Harry S. Truman's middle name is S.",
    "The youngest U.S. president to be in office was Theodore Roosevelt at age 42.",
    "Most Koala bears can sleep up to 22 hours a day.",
    "In 1859, 24 rabbits were released in Australia. Within 6 years, the population grew to 2 million.",
    "Butterflies can taste with their hind feet.",
    "A strand from the web of a golden spider is as strong as a steel wire of the same size.",
    "The bumblebee bat is one of the smallest mammals on Earth. It weighs less than a penny.",
    "The Valley of Square Trees in Panama is the only known place in the world where trees have rectangular trunks.",
    "The original Cinderella was Egyptian and wore fur slippers.",
    "The plastic things on the end of shoelaces are called aglets.",
    "Neckties were first worn in Croatia, which is why they were called cravats.",
    "Barbie's full name is Barbara Millicent Roberts.",
    "The first TV toy commercial aired in 1946 for Mr. Potato Head.",
    "If done perfectly, any Rubik's Cube combination can be solved in 17 turns.",
    "The side of a hammer is called a cheek.",
    "In Athens, Greece, a driver's license can be taken away by law if the driver is deemed either unbathed or poorly dressed.",
    "In Texas, it is illegal to graffiti someone's cow.",
    "Less than 3% of the water on Earth is fresh.",
    "A cubic mile of fog is made up of less than a gallon of water.",
    "The Saturn V moon rocket consumed 15 tons of fuel per second.",
    "A manned rocket can reach the moon in less time than it took a stagecoach to travel the length of England.",
    "At room temperature, the average air molecule travels at the speed of a rifle bullet.",
    "The lollipop was named after one of the most famous Racehorses in the early 1900s, Lolly Pop.",
    "Buzz Aldrin was one of the first men on the moon. His mother's maiden name was also Moon.",
    "Maine is the only state with a one-syllable name.",
    "The highest denomination issued by the U.S. was the 100,000 dollar bill.",
    "The White House was originally called the President's Palace. It became The White House in 1901.",
    "George Washington was the only unanimously elected President.",
    "John Adams was the only President to be defeated by his Vice President, Thomas Jefferson.",
    "New York City has over 800 miles of subway track.",
    "Manatees' eyes close in a circular motion, much like the aperture of a camera.",
    "Even though it is nearly twice as far away from the Sun as Mercury, Venus is by far the hottest planet.",
    "The nothingness of a black hole generates a sound in the key of B flat.",
    "Horses can't vomit.",
    "Babies are born with about 300 separate bones, but adults have 206.",
    "Newborn babies cannot cry tears for at least three weeks.",
    "A day on Venus lasts longer than a year on Venus.",
    "Squirrels lose more than half of the nuts they hide.",
    "The penny was the first U.S. coin to feature the likeness of an actual person.",
    "Forty percent of twins invent their own language.",
    "In South Korea, it is against the rules for a professional baseball player to wear cabbage leaves inside of his hat.",
    "Curly hair follicles are oval, while straight hair follicles are round.",
    "George Washington had false teeth made of gold, ivory, and lead - but never wood.",
    `Napoleon Bonaparte was actually not short. At 5' 7", he was average height for his time.`,
    "The Inca built the largest and wealthiest empire in South America, but had no concept of money.",
    'It is against the law to use "The Star Spangled Banner" as dance music in Massachusetts.',
    "Queen Cleopatra of Egypt was not actually Egyptian.",
    "Early football fields were painted with both horizontal and vertical lines, creating a pattern that resembled a gridiron.",
    "Two national capitals are named after U.S. presidents: Washington, D.C., and Monrovia, the capital of Liberia.",
    "The first spam message was transmitted over telegraph wires in 1864.",
    "A pearl can be dissolved by vinegar.",
    "Queen Isabella I of Spain, who funded Columbus' voyage across the ocean, claimed to have only bathed twice in her life.",
    "The longest attack of hiccups ever lasted 68 years.",
    "A bolt of lightning can reach temperatures hotter than 50,000 degrees Fahrenheit - five times hotter than the sun.",
    "At the deepest point in the ocean, the water pressure is equivalent to having about 50 jumbo jets piled on top of you.",
    "In only 7.6 billion years, the sun will reach its maximum size and will shine 3,000 times brighter.",
    "The state of Alabama once financed the construction of a bridge by holding a rooster auction.",
    "Federal law once allowed the government to quarantine people who came in contact with aliens.",
    "There are 21 'secret' highways that are part of the Interstate Highway System. They are not identified as such by road signs.",
    "The aphid insect is born pregnant.",
    "John Wilkes Booth's brother saved the life of Abraham Lincoln's son.",
    "It is illegal in the United Kingdom to handle salmon in suspicious circumstances.",
    "It is illegal to play annoying games in the street in the United Kingdom.",
    "Tennis was originally played with bare hands.",
    "-40 degrees Fahrenheit is the same temperatures as -40 degrees Celsius.",
    "U.S. President John Tyler had 15 children, the last of which was born when he was 70 years old.",
    "Dolphins are unable to smell.",
    "Charlie Chaplin failed to make the finals of a Charlie Chaplin look-alike contest.",
    "The name of the city of Portland, Oregon was decided by a coin toss. The name that lost was Boston.",
    "The letter J is the only letter in the alphabet that does not appear anywhere on the periodic table of the elements.",
    "'K' was chosen to stand for a strikeout in baseball because 'S' was being used to denote a sacrifice.",
    "A dimpled golf ball produces less drag and flies farther than a smooth golf ball.",
    "When grazing or resting, cows tend to align their bodies with the magnetic north and south poles.",
    "President Chester A. Arthur owned 80 pairs of pants, which he changed several times per day.",
    "Cows do not have upper front teeth.",
    "Between 1979 and 1999, the planet Neptune was farther from the Sun than Pluto. This won't happen again until 2227.",
    "When creating a mummy, Ancient Egyptians removed the brain by inserting a hook through the nostrils.",
    "All of the major candidates in the 1992, 1996, and 2008 U.S. presidential elections were left-handed.",
    "In Switzerland, it is illegal to own only one guinea pig because they are prone to loneliness.",
    "The first American gold rush happened in North Carolina, not California.",
    "To make one pound of honey, a honeybee must tap about two million flowers.",
    "Chicago is named after smelly garlic that once grew in the area.",
    "The Chicago river flows backwards; the flow reversal project was completed in 1900.",
    "The patent for the fire hydrant was destroyed in a fire.",
    "Powerful earthquakes can make the Earth spin faster.",
    "Baby bunnies are called kittens.",
    "A group of flamingos is called a flamboyance.",
    "Sea otters hold each other's paws while sleeping so they don't drift apart.",
    "Gentoo penguins propose to their life mates with a pebble.",
    "Male pups will intentionally let female pups 'win' when they play-fight so they can get to know them better.",
    "A cat's nose is ridged with a unique pattern, just like a human fingerprint.",
    "A group of porcupines is called a prickle.",
    "99% of our solar system's mass is the sun.",
    "More energy from the sun hits Earth every hour than the planet uses in a year.",
    "If two pieces of the same type of metal touch in outer space, they will bond together permanently.",
    "Just a sugar cube of neutron star matter would weigh about one hundred million tons on Earth.",
    "A soup can full of neutron star material would have more mass than the Moon.",
    "Ancient Chinese warriors would show off to their enemies before battle, by juggling.",
    "OMG was added to dictionaries in 2011, but its first known use was in 1917.",
    "In the state of Arizona, it is illegal for donkeys to sleep in bathtubs.",
    "The glue on Israeli postage stamps is certified kosher.",
    "Rats and mice are ticklish, and even laugh when tickled.",
    "Norway once knighted a penguin.",
    "The King of Hearts is the only king without a mustache.",
    "It is illegal to sing off-key in North Carolina.",
    "Forty is the only number whose letters are in alphabetical order.",
    "One is the only number with letters in reverse alphabetical order.",
    "Strawberries are grown in every state in the U.S. and every province in Canada.",
    "The phrase, \u2018You\u2019re a real peach\u2019 originated from the tradition of giving peaches to loved ones.",
    "At latitude 60' south, it is possible to sail clear around the world without touching land.",
    "Interstate 90 is the longest U.S. Interstate Highway with over 3,000 miles from Seattle, WA to Boston, MA.",
    "DFW Airport in Texas is larger than the island of Manhattan.",
    "Benjamin Franklin invented flippers.",
    "Miami installed the first ATM for inline skaters.",
    "Indonesia is made up of more than 17,000 islands.",
    "Giraffes have the same number of vertebrae as humans: 7.",
    "The official taxonomic classification for llamas is Llama glama.",
    "Remove all the space between its atoms and Earth would be the size of a baseball.",
    "The soil on Mars is rust color because it's full of rust.",
    "Sound travels up to 15 times faster through steel than air, at speeds up to 19,000 feet per second.",
    "Humans share 50% of their DNA with bananas.",
    "Maine is the closest U.S. state to Africa.",
    "An octopus has three hearts.",
    "Only 12 U.S. presidents have been elected to office for two terms and served those two terms.",
    "Franklin D. Roosevelt was elected to office for four terms prior to the 22nd Amendment.",
    "John F. Kennedy, at 43, was the youngest elected president, and Ronald Reagan, at 73, the oldest.",
    "James Buchanan is the only bachelor to be elected president.",
    "Eight presidents have died while in office.",
    "Bill Clinton was born William Jefferson Blythe III but took his stepfather's last name when his mother remarried.",
    "Prior to the 12th Amendment in 1804, the presidential candidate who received the second-highest number of electoral votes was vice president.",
    "George Washington was a successful liquor distributor, making rye whiskey, apple brandy, and peach brandy in his Mount Vernon distillery.",
    "Thomas Jefferson and John Adams chipped off a piece of Shakespeare's chair as a souvenir when they visited his home in 1786.",
    "George Washington started losing his permanent teeth in his 20s and had only one natural tooth by the time he was president.",
    "George Washington had false teeth made from many different materials, including an elephant tusk and hippopotamus ivory.",
    "George Washington protected his beloved horses from losing their teeth by making sure they were brushed regularly.",
    "John Quincy Adams regularly skinny-dipped in the Potomac River.",
    "Calvin Coolidge was so shy he was nicknamed 'Silent Cal.'",
    "Calvin Coolidge loved to wear a cowboy hat and ride his mechanical horse.",
    "President Herbert Hoover invented 'Hooverball' (a cross between volleyball and tennis using a medicine ball), which he played with his cabinet members.",
    "Andrew Jackson was involved in as many as 100 duels, many of which were fought to defend the honor of his wife, Rachel.",
    `Martin Van Buren's nickname was "Old Kinderhook" because he was raised in Kinderhook, N.Y.`,
    "James Buchanan bought slaves in Washington, D.C., and quietly freed them in Pennsylvania.",
    'Abraham Lincoln was only defeated once in about 300 wrestling matches, making it to the Wrestling Hall of Fame with honors as "Outstanding American."',
    "In his youth, President Andrew Johnson apprenticed as a tailor.",
    "Ulysses S. Grant smoked at least 20 cigars a day; citizens sent him at least 10,000 boxes in gratitude after winning the Battle of Shiloh.",
    "Not only was James Garfield ambidextrous, he could write Latin with one hand and Greek with the other at the same time.",
    "Benjamin Harrison was the first president to have electricity in the White House; however, he was so scared of getting electrocuted he'd never touch the light switches himself.",
    "William McKinley almost always wore a red carnation on his lapel as a good-luck charm.",
    "Herbert Hoover's son had two pet alligators that were occasionally permitted to run loose throughout the White House.",
    "Jimmy Carter filed a report for a UFO sighting in 1973, calling it 'the darndest thing I've ever seen.'",
    "Bill Clinton's face is so symmetrical that he ranked in facial symmetry alongside male models.",
    "In 1916, Jeannette Rankin of Montana became the first woman elected to Congress.",
    "Gerald Ford was the only president and vice president never to be elected to either office.",
    "Victoria Woodhull, in 1872, was the first woman to run for the U.S. presidency.",
    "James Monroe received every electoral vote but one in the 1820 election.",
    "There are only three requirements to become U.S. president: must be 35, a natural-born U.S. citizen, and have resided in the U.S. for at least 14 years.",
    "To cut groundskeeping costs during World War I, President Woodrow Wilson brought a flock of sheep to trim the White House grounds.",
    "Rutherford B. Hayes was the first president to use a phone, and his phone number was extremely easy to remember ' simply '1.'",
    "Martin Van Buren was the first president born a U.S. citizen; all presidents before him were British.",
    "Andrew Jackson's pet parrot Poll was removed from his funeral for cursing.",
    "There has never been a U.S. president whose name started with the common letter S.",
    "Abraham Lincoln is the only U.S. president who was also a licensed bartender.",
    "Barack Obama is called the 44th president, but is actually the 43rd because Grover Cleveland is counted twice, as he was elected for two terms.",
    "Four times in U.S history has a presidential candidate won the popular vote but lost the election.",
    "President Herbert Hoover and his wife were fluent in Mandarin Chinese and would use it in the White House to speak privately to each other.",
    "November was chosen to be election month because it fell between harvest and brutal winter weather.",
    "Six of the last 12 U.S. presidents have been left-handed, far greater than the national average of lefties (10%).",
    "William Henry Harrison owned a pet goat while in office.",
    "John Adams had a horse named Cleopatra.",
    "James Madison had a pet parrot who outlived him and his wife.",
    "John Quincy Adams' wife raised silkworms.",
    "Martin Van Buren was given two tiger cubs while he was president.",
    "William Harrison had a billy goat at the White House.",
    `Franklin Pierce was gifted two small "sleeve dogs" ' he kept one and gave the other to Jefferson Davis.`,
    "Abraham Lincoln's son had a pet turkey, which he gave a pardon so it wasn't killed and eaten.",
    "James Garfield had a dog appropriately named Veto.",
    "William Taft liked milk so much that he had cows graze on the White House lawn, Pauline being the last in history to graze there.",
    "Calvin Coolidge had a bulldog named Boston Beans, a terrier named Peter Pan, and a pet raccoon.",
    "John Kennedy had a pony named Macaroni.",
    "Lyndon Johnson had two beagles, named Him and Her, for which he was criticized for picking up by their ears.",
    "Jimmy Carter had a dog named Grits, a gift given to his daughter Amy.",
    "Bill Clinton had a cat named Socks, which was the first presidential pet to have its own website.",
    "Woodrow Wilson passed the Georgia Bar Exam despite not finishing law school; he also has a PhD.",
    `President Zachary Taylor's nickname was "Old Rough and Ready" because of his famed war career.`,
    "Andrew Jackson was once given a 1,400-pound cheese wheel as a gift, which he served at his outgoing President's Reception.",
    "Blueberry jelly beans were created for Ronald Reagan's presidential inauguration in 1981.",
    "Dwight D. Eisenhower was the first Texas-born president.",
    "Lyndon Johnson's family all had the initials LBJ.",
    "Thomas Jefferson was convinced that if he soaked his feet in a bucket of cold water every day, he'd never get sick.",
    "Gerald Ford worked as a fashion model during college and actually appeared on the cover of Cosmopolitan.",
    "Dwight Eisenhower was the only president to serve in both World War I and World War II.",
    "Jimmy Carter was the first president to be born in a hospital.",
    "Calvin Coolidge liked to have his head rubbed with petroleum jelly while eating breakfast in bed, believing it was good for his health.",
    "A portion of Grover Cleveland's jaw was artificial, composed of vulcanized rubber.",
    "Russia and the United States are less than three miles apart.",
    "John Adams and Thomas Jefferson died within hours of each other on the Fourth of July in 1826.",
    `Abraham Lincoln's dog Fido was the first "First Dog" to be photographed.`,
    "President Calvin Coolidge owned two lion cubs: Tax Reduction and Budget Bureau.",
    "President Rutherford B. Hayes' cat Siam was the first Siamese cat in the U.S.",
    "President John Quincy Adams' pet alligator lived in a White House bathroom.",
    'First Lady Abigail Adams famously wrote, "If you love me...you must love my dog."',
    "John Adams' pets Satan and Juno were the first dogs to live in the White House.",
    "Calvin Coolidge walked pet raccoon Rebecca on a leash around the White House.",
    "More presidents have had pet birds than cats.",
    "Thomas Jefferson's pet mockingbird was trained to eat out of his mouth.",
    "Spotty Bush, an English Springer Spaniel, has been the only presidential pet to live at the White House during two different administrations.",
    "Andrew Jackson was the first president to ride on a railroad train.",
    "Pat Nixon was the first First Lady to wear pants in public.",
    "First Lady Martha Washington was the first American woman to be honored on a U.S. postage stamp.",
    "When snakes are born with two heads, they fight each other for food.",
    "Venus is the only planet to rotate clockwise.",
    "Tennessee ties with Missouri as the most neighborly state, bordered by 8 states.",
    "The cotton candy machine was invented in 1897, by a dentist.",
    "You can't hum while plugging your nose.",
    "Elephants are afraid of bees.",
    "They used to offer goat carriage rides in Central Park.",
    "Chimps can develop their own fashion trends.",
    "Monday is the only day of the week with an anagram: dynamo.",
    "The only Michelangelo painting in the Western Hemisphere is on display in Fort Worth, TX.",
    "Humans are 1-2 centimeters taller in the morning than at night.",
    "Baby giraffes fall up to 6 feet to the ground when they are born.",
    "It takes around 200 muscles to take a step.",
    "The flamingo can only eat when its head is upside down.",
    "A bald eagle nest can weigh up to two tons.",
    "Worrying squirrels is not tolerated in Missouri.",
    "Wombat droppings are cube-shaped.",
    "Adult humans are the only mammal that can't breathe and swallow at the same time.",
    "Hens do not need a rooster to lay an egg.",
    'There are more nerve connections or "synapses" in your brain than there are stars in our galaxy.',
    'There are more English words beginning with the letter "S" than any other letter.',
    "There are more fake than real flamingos.",
    "The word 'bride' comes from an old Proto-Germanic word meaning 'to cook.'",
    "The word utopia ' an ideal place ' ironically comes from a Greek word meaning 'no place.'",
    "Los Angeles was originally founded as El Pueblo de la Reina de Los Angeles.",
    "The woolly mammoth still roamed the earth while the pyramids were being built.",
    "Nine-banded armadillos almost always give birth to four identical quadruplets.",
    "Jellyfish don't have brains.",
    "Jellyfish can clone themselves.",
    "The koala is the longest-sleeping animal, sleeping an average of 22 hours per day.",
    "Walruses are true party animals; they can go without sleep for 84 hours.",
    "The city of Chicago was raised by over a foot during the 1850s and '60s without disrupting daily life.",
    "Red kangaroos can hop up to 44 mph.",
    "Arkansas has the only active diamond mine in the United States.",
    'Robert Heft, who designed the current U.S. flag in a high school project, received a B- because it "lacked originality."',
    "The first 18-hole golf course in America was built on a sheep farm in 1892.",
    "Most newborns will lose all the hair they are born with in the first six months of life.",
    "Ripening bananas glow an intense blue under black light.",
    "Coconut water was used as an IV drip in WWII when saline solution was in short supply.",
    "Mercury and Venus are the only planets in our solar system with no moon.",
    "Peanuts are not actually nuts but legumes.",
    "The Oscar statuette is brittanium plated with 24K gold.",
    "The only thing that can scratch a diamond is a diamond.",
    "There is a star that is a diamond of ten billion trillion trillion carats.",
    "One ounce of gold can be stretched into a thin wire measuring 50 miles.",
    "A $100,000 bill exists, but was only used by Federal Reserve Banks.",
    "10 million bricks were used to build the Empire State Building.",
    "One quarter of all the body's bones are in the feet.",
    "Lake Havasu City, AZ, has been recorded as the hottest city in the U.S. with average summer temperatures of 94.6.",
    "Early sunscreens included ingredients like rice bran oil, iron, clay, and tar.",
    "One of the first sunscreens was sold in the 1910s under the name Zeozon.",
    "In the U.S., there is an official rock, paper, scissors league.",
    "The largest bill ever issued by the U.S. was a $100,000 bill in 1934.",
    "Kickball is referred to as 'soccer-baseball' in some parts of Canada.",
    "Less than 1% of Sweden's household waste ends up in a dump.",
    "Duck Duck Goose is called Duck Duck Grey Duck in Minnesota.",
    "There are more tigers owned by Americans than in the wild worldwide.",
    "Hawaiian pizza was actually created in Canada.",
    "A city in Greece struggles to build subway systems because they keep digging up ancient ruins.",
    "Elvis was a natural blonde.",
    "On Venus, it snows metal.",
    "Eating 600 bananas is the equivalent of one chest X-ray in terms of radiation.",
    "The potato became the first vegetable to be grown in space.",
    "The average dog can understand over 150 words.",
    "At one time, serving ice cream on cherry pie in Kansas was prohibited.",
    "Blueberries are one of the only natural foods that are truly blue in color.",
    "Blueberries are also called 'star berries.'",
    "There are more varieties of blueberries than states in the U.S.",
    "Typically, blueberries become ripe after 2-5 weeks on a bush.",
    "Love blueberries. Celebrate them all year round, but especially in July, National Blueberry Month.",
    "While blueberries grow in clusters on their bush, the individual blueberries ripen at different times.",
    "The first commercial batch of blueberries came from Whitesbog, New Jersey, in 1916.",
    "The perfect blueberry should be 'dusty' in color.",
    "Maine produces more wild blueberries than anywhere else in the world.",
    "75% of the U.S.'s tart cherries come from Michigan.",
    "Traverse, MI, considers itself the Cherry Capital of the World.",
    "Once cherries have been picked, they don't ripen.",
    "Make sure to eat a chocolate-covered cherry on January 3; it's National Chocolate-Covered Cherry Day.",
    "On average, how many cherries are in a pound? 44.",
    "The word 'cherry' comes from the Turkish town of Cerasus.",
    "A cherry pie is made of about 250 cherries.",
    "Eau Claire, Michigan, is known as 'The Cherry Pit Spitting Capital of the World.'",
    "The National Anthem of Greece has 158 verses.",
    "North Korea and Finland are technically separated by only one country.",
    "Australia's first police force was made up of the most well-behaved convicts.",
    "Emergency phone number in Europe is 112.",
    "Canada's postal code for Santa Claus at the North Pole is H0H 0H0.",
    "Russia has a larger surface area than Pluto.",
    'In New Zealand, it is illegal to name your twin babies "Fish" and "Chips."',
    "Chocolate bars and blue denim both originated in Guatemala.",
    "In New Zealand, parents have to run baby names by the government for approval.",
    "When a child loses their tooth in Greece, they throw it on the roof as a good luck wish that their adult teeth will be strong.",
    "Australia is the only nation to govern an entire continent and its outlying islands.",
    "No one in Greece can choose not to vote; voting is required by law for every citizen who is 18 or older.",
    "Australia has 10,685 beaches; you could visit a new beach every day for more than 29 years.",
    "China is large enough to cover about five separate time zones, but only has one national time zone since the Chinese Civil War in 1949.",
    "There is a language in Botswana that consists of mainly five types of clicks.",
    "An African elephant can turn the pages of a book with its trunk.",
    "Ancient Egyptians slept on head rests made of wood, ivory, or stone.",
    "A traffic jam once lasted for 11 days in Beijing, China.",
    "Alaska is the only state that can be typed on one row of keys.",
    "The blue in the Sistine Chapel is made of ground lapis lazuli gems and oils.",
    '"The Bridge of Eggs" built in Lima, Peru, was made of mortar that was mixed with egg whites.',
    "In South Korea, you are one year old at birth.",
    "The Great Wall of China is 13,170.7 miles long, over five times the distance from LA to NYC.",
    "The horizontal line between two numbers in a fraction is called a vinculum.",
    "The metal ring on the end of a pencil is called a ferrule.",
    "You cannot taste food until mixed with saliva.",
    "There is an uninhabited island in the Bahamas known as Pig Beach, which is populated entirely by swimming pigs.",
    "Lake Hillier, in Western Australia, is colored a bright pink.",
    "Spiked dog collars were invented by the Ancient Greeks, who used them on their sheepdogs to protect their necks from wolves.",
    '"Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo." is a grammatically correct sentence.',
    "On Jupiter and Saturn, it rains diamonds.",
    "Nowhere in the Humpty Dumpty nursery rhyme does it say that Humpty Dumpty is an egg.",
    "Located on the Detroit River, the J.W. Wescott II is the only floating post office in the U.S. and has its own ZIP Code: 48222.",
    "Antarctica is the largest desert in the world.",
    "Tomatoes have more genes than humans.",
    "In Texas, it is legal to kill Bigfoot if you ever find it.",
    "Elephants can smell water up to 3 miles away.",
    "A snail can grow back a new eye if it loses one.",
    "You can tell a turtle's gender by the noise it makes. Males grunt and females hiss.",
    "French poodles actually originated in Germany.",
    "Marine mammals swim by moving their tails up and down, while fish swim by moving their tails left and right.",
    "'Knocker uppers' were professionals paid to shoot peas at windows. They were replaced by alarm clocks.",
    "An average cumulus cloud weighs more than 70 adult T. rexes.",
    "Clicking your computer mouse 1,400 times burns one calorie.",
    '"Guy" was once an insult for anyone dressed in poor clothes, originating from the burning of effigies of the infamous British rebel, Guy Fawkes.',
    "The national animal of Scotland is the unicorn.",
    "The tea bag was created by accident in 1908 by Thomas Sullivan of New York.",
    "The male ostrich can roar just like a lion.",
    "A group of frogs is called an army.",
    "Corn always has an even number of rows on each ear.",
    "You are always looking at your nose; your brain just chooses to ignore it.",
    "There is a single mega-colony of ants that spans three continents, covering much of Europe, the west coast of the U.S., and the west coast of Japan.",
    "The world's largest mountain range is under the sea.",
    "The Anglo-Zanzibar war of 1896 is the shortest war on record, lasting an exhausting 38 minutes.",
    "Below the Kalahari Desert lies the world's largest underground lake.",
    "Oregon and Mexico once shared a border.",
    "Bluetooth technology was named after a 10th century Scandinavian king.",
    "A nun held one of the first PhDs in computer science.",
    "For 67 years, Nintendo only produced playing cards.",
    "The ancient Chinese carried Pekingese puppies in the sleeves of their robes.",
    "A tarantula can survive for more than two years without food.",
    "Ethiopia follows a calendar that is seven years behind the rest of the world.",
    "In Denmark, citizens have to select baby names from a list of 7,000 government-approved names.",
    "Every tweet Americans send is archived by the Library of Congress.",
    "A neutron star is as dense as stuffing 50 million elephants into a thimble.",
    "More energy from the sun hits Earth every hour than the planet uses in a year.",
    "An earthquake in 1812 caused the Mississippi River to flow backward.",
    "In 2014, the Department of Veterans Affairs was still paying a Civil War pension.",
    "In Webster's Dictionary, the longest words without repeating letters are 'uncopyrightable' and 'dermatoglyphics.'",
    "'Unprosperousness' is the longest word in which no letter occurs only once.",
    "'Typewriter' and 'perpetuity' are the longest words that can be typed on a single line of a QWERTY keyboard.",
    "There have been three Olympic games held in countries that no longer exist.",
    "Golf is the only sport to be played on the moon.",
    'The word "checkmate" comes from the Persian phrase meaning "the king is dead."',
    "The brain is the only organ in the human body without pain receptors.",
    "There is a volcano on Mars the size of Arizona.",
    "The blue whale can produce the loudest sound of any animal. At 188 decibels, the noise can be detected over 800 kilometers away.",
    "Dogs' sense of hearing is more than ten times more acute than a human's.",
    "A housefly hums in the key of F.",
    "Venus is the only planet in the solar system where the sun rises in the west.",
    "The state animal of Tennessee is a raccoon.",
    "If you were to stretch out a Slinky until it's flat, it would measure 87 feet long.",
    "It's illegal in many countries to perform surgery on an octopus without anesthesia because of its intelligence.",
    "There are more trees on Earth than stars in the galaxy.",
    "Human thigh bones are stronger than concrete.",
    "Fires spread faster uphill than downhill.",
    "The Florida Everglades is the only place in the world where both alligators and crocodiles live together.",
    "Newborns can't cry actual tears. This normally occurs between 3 weeks and 3 months of life.",
    "If you could drive your car upward, you would be in space in less than an hour.",
    "The sun is actually white, but the Earth's atmosphere makes it appear yellow.",
    "The Earth rotates at a speed of 1,040 MPH.",
    "Even when a snake has its eyes closed, it can still see through its eyelids.",
    'The word "aegilops" is the longest word in the English language to have all of its letters in alphabetical order.',
    "Gorillas burp when they are happy.",
    "Because of metal prices, since 2006 the U.S. Mint has had to spend more to make a penny than they are worth.",
    '"Never odd or even" spelled backward is still "Never odd or even."',
    "In Alabama, it's illegal to carry an ice cream cone in your back pocket at any time.",
    "Alaska is the most northern, western, and eastern U.S. state.",
    "In France, it's illegal for employers to send emails after work hours.",
    "A group of raccoons is called a gaze.",
    "Pteronophobia is the fear of being tickled by feathers.",
    "Cherophobia is the fear of happiness.",
    "The vertical distance between the Earth's highest and lowest points is about 12 miles.",
    "A flock of crows is known as a murder.",
    'Dr. Seuss wrote "Green Eggs and Ham" to win a bet with his publisher who thought he could not complete a book with only 50 words.',
    "Over 80% of the land in Nevada is owned by the U.S. government.",
    "There are more people on Facebook today than there were on the Earth 200 years ago.",
    "Mangoes have noses.",
    "Mangoes can get sunburned.",
    "Before 1859, baseball umpires sat behind home plate in rocking chairs.",
    "The shortest professional baseball player was 3 feet, 7 inches tall.",
    "The average life span of an MLB baseball is five to seven pitches.",
    "The most valuable baseball card ever is worth about $2.8 million.",
    "The paisley pattern is based on the mango.",
    "In India, mango leaves are used to celebrate the birth of a boy.",
    "A flipped coin is more likely to land on the side it started on.",
    "When sprinting, professional cyclists produce enough power to power a home.",
    "Mosquitoes prefer to bite people with Type O blood.",
    "During a typical MLB season, approximately 160,000 baseballs are used.",
    "The Bible is the world's most shoplifted book.",
    "The British pound is the world's oldest currency still in use.",
    "The Great Lakes have more than 30,000 islands.",
    "Mountain lions can whistle.",
    "While rabbits have near-perfect 360-degree panoramic vision, their most critical blind spot is directly in front of their nose.",
    "When a koala is born, it is about the size of a jelly bean.",
    "Toe wrestling is a competitive sport.",
    "There have been 85 recorded instances of a pitcher striking out four batters in one inning.",
    "3.7 million bags of ballpark peanuts are eaten every year at ballparks.",
    'Shakespeare created the name Jessica for his play "The Merchant of Venice."',
    "Tooth enamel is the hardest substance in the human body.",
    "The mummy of Pharaoh Ramesses II has a passport.",
    "It is physically impossible for a pig to look at the sky.",
    "There are more stars in the universe than grains of sand on earth.",
    "A caterpillar has more muscles than a human.",
    "A shrimp's heart is in its head.",
    "A human being could swim through the blood vessels of a blue whale.",
    "Light could travel around the earth nearly 7.5 times in one second.",
    "A single lightning bolt contains enough energy to cook 100,000 pieces of toast.",
    "About one in every 2,000 babies is born with teeth.",
    "Water can boil and freeze at the same time.",
    "Less than 5% of the population needs just 4-5 hours of sleep.",
    "Peanut butter can be converted into diamonds.",
    "Astronauts can't burp in space.",
    "An Immaculate Inning is when a pitcher strikes out three batters with only nine pitches.",
    "Earth is the only planet not named after a Greek or Roman god.",
    "Yawns are contagious to dogs as well as humans.",
    "In the 1960s, the U.S. government tried to turn a cat into a spy.",
    "Movie trailers used to come on at the end of movies, but no one stuck around to watch them.",
    "MLB umpires often wear black underwear, in case they split their pants.",
    "It is possible to record four outs in one-half inning of baseball.",
    "There are nine different ways to reach first base.",
    "During World War II, the U.S. military designed a grenade to be the size and weight of a baseball, since 'any young American man should be able to properly throw it.'",
    "Philadelphia zookeeper Jim Murray sent baseball scores to telegraph offices by carrier pigeon every half inning in 1883.",
    "From 1845 through 1867, home base was circular, made of iron, painted or enameled white, and 12 inches in diameter.",
    "President Bill Clinton's first presidential pitch (on April 4, 1993) was the first ever from the pitcher's mound to the catcher's mitt.",
    "Thunder is actually the sound caused by lightning.",
    "Australia is wider than the moon.",
    "85% of people only breathe out of one nostril at a time.",
    "An albatross can sleep while it flies.",
    "In a room of 23 people, there is a 50% chance that two people have the same birthday.",
    "Bubble wrap was originally invented as a wallpaper in 1957.",
    "There is a species of jellyfish that is immortal.",
    "Of the 193 members of the United Nations, Britain has invaded 171 of them.",
    "The Apollo 11 guidance computer was no more powerful than today's pocket calculator.",
    "'Sphenopalatine ganglioneuralgia' is the technical name for brain freeze.",
    "Earth is actually located inside the sun's atmosphere.",
    "The spiral shapes of sunflowers follow the Fibonacci sequence.",
    "If you drilled a hole through the earth, it would take 42 minutes to fall through it.",
    "The planet 55 Cancri e is made of diamonds and would be worth $26.9 nonillion.",
    "France used the guillotine as recently as 1977.",
    "Sloths move so slow that algae can grow on them.",
    "Zero is the only number that cannot be represented by Roman numerals.",
    "Michelangelo hated painting and wrote a poem about it.",
    "The dwarf lantern shark grows to be no bigger than a human hand.",
    '"Tools of ignorance" is a nickname for the equipment worn by catchers.',
    "More than 100 baseballs are used during a typical MLB game.",
    "Pitchers were prohibited from delivering the ball overhand for much of the 19th century.",
    "Walks were scored as hits during the 1887 season.",
    "A regulation baseball has 108 stitches.",
    'A "can of corn" is a routine fly ball hit to an outfielder.',
    "Baseball is played in more than 100 countries.",
    "'Take Me Out to the Ballgame' was written in 1908 by Jack Norworth and Albert Von Tilzer, both of whom had never been to a baseball game.",
    "A baseball pitcher's curveball can break up to 17 inches.",
    "MLB baseballs are rubbed in Lena Blackburne Baseball Rubbing Mud, a unique mud found only near Palmyra, New Jersey.",
    "The Metropolitan Museum of Art has over 30,000 baseball cards as part of the Jefferson R. Burdick collection.",
    "William Howard Taft, the 27th president of the U.S., began the tradition of throwing out the ceremonial first pitch in 1910.",
    "MLB National League (1876) is the oldest professional sports league that is still in existence.",
    "The first modern-day World Series game was played in 1903.",
    "The Mendoza Line is a .200 batting average.",
    "There are 13 different pitches a pitcher can throw in baseball.",
    "The first MLB All-Star Game was played in 1933.",
    "A player was once ejected from an MLB game for sleeping during the game.",
    "Baseball hits that bounced over the fence were considered home runs until the 1930s.",
    "The most home runs ever recorded in an MLB season is 73.",
    "The highest batting average ever recorded in an MLB season is .440.",
    "MLB has not had a lefty play catcher since 1989.",
    "The longest MLB game went 26 innings."
  ];
  function genFact() {
    return facts[Math.floor(Math.random() * facts.length)];
  }
  return __toCommonJS(scriptFolder_exports);
})();
/*! Bundled license information:

howler/dist/howler.js:
  (*!
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
  (*!
   *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
   *  
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
*/
window.mainScript = mainScript;
