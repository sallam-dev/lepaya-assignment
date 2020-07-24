function logPrefix(prefix: string) {
  return `${new Date(Date.now()).toISOString()} ${prefix}`;
}
export const logger = {
  info(message: unknown): void {
    console.log(`${logPrefix('INFO')} ${String(message)}`);
  },
  error(message: unknown): void {
    console.error(`${logPrefix('ERROR')} ${String(message)}`);
  },
};
