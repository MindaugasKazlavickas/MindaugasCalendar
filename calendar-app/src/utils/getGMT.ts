function getGMT() {
  let timezone: number = new Date().getTimezoneOffset() / 60;
  const sign: string = timezone === 0 ? "" : timezone > 0 ? "-" : "+";
  timezone = Math.abs(timezone);
  return `GMT ${sign}${timezone < 10 ? "0" : ""}${timezone}`;
}
export default getGMT;
