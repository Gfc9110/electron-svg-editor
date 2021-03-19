const Translator = {
  async setLanguage(code = "it") {
    this._languageCode = code[0] + code[1];
    if (!this._languages[code]) {
      this._languages[code] = await (
        await fetch("./languages/" + code + ".json")
      ).json();
      app.$forceUpdate();
    }
  },
  translate(tKey = "") {
    if (tKey && this._languages[this._languageCode]) {
      const keys = tKey.split(".");
      let value = "";
      for (let i = 0; i < keys.length; i++) {
        if (i == 0) {
          value = this._languages[this._languageCode][keys[i]];
        } else {
          value = value[keys[i]];
        }
      }
      return value;
    }
  },
  _languages: {},
  _languageCode: "it",
};

Translator.setLanguage(navigator.language);
