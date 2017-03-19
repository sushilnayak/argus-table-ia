import Settings from '../setting'

var Graph = function() {

    this.nodelist = []
    this.nodes = {};
    this.hideNodesContaining=[]
    // this.hideNodesContaining=["WORK.","WORKSPDS."];
}

Graph.prototype.addNode = function(node) {
    this.nodelist.push(node);
    this.nodes[node.id] = node;
}

Graph.prototype.visible=function(id){
    return this.hideNodesContaining.map(x=> new RegExp(x).test(id)).filter(x=>x==true).length > 0 ? false : true
}

Graph.prototype.getParentNodes = function(find) {
    let graph=this
    let allNodes_list=[graph.nodes[find].id]
    function allNodes(node){
        for(let key in node.parent_nodes){
            if (graph.visible(node.parent_nodes[key].id)) allNodes_list.push(node.parent_nodes[key].id)
            if (node.parent_nodes[key].parent_nodes!=null){
                allNodes(node.parent_nodes[key])
            }
        }
    }

    allNodes(this.nodes[find])

    return allNodes_list
}

Graph.prototype.getChildrenNodes = function(find) {
    let graph=this
     let allNodes_list=[this.nodes[find].id]
    function allNodes(node){
        for(let key in node.child_nodes){
            if (graph.visible(node.child_nodes[key].id)) allNodes_list.push(node.child_nodes[key].id)
            if (node.child_nodes[key].child_nodes!=null){
                allNodes(node.child_nodes[key])
            }
        }
    }

    allNodes(this.nodes[find])

    return allNodes_list
}

Graph.prototype.getReverseImpactAnalysisForKlay=function(find){
    let graph=this;
    let parent=graph.getParentNodes(find)

    let klayNodes=[]
    let klayLinks=[]

    function getParent(x,y){
        let helper={};

        function recursion(node){
           if (helper[node.id]) {
               return;
           }

            helper[node.id] = {}
            let parents=node.parent_nodes
            for(let parentKey in parents){
                let parentValue=parents[parentKey];
                // if(graph.visible(parentKey)){
                if(parent.indexOf(parentKey)!==-1){
                    helper[node.id][parentKey]=parentValue
                }
                else{
                    recursion(parentValue)
                    let grandparent=helper[parentKey]
                    for(let gid in grandparent){
                        helper[node.id][gid]=grandparent[gid]
                    }
                }
            }
        }
        
        recursion(x)

        let linkResults=[]
        let z=0;

             for(let i in helper[x.id]){
                 z++;
                 linkResults.push( {id:"l".concat(y,z),source:i, target:x.id} )
             }

        return linkResults;
        
    }

    let counter=0
    for(let p of parent){
        counter+=1;
        let pid=getParent(graph.nodes[p],counter)

        klayNodes.push({
            id:graph.nodes[p].id,
            width:graph.nodes[p].id.length*10,
            height:30,
            padding:{
                left:50,
                right:50,
                top:50,
                botton:50
            }
        })
        
        if (pid.length !=0) {
            for(let kl of pid){
                klayLinks.push( kl )
            }
        }
    }

    return {
        id:"root",
        children:klayNodes,
        edges:klayLinks,
        properties: Settings.klayProperties
    }

}

Graph.prototype.getForwardImpactAnalysisForKlay=function(find){
    let graph=this;
    let children=graph.getChildrenNodes(find)

    let klayNodes=[]
    let klayLinks=[]

    function getChildren(x,y){
        let helper={};

        function recursion(node){
           if (helper[node.id]) {
               return;
           }

            helper[node.id] = {}
            let childrens=node.child_nodes
            for(let childrenKey in childrens){
                let childrenValue=childrens[childrenKey];
                // if(graph.visible(childrenKey)){
                if(children.indexOf(childrenKey) !==-1){
                    helper[node.id][childrenKey]=childrenValue
                }
                else{
                    recursion(childrenValue)
                    let grandchildren=helper[childrenKey]
                    for(let gid in grandchildren){
                        helper[node.id][gid]=grandchildren[gid]
                    }
                }
            }
        }
        
        recursion(x)

        let linkResults=[]
        let z=0;

             for(let i in helper[x.id]){
                z++;
                  linkResults.push({id:"l".concat(y,z),source:x.id, target:i})
             }


        return linkResults
        
    }

    let counter=0
    for(let p of children){
        counter+=1;
        let pid=getChildren(graph.nodes[p],counter)

        klayNodes.push({
            id:graph.nodes[p].id,
            width:graph.nodes[p].id.length*10,
            height:30,
            padding:{
                left:50,
                right:50,
                top:50,
                botton:50
            }
        })
        
        if (pid.length !=0) {
            for(let kl of pid){
                klayLinks.push( kl )
            }
        }
    }



    return {
        id:"root",
        children:klayNodes,
        edges:klayLinks,
        properties: Settings.klayProperties
    }

}

module.exports=Graph
