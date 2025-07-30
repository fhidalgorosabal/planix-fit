import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SoundApi {
  private audio = new Audio();

  play(src: string, time: number) {
    this.audio.src = src;
    this.audio.load();
    this.audio
      .play()
      .catch((e) => console.error('Error al reproducir sonido', e));
    setTimeout(() => {
      this.stop();
    }, time * 1000);
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
