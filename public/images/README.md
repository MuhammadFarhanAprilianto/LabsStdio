# Folder Gambar (Images)

Simpan semua file foto dan gambar website Anda di dalam folder ini:
- Contoh: `hero-bg.jpg`, `showcase.png`, `project-1.webp`, dll.

### Cara Memanggil Gambar di Next.js:
```tsx
import Image from "next/image";

// Contoh 1 (Menggunakan next/image):
<Image src="/images/nama-foto.jpg" alt="Deskripsi" width={1200} height={800} />

// Contoh 2 (Menggunakan tag img standar / background):
<img src="/images/nama-foto.jpg" alt="Deskripsi" />
```
