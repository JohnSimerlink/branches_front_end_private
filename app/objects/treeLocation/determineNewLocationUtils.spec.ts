import {determineObstacleVectorField, determinePreferenceField, distance, inCircle} from './determineNewLocationUtils';
import test from 'ava'
import {expect} from 'chai'
import {fXYField} from '../interfaces';
import {log} from '../../core/log'

test('distance', t => {
    const expectedDistance = 5;
    const d = distance({x1: 2, x2: -1, y1: 1000, y2: 1004});
    expect(d).to.equal(expectedDistance);
    t.pass();
});
test('inCircle 1', t => {
    const center = {x: 0, y: 0};
    const r = 4;
    const x = 0;
    const y = 4;
    const inside = inCircle({center, r, x, y});
    expect(inside).to.equal(false);
    t.pass();
});
test('inCircle 2', t => {
    const center = {x: 0, y: 0};
    const r = 4;
    const x = 1;
    const y = 2;
    const inside = inCircle({center, r, x, y});
    expect(inside).to.equal(true);
    t.pass();
});
test('inCircle 3', t => {
    const center = {x: 0, y: 0};
    const r = 3;
    const x = 3.5;
    const y = 3.9;
    const inside = inCircle({center, r, x, y});
    expect(inside).to.equal(false);
    t.pass();
});
test('determinePreferenceField onCircleValuesTheSame', t => {
    const parentCoordinate = {x : 0, y: 0};
    const r = 10;
    const preferenceField: fXYField = determinePreferenceField({parentCoordinate, r});
    const onCirclePointSouth = {x: 0, y: 10};
    const onCirclePointNorth = {x: 0, y: -10};
    const inCirclePointSouth = {x: 0, y: 9};
    const outCirclePointSouth = {x: 0, y: 11};

    const onCirclePointSouthValue = preferenceField(onCirclePointSouth);
    const onCirclePointNorthValue = preferenceField(onCirclePointNorth);
    // const inCirclePointSouthValue = preferenceField(inCirclePointSouth)
    // const outCirclePointSouthValue = preferenceField(outCirclePointSouth)

    const onCircleValuesTheSame = onCirclePointSouthValue === onCirclePointNorthValue;
    expect(onCircleValuesTheSame).to.equal(true);
    // const onCircleGreaterThanOutOfCircle = onCirclePointSouthValue > inCirclePointSouthValue
    // expect(onCircleGreaterThanOutOfCircle).to.equal(true)
    // t.
    // const inside = inCircle({center, r, x, y})
    // expect(inside).to.equal({x, y})
    t.pass();
});
test('determinePreferenceField inCircleValue less than onCircleValue', t => {
    const parentCoordinate = {x : 0, y: 0};
    const r = 10;
    const preferenceField: fXYField = determinePreferenceField({parentCoordinate, r});
    const onCirclePointSouth = {x: 0, y: 10};
    // const onCirclePointNorth = {x: 0, y: -10}
    const inCirclePointSouth = {x: 0, y: 9};
    // const outCirclePointSouth = {x: 0, y: 11}

    const onCirclePointSouthValue = preferenceField(onCirclePointSouth);
    // const onCirclePointNorthValue = preferenceField(onCirclePointNorth)
    const inCirclePointSouthValue = preferenceField(inCirclePointSouth);
    // const outCirclePointSouthValue = preferenceField(outCirclePointSouth)

    // const onCircleValuesTheSame = onCirclePointSouthValue === onCirclePointNorthValue
    // expect(onCircleValuesTheSame).to.equal(true)
    const onCircleGreaterThanInCircle = onCirclePointSouthValue > inCirclePointSouthValue;
    log('onCirclePointSouthValue is', onCirclePointSouthValue);
    log('inCirclePointSouthValue is', inCirclePointSouthValue);
    expect(onCircleGreaterThanInCircle).to.equal(true);
    // t.
    // const inside = inCircle({center, r, x, y})
    // expect(inside).to.equal({x, y})
    t.pass();
});
test('determinePreferenceField outCircleValue less than onCircleValue', t => {
    const parentCoordinate = {x : 0, y: 0};
    const r = 10;
    const preferenceField: fXYField = determinePreferenceField({parentCoordinate, r});
    const onCirclePointSouth = {x: 0, y: 10};
    // const onCirclePointNorth = {x: 0, y: -10}
    // const inCirclePointSouth = {x: 0, y: 9}
    const outCirclePointSouth = {x: 0, y: 11.1};

    const onCirclePointSouthValue = preferenceField(onCirclePointSouth);
    // const onCirclePointNorthValue = preferenceField(onCirclePointNorth)
    // const inCirclePointSouthValue = preferenceField(inCirclePointSouth)
    const outCirclePointSouthValue = preferenceField(outCirclePointSouth);

    // const onCircleValuesTheSame = onCirclePointSouthValue === onCirclePointNorthValue
    // expect(onCircleValuesTheSame).to.equal(true)
    const onCircleGreaterThanOutOfCircle = onCirclePointSouthValue > outCirclePointSouthValue;
    log('onCirclePointSouthValue is', onCirclePointSouthValue);
    log('outCirclePointSouthValue is', outCirclePointSouthValue);
    expect(onCircleGreaterThanOutOfCircle).to.equal(true);
    // t.
    // const inside = inCircle({center, r, x, y})
    // expect(inside).to.equal({x, y})
    t.pass();
});
test('determineObstacleVectorField onObstacle has crazy high value', t => {
    const r = 10;
    const obstacleCoordinate = {x: 10, y: 10};
    const obstacleField: fXYField = determineObstacleVectorField({obstacleCoordinate, r});
    const onObstaclePoint = obstacleCoordinate;
    // const onCirclePointSouth = {x: 0, y: 10}
    // // const onCirclePointNorth = {x: 0, y: -10}
    // // const inCirclePointSouth = {x: 0, y: 9}
    // const outCirclePointSouth = {x: 0, y: 11.1}

    const onCirclePointValue = obstacleField(onObstaclePoint);
    log('onCirclePointValue is ', onCirclePointValue);
    // const onCirclePointNorthValue = preferenceField(onCirclePointNorth)
    // const inCirclePointSouthValue = preferenceField(inCirclePointSouth)
    // const outCirclePointSouthValue = preferenceField(outCirclePointSouth)

    // const onCircleValuesTheSame = onCirclePointSouthValue === onCirclePointNorthValue
    // expect(onCircleValuesTheSame).to.equal(true)
    const onCirclePointSuperLow = onCirclePointValue < -999;
    // log('onCirclePointSouthValue is', onCirclePointSouthValue)
    // log('outCirclePointSouthValue is', outCirclePointSouthValue)
    expect(onCirclePointSuperLow).to.equal(true);
    // t.
    // const inside = inCircle({center, r, x, y})
    // expect(inside).to.equal({x, y})
    t.pass();
});

test('determineObstacleVectorField obstacle field gets smaller as you go farther away', t => {
    const r = 10;
    const obstacleCoordinate = {x: 10, y: 10};
    const obstacleField: fXYField = determineObstacleVectorField({obstacleCoordinate, r});
    const point1 = {
        x: 9.9,
        y: 9.8,
    };
    const point2 = {
        x: 8.9,
        y: 8.8,
    };
    const point3 = {
        x: 5.9,
        y: 5.8,
    };
    const point4 = {
        x: 3.9,
        y: 3.8,
    };
    // const onCirclePointSouth = {x: 0, y: 10}
    // // const onCirclePointNorth = {x: 0, y: -10}
    // // const inCirclePointSouth = {x: 0, y: 9}
    // const outCirclePointSouth = {x: 0, y: 11.1}

    const point1Value = obstacleField(point1);
    log('point1Value is ', point1Value);
    const point2Value = obstacleField(point2);
    log('point2Value is ', point2Value);
    const point3Value = obstacleField(point3);
    log('point3Value is ', point3Value);
    const point4Value = obstacleField(point4);
    log('point4Value is ', point4Value);
    // const onCirclePointNorthValue = preferenceField(onCirclePointNorth)
    // const inCirclePointSouthValue = preferenceField(inCirclePointSouth)
    // const outCirclePointSouthValue = preferenceField(outCirclePointSouth)

    // const onCircleValuesTheSame = onCirclePointSouthValue === onCirclePointNorthValue
    // expect(onCircleValuesTheSame).to.equal(true)
    const point2ValueLessNegativeThanPoint1 = point1Value < point2Value;
    const point3ValueLessNegativeThanPoint2 = point2Value < point3Value;
    const point4ValueLessNegativeThanPoint3 = point3Value < point4Value;
    // log('onCirclePointSouthValue is', onCirclePointSouthValue)
    // log('outCirclePointSouthValue is', outCirclePointSouthValue)
    expect(point2ValueLessNegativeThanPoint1).to.equal(true);
    expect(point3ValueLessNegativeThanPoint2).to.equal(true);
    expect(point4ValueLessNegativeThanPoint3).to.equal(true);
    // t.
    // const inside = inCircle({center, r, x, y})
    // expect(inside).to.equal({x, y})
    t.pass();
});

// test('determineObstacleVectorField obstacle field gets smaller as you go farther away', t => {
//     const r = 10
//     const obstacleCoordinate = {x: 10, y: 10}
//     const obstacleField: fXYField = determineObstacleVectorField({obstacleCoordinate, r})
//     const point1 = {
//         x: 9.9,
//         y: 9.8,
//     }
//     const point2 = {
//         x: 8.9,
//         y: 8.8,
//     }
//     // const onCirclePointSouth = {x: 0, y: 10}
//     // // const onCirclePointNorth = {x: 0, y: -10}
//     // // const inCirclePointSouth = {x: 0, y: 9}
//     // const outCirclePointSouth = {x: 0, y: 11.1}
//
//     const point1Value = obstacleField(point1)
//     log('point1Value is ', point1Value)
//     const point2Value = obstacleField(point2)
//     log('point2Value is ', point2Value)
//     // const onCirclePointNorthValue = preferenceField(onCirclePointNorth)
//     // const inCirclePointSouthValue = preferenceField(inCirclePointSouth)
//     // const outCirclePointSouthValue = preferenceField(outCirclePointSouth)
//
//     // const onCircleValuesTheSame = onCirclePointSouthValue === onCirclePointNorthValue
//     // expect(onCircleValuesTheSame).to.equal(true)
//     const point2ValueLessNegativeThanPoint1 = point1Value < point2Value
//     // log('onCirclePointSouthValue is', onCirclePointSouthValue)
//     // log('outCirclePointSouthValue is', outCirclePointSouthValue)
//     expect(point2ValueLessNegativeThanPoint1).to.equal(true)
//     // t.
//     // const inside = inCircle({center, r, x, y})
//     // expect(inside).to.equal({x, y})
//     t.pass()
// })
