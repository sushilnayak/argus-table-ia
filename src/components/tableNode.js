var Node = function(id) {
    this.id = id;
    this.child_nodes = {};
    this.parent_nodes = {};
}

Node.prototype.addChild = function(child) {
    this.child_nodes[child.id] = child;
}

Node.prototype.addParent = function(parent) {
        this.parent_nodes[parent.id] = parent;
    }
    // Get all Parent Nodes regardless of visibility
Node.prototype.getAllParentNodes = function() {

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

    return flatten(this)
}

// Get all Children Nodes regardless of visibility
Node.prototype.getAllChildrenNodes = function() {

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

    return flatten(this)

}

module.exports = Node
