export function calculatePercentage(part: number, whole: number): { percent: number, color: string } {
    const percent = Math.min(Math.floor((part / whole) * 100), 100)

    let color: string

    if (percent < 50) {
        color = "#59A43E"       // green
    } else if (percent < 80) {
        color = "#cb9c45ff"     // yellow
    } else {
        color = "#D32254"       // red
    }

    return { percent, color }
}