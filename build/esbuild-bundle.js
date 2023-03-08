(() => {
  // node_modules/ts-enums/dist/ts-enums.es5.js
  var INITIALIZED = Symbol();
  var EnumValue = function() {
    function EnumValue2(_description) {
      var _newTarget = this.constructor;
      this._description = _description;
      if ({}.hasOwnProperty.call(_newTarget, INITIALIZED)) {
        throw new Error("EnumValue classes can\u2019t be instantiated individually");
      }
      var size = EnumValue2.sizes.get(this.constructor);
      if (!size) {
        size = 0;
      }
      this._ordinal = size;
      size++;
      EnumValue2.sizes.set(this.constructor, size);
    }
    Object.defineProperty(EnumValue2.prototype, "description", {
      /**
       * The description of the instance passed into the constructor - may be the
       * same as the propName.
       *
       * @returns {string} The description
       */
      get: function() {
        return this._description;
      },
      enumerable: true,
      configurable: true
    });
    EnumValue2.prototype.toString = function() {
      return this.constructor.name + "." + this.propName;
    };
    Object.defineProperty(EnumValue2.prototype, "ordinal", {
      /**
       * Returns the index of the instance in the enum (0-based)
       *
       * @returns {number} The index of the instance in the enum (0-based)
       */
      get: function() {
        return this._ordinal;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(EnumValue2.prototype, "propName", {
      /**
       * Returns the property name used for this instance in the Enum.
       *
       * @returns {string} the property name used for this instance in the Enum
       */
      get: function() {
        return this._propName;
      },
      enumerable: true,
      configurable: true
    });
    EnumValue2.sizes = /* @__PURE__ */ new Map();
    return EnumValue2;
  }();
  var Enum = function() {
    function Enum2() {
    }
    Enum2.initEnum = function(name, theEnum) {
      if (Enum2.enumValues.has(theEnum.name)) {
        throw new Error("Duplicate name: " + theEnum.name);
      }
      var enumValues = this.enumValuesFromObject(theEnum);
      Object.freeze(theEnum);
      Enum2.enumValues.set(theEnum.name, enumValues);
    };
    Enum2.enumValuesFromObject = function(theEnum) {
      var values = Object.getOwnPropertyNames(theEnum).filter(function(propName) {
        return theEnum[propName] instanceof EnumValue;
      }).map(function(propName) {
        var enumValue = theEnum[propName];
        Object.defineProperty(enumValue, "_propName", {
          value: propName,
          configurable: false,
          writable: false,
          enumerable: true
        });
        Object.freeze(enumValue);
        return enumValue;
      });
      if (values.length) {
        values[0].constructor[INITIALIZED] = true;
      }
      var descriptions = values.map(function(value) {
        return value.description;
      });
      if (values.length !== this.unique(descriptions).length) {
        throw new Error("All descriptions must be unique for a given enum type." + ("Instead, there are multiples in " + theEnum.name));
      }
      return values;
    };
    Enum2.unique = function(values) {
      return values.filter(function(value, i) {
        return values.indexOf(value) === i;
      });
    };
    Enum2.values = function(name) {
      var values = this.enumValues.get(name);
      return values ? values.slice() : [];
    };
    Enum2.prototype.byPropName = function(propName) {
      return this.values.find(function(x) {
        return x.propName === propName;
      });
    };
    Enum2.prototype.byDescription = function(description) {
      return this.values.find(function(x) {
        return x.description === description;
      });
    };
    Object.defineProperty(Enum2.prototype, "values", {
      /**
       * Return a defensively-copied array of all the elements of the enum.
       *
       * @returns {T[]} The array of EnumValues
       */
      get: function() {
        return Enum2.values(this.name);
      },
      enumerable: true,
      configurable: true
    });
    Enum2.prototype.toString = function() {
      return this.name;
    };
    Enum2.prototype.initEnum = function(name) {
      this.name = name;
      Enum2.initEnum(name, this);
    };
    Enum2.enumValues = /* @__PURE__ */ new Map();
    return Enum2;
  }();

  // dist/Chord.js
  var CHORD_RANKS = /* @__PURE__ */ new Map([
    ["B#", 0],
    ["C", 0],
    ["C#", 1],
    ["Db", 1],
    ["D", 2],
    ["D#", 3],
    ["Eb", 3],
    ["E", 4],
    ["Fb", 4],
    ["E#", 5],
    ["F", 5],
    ["F#", 6],
    ["Gb", 6],
    ["G", 7],
    ["G#", 8],
    ["Ab", 8],
    ["A", 9],
    ["A#", 10],
    ["Bb", 10],
    ["Cb", 11],
    ["B", 11]
  ]);
  var TRIAD_PATTERN = "(M|maj|major|m|min|minor|dim|sus|dom|aug|\\+|-)";
  var ADDED_TONE_PATTERN = "(([/\\.\\+]|add)?\\d+[\\+-]?)";
  var SUFFIX_PATTERN = `(?<suffix>\\(?${TRIAD_PATTERN}?${ADDED_TONE_PATTERN}*\\)?)`;
  var BASS_PATTERN = "(\\/(?<bass>[A-G](#|b)?))?";
  var ROOT_PATTERN = "(?<root>[A-G](#|b)?)";
  var MINOR_PATTERN = "(m|min|minor)+";
  var CHORD_REGEX = XRegExp(`^${ROOT_PATTERN}${SUFFIX_PATTERN}${BASS_PATTERN}$`);
  var MINOR_SUFFIX_REGEX = XRegExp(`^${MINOR_PATTERN}.*$`);
  var Chord = class {
    constructor(root, suffix, bass) {
      this.root = root;
      this.suffix = suffix;
      this.bass = bass;
    }
    toString() {
      if (this.bass) {
        return this.root + this.suffix + "/" + this.bass;
      } else {
        return this.root + this.suffix;
      }
    }
    isMinor() {
      return MINOR_SUFFIX_REGEX.test(this.suffix);
    }
    static parse(token) {
      if (!isChord(token)) {
        throw new Error(`${token} is not a valid chord`);
      }
      const result = XRegExp.exec(token, CHORD_REGEX);
      return new Chord(result.groups.root, result.groups.suffix, result.groups.bass);
    }
  };
  function isChord(token) {
    return CHORD_REGEX.test(token);
  }

  // dist/KeySignatures.js
  var FLAT_SCALE = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "Cb"
  ];
  var SHARP_SCALE = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
  ];
  var F_SHARP_SCALE = SHARP_SCALE.map((note) => note === "F" ? "E#" : note);
  var C_SHARP_SCALE = F_SHARP_SCALE.map((note) => note === "C" ? "B#" : note);
  var G_FLAT_SCALE = FLAT_SCALE.map((note) => note === "B" ? "Cb" : note);
  var C_FLAT_SCALE = G_FLAT_SCALE.map((note) => note === "E" ? "Fb" : note);
  var KEY_SIGNATURE_REGEX = XRegExp(`${ROOT_PATTERN}(${MINOR_PATTERN})?`);
  var KeyType;
  (function(KeyType2) {
    KeyType2[KeyType2["FLAT"] = 0] = "FLAT";
    KeyType2[KeyType2["SHARP"] = 1] = "SHARP";
  })(KeyType || (KeyType = {}));
  var KeySignature = class extends EnumValue {
    constructor(majorKey, relativeMinor, keyType, rank, chromaticScale) {
      super(majorKey);
      this.majorKey = majorKey;
      this.relativeMinor = relativeMinor;
      this.keyType = keyType;
      this.rank = rank;
      this.chromaticScale = chromaticScale;
    }
  };
  var KeySignatureEnum = class extends Enum {
    constructor() {
      super();
      this.C = new KeySignature("C", "Am", KeyType.SHARP, 0, SHARP_SCALE);
      this.Db = new KeySignature("Db", "Bbm", KeyType.FLAT, 1, FLAT_SCALE);
      this.D = new KeySignature("D", "Bm", KeyType.SHARP, 2, SHARP_SCALE);
      this.Eb = new KeySignature("Eb", "Cm", KeyType.FLAT, 3, FLAT_SCALE);
      this.E = new KeySignature("E", "C#m", KeyType.SHARP, 4, SHARP_SCALE);
      this.F = new KeySignature("F", "Dm", KeyType.FLAT, 5, FLAT_SCALE);
      this.Gb = new KeySignature("Gb", "Ebm", KeyType.FLAT, 6, G_FLAT_SCALE);
      this.Fsharp = new KeySignature("F#", "D#m", KeyType.SHARP, 6, F_SHARP_SCALE);
      this.G = new KeySignature("G", "Em", KeyType.SHARP, 7, SHARP_SCALE);
      this.Ab = new KeySignature("Ab", "Fm", KeyType.FLAT, 8, FLAT_SCALE);
      this.A = new KeySignature("A", "F#m", KeyType.SHARP, 9, SHARP_SCALE);
      this.Bb = new KeySignature("Bb", "Gm", KeyType.FLAT, 10, FLAT_SCALE);
      this.B = new KeySignature("B", "G#m", KeyType.SHARP, 11, SHARP_SCALE);
      this.Csharp = new KeySignature("C#", "A#m", KeyType.SHARP, 1, C_SHARP_SCALE);
      this.Cb = new KeySignature("Cb", "Abm", KeyType.FLAT, 11, C_FLAT_SCALE);
      this.Dsharp = new KeySignature("D#", "", KeyType.SHARP, 3, SHARP_SCALE);
      this.Gsharp = new KeySignature("G#", "", KeyType.SHARP, 8, SHARP_SCALE);
      this.keySignatureMap = /* @__PURE__ */ new Map();
      this.rankMap = /* @__PURE__ */ new Map();
      this.initEnum("KeySignature");
      for (const signature of this.values) {
        this.keySignatureMap.set(signature.majorKey, signature);
        this.keySignatureMap.set(signature.relativeMinor, signature);
        if (!this.rankMap.has(signature.rank)) {
          this.rankMap.set(signature.rank, signature);
        }
      }
    }
    /**
     * Returns the enum constant with the specific name or throws an error if the
     * key signature is not valid.
     */
    valueOf(name) {
      if (KEY_SIGNATURE_REGEX.test(name)) {
        const chord = Chord.parse(name);
        const signatureName = chord.isMinor() ? chord.root + "m" : chord.root;
        const foundSignature = this.keySignatureMap.get(signatureName);
        if (foundSignature) {
          return foundSignature;
        }
        for (const signature of this.values) {
          if (signature.chromaticScale.includes(chord.root)) {
            return signature;
          }
        }
      }
      throw new Error(`${name} is not a valid key signature.`);
    }
    forRank(rank) {
      const signature = this.rankMap.get(rank);
      if (signature) {
        return signature;
      }
      throw new Error(`${rank} is not a valid rank.`);
    }
  };
  function guessKeySignature(chord) {
    let signature = chord.root;
    if (chord.isMinor()) {
      signature += "m";
    }
    return KeySignatures.valueOf(signature);
  }
  var KeySignatures = new KeySignatureEnum();

  // dist/index.js
  var N_KEYS = 12;
  var Transposer = class {
    constructor(text) {
      if (typeof text === "string") {
        this.tokens = tokenize(text);
      } else if (text instanceof Array) {
        this.tokens = text;
      } else {
        throw new Error("Invalid argument (must be text or parsed text).");
      }
    }
    static transpose(text) {
      return new Transposer(text);
    }
    /** Get the key of the text. If not explicitly set, it will be guessed from the first chord. */
    getKey() {
      if (this.currentKey) {
        return this.currentKey;
      }
      for (const line of this.tokens) {
        for (const token of line) {
          if (token instanceof Chord) {
            return guessKeySignature(token);
          }
        }
      }
      throw new Error("Given text has no chords");
    }
    fromKey(key) {
      this.currentKey = key instanceof KeySignature ? key : KeySignatures.valueOf(key);
      return this;
    }
    up(semitones) {
      const key = this.getKey();
      const newKey = transposeKey(key, semitones);
      const tokens = transposeTokens(this.tokens, key, newKey);
      return new Transposer(tokens).fromKey(newKey);
    }
    down(semitones) {
      return this.up(-semitones);
    }
    toKey(toKey) {
      const key = this.getKey();
      const newKey = KeySignatures.valueOf(toKey);
      const tokens = transposeTokens(this.tokens, key, newKey);
      return new Transposer(tokens).fromKey(newKey);
    }
    /** Returns a string representation of the text. */
    toString() {
      return this.tokens.map((line) => line.map((token) => token.toString()).join("")).join("\n");
    }
  };
  function transposeKey(currentKey, semitones) {
    const newRank = (currentKey.rank + semitones + N_KEYS) % N_KEYS;
    return KeySignatures.forRank(newRank);
  }
  function tokenize(text) {
    const lines = text.split("\n");
    const newText = [];
    for (const line of lines) {
      const newLine = [];
      let chordCount = 0;
      let tokenCount = 0;
      const tokens = line.split(/(\s+|-|]|\[)/g);
      let lastTokenWasString = false;
      for (const token of tokens) {
        const isTokenEmpty = token.trim() === "";
        if (!isTokenEmpty && isChord(token)) {
          const chord = Chord.parse(token);
          newLine.push(chord);
          chordCount++;
          lastTokenWasString = false;
        } else {
          if (lastTokenWasString) {
            newLine.push(newLine.pop() + token);
          } else {
            newLine.push(token);
          }
          if (!isTokenEmpty) {
            tokenCount++;
          }
          lastTokenWasString = true;
        }
      }
      newText.push(newLine);
    }
    return newText;
  }
  function transposeTokens(tokens, fromKey, toKey) {
    const transpositionMap = createTranspositionMap(fromKey, toKey);
    const result = [];
    for (const line of tokens) {
      const accumulator = [];
      let spaceDebt = 0;
      line.forEach((token, i) => {
        if (typeof token === "string") {
          if (spaceDebt > 0) {
            const numSpaces = token.search(/\S|$/);
            const spacesToTake = Math.min(spaceDebt, numSpaces, token.length - 1);
            const truncatedToken = token.substring(spacesToTake);
            accumulator.push(truncatedToken);
            spaceDebt = 0;
          } else if (typeof accumulator[accumulator.length - 1] === "string") {
            accumulator.push(accumulator.pop() + token);
          } else {
            accumulator.push(token);
          }
        } else {
          const transposedChord = new Chord(transpositionMap.get(token.root), token.suffix, transpositionMap.get(token.bass));
          const originalChordLen = token.toString().length;
          const transposedChordLen = transposedChord.toString().length;
          if (originalChordLen > transposedChordLen) {
            accumulator.push(transposedChord);
            if (i < line.length - 1) {
              accumulator.push(" ".repeat(originalChordLen - transposedChordLen));
            }
          } else if (originalChordLen < transposedChordLen) {
            spaceDebt += transposedChordLen - originalChordLen;
            accumulator.push(transposedChord);
          } else {
            accumulator.push(transposedChord);
          }
        }
      });
      result.push(accumulator);
    }
    return result;
  }
  function createTranspositionMap(currentKey, newKey) {
    const map = /* @__PURE__ */ new Map();
    const semitones = semitonesBetween(currentKey, newKey);
    const scale = newKey.chromaticScale;
    for (const [chord, rank] of CHORD_RANKS.entries()) {
      const newRank = (rank + semitones + N_KEYS) % N_KEYS;
      map.set(chord, scale[newRank]);
    }
    return map;
  }
  function semitonesBetween(a, b) {
    return b.rank - a.rank;
  }
  var transpose = (text) => new Transposer(text);
  var dist_default = {
    transpose,
    Chord,
    KeySignature,
    KeySignatures,
    Transposer
  };
  window.transpose = (text) => new Transposer(text);
})();
