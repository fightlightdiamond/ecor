import { execSync } from "node:child_process"

// Docker Linux images need the linux sharp binary; native Windows/macOS use the default install.
if (process.platform === "linux") {
  execSync("npm install --no-save --os=linux --cpu=arm64 sharp", {
    stdio: "inherit",
  })
}
