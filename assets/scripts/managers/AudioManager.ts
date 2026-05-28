
import { _decorator, AudioSource, resources, AudioClip } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager {
  private static _instance: AudioManager | null = null;

  public static get instance(): AudioManager {
    if (!AudioManager._instance) {
      AudioManager._instance = new AudioManager();
    }
    return AudioManager._instance;
  }

  public musicEnabled: boolean = true;
  public soundEnabled: boolean = true;

  private _musicSource: AudioSource | null = null;
  private _soundSources: AudioSource[] = [];
  private _audioClips: Map&lt;string, AudioClip&gt; = new Map();

  private constructor() {}

  init(musicSource: AudioSource, soundSources: AudioSource[]): void {
    this._musicSource = musicSource;
    this._soundSources = soundSources;
    
    const savedMusicEnabled = localStorage.getItem('musicEnabled');
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    
    if (savedMusicEnabled !== null) {
      this.musicEnabled = savedMusicEnabled === 'true';
    }
    if (savedSoundEnabled !== null) {
      this.soundEnabled = savedSoundEnabled === 'true';
    }
  }

  playMusic(name: string): void {
    if (!this.musicEnabled || !this._musicSource) return;
    
    if (this._audioClips.has(name)) {
      this._musicSource.clip = this._audioClips.get(name)!;
      this._musicSource.loop = true;
      this._musicSource.play();
    } else {
      resources.load(`audio/music/${name}`, AudioClip, (err, clip) =&gt; {
        if (!err &amp;&amp; clip) {
          this._audioClips.set(name, clip);
          this._musicSource!.clip = clip;
          this._musicSource!.loop = true;
          this._musicSource!.play();
        }
      });
    }
  }

  stopMusic(): void {
    if (this._musicSource) {
      this._musicSource.stop();
    }
  }

  playSound(name: string): void {
    if (!this.soundEnabled) return;
    
    const source = this._soundSources.find(s =&gt; !s.playing);
    if (!source) return;
    
    if (this._audioClips.has(name)) {
      source.clip = this._audioClips.get(name)!;
      source.play();
    } else {
      resources.load(`audio/sounds/${name}`, AudioClip, (err, clip) =&gt; {
        if (!err &amp;&amp; clip) {
          this._audioClips.set(name, clip);
          source.clip = clip;
          source.play();
        }
      });
    }
  }

  toggleMusic(): void {
    this.musicEnabled = !this.musicEnabled;
    localStorage.setItem('musicEnabled', this.musicEnabled.toString());
    
    if (!this.musicEnabled) {
      this.stopMusic();
    }
  }

  toggleSound(): void {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('soundEnabled', this.soundEnabled.toString());
  }
}
