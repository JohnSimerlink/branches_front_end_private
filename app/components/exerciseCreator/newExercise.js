import Exercise from "../../objects/exercise";
// import ExerciseQA from "../../objects/exerciseQA";
import Taggle from 'taggle'

export default {
    template: require('./newExercise.html'),
    created () {
        var me = this
        this.items = [{breadcrumb: "Spanish > Hola", id: 'a12345'},{breadcrumb: "Spanish > Senorita", id: 'b23456'}]
        // this.itemIds = {12345: true} //[12345]
        this.selectedItems = []
        this.selectedItemIds = []
        this.newItem=""
        this.question=""
        this.answer=""
        // this.factsAndSkills = [{breadcrumb: "<span>Spanish > Hola<span item-id='12345'></span></span>", id: '12345'},{breadcrumb: "Spanish > Senorita", id: '23456'}]

        var breadcrumbIdMap = this.items.reduce((map, item) => {
            map[item.breadcrumb] = item.id
            return map
        },{})
        var idBreadcrumbMap = this.items.reduce((map, item) => {
            map[item.id] = item.breadcrumb
            return map
        },{})
        this.idBreadcrumbMap = idBreadcrumbMap
        this.breadcrumbIdMap = breadcrumbIdMap
        // hacky solution, but each breadcrumb should be uniquely mapped to a contentId so i guess no big deal

        setTimeout(function() {
            window.example4 = new Taggle($('.example4.textarea')[0], {
                duplicateTagClass: 'bounce',
                onTagRemove: function(event,breadcrumb){
                    var id = breadcrumbIdMap[breadcrumb]
                    var index = me.selectedItemIds.indexOf(id)
                    me.selectedItemIds.splice(index,1)
                    delete me.selectedItemIds[id]
                }
            });

            var container = window.example4.getContainer();
            var input = window.example4.getInput();
            console.log('input is ', input)
            console.log('container is ', container)

            $(input).autocomplete({
                source: me.items.map( x => x.breadcrumb),
                appendTo: container,
                position: { at: 'left bottom', of: container },
                select: function(e, v) {
                    console.log("added! at start selectedItemIds is ", me.selectedItemIds)
                    e.preventDefault();
                    // Add the tag if user clicks
                    if (e.which === 1) {
                        var breadcrumb = v.item.value
                        var id = breadcrumbIdMap[breadcrumb]
                        var alreadyExists = me.selectedItemIds.find(itemId => itemId == id)
                        if (alreadyExists) return
                        me.selectedItemIds.push(id) //[id.toString()] = true
                        window.example4.add(breadcrumb);
                        console.log('me selectedItemIds is now', me.selectedItemIds)
                    }
                }
            });
        },0)


    },
    data () {
        return {
            items: this.items,
            newItem: this.newItem,
            question: this.question,
            answer: this.answer,
            selectedItems: this.selectedItems,
            selectedItemIds: this.selectedItemIds,
            factsAndSkills: [],
            itemIds: this.itemIds,
            type: 'fact'
        }
    },
    computed: {
        selectedBreadcrumbs() {
            var me = this
            const selectedBreadcrumbs = Object.keys(this.selectedItemIds).map(id =>  {
                var breadcrumb = me.idBreadcrumbMap[id]
                console.log('id and breadcrumb are ', id, breadcrumb)
                return breadcrumb
            })
            console.log(
                'selected bread crumbs and itemIds are', selectedBreadcrumbs, this.selectedItemIds, me.idBreadcrumbMap
            )
            return selectedBreadcrumbs
        },
        favcolor() {
            return 'blue'
        },
        contentIsFact () {
            return this.type == 'fact'
        },
    },
    methods: {
        addContentItem() {

            if (!this.newItem) return
            this.items[this.newItem] = true
            this.newItem=""
        },
        createExercise() {
           //TODO allow creation of other types of exercises than QA
           // ExerciseQA.create({question: this.question, answer: this.answer, contentItems:this.items})
        }
    },
}
