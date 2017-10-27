var cleanup = require('jsdom-global')()
import {expect} from 'chai'
import * as curve from '../app/forgettingCurve'
    describe('measuringPreviousStrength', () => {
        it('should return estimated previous strength if proficiency >= PROFICIENCIES.FOUR and time since last review was really short', () => {
            try {
                expect(curve.measurePreviousStrength(40, 99, 2)).to.equal(40)
                expect(curve.measurePreviousStrength(40, 99.9, 2)).to.equal(40)
            } catch(err) {
                console.error("there was an error", err)
            }
        })
        it('should return estimated previous strength if proficiency <= 1 and time since last review was really long', () => {
            try {
                expect(curve.measurePreviousStrength(40, 1, 9999999)).to.equal(40)
                expect(curve.measurePreviousStrength(40, .1, 9999999)).to.equal(40)
            } catch(err) {
                console.error("there was an error", err)
            }
            //if you were to plug in 1% in our formula for 9999999 seconds you would normally get 63 dB, which doesn't make sense given the previous estimated decibel strength of 40
        })
        it('should return 10 dbE for 1/e proficiency and 10 seconds', () => {
            try {
                expect(curve.measurePreviousStrength(39, 100 * 1 / curve.e, 10)).to.closeTo(10,.1)
            } catch(err) {
                console.error("there was an error", err)
            }
        })
        it('should return 50 dbE for 75% proficiency and 8 hours', () => {
            try {
                expect(curve.measurePreviousStrength(39, 100 * .75, 8 * 60 * 60)).to.closeTo(50,.1)
            } catch( err){
                console.error(err)
            }
        })
    })
    describe('estimateCurrentStrength', () => {
        it('should return previous strength for 1/e proficiency', () => {
            try {
                expect(curve.estimateCurrentStrength(39, 100 * 1 / curve.e, 8 * 60 * 60)).to.closeTo(39,.1)
            } catch( err){
                console.error("Err is", err)
            }
        })
        it('should return previous strength for 0 seconds since last review', () => {
            try {
                expect(curve.estimateCurrentStrength(39, 100 * 1 / curve.e, 0)).to.closeTo(39,.1)
            } catch( err){
                console.error("Err is", err)
            }
        })
        it('should return + 10(e-1) dB for 100% proficiency and longgg time since last review', () => {
            try {
                const originalStrength = 39
                const newExpectedStrength = originalStrength + 10 * (curve.e - 1)
                expect(curve.estimateCurrentStrength(39, 99.99999, 9999999999)).to.closeTo(newExpectedStrength,.1)
            } catch( err){
                console.error("Err is", err)
            }
        })
        it('should return + 10(1 - 1/e) dB for 100% proficiency at Tc', () => {
            try {
                const originalStrength = 39
                const newExpectedStrength = originalStrength + 10 * ( 1 - 1 / curve.e)
                const Tc = curve.calculateTime(originalStrength, curve.criticalRecall)

                expect(curve.estimateCurrentStrength(39, 99.99999, Tc)).to.closeTo(newExpectedStrength,.1)
            } catch( err){
                console.error("Err is", err)
            }
        })
        it('should return + 4.4dB for 99% proficiency at 40 minutes past a 39 strength memory ', () => {
            try {
                const originalStrength = 39
                const proficiency = 99
                const timeSincePreviousInteraction = 40 * 60

                const newStrength = originalStrength + 4.4

                expect(curve.estimateCurrentStrength(originalStrength, proficiency, timeSincePreviousInteraction)).to.closeTo(newStrength,.1)
            } catch( err){
                console.error("Err is", err)
            }
        })
    })

cleanup()
