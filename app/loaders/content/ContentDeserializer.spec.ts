import test
	from 'ava';
import {expect} from 'chai';
import 'reflect-metadata';
import {
	IMutableSubscribableContent,
	ISyncableMutableSubscribableContent
} from '../../objects/interfaces';
import {ContentDeserializer} from './ContentDeserializer';
import {myContainerLoadLoaders} from '../../../inversify.config';
import {
	getASampleContent1,
	sampleContentData1,
	sampleContentDataFromDB1
} from '../../objects/content/contentTestHelpers';

myContainerLoadLoaders();
test('ContentDeserializer::: deserialize Should deserialize properly', (t) => {
	const contentId = '092384';
	const expectedContent: ISyncableMutableSubscribableContent = getASampleContent1();
	const deserializedContent: IMutableSubscribableContent =
		ContentDeserializer.deserialize({
			contentData: sampleContentData1,
			contentId
		});
	expect(deserializedContent).to.deep.equal(expectedContent);
	t.pass();
});
test('ContentDeserializerFromDB::: deserializeFromDB Should deserialize properly', (t) => {
	const contentId = '092384';
	const expectedContent: ISyncableMutableSubscribableContent = getASampleContent1();
	const deserializedContent: IMutableSubscribableContent =
		ContentDeserializer.deserializeFromDB({
			contentDataFromDB: sampleContentDataFromDB1,
			contentId
		});
	expect(deserializedContent).to.deep.equal(expectedContent);
	t.pass();
});
