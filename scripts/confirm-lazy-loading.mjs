import fs from "node:fs/promises";

const files = [
    "index.html",
    "barber.html",
    "tattoo.html"
];

let totalGalleryImages = 0;
let updatedImages = 0;
let missingLazy = 0;

for (const file of files) {
    let html = await fs.readFile(file, "utf8");

    const imagePattern = /<img\b[\s\S]*?>/gi;
    const matches = [...html.matchAll(imagePattern)];

    for (let index = matches.length - 1; index >= 0; index -= 1) {
        const match = matches[index];
        const originalTag = match[0];

        const src =
            originalTag.match(
                /\bsrc\s*=\s*["']([^"']+)["']/i
            )?.[1] ?? "";

        const isGalleryImage =
            src.includes("assets/images/barber/")
            || src.includes("assets/images/tattoo/");

        if (!isGalleryImage) {
            continue;
        }

        totalGalleryImages += 1;

        if (!/\bloading\s*=\s*["']lazy["']/i.test(originalTag)) {
            console.log(
                `Sem lazy loading: ${file} → ${src}`
            );

            missingLazy += 1;
            continue;
        }

        if (/\bdecoding\s*=/i.test(originalTag)) {
            continue;
        }

        const updatedTag = originalTag.replace(
            /\bloading\s*=\s*["']lazy["']/i,
            'loading="lazy"\n                            decoding="async"'
        );

        html =
            html.slice(0, match.index)
            + updatedTag
            + html.slice(
                match.index + originalTag.length
            );

        updatedImages += 1;
    }

    await fs.writeFile(
        file,
        html,
        "utf8"
    );
}

console.log(
    `Imagens de galeria verificadas: ${totalGalleryImages}`
);

console.log(
    `decoding="async" adicionado: ${updatedImages}`
);

if (missingLazy === 0) {
    console.log(
        "OK: todas as imagens das galerias possuem lazy loading"
    );
} else {
    console.log(
        `${missingLazy} imagem(ns) sem lazy loading`
    );

    process.exitCode = 1;
}