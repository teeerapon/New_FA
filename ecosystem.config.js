module.exports = {
    apps: [
      {
        name: "NEW_FA_33001",
        script: "./server.js",
        env: {
          NODE_ENV: "production",
          PORT: 33001
        }
      }
    ]
  };