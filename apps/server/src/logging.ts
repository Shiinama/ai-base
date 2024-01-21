export function localDate() {
  const tzoffset = new Date().getTimezoneOffset() * 60000 //offset in milliseconds
  const localISOTime = new Date(Date.now() - tzoffset)
    .toISOString()
    .slice(0, -1)
  return localISOTime
}

export function logv(...args: string[]) {
  // [VERBOSE] 2021-08-02T14:00:00.000Z args...
  console.log(`[VERBOSE] ${localDate()} ${args.join(" ")}`)
}

export function logi(...args: string[]) {
  // [INFO] 2021-08-02T14:00:00.000Z args...
  console.log(`[INFO] ${localDate()} ${args.join(" ")}`)
}

export function logw(...args: string[]) {
  // [WARN] 2021-08-02T14:00:00.000Z args...
  console.log(`[WARN] ${localDate()} ${args.join(" ")}`)
}

export function loge(...args: string[]) {
  // [ERROR] 2021-08-02T14:00:00.000Z args...
  console.log(`[ERROR] ${localDate()} ${args.join(" ")}`)
}
