class UploadStore {
  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
  }

  addUrl(url) {
    const urls = [...this.getUrls(), url];
    window.localStorage.setItem(this.localStorageKey, JSON.stringify(urls));
  }

  getUrls() {
    return JSON.parse(
      window.localStorage.getItem(this.localStorageKey) || "[]"
    );
  }
}

const Uploads = new UploadStore("url-list");

const App = {
  $: {
    form: document.querySelector("[data-id='js-form']"),
    uploadsList: document.querySelector("[data-id='uploads-list']"),
  },
  init() {
    App.$.form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = new FormData(e.target);

      const upload = await fetch("http://localhost:8081/uploads", {
        method: "POST",
        body: data,
      }).then((v) => v.json());

      Uploads.addUrl(upload);
      App.render();
    });

    App.render();
  },
  createUrlItem(responseData) {
    const { extension, url } = responseData;

    /**
     * This is a naive approach, but adequate for this tutorial
     *
     * Use the file extension returned from the server to render
     * the correct HTML element
     */
    switch (extension) {
      case "png":
      case "jpg":
      case "jpeg":
        const img = document.createElement("img");
        img.setAttribute("src", url);
        img.setAttribute("alt", "some alt value!");
        return img;
      case "mp3":
      case "mpga":
        const audio = document.createElement("audio");
        audio.setAttribute("controls", true);
        audio.setAttribute("src", url);
        return audio;
      case "mp4":
        const video = document.createElement("video");
        video.setAttribute("controls", true);
        video.setAttribute("src", url);
        return video;
      default:
        const el = document.createElement("a");
        el.setAttribute("download", true);
        el.setAttribute("href", url);
        el.setAttribute("style", "padding: 10px;");
        el.innerText = url;
        return el;
    }
  },
  render() {
    const nodes = Uploads.getUrls().map(App.createUrlItem);
    App.$.uploadsList.replaceChildren(...nodes);
  },
};

App.init();
