import { Howl } from "howler";

function addMaxVolume(howl: Howl, maxVolume: number) {
    howl["maxVolume"] = maxVolume;
    return howl;
}

const introMusic: Array<Howl> = [
    new Howl({
        src: ["/static/assets/roaming_two.ogg"],
        loop: true,
        rate: 1,

        html5: true,
        preload: "metadata",
    }),
];

const waterMusic: Array<Howl> = [
    addMaxVolume(new Howl({
        src: ["/static/assets/river1.ogg"],
        loop: true,
        rate: 1,

        html5: true,
        preload: "metadata",
    }), 1.5),
];

const swimmingMusic: Array<Howl> = [
    new Howl({
        src: ["/static/assets/swimming.ogg"],
        loop: true,
        rate: 1,

        html5: true,
        preload: "metadata",
    }),
];

type MusicManager = {
    activeSoundtracks: Array<number>;
    soundtracks: Array<Array<Howl>>;
    playSoundtrack: Function;
    pauseSoundtrack: Function;
    toggleSoundtrack: Function;
};

const musicManager: MusicManager = {
    activeSoundtracks: [],
    soundtracks: [introMusic, waterMusic, swimmingMusic],

    playSoundtrack: function (whichSoundtrack: number) {
        this.soundtracks[whichSoundtrack].forEach((howl) => {
            let maxVolume = howl["maxVolume"];
            if (maxVolume === undefined) {
                maxVolume = 1.0;
            }

            if (howl.state() === "unloaded") {
                howl.load();
            }
            howl.play();
        });

        this.activeSoundtracks.push(whichSoundtrack);
    },

    pauseSoundtrack: function (whichSoundtrack: number) {
        this.soundtracks[whichSoundtrack].forEach((howl) => {
            howl.pause();
        });
        this.activeSoundtracks.splice(this.activeSoundtracks.indexOf(whichSoundtrack), 1); 
    },

    toggleSoundtrack: function (whichSoundtrack: number) {
        if (!this.activeSoundtracks.includes(whichSoundtrack)) {
            this.playSoundtrack(whichSoundtrack);
        } else {
            this.pauseSoundtrack(whichSoundtrack);
        }
    },
};

export { musicManager };
