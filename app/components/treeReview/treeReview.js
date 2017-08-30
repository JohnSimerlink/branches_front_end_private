import Exercise from "../../objects/exercise";
import ExerciseQA from "../../objects/exerciseQA";
import ContentItems from "../../objects/contentItems";
import Snack from '../../../node_modules/snack.js/dist/snack'

import invert from 'invert-object'

export default {
    template: require('./treeReview.html'),
    created () {
        var me = this
        this.items = {} // [{breadcrumb: "Spanish > Hola", id: 'a12345'},{breadcrumb: "Spanish > Senorita", id: 'b23456'}]
        // this.itemIds = {12345: true} //[12345]
        this.selectedItems = []
        this.selectedItemIds = []
        this.question=""
        this.answer=""
        this.tags = null


        // this.factsAndSkills = [{breadcrumb: "<span>Spanish > Hola<span item-id='12345'></span></span>", id: '12345'},{breadcrumb: "Spanish > Senorita", id: '23456'}]

        ContentItems.getAllExceptForHeadings().then(items => {
            this.items = items
            var breadcrumbIdMap = Object.keys(this.items).reduce((map, key) => {
                var item = items[key]
                var breadCrumb = item.getBreadCrumbs()
                map[breadCrumb] = item.id
                return map
            },{})
            var idBreadcrumbMap = invert(breadcrumbIdMap)
            this.idBreadcrumbMap = idBreadcrumbMap
            this.breadcrumbIdMap = breadcrumbIdMap
            initTagSearch()
        })
        // hacky solution, but each breadcrumb should be uniquely mapped to a contentId so i guess no big deal

        function initTagSearch(){
            setTimeout(function() {
                me.tags = new Taggle($('.new-exercise-items.textarea')[0], {
                    duplicateTagClass: 'bounce',
                    onTagRemove: function(event,breadcrumb){
                        var id = me.breadcrumbIdMap[breadcrumb]
                        var index = me.selectedItemIds.indexOf(id)
                        me.selectedItemIds.splice(index,1)
                        delete me.selectedItemIds[id]
                    }
                });

                var container = me.tags.getContainer();
                var input = me.tags.getInput();

                $(input).autocomplete({
                    source: Object.keys(me.breadcrumbIdMap), //me.items.map( x => x.breadcrumb),
                    appendTo: container,
                    position: { at: 'left bottom', of: container },
                    select: function(e, v) {
                        console.log("added! at start selectedItemIds is ", me.selectedItemIds)
                        e.preventDefault();
                        // Add the tag if user clicks
                        if (e.which === 1) {
                            var breadcrumb = v.item.value
                            var id = me.breadcrumbIdMap[breadcrumb]
                            var alreadyExists = me.selectedItemIds.find(itemId => itemId == id)
                            if (alreadyExists) return
                            me.selectedItemIds.push(id) //[id.toString()] = true
                            me.tags.add(breadcrumb);
                            console.log('me selectedItemIds is now', me.selectedItemIds)
                        }
                    }
                });
            },0)
        }

    },
    data () {
        return {
            items: this.items,
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
    },
    methods: {
        createExercise() {
           //TODO allow creation of other types of exercises than QA
           const exerciseData = {
               question: this.question,
               answer: this.answer,
               contentItemIds:
                   this.selectedItemIds.reduce((obj,key) => {
                       obj[key] = true;
                       return obj
               }, {})
           }
           console.log('exercise data is', exerciseData)
           const exercise = ExerciseQA.create(exerciseData)
            console.log('exercise created is ', exercise)

            console.log('this.selectedItemIds is', this.selectedItemIds)
           this.selectedItemIds.forEach(id => {
               ContentItems.get(id).then(contentItem => {
                   console.log('contentItem gotten is ',id, contentItem, contentItem.toString())
                   contentItem.addExercise(exercise.id)
                   console.log('contentItem gotten is ',contentItem, contentItem.toString())
               })
           })

           var snack = new Snack({
               domParent: document.querySelector('.new-exercise')
           });
            // show a snack for 4s
            snack.show('Exercise created!', 4000);

           //clear exercise
            this.selectedItemIds = []
            this.question = ""
            this.answer = ""
            this.tags.removeAll()

        }
    },
}
