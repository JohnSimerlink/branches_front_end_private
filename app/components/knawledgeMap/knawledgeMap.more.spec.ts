import test from 'ava';
import {Store} from 'vuex';
import {IKnawledgeMapCreator} from '../../objects/interfaces';
import {KnawledgeMapCreator, KnawledgeMapCreatorArgs} from './KnawledgeMap';
import {partialInject} from '../../testHelpers/partialInject';
import {TYPES} from '../../objects/types';
import {myContainer} from '../../../inversify.config';
import {log} from '../../core/log';
let Vue = require('vue').default || require('vue'); // for webpack
