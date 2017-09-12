
const STATES = {
    SHOWING: "showing",
    SUBTRACTING_BY_7: "subtracting_by_7",
    QUIZZING: "quizzing",
    ANSWER: "answer",
}
const TIME_SHOWING = 0 //00000
const TIME_SUBTRACTING_BY_7 = 0 //64000
export default {
    template: require('./ebbinghaus.html'),
    created () {
        const numTriplets = 3
        this.triplets = []
        for (let i = 0; i < numTriplets; i++){
            const triplet = randomMeaninglessTriplet()
            this.triplets.push(triplet)
        }
        this.state= STATES.SHOWING
        setTimeout(() =>{
            this.state = STATES.SUBTRACTING_BY_7
        },TIME_SHOWING)
        setTimeout(() =>{
            this.state = STATES.QUIZZING
        },TIME_SHOWING + TIME_SUBTRACTING_BY_7 )

    },
    data () {
        return {
            triplets: this.triplets,
            state: 'showing',

        }
    },
    computed: {
        stateIsShowing(){
            return this.state === STATES.SHOWING
        },
        stateIsSubtractingBy7(){
            return this.state === STATES.SUBTRACTING_BY_7
        },
        stateIsQuizzing(){
            return this.state === STATES.QUIZZING
        },
        stateIsAnswer(){
            return this.state === STATES.ANSWER
        },
    },
    methods: {
        showAnswer(){
            this.state = STATES.ANSWER
        }
    }
}

function randomMeaninglessTriplet(){
    const meaningfulTripletsForJohn = ['lsd', 'lds','dsl', 'hrc','dmv','cbs','kfc', 'mtn','gdp', 'frs','cds', 'std','gwt','dtf','cpr', 'csr', 'phx','hjb','dsk','snp','pbj','cht','hbs','cpx','ftv','bsh', 'bch','crm', 'vgl','jks','dmz','bmv', 'dmv']
    const numLetters = 26
    const CHAR_CODE_A = 97
    let triplet = ""
    do {
        for (let i = 0; i < 3; i++){
            let consonant = getRandomConsonant();
            while (triplet.indexOf(consonant) >= 0) {
                consonant = getRandomConsonant()
            }
            triplet += consonant
        }
    } while (meaningfulTripletsForJohn.indexOf(triplet) >= 0)
    return triplet
}
function getRandomConsonant(){
    const consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','x','z']
    const consonantIndex = Math.floor(Math.random() * consonants.length)
    const consonant = consonants[consonantIndex]
    return consonant
}

