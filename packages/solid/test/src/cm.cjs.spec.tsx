import { spawnSync } from "node:child_process"
import path from "node:path"

const distPath = path.resolve(__dirname, "../../dist/index.cjs.js")

const runNodeScript = (script: string) => {
  return spawnSync("node", ["-e", script], {
    encoding: "utf-8",
  })
}

describe("CommonJS Build (solid)", () => {
  it("loads the CJS bundle without throwing", () => {
    const script = `
      try {
        require(${JSON.stringify(distPath)});
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    `

    const result = runNodeScript(script)
    expect(result.status).toBe(0)
    expect(result.stderr).toBe("")
  })
})
