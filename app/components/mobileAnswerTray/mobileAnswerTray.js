import {Trees} from '../../objects/trees';
import ContentItems from '../../objects/contentItems';
export default {
    template: require('./mobileAnswerTray.html'),
    created () {
        var self = this;
        self.tree = {};
        self.content = {};
        self.treeid = '';

        this.varsGoHere = "varhere";

        this.num = 5;
        PubSub.subscribe('nodeSelect', () => {
            let val = document.getElementById("mobileAnswerTray").getAttribute('treeid');
            if (val === this.treeid) return;
            this.treeid = val;
            Trees.get(val).then(tree => {
                self.tree = tree;
                ContentItems.get(tree.contentId).then(content => {
                    self.content = content;
                    console.log(content);
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
            //do Close
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
                console.log(val);
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

