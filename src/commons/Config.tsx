interface IConfig {
  app: {
    name: string;
  };
  os: {
    ios: string;
    android: string;
    web: string;
  };
  web: {
    root: string;
  };
}

const Config: IConfig = {
  app: {
    name: "book"
  },
  os: {
    ios: "ios",
    android: "android",
    web: "web"
  },
  web: {
    root: "root"
  }
};

export default Config;
