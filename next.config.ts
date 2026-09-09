import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Next 16 allowlists optimizer quality values and defaults to [75]
       alone — anything else is silently ignored. 90 is here for the
       hero artwork, which is displayed *contained* and so is scaled up
       slightly on a tall screen from a 960px source; that is exactly
       where the extra bitrate shows. */
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
