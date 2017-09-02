export default {
    template: require('./treeReviewContainer.html'),
    props: ['leafId'],
    created(){
        console.log('tree review container leafId is', this.leafId)
    }
    //in browser navigate to  http://localhost:8080/#/study/83cbe6ea3fa874449982b645f04d14a1 - for amar
    //in browser navigate to  http://localhost:8080/#/study/ac8b5a3a8898a48e70bb3a5c6eebfca0 - for an item with no exercises
    //http://localhost:8080/#/study/83cbe6ea3fa874449982b645f04d14a1
}
