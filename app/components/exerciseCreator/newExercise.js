import Exercise from "../../objects/exercise";
import ExerciseQA from "../../objects/exerciseQA";
import ContentItems from "../../objects/contentItems";
import Snack from '../../../node_modules/snack.js/dist/snack'

import invert from 'invert-object'
import Exercises from "../../objects/exercises";

export default {
    props: ['contentItemId','exerciseToReplaceId'],
    template: require('./newExercise.html'),
    data () {
        return {
            items: {},
            question: "",
            answer: "",
            selectedItems: [],
            selectedItemIds: [],
            factsAndSkills: [],
            itemIds: this.itemIds,
            type: 'fact',
            window,
            loading: true,
        }
    },
    async created () {
        var me = this
        if (this.contentItemId){
            this.selectedItemIds.push(this.contentItemId)
        }
        this.tags = null
        //TODO: replace with Vuex/redux stores . . . or maybe a routing system
        if (this.exerciseToReplaceId){
            const exercise = await Exercises.get(this.exerciseToReplaceId)
            me.question = exercise.question
            me.answer = exercise.answer
            me.selectedItemIds = Object.keys(exercise.contentItemIds)
        }


        // this.factsAndSkills = [{breadcrumb: "<span>Spanish > Hola<span item-id='12345'></span></span>", id: '12345'},{breadcrumb: "Spanish > Senorita", id: '23456'}]
        this.items = await ContentItems.getAllExceptForHeadings()
        var breadcrumbIdMap = Object.keys(this.items).reduce((map, key) => {
            var item = me.items[key]
            var breadCrumb = item.getBreadCrumbsString()
            map[breadCrumb] = item.id
            return map
        },{})
        var idBreadcrumbMap = invert(breadcrumbIdMap)
        this.idBreadcrumbMap = idBreadcrumbMap
        this.breadcrumbIdMap = breadcrumbIdMap
        initTagSearch()
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
                me.selectedItemIds.map(id => {
                    return me.idBreadcrumbMap[id]
                }).forEach(existingBreadcrumb => {
                    console.log('existing breadcrumb', existingBreadcrumb)
                    me.tags.add(existingBreadcrumb)
                    // me.tags.add
                })

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
                me.loading = false
            },0)
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
        getExerciseData(){
            const exerciseData = {
                question: this.question,
                answer: this.answer,
                contentItemIds:
                    this.selectedItemIds.reduce((obj,key) => {
                        obj[key] = true;
                        return obj
                    }, {})
            }
            return exerciseData
        },
        createExercise() {
            const exerciseData = this.getExerciseData()
            //TODO allow creation of other types of exercises than QA
            const exercise = ExerciseQA.create(exerciseData)

            this.selectedItemIds.forEach(async id => {
                const contentItem = await ContentItems.get(id)
                contentItem.addExercise(exercise.id)
            })

            var snack = new Snack({
               domParent: document.querySelector('.new-exercise')
            });
            // show a snack for 4s
            snack.show('Exercise created! +1000 points', 4000); //TODO: make the number of points added be based on the supply and demand of the current exercises for the content items. We need to balance the content creators with content consumers, as we are creating a platform - as explained in "The Platform Revolution" book -  https://www.amazon.com/Platform-Revolution-Networked-Transforming-Economy/dp/0393249131. e.g. so you don't get 1000 Uber drivers in a city with only 300 people who need to be driven

            //clear exercise
            this.selectedItemIds = []
            this.question = ""
            this.answer = ""
            this.tags.removeAll()

        },
        async replaceExercise(){
            const exerciseData = this.getExerciseData()
            //TODO allow creation of other types of exercises than QA
            const newExercise = ExerciseQA.create(exerciseData)
            const me = this

            const exercise = await Exercises.get(this.exerciseToReplaceId)
            exercise.contentItemIds.forEach(async contentItemId => {
                const contentIdem = await ContentItems.get(contentItemId)
                contentItem.removeExercise(me.exerciseToReplaceId)
                contentItem.addExercise(newExercise.id)
            })

            var snack = new Snack({
                domParent: document.querySelector('.new-exercise')
            });
            // show a snack for 4s
            snack.show('Exercise edited!', 4000);

            //TODO: eventually redirect the user back to the tree/exercise they were studying

        }
    },
}
function convertItemIdsObjectToList(obj){
    return Object.keys(obj)
}