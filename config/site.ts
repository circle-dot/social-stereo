export const SITE_CONFIG = {
  name: "Social Stereo",
  description: "Devcon SEA"
};
export const EAS_CONFIG = {
    chainId: 84532,
    EAS_CONTRACT_ADDRESS: "0x4200000000000000000000000000000000000021",
    PRETRUST_SCHEMA: process.env.PRETRUST_SCHEMA || "0xe6428e26d2e2c1a92ac3f5b30014a228940017aa3e621e9f16f02f0ecb748de9",
    VOUCH_SCHEMA: process.env.VOUCH_SCHEMA || "0xa142412d946732a5a336236267a625ab2bc5c51b9d6f0703317bc979432ced66",
    GRAPHQL_URL: process.env.GRAPHQL_URL || "https://base-sepolia.easscan.org/graphql",
    platform: "Devcon",
    category: "SocialStereo",
}
