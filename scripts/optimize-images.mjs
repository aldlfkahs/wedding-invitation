import { readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, basename } from 'node:path';
import sharp from 'sharp';

const SRC_DIR = 'public/images-src';
const OUT_DIR = 'public/images';

const VARIANTS = [
    { suffix: '-sm', width: 800, quality: 72 },
    { suffix: '-md', width: 1200, quality: 76 },
    { suffix: '',    width: 1600, quality: 78 },
];

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function main() {
    if (!existsSync(SRC_DIR)) {
        console.error(`Source directory not found: ${SRC_DIR}`);
        console.error('원본 이미지를 public/images-src/ 에 두고 다시 실행해주세요.');
        process.exit(1);
    }
    await mkdir(OUT_DIR, { recursive: true });

    const entries = await readdir(SRC_DIR);
    const images = entries.filter((f) => SUPPORTED.has(extname(f).toLowerCase()));
    if (images.length === 0) {
        console.error(`No images found in ${SRC_DIR}`);
        process.exit(1);
    }

    const galleryFiles = [];
    let totalIn = 0;
    let totalOut = 0;

    for (const file of images) {
        const stem = basename(file, extname(file));
        const inputPath = join(SRC_DIR, file);
        const inSize = (await stat(inputPath)).size;
        totalIn += inSize;

        const isMain = /^main$/i.test(stem);

        if (isMain) {
            const outPath = join(OUT_DIR, 'main.webp');
            await sharp(inputPath)
                .rotate()
                .resize({ width: 1600, withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(outPath);
            const outSize = (await stat(outPath)).size;
            totalOut += outSize;
            console.log(`  main.webp  ${(inSize/1024/1024).toFixed(2)}MB → ${(outSize/1024).toFixed(0)}KB`);
            continue;
        }

        for (const v of VARIANTS) {
            const outName = `${stem}${v.suffix}.webp`;
            const outPath = join(OUT_DIR, outName);
            await sharp(inputPath)
                .rotate()
                .resize({ width: v.width, withoutEnlargement: true })
                .webp({ quality: v.quality })
                .toFile(outPath);
            const outSize = (await stat(outPath)).size;
            totalOut += outSize;
            console.log(`  ${outName.padEnd(14)} ${(inSize/1024/1024).toFixed(2)}MB → ${(outSize/1024).toFixed(0)}KB`);
        }
        galleryFiles.push(`${stem}.webp`);
    }

    galleryFiles.sort((a, b) => {
        const na = parseInt(a, 10);
        const nb = parseInt(b, 10);
        if (Number.isNaN(na) || Number.isNaN(nb)) return a.localeCompare(b);
        return na - nb;
    });

    await writeFile(
        join(OUT_DIR, 'manifest.json'),
        JSON.stringify(galleryFiles, null, 2) + '\n',
        'utf8'
    );

    console.log('\n총 용량');
    console.log(`  입력: ${(totalIn/1024/1024).toFixed(1)}MB`);
    console.log(`  출력: ${(totalOut/1024/1024).toFixed(1)}MB (${((totalOut/totalIn)*100).toFixed(1)}%)`);
    console.log(`\nmanifest.json 갱신: ${galleryFiles.length}개 항목`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
