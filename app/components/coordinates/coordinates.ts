const env = process.env.NODE_ENV || 'development'
if (env === 'test') {
    const register = require('ignore-styles').default
    register(['.html', '.less'])
}
import {log} from '../../core/log'
import './coordinates.less'
import {determineNewLocation} from '../../objects/treeLocation/determineNewLocation';
import {ICoordinate} from '../../objects/interfaces';
export default {
    template: require('./coordinates.html').default,
    created() {
        const size = 100
        const preferenceField: number[][] = new Array(size)
        const preferenceFieldVal: number[][] = new Array(size)
        const coordinateField: ICoordinate[][] = new Array(size)
        for (let i = 0; i < size; i++) {
            coordinateField[i] = new Array(size)
            preferenceFieldVal[i] = new Array(size)
            for (let j = 0; j < size; j++) {
                coordinateField[i][j] = {x: j, y: i}
                preferenceFieldVal[i][j] = 0
            }
        }
        this.preferenceField = preferenceField
        const parentCoordinate = {x: 50, y: 50}
        this.parentCoordinate =  parentCoordinate
        const obstacles = [
            {x: 50, y: 60}, {x: 60, y: 50}, {x: 40, y: 50}, {x: 45, y: 50}, {x: 80, y: 80},
            {x: 50, y: 40}
        ]
        // const obstacles = []
        // const obstacles = []
        this.obstacles = obstacles

        const newLocation = determineNewLocation({
            parentCoordinate,
            obstacles,
            preferenceField: preferenceFieldVal,
            coordinateField,
        })
        log('determineNewLocation is ', newLocation)

        for (let i = 0; i < size; i++ ) {
            preferenceField[i] = new Array(size)
            for (let j = 0; j < size; j++) {
                const cell = {} as any
                preferenceField[i][j] = cell
                cell.value = preferenceFieldVal[i][j]
                cell.color = valueToColor(cell.value)
            }
        }
        // this.preferenceField = preferenceField

        // for (let preferenceRow of preferenceField){
        //     preferenceRow = new Array(size)
        // }
        // const numTriplets = 3
        // this.triplets = []
        // for (let i = 0; i < numTriplets; i++){
        //     const triplet = randomMeaninglessTriplet()
        //     this.triplets.push(triplet)
        // }
        // this.state= STATES.SHOWING
        // setTimeout(() =>{
        //     this.state = STATES.SUBTRACTING_BY_7
        // },TIME_SHOWING)
        // setTimeout(() =>{
        //     this.state = STATES.QUIZZING
        // },TIME_SHOWING + TIME_SUBTRACTING_BY_7 )
        log('coordinates ts create!', preferenceField)
    },
    data() {
        return {
            preferenceField: null,
            parentCoordinate: null,
            obstacles: null
        }
    },
    computed: {
    },
    methods: {
    }
}
// takes value between 0 and 10
function valueToColor(value): string {
    value = value * 10
    if (value < 0) {
        value = 0
    }
    if (value > 100) {
        value = 100
    }
    value = Math.floor(value)
    // log('value in valueToColor is', value)
    // value = value + 50
    let red = 75 - value
    if (red < 0) red = 0
    let green = value - 25
    if (green < 0) green = 0
    red = red * 3
    green = green * 3
    return "rgb(" + red + ", " + green + ", 0)"
}
