import { IState } from "../interfaces";
import Reference = firebase.database.Reference;

@injectable()
export class ContentIdMapIdMap implements IContentIdMapIdMap {
  private hashmap: Object;
  private contentIdMapIdMapRef: Reference
  constructor(@inject(TYPES.ContentIdMapIdMapArgs){hashmap}: ContentIdMapIdMapArgs) {
    this.hashmap = hashmap;
  }
  public async get(contentId: id){
    if (this.map[id]){
      return this.map[id];
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
  public async set(contentId: id, mapId: id){
    this.map[contentId] = mapId;
    const update = {
      [contentId]: mapId
    }
    this.contentIdMapIdMapRef.update(update)
  }

}

@injectable()
export default class ContentIdMapIdMapArgs {
  @inject(TYPES.Object) @tagged(TAGS.CONTENT_ID_MAP_ID_MAP, true) hashmap: IHash<id>;
}
