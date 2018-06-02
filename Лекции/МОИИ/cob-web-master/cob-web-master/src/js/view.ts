import {Instance, Node} from "./primitives";

export class View {
    static defNodeWidth = 100;
    static rootNode: Node;

    static setRootNode(root: Node) {
        View.rootNode = root;
    }

    static getHTML(node: Node, nodeWidth): string {
        const nodeMargin = 12,
            nodeChildLength = View.countNodeChild(node);
        let html = `
        <div class="node" 
            id="${node.id}"
            onmouseover="selectNode(event, true)"
            onmouseout="selectNode(event, false)"
            style="width: ${nodeChildLength * nodeWidth + (node.child.length ? node.child.length + 2 : 0) * nodeMargin || View.defNodeWidth}px;margin: ${nodeMargin}px;z-index: ${node.id}">
            <div class="node-info">
                <b>Node id: ${node.id} ${node.cu ? ("(cu: " + node.cu.toFixed(3) + ")") : ''}</b>
                <span>Instances: ${node.instances.length}</span>
                <span>Child Nodes: ${node.child.length}</span>
            </div>
            <div class="node-child" >
                ${nodeChildLength ? node.child.reduce((pr, cr) => {
            return pr + View.getHTML(<Node>cr, nodeWidth);
        }, '') : ''}
            </div>
        </div>
        `;

        return html;
    }

    static countNodeChild(node: Node): number {
        let count = node.child.length;
        node.child.forEach(c => {
            count += View.countNodeChild(<Node>c);
        });
        return count;
    }

    static setInstances(selector: string) {
        const el = <HTMLElement>document.querySelector(selector);
        View.instancesPlace = el;
    }

    static setInstData(arr: Array<Instance>) {
        const html = View.instancesPlace;

        let innerHtml = '';

        arr.forEach((item, itemIndex) => {
            innerHtml += `
                ${!itemIndex ? ('<tr><td>№</td>' + item.attributes.reduce((pr, cr) => {
                return pr + `<td>${cr.name}</td>`
            }, '') + '</tr>') : ''}
                <tr>
                    <td>${itemIndex + 1}</td>
                    ${item.attributes.reduce((pr, cr) => {
                return pr + `<td>${cr.value}</td>`
            }, '')}
                </tr>
                
            `
        });

        html.innerHTML = `<table border="1">${innerHtml}</table>`;

        View.instancesPlace = html;

    }

    static instancesPlace: HTMLElement;
}

window['getInstances'] = getInstances;
window['View'] = View;
window['selectNode'] = selectNode;

function selectNode(e, hide) {
    let target = e.target;
    while (target != this) {
        if (target.id) {
            target.style.background = hide ? '#d7d7d7' : 'inherit';
            return;
        }
        target = target.parentNode;
    }
}

function getInstances(e): void {
    let target = e.target;
    while (target != this) {
        if (target.id) {
            const ins = _getInstances(+target.id, View.rootNode);
            View.setInstData(ins);
            return;
        }
        target = target.parentNode;
    }
}

function _getInstances(nodeId: number, rootNode: Node): Array<Instance> {
    let instances;
    if (nodeId !== rootNode.id) {
        rootNode.child.forEach(c => {
            if (typeof instances === "undefined") {
                instances = _getInstances(nodeId, <Node>c)
            }
        })
    } else {
        instances = rootNode.instances;
    }

    return instances;
}

