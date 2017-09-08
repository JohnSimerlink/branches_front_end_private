import {Trees} from '../../objects/trees';
import ContentItems from '../../objects/contentItems';
export default {
    template: require('./mobileAnswerTray.html'),
    created () {
        var self = this;
        self.tree = {};
        self.content = {};
        self.treeid = '';


        this.num = 5;
        PubSub.subscribe('canvas.nodeMouseUp', (eventName, node) => {
            if (node.id === this.treeid) return;
            this.treeid = node.id;
            Trees.get(this.treeid).then(tree => {
                self.tree = tree;
                ContentItems.get(tree.contentId).then(content => {
                    self.content = content;
                    console.log("contentitem is", content);
                    console.log(content.question);
                    console.log(content.answer);
                    console.log(Object.keys(content));
                })
            })
        });
    },
    data () {
        return {
            content: this.content,
            tree: this.tree,
            treeid: this.treeid
        }
    },
    methods: {
        closeTray: function () {
            document.getElementById("mobileAnswerTray").style.display = 'none';
        }
    },
    computed : {
        //This is a computed property on the HTML
        numItemsToReview() {
            console.log(this.treeid);
            return JSON.stringify(this.treeid);
        },
        timeSpentReviewing() {
            return JSON.stringify(this.tree);
        },
        answerText() {
            return {};
        }
    },
    watch: {
        content: {
            handler: function(val) {
                //
            }
        },
        tree: {
            handler: function(val) {
                console.log(val);
            }
        },
        treeid: {
            handler: function(val) {

            }
        }
    }
}

