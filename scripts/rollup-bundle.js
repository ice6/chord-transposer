var INITIALIZED = Symbol();
/**
 * An instance of the enum (for example, if you have an enumeration of seasons,
 * Winter would be an EnumValue.
 */
var EnumValue = (function () {
    /**
     * `initEnum()` on Enum closes the class, so subsequent calls to this
     * constructor throw an exception.
     */
    function EnumValue(_description) {
        var _newTarget = this.constructor;
        this._description = _description;
        if ({}.hasOwnProperty.call(_newTarget, INITIALIZED)) {
            throw new Error('EnumValue classes can’t be instantiated individually');
        }
        // keep track of the number of instances that have been created,
        // and use it to set the ordinal
        var size = EnumValue.sizes.get(this.constructor);
        if (!size) {
            size = 0;
        }
        this._ordinal = size;
        size++;
        EnumValue.sizes.set(this.constructor, size);
    }
    Object.defineProperty(EnumValue.prototype, "description", {
        /**
         * The description of the instance passed into the constructor - may be the
         * same as the propName.
         *
         * @returns {string} The description
         */
        get: function () {
            return this._description;
        },
        enumerable: true,
        configurable: true
    });
    EnumValue.prototype.toString = function () {
        return this.constructor.name + "." + this.propName;
    };
    Object.defineProperty(EnumValue.prototype, "ordinal", {
        /**
         * Returns the index of the instance in the enum (0-based)
         *
         * @returns {number} The index of the instance in the enum (0-based)
         */
        get: function () {
            return this._ordinal;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EnumValue.prototype, "propName", {
        /**
         * Returns the property name used for this instance in the Enum.
         *
         * @returns {string} the property name used for this instance in the Enum
         */
        get: function () {
            return this._propName;
        },
        enumerable: true,
        configurable: true
    });
    EnumValue.sizes = new Map();
    return EnumValue;
}());
/**
 * This is an abstract class that is not intended to be used directly. Extend it
 * to turn your class into an enum (initialization is performed via
 * `this.initEnum()` within the constructor).
 */
var Enum = (function () {
    function Enum() {
    }
    /**
     * Set up the enum and close the class. This must be called after the
     * constructor to set up the logic.
     *
     * @param name The name that will be used for internal storage - must be
     * unique
     * @param theEnum The enum to process
     */
    Enum.initEnum = function (name, theEnum) {
        if (Enum.enumValues.has(theEnum.name)) {
            throw new Error("Duplicate name: " + theEnum.name);
        }
        var enumValues = this.enumValuesFromObject(theEnum);
        Object.freeze(theEnum);
        Enum.enumValues.set(theEnum.name, enumValues);
    };
    /**
     * Extract the enumValues from the Enum. We set the ordinal and propName
     * properties on the EnumValue. We also freeze the objects and lock the Enum
     * and EnumValue to prevent future instantiation.
     *
     * @param theEnum The enum to process
     * @returns {T[]} The array of EnumValues
     */
    Enum.enumValuesFromObject = function (theEnum) {
        var values = Object.getOwnPropertyNames(theEnum)
            .filter(function (propName) { return theEnum[propName] instanceof EnumValue; })
            .map(function (propName) {
            var enumValue = theEnum[propName];
            Object.defineProperty(enumValue, '_propName', {
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
        var descriptions = values.map(function (value) { return value.description; });
        if (values.length !== this.unique(descriptions).length) {
            throw new Error('All descriptions must be unique for a given enum type.' +
                ("Instead, there are multiples in " + theEnum.name));
        }
        return values;
    };
    /**
     * Extract the unique values from an array. Based on
     * https://stackoverflow.com/a/23282057.
     */
    Enum.unique = function (values) {
        return values.filter(function (value, i) { return values.indexOf(value) === i; });
    };
    Enum.values = function (name) {
        var values = this.enumValues.get(name);
        return values ? values.slice() : [];
    };
    /**
     * Given the property name of an enum constant, return its value.
     *
     * @param propName The property name to search by
     * @returns {undefined|T} The matching instance
     */
    Enum.prototype.byPropName = function (propName) {
        return this.values.find(function (x) { return x.propName === propName; });
    };
    /**
     * Given the description of an enum constant, return its value.
     *
     * @param description The property name to search by
     * @returns {undefined|T} The matching instance
     */
    Enum.prototype.byDescription = function (description) {
        return this.values.find(function (x) { return x.description === description; });
    };
    Object.defineProperty(Enum.prototype, "values", {
        /**
         * Return a defensively-copied array of all the elements of the enum.
         *
         * @returns {T[]} The array of EnumValues
         */
        get: function () {
            return Enum.values(this.name);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a simple representation of the type.
     *
     * @returns {string} a simple representation of the type
     */
    Enum.prototype.toString = function () {
        return this.name;
    };
    /**
     * Set up the enum and close the class.
     *
     * @param name The name that will be used for internal storage - must be unique
     */
    Enum.prototype.initEnum = function (name) {
        this.name = name;
        Enum.initEnum(name, this);
    };
    Enum.enumValues = new Map();
    return Enum;
}());

/**
 * The rank for each possible chord. Rank is the distance in semitones from C.
 */
const CHORD_RANKS = new Map([
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
    ["B", 11],
]);
// Regex for recognizing chords
const TRIAD_PATTERN = "(M|maj|major|m|min|minor|dim|sus|dom|aug|\\+|-)";
const ADDED_TONE_PATTERN = "(([/\\.\\+]|add)?\\d+[\\+-]?)";
const SUFFIX_PATTERN = `(?<suffix>\\(?${TRIAD_PATTERN}?${ADDED_TONE_PATTERN}*\\)?)`;
const BASS_PATTERN = "(\\/(?<bass>[A-G](#|b)?))?";
const ROOT_PATTERN = "(?<root>[A-G](#|b)?)";
const MINOR_PATTERN = "(m|min|minor)+";
const CHORD_REGEX = XRegExp(`^${ROOT_PATTERN}${SUFFIX_PATTERN}${BASS_PATTERN}$`);
const MINOR_SUFFIX_REGEX = XRegExp(`^${MINOR_PATTERN}.*$`);
/**
 * Represents a musical chord. For example, Am7/C would have:
 *
 * root: A
 * suffix: m7
 * bass: C
 */
class Chord {
    constructor(root, suffix, bass) {
        this.root = root;
        this.suffix = suffix;
        this.bass = bass;
    }
    toString() {
        if (this.bass) {
            return this.root + this.suffix + "/" + this.bass;
        }
        else {
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
}
function isChord(token) {
    return CHORD_REGEX.test(token);
}

// Chromatic scale starting from C using flats only.
const FLAT_SCALE = [
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
    "Cb",
];
// Chromatic scale starting from C using sharps only.
const SHARP_SCALE = [
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
    "B",
];
// Chromatic scale for F# major which includes E#.
const F_SHARP_SCALE = SHARP_SCALE.map(note => note === "F" ? "E#" : note);
// Chromatic scale for C# major which includes E# and B#.
const C_SHARP_SCALE = F_SHARP_SCALE.map(note => note === "C" ? "B#" : note);
// Chromatic scale for Gb major which includes Cb.
const G_FLAT_SCALE = FLAT_SCALE.map(note => note === "B" ? "Cb" : note);
// Chromatic scale for Cb major which includes Cb and Fb.
const C_FLAT_SCALE = G_FLAT_SCALE.map(note => note === "E" ? "Fb" : note);
const KEY_SIGNATURE_REGEX = XRegExp(`${ROOT_PATTERN}(${MINOR_PATTERN})?`);
var KeyType;
(function (KeyType) {
    KeyType[KeyType["FLAT"] = 0] = "FLAT";
    KeyType[KeyType["SHARP"] = 1] = "SHARP";
})(KeyType || (KeyType = {}));
class KeySignature extends EnumValue {
    constructor(majorKey, relativeMinor, keyType, rank, chromaticScale) {
        super(majorKey);
        this.majorKey = majorKey;
        this.relativeMinor = relativeMinor;
        this.keyType = keyType;
        this.rank = rank;
        this.chromaticScale = chromaticScale;
    }
}
/** Enum for each key signature. */
class KeySignatureEnum extends Enum {
    constructor() {
        super();
        this.C = new KeySignature('C', 'Am', KeyType.SHARP, 0, SHARP_SCALE);
        this.Db = new KeySignature('Db', 'Bbm', KeyType.FLAT, 1, FLAT_SCALE);
        this.D = new KeySignature('D', 'Bm', KeyType.SHARP, 2, SHARP_SCALE);
        this.Eb = new KeySignature('Eb', 'Cm', KeyType.FLAT, 3, FLAT_SCALE);
        this.E = new KeySignature('E', 'C#m', KeyType.SHARP, 4, SHARP_SCALE);
        this.F = new KeySignature('F', 'Dm', KeyType.FLAT, 5, FLAT_SCALE);
        this.Gb = new KeySignature('Gb', 'Ebm', KeyType.FLAT, 6, G_FLAT_SCALE);
        this.Fsharp = new KeySignature('F#', 'D#m', KeyType.SHARP, 6, F_SHARP_SCALE);
        this.G = new KeySignature('G', 'Em', KeyType.SHARP, 7, SHARP_SCALE);
        this.Ab = new KeySignature('Ab', 'Fm', KeyType.FLAT, 8, FLAT_SCALE);
        this.A = new KeySignature('A', 'F#m', KeyType.SHARP, 9, SHARP_SCALE);
        this.Bb = new KeySignature('Bb', 'Gm', KeyType.FLAT, 10, FLAT_SCALE);
        this.B = new KeySignature('B', 'G#m', KeyType.SHARP, 11, SHARP_SCALE);
        // Unconventional key signatures:
        this.Csharp = new KeySignature('C#', 'A#m', KeyType.SHARP, 1, C_SHARP_SCALE);
        this.Cb = new KeySignature('Cb', 'Abm', KeyType.FLAT, 11, C_FLAT_SCALE);
        this.Dsharp = new KeySignature('D#', '', KeyType.SHARP, 3, SHARP_SCALE);
        this.Gsharp = new KeySignature('G#', '', KeyType.SHARP, 8, SHARP_SCALE);
        this.keySignatureMap = new Map();
        this.rankMap = new Map();
        this.initEnum('KeySignature');
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
            const signatureName = chord.isMinor() ? chord.root + 'm' : chord.root;
            const foundSignature = this.keySignatureMap.get(signatureName);
            if (foundSignature) {
                return foundSignature;
            }
            // If all else fails, try to find any key with this chord in it.
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
}
/**
 * Transforms the given chord into a key signature.
 */
function guessKeySignature(chord) {
    let signature = chord.root;
    if (chord.isMinor()) {
        signature += 'm';
    }
    return KeySignatures.valueOf(signature);
}
const KeySignatures = new KeySignatureEnum();

const N_KEYS = 12;
/** Fluent API for transposing text containing chords. */
class Transposer {
    constructor(text) {
        if (typeof text === "string") {
            this.tokens = tokenize(text);
        }
        else if (text instanceof Array) {
            this.tokens = text;
        }
        else {
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
        this.currentKey =
            key instanceof KeySignature ? key : KeySignatures.valueOf(key);
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
        return this.tokens
            .map((line) => line.map((token) => token.toString()).join(''))
            .join("\n");
    }
}
/**
 * Finds the key that is a specified number of semitones above/below the current
 * key.
 */
function transposeKey(currentKey, semitones) {
    const newRank = (currentKey.rank + semitones + N_KEYS) % N_KEYS;
    return KeySignatures.forRank(newRank);
}
/** Tokenize the given text into chords.
 */
function tokenize(text) {
    const lines = text.split("\n");
    const newText = [];
    for (const line of lines) {
        const newLine = [];
        const tokens = line.split(/(\s+|-|]|\[)/g);
        let lastTokenWasString = false;
        for (const token of tokens) {
            const isTokenEmpty = token.trim() === "";
            if (!isTokenEmpty && isChord(token)) {
                const chord = Chord.parse(token);
                newLine.push(chord);
                lastTokenWasString = false;
            }
            else {
                if (lastTokenWasString) {
                    newLine.push(newLine.pop() + token);
                }
                else {
                    newLine.push(token);
                }
                lastTokenWasString = true;
            }
        }
        newText.push(newLine);
    }
    return newText;
}
/**
 * Transposes the given parsed text (by the parse() function) to another key.
 */
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
                    // Keep at least one space.
                    const spacesToTake = Math.min(spaceDebt, numSpaces, token.length - 1);
                    const truncatedToken = token.substring(spacesToTake);
                    accumulator.push(truncatedToken);
                    spaceDebt = 0;
                }
                else if (typeof accumulator[accumulator.length - 1] === "string") {
                    accumulator.push(accumulator.pop() + token);
                }
                else {
                    accumulator.push(token);
                }
            }
            else {
                const transposedChord = new Chord(transpositionMap.get(token.root), token.suffix, transpositionMap.get(token.bass));
                const originalChordLen = token.toString().length;
                const transposedChordLen = transposedChord.toString().length;
                // Handle length differences between chord and transposed chord.
                if (originalChordLen > transposedChordLen) {
                    // Pad right with spaces.
                    accumulator.push(transposedChord);
                    if (i < line.length - 1) {
                        accumulator.push(" ".repeat(originalChordLen - transposedChordLen));
                    }
                }
                else if (originalChordLen < transposedChordLen) {
                    // Remove spaces from the right (if possible).
                    spaceDebt += transposedChordLen - originalChordLen;
                    accumulator.push(transposedChord);
                }
                else {
                    accumulator.push(transposedChord);
                }
            }
        });
        result.push(accumulator);
    }
    return result;
}
/**
 * Given the current key and the number of semitones to transpose, returns a
 * mapping from each note to a transposed note.
 */
function createTranspositionMap(currentKey, newKey) {
    const map = new Map();
    const semitones = semitonesBetween(currentKey, newKey);
    const scale = newKey.chromaticScale;
    for (const [chord, rank] of CHORD_RANKS.entries()) {
        const newRank = (rank + semitones + N_KEYS) % N_KEYS;
        map.set(chord, scale[newRank]);
    }
    return map;
}
/** Finds the number of semitones between the given keys. */
function semitonesBetween(a, b) {
    return b.rank - a.rank;
}
const transpose = (text) => new Transposer(text);
var index = {
    transpose,
    Chord,
    KeySignature,
    KeySignatures,
    Transposer,
};
window.transpose = (text) => new Transposer(text);

export { Chord, KeySignature, KeySignatures, Transposer, index as default, transpose };
