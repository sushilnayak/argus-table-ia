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

    const flatten = (deep, flat = []) => {
        if (deep.length == 0) return flat;
        let [head, ...tail] = deep
        if (head.parent_nodes != undefined || head.parent_nodes != null) tail = Object.keys(head.parent_nodes).map(x => head.parent_nodes[x]).concat(tail)
        return flatten(tail, flat.concat(head.id))
    }

    return flatten([this])


    // function counter(n, acc = 0) {
    //   var _repeat = true;

    //   var _n, _acc;

    //   while (_repeat) {
    //     _repeat = false;

    //     if (n === 0) {
    //       return acc;
    //     } else {
    //       _n = n - 1
    //       _acc = acc + 1
    //       n = _n
    //       acc = _acc
    //       _repeat = true;
    //       continue;
    //     }
    //   }
    // }
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
