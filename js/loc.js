class Loc {
    constructor(lang, table) {
        this.lang = lang;
        this.table = table;
    }

    async init() {
        this.lang = window.navigator.language;
        this.table = await this.getKeys(this.lang);
    }

    getKeys(lang) {
        return fetch("assets/loc/" + lang + ".json")
            .then(response => response.json())
            .then(data => data)
            .catch(error => console.log(error));
    }

    tryGetString(key) {
        if (key in this.table) {
            return this.table[key];
        } else {
            return null;
        }
    }

    getString(key) {
        return this.tryGetString(key) ?? key;
    }

    /**
     * @param {string} key
     * @param {array} args
     * @returns {string}
     */
    formatString(key, args) {
        var string = this.getString(key);
        const regExp = /\${[0-9a-zA-Z]*}/g;
        const array = string.match(regExp);

        if (array == null) return key;

        for (let i = 0; i < array.length; i++) {
            string = string.replace(array[i], args[i]);
        }
        return string;
    }

    localizeDOM() {
        const allElements = document.querySelectorAll("*");
        for (var element of allElements) {
            if (!element.firstChild || !element.firstChild.data) {
                continue;
            }

            const text = element.firstChild.data;

            if (text.includes("\n")) {
                continue;
            }
            if (text.includes(" ")) {
                const substrings = text.split(" ");
                var buffer = [];
    
                for (var substring of substrings) {
                    buffer.push(loc.getString(substring));
                }
    
                const final = buffer.join(" ");
                element.firstChild.data = final;
            } else {
                element.firstChild.data = loc.getString(text);
            }
        }
    }
}
async function initializeLoc(loc) {
    await loc.init();
    console.log("Loc initialized.");
    loc.localizeDOM();
    console.log("DOM localized.");
}

var loc = new Loc();
initializeLoc(loc);