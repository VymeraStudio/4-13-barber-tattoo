import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();

const htmlFiles = [
    "index.html",
    "barber.html",
    "tattoo.html"
];

const dimensionCache = new Map();

async function getImageDimensions(src) {
    if (
        /^(https?:|data:|\/\/)/i.test(src)
    ) {
        return null;
    }

    const cleanSrc = src.split(/[?#]/)[0];

    if (
        !/\.(png|jpe?g|webp|avif|gif)$/i.test(
            cleanSrc
        )
    ) {
        return null;
    }

    if (!dimensionCache.has(cleanSrc)) {
        const imagePath = path.join(
            projectRoot,
            cleanSrc
        );

        dimensionCache.set(
            cleanSrc,
            sharp(imagePath)
                .metadata()
                .then((metadata) => {
                    if (
                        !metadata.width
                        || !metadata.height
                    ) {
                        throw new Error(
                            `Dimensões não encontradas: ${cleanSrc}`
                        );
                    }

                    return {
                        width: metadata.width,
                        height: metadata.height
                    };
                })
        );
    }

    return dimensionCache.get(cleanSrc);
}

async function updateHtmlFile(file) {
    const filePath = path.join(
        projectRoot,
        file
    );

    let html = await fs.readFile(
        filePath,
        "utf8"
    );

    const imageTags = [
        ...html.matchAll(
            /<img\b[\s\S]*?>/gi
        )
    ];

    let updatedCount = 0;

    for (
        let index = imageTags.length - 1;
        index >= 0;
        index -= 1
    ) {
        const match = imageTags[index];
        const originalTag = match[0];

        const srcMatch = originalTag.match(
            /\bsrc\s*=\s*["']([^"']+)["']/i
        );

        if (!srcMatch) {
            continue;
        }

        const dimensions =
            await getImageDimensions(
                srcMatch[1]
            );

        if (!dimensions) {
            continue;
        }

        const indentationMatch =
            originalTag.match(
                /\n([ \t]*)src\s*=/i
            );

        const indentation =
            indentationMatch?.[1]
            ?? "    ";

        let updatedTag = originalTag
            .replace(
                /\s+width\s*=\s*["'][^"']*["']/gi,
                ""
            )
            .replace(
                /\s+height\s*=\s*["'][^"']*["']/gi,
                ""
            );

        updatedTag = updatedTag.replace(
            srcMatch[0],
            `${srcMatch[0]}
${indentation}width="${dimensions.width}"
${indentation}height="${dimensions.height}"`
        );

        html =
            html.slice(0, match.index)
            + updatedTag
            + html.slice(
                match.index
                + originalTag.length
            );

        updatedCount += 1;
    }

    await fs.writeFile(
        filePath,
        html,
        "utf8"
    );

    console.log(
        `${file}: ${updatedCount} imagens atualizadas`
    );
}

async function main() {
    for (const file of htmlFiles) {
        await updateHtmlFile(file);
    }

    console.log(
        "Dimensões adicionadas com sucesso."
    );
}

main().catch((error) => {
    console.error(
        "Erro ao adicionar dimensões:",
        error
    );

    process.exitCode = 1;
});