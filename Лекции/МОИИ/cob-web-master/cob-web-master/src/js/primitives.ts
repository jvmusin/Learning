export interface BestWay {
    nodeId: number;
    cu: number;
    operation: operations
}

export interface BestWayMerge extends BestWay {
    nextNodeId: number;
}

export enum operations {
    currentCat, newCat, mergeCat, splitCat
}

export class Attribute {
    constructor(public name: string,
                public value: any) {
    }
}

export class Instance { // [ri, fe, ...]
    constructor(public attributes: Array<Attribute>) {
    }
}

export class Leaf {
    instances: Array<Instance>;
    cu: number;
    id: number;
}

export class Node extends Leaf {
    child: Array<Node | Leaf>;

    constructor() {
        super();
        this.child = new Array<Node | Leaf>();
        this.instances = new Array<Instance>();
        this.id = 0;
    }
}

export function isNode(node: Node): boolean {
    return node.child.length > 1;
}

export class MethodOfCategory {
    bestCategory: BestWay;
    newCategory: BestWay;
    mergeCategory: BestWayMerge;
    splitCategory: BestWay;
}


export function isLeaf(node: Node) {
    return node.child.length <= 1
}

export function copyInstances(inst: Array<Instance>): Array<Instance> {
    return new Array<Instance>(...inst);
}

export function copyNode(node: Node, inDepth = true): Node {
    const newNode = new Node();
    newNode.id = node.id;
    newNode.cu = node.cu;
    newNode.instances = copyInstances(node.instances);
    if (inDepth) {
        node.child.forEach(c => {
            newNode.child.push(copyNode(<Node>c))
        });
    }

    return newNode;
}

export function copyChild(child: Array<Node | Leaf>): Array<Node | Leaf> {
    const newChild = new Array<Node | Leaf>();
    child.forEach(c => {
        newChild.push(copyNode(<Node>c))
    });

    return newChild;
}