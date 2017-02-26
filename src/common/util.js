
class Util {
    defaultIfNull(val, defaultVal) {
        return typeof val !== 'undefined' ? val : defaultVal
    }
}

export new Util();
