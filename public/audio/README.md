# Folder Audio / Musik (Audio & Music)

Simpan file audio, lagu, atau efek suara website Anda di dalam folder ini:
- Format rekomendasi: `.mp3`, `.wav`, `.ogg`, `.m4a`.
- Contoh: `song.mp3`, `background-music.mp3`, `audio01.mp3`, dll.

### Cara Memanggil Audio di Next.js:
```tsx
const audio = new Audio("/audio/song.mp3");
audio.play();
```
Atau menggunakan tag `<audio>`:
```tsx
<audio src="/audio/song.mp3" loop />
```
