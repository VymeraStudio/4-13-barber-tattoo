import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();

const imageFolders = [
    "assets/images/interior",
    "assets/images/barber",
    "assets/images/tattoo"
];

async function findPngFiles(folder) {
    const fullFolderPath = path.join(
        projectRoot,
        folder
    );

    const entries = await fs.readdir(
        fullFolderPath,
        {
            withFileTypes: true
        }
    );

    const files = [];

    for (const entry of entries) {
        const entryPath = path.join(
            fullFolderPath,
            entry.name
        );

        if (entry.isDirectory()) {
            const nestedFiles =
                await findPngFiles(
                    path.relative(
                        projectRoot,
                        entryPath
                    )
                );

            files.push(...nestedFiles);
            continue;
        }

        if (
            entry.isFile()
            && entry.name
                .toLowerCase()
                .endsWith(".png")
        ) {
            files.push(entryPath);
        }
    }

    return files;
}

async function optimizeImage(inputPath) {
    const outputPath = inputPath.replace(
        /\.png$/i,
        ".webp"
    );

    const originalStats = await fs.stat(
        inputPath
    );

    await sharp(inputPath)
        .rotate()
        .webp({
            quality: 82,
            effort: 6,
            smartSubsample: true
        })
        .toFile(outputPath);

    const optimizedStats = await fs.stat(
        outputPath
    );

    const reduction =
        (
            1
            - optimizedStats.size
            / originalStats.size
        )
        * 100;

    console.log(
        `${path.relative(projectRoot, inputPath)}`
    );

    console.log(
        `  PNG: ${(
            originalStats.size
            / 1024
        ).toFixed(1)} KB`
    );

    console.log(
        `  WebP: ${(
            optimizedStats.size
            / 1024
        ).toFixed(1)} KB`
    );

    console.log(
        `  Redução: ${reduction.toFixed(1)}%\n`
    );
}

async function main() {
    const pngFiles = [];

    for (const folder of imageFolders) {
        const files = await findPngFiles(
            folder
        );

        pngFiles.push(...files);
    }

    console.log(
        `Encontradas ${pngFiles.length} imagens PNG.\n`
    );

    for (const file of pngFiles) {
        await optimizeImage(file);
    }

    console.log(
        "Conversão concluída."
    );

    console.log(
        "Os PNG originais foram mantidos."
    );
}

main().catch((error) => {
    console.error(
        "Erro ao otimizar imagens:",
        error
    );

    process.exitCode = 1;
});