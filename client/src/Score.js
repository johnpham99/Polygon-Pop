export default class Score {

    constructor(value) {
        this._value = value;
    }

    get value() {
        return this._value
    }

    set value(newValue) {
        this._value = newValue
    }

    resetScore() {
        this.value = 0
    }

    addToScore(points) {
        this.value += points
    }
}