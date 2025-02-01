const getRandomInt = async (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const replaceHttpWithHttps = async (url) => {
    if (url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
}

export { getRandomInt, replaceHttpWithHttps }
