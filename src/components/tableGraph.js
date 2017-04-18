import Settings from '../setting'

var Graph = function() {

    this.nodelist = []
    this.nodes = {};
    this.hideNodesContaining = []
        // this.hideNodesContaining=["WORK.","WORKSPDS."];
}

Graph.prototype.addNode = function(node) {
    this.nodelist.push(node);
    this.nodes[node.id] = node;
}

Graph.prototype.visible = function(id) {
    return this.hideNodesContaining.map(x => id.startsWith(x)).filter(x => x == true).length > 0 ? false : true
}

Graph.prototype.getParentNodes = function(find) {
    let graph = this

    function flatten(n) {
        function flat(f, acc) {
            if (f.length == 0) {
                return acc
            } else {
                let y = [];
                for (let i of f) {
                    if (acc.indexOf(i.id) != -1) continue
                    acc.push(i.id)
                    for (let j in i.parent_nodes) {
                        y.push(i.parent_nodes[j])
                    }
                }

                return flat(y, acc)
            }
        }
        return flat([n], [])
    }

    let allNodes_list = flatten(this.nodes[find])

    var uniqueallNodes_list = allNodes_list.filter(function(item, pos, self) {
        return self.indexOf(item) == pos && graph.visible(item);
    })

    return uniqueallNodes_list
}

Graph.prototype.getChildrenNodes = function(find) {
    let graph = this

    function flatten(n) {
        function flat(f, acc) {
            if (f.length == 0) {
                return acc
            } else {
                let y = [];
                for (let i of f) {
                    if (acc.indexOf(i.id) != -1) continue
                    acc.push(i.id)
                    for (let j in i.child_nodes) {
                        y.push(i.child_nodes[j])
                    }
                }

                return flat(y, acc)
            }
        }
        return flat([n], [])
    }

    let allNodes_list = flatten(this.nodes[find])

    var uniqueallNodes_list = allNodes_list.filter(function(item, pos, self) {
        return self.indexOf(item) == pos && graph.visible(item);
    })

    return uniqueallNodes_list
}

Graph.prototype.getReverseImpactAnalysisForKlay = function(find) {
    let graph = this;
    let parent = graph.getParentNodes(find)

    let klayNodes = []
    let klayLinks = []

    function getParent(x, y) {
        let helper = {};

        function recursion(node) {
            if (helper[node.id]) {
                return;
            }

            helper[node.id] = {}
            let parents = node.parent_nodes
            for (let parentKey in parents) {
                let parentValue = parents[parentKey];
                // if(graph.visible(parentKey)){
                if (parent.indexOf(parentKey) !== -1) {
                    helper[node.id][parentKey] = parentValue
                } else {
                    recursion(parentValue)
                    let grandparent = helper[parentKey]
                    for (let gid in grandparent) {
                        helper[node.id][gid] = grandparent[gid]
                    }
                }
            }
        }

        recursion(x)

        let linkResults = []
        let z = 0;

        for (let i in helper[x.id]) {
            z++;
            let _i = i.startsWith("WORK.") ? i.split("|")[0] : i
            let _x = x.id.startsWith("WORK.") ? x.id.split("|")[0] : x.id

            linkResults.push({ id: "l".concat(y, z), source: _i, target: _x })
        }

        return linkResults;

    }

    let counter = 0
    let _tempnodes=[]
    let _templinks=[]

    for (let p of parent) {
        counter += 1;
        let pid = getParent(graph.nodes[p], counter)
        let nodeOfInterest = graph.nodes[p].id.startsWith("WORK.") ? graph.nodes[p].id.split("|")[0] : graph.nodes[p].id

        if (_tempnodes.indexOf(nodeOfInterest)==-1){

            _tempnodes.push(nodeOfInterest)

            klayNodes.push({
                id: nodeOfInterest,
                width: nodeOfInterest.length * 10,
                height: 30,
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    botton: 50
                }
            })

        }


        if (pid.length != 0) {
            for (let kl of pid) {

                if(_templinks.indexOf(kl.source+'|'+kl.target)==-1){

                    _templinks.push(kl.source+'|'+kl.target)
                    klayLinks.push(kl)

                }
                
            }
        }
    }

    return {
        id: "root",
        children: klayNodes,
        edges: klayLinks,
        properties: Settings.klayProperties
    }

}

Graph.prototype.getForwardImpactAnalysisForKlay = function(find) {
    let graph = this;
    let children = graph.getChildrenNodes(find)

    let klayNodes = []
    let klayLinks = []

    function getChildren(x, y) {
        let helper = {};

        function recursion(node) {
            if (helper[node.id]) {
                return;
            }

            helper[node.id] = {}
            let childrens = node.child_nodes
            for (let childrenKey in childrens) {
                let childrenValue = childrens[childrenKey];
                // if(graph.visible(childrenKey)){
                if (children.indexOf(childrenKey) !== -1) {
                    helper[node.id][childrenKey] = childrenValue
                } else {
                    recursion(childrenValue)
                    let grandchildren = helper[childrenKey]
                    for (let gid in grandchildren) {
                        helper[node.id][gid] = grandchildren[gid]
                    }
                }
            }
        }

        recursion(x)

        let linkResults = []
        let z = 0;

        for (let i in helper[x.id]) {
            z++;
            let _i = i.startsWith("WORK.") ? i.split("|")[0] : i
            let _x = x.id.startsWith("WORK.") ? x.id.split("|")[0] : x.id

            linkResults.push({ id: "l".concat(y, z), source: _x, target: _i })
        }


        return linkResults

    }

    let counter = 0
    let _tempnodes=[]
    let _templinks=[]

    for (let p of children) {
        counter += 1;
        let pid = getChildren(graph.nodes[p], counter)
        let nodeOfInterest = graph.nodes[p].id.startsWith("WORK.") ? graph.nodes[p].id.split("|")[0] : graph.nodes[p].id

        if (_tempnodes.indexOf(nodeOfInterest)==-1){

            _tempnodes.push(nodeOfInterest)

            klayNodes.push({
                // id: graph.nodes[p].id,
                id: nodeOfInterest,
                width: nodeOfInterest.length * 10,
                height: 30,
                padding: {
                    left: 50,
                    right: 50,
                    top: 50,
                    botton: 50
                }
            })

        }


        if (pid.length != 0) {
            for (let kl of pid) {
                if (_templinks.indexOf(kl.source+'|'+kl.target)==-1){
                    _templinks.push(kl.source+'|'+kl.target)
                    klayLinks.push(kl)
                }
            }
        }
    }



    return {
        id: "root",
        children: klayNodes,
        edges: klayLinks,
        properties: Settings.klayProperties
    }

}

module.exports = Graph
