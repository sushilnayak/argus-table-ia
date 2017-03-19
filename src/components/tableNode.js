var Node = function(id) {
    this.id = id;
    this.child_nodes  = {};
    this.parent_nodes = {};
}

Node.prototype.addChild = function(child) {
    this.child_nodes[child.id] = child;
}

Node.prototype.addParent = function(parent) {
    this.parent_nodes[parent.id] = parent;
}
// Get all Parent Nodes regardless of visibility
Node.prototype.getAllParentNodes=function(){
    let allNodes_list=[this.id]
    function allNodes(node){
        for(let key in node.parent_nodes){
            allNodes_list.push(node.parent_nodes[key].id)
            if (node.parent_nodes[key].parent_nodes!=null){
                allNodes(node.parent_nodes[key])
            }
        }
    }

    allNodes(this)

    return allNodes_list
}

// Get all Children Nodes regardless of visibility
Node.prototype.getAllChildrenNodes=function(){
    let allNodes_list=[this.id]
    function allNodes(node){
        for(let key in node.child_nodes){
            allNodes_list.push(node.child_nodes[key].id)
            if (node.child_nodes[key].child_nodes!=null){
                allNodes(node.child_nodes[key])
            }
        }
    }

    allNodes(this)

    return allNodes_list
}


// Node.prototype.getVisibleParentNodes = function() {   
//     let allNodes_list=[this.id]
//     function allNodes(node){
//         for(let key in node.parent_nodes){
//             if (node.parent_nodes[key].visible()) allNodes_list.push(node.parent_nodes[key].id)
//             if (node.parent_nodes[key].parent_nodes!=null){
//                 allNodes(node.parent_nodes[key])
//             }
//         }
//     }

//     allNodes(this)

//     return allNodes_list
// }

// Node.prototype.getVisibleChildrenNodes = function() {   
//     let allNodes_list=[this.id]
//     function allNodes(node){
//         for(let key in node.child_nodes){
//             if (node.child_nodes[key].visible()) allNodes_list.push(node.child_nodes[key].id)
//             if (node.child_nodes[key].child_nodes!=null){
//                 allNodes(node.child_nodes[key])
//             }
//         }
//     }

//     allNodes(this)

//     return allNodes_list
// }

// Node.prototype.getAllChildrenSourceTarget

module.exports=Node