import {id, IHash, IState} from '../interfaces';
import * as firebase from '../../core/firebase_interfaces';
import Reference = firebase.database.Reference;
import {inject, injectable, tagged} from 'inversify';
import {TYPES} from '../types';
import {IContentIdMapIdMap} from '../../core/store/store_interfaces';
import {TAGS} from '../tags';

@injectable()
export class ContentIdMapIdMap implements IContentIdMapIdMap {
	private hashmap: object;
	private contentIdMapIdMapRef: Reference

	constructor(@inject(TYPES.ContentIdMapIdMapArgs){hashmap}: ContentIdMapIdMapArgs) {
		this.hashmap = hashmap;
	}

	public async get(contentId: id) {
		if (this.hashmap[contentId]) {
			return this.hashmap[contentId];
		}
		const me = this
		return new Promise((resolve, reject) => {
			me.contentIdMapIdMapRef.child(contentId).once('value', snapshot => {
				const mapId = snapshot.val()
				if (!mapId) {
					reject(`No map id found for ${contentId}`)
				} else {
					resolve(mapId)
				}
			})
		})
	}

	public async set(contentId: id, mapId: id) {
		this.hashmap[contentId] = mapId;
		const update = {
			[contentId]: mapId
		}
		this.contentIdMapIdMapRef.update(update)
	}

}

@injectable()
export default class ContentIdMapIdMapArgs {
	@inject(TYPES.Object)
	@tagged(TAGS.CONTENT_ID_MAP_ID_MAP_SOURCE, true)
		public hashmap: IHash<id>;
}
