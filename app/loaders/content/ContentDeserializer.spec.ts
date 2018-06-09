import test from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import {MutableSubscribableField} from '../../objects/field/MutableSubscribableField';
import {
	CONTENT_TYPES,
	IContentData,
	IMutableSubscribableContent,
	ISyncableMutableSubscribableContent
} from '../../objects/interfaces';
import {ContentDeserializer} from './ContentDeserializer';
import {myContainerLoadAllModules, myContainerLoadLoaders} from '../../../inversify.config';
import {SyncableMutableSubscribableContent} from '../../objects/content/SyncableMutableSubscribableContent';
import {
	getASampleContent1, sampleContentData1,
	sampleContentDataFromDB1
} from '../../objects/content/contentTestHelpers';

myContainerLoadLoaders();
test('ContentDeserializer::: deserialize Should deserialize properly', (t) => {
	const contentId = '092384';
	const expectedContent: ISyncableMutableSubscribableContent = getASampleContent1();
	const deserializedContent: IMutableSubscribableContent =
		ContentDeserializer.deserialize({contentData: sampleContentData1, contentId});
	expect(deserializedContent).to.deep.equal(expectedContent);
	t.pass();
});
test('ContentDeserializerFromDB::: deserializeFromDB Should deserialize properly', (t) => {
	const contentId = '092384';
	const expectedContent: ISyncableMutableSubscribableContent = getASampleContent1();
	const deserializedContent: IMutableSubscribableContent =
		ContentDeserializer.deserializeFromDB({contentDataFromDB: sampleContentDataFromDB1, contentId});
	expect(deserializedContent).to.deep.equal(expectedContent);
	t.pass();
});
