import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

// Serves `virtual:image-sizes`: the width and height of every WebP in
// public/img, read from the file headers at build time, so <ZoomImg>
// can reserve space for screenshots without a hand-kept list.
const id = "virtual:image-sizes"

function webpSize(b: Buffer): [number, number] | null {
  if (b.toString("ascii", 0, 4) !== "RIFF") return null
  const chunk = b.toString("ascii", 12, 16)
  if (chunk === "VP8X") return [1 + b.readUIntLE(24, 3), 1 + b.readUIntLE(27, 3)]
  if (chunk === "VP8 ") return [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff]
  if (chunk === "VP8L") {
    const v = b.readUInt32LE(21)
    return [(v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1]
  }
  return null
}

export default function imageSizes() {
  return {
    name: "image-sizes",
    resolveId: (source: string) => (source === id ? "\0" + id : null),
    load(loadId: string) {
      if (loadId !== "\0" + id) return null
      const dir = join(__dirname, "../public/img")
      const sizes: Record<string, [number, number]> = {}
      for (const file of readdirSync(dir)) {
        if (!file.endsWith(".webp")) continue
        const size = webpSize(readFileSync(join(dir, file)).subarray(0, 32))
        if (size) sizes[`/img/${file}`] = size
      }
      return `export default ${JSON.stringify(sizes)}`
    },
  }
}
