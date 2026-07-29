import fs from "node:fs";

const files = [
    "index.html",
    "barber.html",
    "tattoo.html",
    "css/style.css",
    "css/portfolio-pages.css"
];

const cp1252SpecialCharacters = new Map([
    [0x20AC, 0x80],
    [0x201A, 0x82],
    [0x0192, 0x83],
    [0x201E, 0x84],
    [0x2026, 0x85],
    [0x2020, 0x86],
    [0x2021, 0x87],
    [0x02C6, 0x88],
    [0x2030, 0x89],
    [0x0160, 0x8A],
    [0x2039, 0x8B],
    [0x0152, 0x8C],
    [0x017D, 0x8E],
    [0x2018, 0x91],
    [0x2019, 0x92],
    [0x201C, 0x93],
    [0x201D, 0x94],
    [0x2022, 0x95],
    [0x2013, 0x96],
    [0x2014, 0x97],
    [0x02DC, 0x98],
    [0x2122, 0x99],
    [0x0161, 0x9A],
    [0x203A, 0x9B],
    [0x0153, 0x9C],
    [0x017E, 0x9E],
    [0x0178, 0x9F]
]);

function restoreUtf8(text, file) {
    const bytes = [];

    for (const character of text) {
        const code = character.codePointAt(0);

        // Ignora o BOM criado pelo PowerShell.
        if (code === 0xFEFF) {
            continue;
        }

        if (
            code <= 0x7F
            || (code >= 0x80 && code <= 0xFF)
        ) {
            bytes.push(code);
            continue;
        }

        const mappedByte =
            cp1252SpecialCharacters.get(code);

        if (mappedByte !== undefined) {
            bytes.push(mappedByte);
            continue;
        }

        throw new Error(
            `Caractere inesperado em ${file}: U+${code
                .toString(16)
                .toUpperCase()}`
        );
    }

    return Buffer.from(bytes).toString("utf8");
}

for (const file of files) {
    const damagedText =
        fs.readFileSync(file, "utf8");

    const restoredText =
        restoreUtf8(damagedText, file);

    fs.writeFileSync(
        file,
        restoredText,
        "utf8"
    );

    console.log(`Corrigido: ${file}`);
}

console.log("Codificação UTF-8 restaurada.");