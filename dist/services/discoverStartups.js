"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchNewStartups = fetchNewStartups;
exports.discoverStartupsNode = discoverStartupsNode;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function fetchNewStartups() {
    const query = `
  {
    posts(order: NEWEST, first: 100) {
      edges {
        node {
          name
          tagline
          website_url
          discussion_url
        }
      }
    }
  }`;
    const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.PRODUCT_HUNT_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
    });
    const data = await res.json();
    if (!data?.data?.posts?.edges) {
        return [];
    }
    return data.data.posts.edges.map((e) => ({
        name: e.node.name,
        description: e.node.tagline,
        url: e.node.website_url || e.node.discussion_url
    }));
}
async function discoverStartupsNode() {
    const startups = await fetchNewStartups();
    return {
        discoveredStartups: startups
    };
}
