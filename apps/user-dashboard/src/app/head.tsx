const IOS_STARTUP_IMAGES = [
  {
    href: '/icons/icon-512-v2.png',
    media:
      '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: '/icons/icon-512-v2.png',
    media:
      '(device-width: 667px) and (device-height: 375px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: '/icons/icon-512-v2.png',
    media:
      '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: '/icons/icon-512-v2.png',
    media:
      '(device-width: 844px) and (device-height: 390px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: '/icons/icon-512-v2.png',
    media:
      '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    href: '/icons/icon-512-v2.png',
    media:
      '(device-width: 932px) and (device-height: 430px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
  },
  {
    href: '/icons/icon-512-v2.png',
    media:
      '(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: '/icons/icon-512-v2.png',
    media:
      '(device-width: 1180px) and (device-height: 820px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
  {
    href: '/icons/icon-512-v2.png',
    media:
      '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
  {
    href: '/icons/icon-512-v2.png',
    media:
      '(device-width: 1194px) and (device-height: 834px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
  },
] as const;

export default function Head() {
  return (
    <>
      {IOS_STARTUP_IMAGES.map((image) => (
        <link
          key={image.media}
          rel="apple-touch-startup-image"
          href={image.href}
          media={image.media}
        />
      ))}
    </>
  );
}
