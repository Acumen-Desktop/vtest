const config = {
  // Configure path to components
  components: {
    path: "src/lib/components/ui",
    pathPrefix: "$lib/components/ui",
  },
  // Configure path to utils
  utils: {
    path: "src/lib/utils",
    pathPrefix: "$lib/utils",
  },
  // Configure tailwind
  tailwind: {
    config: "tailwind.config.js",
    css: "src/styles/app.css",
    baseColor: "slate",
  },
  // Configure aliases
  aliases: {
    "components/*": "src/lib/components/ui/*",
    "utils/*": "src/lib/utils/*",
  },
};
