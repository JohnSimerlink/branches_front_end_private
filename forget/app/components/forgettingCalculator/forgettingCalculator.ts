// tslint:disable object-literal-sort-keys
import {log} from '../../../../app/core/log'
import {calculateRecall, calculateStrength, calculateTime} from '../../../../app/forgettingCurve';
const secondsInMinute = 60
const secondsInHour = secondsInMinute * 60
const secondsInDay = secondsInHour * 24
const secondsInWeek = secondsInDay * 7
const secondsInYear = secondsInDay * 365
const secondsInMonth = secondsInYear / 12
export function truncateToHundredths(num) {
    return Math.floor(num * 100) / 100
}
export function times100(num) {
    return num * 100
}
export default {
    template: require('./forgettingCalculator.html'),
    data() {
        return {
            years: 0,
            months: 0,
            weeks: 1,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            s: 60,
            r: 70,
        }
    },
    async created() {
        const urlString = window.location.href
        // "http://www.example.com/t.html?a=1&b=3&c=m2-m3-m4-m5"; //window.location.href
        const url = new URL(urlString);
        const s = url.searchParams.get('s')
        const r = url.searchParams.get('r')
        const years = url.searchParams.get('years')
        const months = url.searchParams.get('months')
        const weeks = url.searchParams.get('weeks')
        const days = url.searchParams.get('days')
        const hours = url.searchParams.get('hours')
        const minutes = url.searchParams.get('minutes')
        const seconds = url.searchParams.get('seconds')

        this.s = s || this.s
        this.r = r || this.r
        this.years = years
        this.months = months
        this.weeks = weeks
        this.days = days
        this.hours = hours
        this.minutes = minutes
        this.seconds = seconds
        log('forgettingcalculator component created')
    },
    computed: {
        t() {
            const t = this.seconds +
                secondsInMinute * this.minutes +
                secondsInHour * this.hours +
                secondsInDay * this.days +
                secondsInWeek * this.weeks +
                secondsInMonth * this.months +
                secondsInYear * this.years
            log('t changed to', t, this.seconds, this.minutes * secondsInMinute, secondsInHour * this.hours,
                secondsInDay * this.days,
                secondsInWeek * this.weeks,
                secondsInMonth * this.months,
                secondsInYear * this.years )
            return t
        },
        sComputed() {
            const computedStrength = calculateStrength(this.r, this.t)
            log('computedStrength calculated to be ', this.r, this.t, '--->', computedStrength)
            return computedStrength
        },
        rComputed() {
            const computedRecall = calculateRecall(this.s, this.t)
            log('computedRecall calculated to be ', this.s, this.t, '--->', computedRecall)
            return computedRecall
        },
        tComputed() {
            const computedTime = calculateTime(this.s, this.r / 100)
            log('computedTime calculated to be ', this.s, this.r / 100, '---->', computedTime)
            return computedTime
        },
        yearsComputed() {
            const yearsComputed = Math.floor(this.tComputed / secondsInYear)
            log('yearsComputed is', yearsComputed)
            return yearsComputed
        },
        yearsRemainder() {
            const yearsRemainder = this.tComputed / secondsInYear - Math.floor(this.tComputed / secondsInYear)
            log('yearsRemainder is', yearsRemainder)
            return yearsRemainder
        },
        monthsRemainder() {
            const monthsRemainder = this.yearsRemainder * 12 - Math.floor(this.yearsRemainder * 12)
            log('monthsRemainder is', monthsRemainder)
            return monthsRemainder
        },
        weeksRemainder() {
            const weeksRemainder = this.monthsRemainder * 30.5 / 7 - Math.floor(this.monthsRemainder * 30.5 / 7)
            log('weeksRemainder is', weeksRemainder)
            return weeksRemainder
        },
        daysRemainder() {
            const daysRemainder = this.weeksRemainder * 7 - Math.floor(this.weeksRemainder * 7)
            log('daysRemainder is', daysRemainder)
            return daysRemainder
        },
        hoursRemainder() {
            const hoursRemainder = this.daysRemainder * 24 - Math.floor(this.daysRemainder * 24)
            log('hoursRemainder is', hoursRemainder)
            return hoursRemainder
        },
        minutesRemainder() {
            const minutesRemainder = this.hoursRemainder * 60 - Math.floor(this.hoursRemainder * 60)
            log('minutesRemainder is', minutesRemainder)
            return minutesRemainder
        },
        secondsRemainder() {
            const secondsRemainder = this.minutesRemainder * 60 - Math.floor(this.minutesRemainder * 60)
            log('secondsRemainder is', secondsRemainder)
            return secondsRemainder
        },
        monthsComputed() {
            const monthsComputed = Math.floor(this.yearsComputed / secondsInMonth)
            log('monthsComputed is', monthsComputed)
            return monthsComputed
        },
        weeksComputed() {
            const weeksComputed = Math.floor(this.monthsRemainder * 12)
            log('weeksComputed is', weeksComputed)
            return weeksComputed
        },
        daysComputed() {
            const daysComputed = Math.floor(this.weeksRemainder * 12)
            log('daysComputed is', daysComputed)
            return daysComputed
        },
        hoursComputed() {
            const hoursComputed = Math.floor(this.daysRemainder * 12)
            log('inside of hoursComputed, daysRemainder is', this.daysRemainder)
            log('hoursComputed is', hoursComputed)
            return hoursComputed
        },
        minutesComputed() {
            const minutesComputed = Math.floor(this.hoursRemainder * 12)
            log('inside of minutesComputed, hoursRemainder is', this.hoursRemainder)
            log('minutesComputed is', minutesComputed)
            return minutesComputed
        },
        secondsComputed() {
            const secondsComputed = Math.floor(this.minutesRemainder * 12)
            log('inside of secondsComputed, minutesRemainder is', this.minutesRemainder)
            log('secondsComputed is', secondsComputed)
            return secondsComputed
        },
    },
    methods: {
    },
}
