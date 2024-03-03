import { Howl } from "howler";

function addMaxVolume(howl: Howl, maxVolume: number) {
    howl["maxVolume"] = maxVolume;
    return howl;
}

const silence: Array<Howl> = [];

const introMusic: Array<Howl> = [
    new Howl({
        src: ["/static/assets/roaming_two.ogg"],
        loop: true,
        rate: 1,

        autoplay: true,
        volume: 0,
    }),
];

const waterMusic: Array<Howl> = [
    new Howl({
        src: ["/static/assets/river1.ogg"],
        loop: true,
        rate: 1,

        autoplay: true,
        volume: 0,
    }),
];

const swimmingMusic: Array<Howl> = [
    new Howl({
        src: ["/static/assets/swimming.ogg"],
        loop: true,
        rate: 1,

        autoplay: true,
        volume: 0,
    }),
];

/*
const dormMusic: Array<Howl> = [
    addMaxVolume(new Howl({
        src: ["assets/music_real/out_of_bounds.ogg"],
        loop: true,

        autoplay: true,
        volume: 0,
        html5: true,
        preload: "metadata"
    }), 0.9),
    addMaxVolume(new Howl({
        src: ["assets/music_real/room_tone.ogg"],
        loop: true,

        autoplay: true,
        volume: 0,
        html5: true,
        preload: "metadata"
    }), 0.2),
    addMaxVolume(new Howl({
        src: ["assets/music_real/buzzing_light.ogg"],
        loop: true,

        autoplay: true,
        volume: 0,
        html5: true,
        preload: "metadata"
    }), 0.1)
]; */

type MusicManager = {
    activeSoundtrack: number;
    soundtracks: Array<Array<Howl>>;
    playSoundtrack: Function;
};

const musicManager: MusicManager = {
    activeSoundtrack: -1,
    soundtracks: [silence, introMusic, waterMusic, swimmingMusic],

    playSoundtrack: function (whichSoundtrack: number) {
        if (whichSoundtrack === this.activeSoundtrack) {
            return;
        }

        if (this.activeSoundtrack !== -1) {
            this.soundtracks[this.activeSoundtrack].forEach((howl) => {
                howl.fade(howl.volume(), 0, 5);
            });
        }

        this.soundtracks[whichSoundtrack].forEach((howl) => {
            let maxVolume = howl["maxVolume"];
            if (maxVolume === undefined) {
                maxVolume = 1.0;
            }

            if (howl.state() === "unloaded") {
                howl.load();

                howl.onplay = () => {
                    // otherwise volume change not applied
                    // see https://github.com/goldfire/howler.js/issues/1603 ?
                    howl.fade(0, maxVolume, 5);
                };
            } else {
                setTimeout(() => {
                    howl.fade(0, maxVolume, 5);
                });
            }
        });

        /*
        setTimeout(() => {
            this.soundtracks[whichSoundtrack].forEach(howl => {
                let maxVolume = howl["maxVolume"];
                if (maxVolume === undefined) {
                    maxVolume = 1.0;
                }

                if (howl.state() === "unloaded") {
                    howl.load();

                    howl.onplay = () => {
                        setTimeout(() => {
                            // otherwise volume change not applied
                            // see https://github.com/goldfire/howler.js/issues/1603 ?
                            howl.fade(0, maxVolume, 7000);
                        }, 100);
                    }

                }
                else {
                    setTimeout(() => {
                        // otherwise volume change not applied
                        // see https://github.com/goldfire/howler.js/issues/1603 ?
                        howl.fade(0, maxVolume, 7000);
                    }, 100);
                }
            })
        }, 1000); */

        this.activeSoundtrack = whichSoundtrack;
    },
};

export { musicManager };
