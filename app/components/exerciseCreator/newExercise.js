import Exercise from "../../objects/exercise";
// import ExerciseQA from "../../objects/exerciseQA";
import Taggle from 'taggle'

export default {
    template: require('./newExercise.html'),
    created () {
        var me = this
        this.items = {'250': true}
        this.itemIds = [12345]
        this.newItem=""
        this.question=""
        this.answer=""
        this.factsAndSkills = [{breadcrumb: "<span>Spanish > Hola<span item-id='12345'></span></span>", id: '12345'},{breadcrumb: "Spanish > Senorita", id: '23456'}]

        var items = [{breadcrumb: "Spanish > Hola", id: '12345'},{breadcrumb: "Spanish > Senorita", id: '23456'}]

        var breadcrumbIdMap = items.reduce((map, item) => {
            map[item.breadcrumb] = item.id
            return map
        },{})
        //hacky solution, but each breadcrumb should be uniquely mapped to a contentId so i guess no big deal

        setTimeout(function() {
            window.example4 = new Taggle($('.example4.textarea')[0], {
                duplicateTagClass: 'bounce'
            });

            var container = window.example4.getContainer();
            var input = window.example4.getInput();
            console.log('input is ', input)
            console.log('container is ', container)

            $(input).autocomplete({
                source: items.map( x => x.breadcrumb),
                appendTo: container,
                position: { at: 'left bottom', of: container },
                select: function(e, v) {
                    e.preventDefault();
                    // Add the tag if user clicks
                    if (e.which === 1) {
                        var breadcrumb = v.item.value
                        var id = breadcrumbIdMap[breadcrumb]
                        me.itemIds.push(id)
                        window.example4.add(breadcrumb);
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
            factsAndSkills: this.factsAndSkills,
            itemIds: this.itemIds,
        }
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
    computed : {
    }
}
