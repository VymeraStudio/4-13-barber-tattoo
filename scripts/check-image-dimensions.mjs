import fs from "node:fs";

const files = [
    "index.html",
    "barber.html",
    "tattoo.html"
];

let missing = 0;

for (const file of files) {
    const html = fs.readFileSync(
        file,
        "utf8"
    );

    const images =
        html.match(/<img\b[\s\S]*?>/gi)
        ?? [];

    for (const image of images) {
        const hasWidth =
            /\bwidth\s*=/i.test(image);

        const hasHeight =
            /\bheight\s*=/i.test(image);

        if (hasWidth && hasHeight) {
            continue;
        }

        const src =
            image.match(
                /\bsrc\s*=\s*["']([^"']+)["']/i
            )?.[1]
            ?? "imagem sem src";

        console.log(
            `${file}: ${src}`
        );

        missing += 1;
    }
}

if (missing === 0) {
    console.log(
        "OK: todas as imagens têm width e height"
    );
} else {
    console.log(
        `${missing} imagem(ns) sem dimensões`
    );

    process.exitCode = 1;
}