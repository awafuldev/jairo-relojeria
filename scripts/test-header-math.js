const widths = [320, 375, 430, 768, 1024, 1280, 1440];
widths.forEach(w => {
  const pad = w >= 768 ? 72 : 48;
  const avail = Math.min(w, 1240) - pad;
  const logoW = w < 375 ? 130 : 155;
  const sideW = Math.max(0, (avail - logoW - 24) / 2);
  const leftReq = w >= 1024 ? 300 : 32;
  const rightReq = w >= 768 ? 154 : (w >= 640 ? 64 : 32);
  console.log(`Width ${w}px: Avail=${avail}px, SideCol=${Math.floor(sideW)}px, LeftReq=${leftReq}px (Fits:${sideW >= leftReq}), RightReq=${rightReq}px (Fits:${sideW >= rightReq})`);
});
