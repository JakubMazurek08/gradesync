export function getGradientColor(value: number): string {
    if (value < 0 || value > 100) {
        throw new Error("Value must be between 0 and 100");
    }

    const gradient: { stop: number; color: [number, number, number] }[] = [
        { stop: 0, color: [255, 0, 0] },
        { stop: 33, color: [255, 133, 40] },
        { stop: 66, color: [255, 197, 24] },
        { stop: 100, color: [0, 255, 17] }
    ];

    let start: { stop: number; color: [number, number, number] } | undefined;
    let end: { stop: number; color: [number, number, number] } | undefined;

    for (let i = 0; i < gradient.length - 1; i++) {
        if (value >= gradient[i].stop && value <= gradient[i + 1].stop) {
            start = gradient[i];
            end = gradient[i + 1];
            break;
        }
    }

    if (!start || !end) {
        throw new Error("Value out of gradient range");
    }

    const ratio = (value - start.stop) / (end.stop - start.stop);
    const interpolatedColor = start.color.map((startC, index) =>
        Math.round(startC + ratio * (end.color[index] - startC))
    ) as [number, number, number];

    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${interpolatedColor.map(toHex).join("")}`;
}