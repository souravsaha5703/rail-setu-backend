import NodeCache from "node-cache";

export const trainCache = new NodeCache({ stdTTL: 1800 });