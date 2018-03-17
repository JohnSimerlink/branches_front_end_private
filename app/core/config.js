import ENV from "./env.js";

export const Config = {
    env: ENV, // prod || dev
    offlineMode: false, // for when I'm trying to code/develop on a train/plane or some place without wifi
    version: 10,
    framework: "vue", // vue || angular1
};
