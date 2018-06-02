webpackJsonp([0],[
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./src/css/style.sass
var style = __webpack_require__(1);
var style_default = /*#__PURE__*/__webpack_require__.n(style);

// EXTERNAL MODULE: ./src/css/loader.sass
var loader = __webpack_require__(2);
var loader_default = /*#__PURE__*/__webpack_require__.n(loader);

// CONCATENATED MODULE: ./src/js/primitives.ts
var operations;
(function (operations) {
    operations[operations["currentCat"] = 0] = "currentCat";
    operations[operations["newCat"] = 1] = "newCat";
    operations[operations["mergeCat"] = 2] = "mergeCat";
    operations[operations["splitCat"] = 3] = "splitCat";
})(operations || (operations = {}));
class Attribute {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}
class Instance {
    constructor(attributes) {
        this.attributes = attributes;
    }
}
class Leaf {
}
class Node extends Leaf {
    constructor() {
        super();
        this.child = new Array();
        this.instances = new Array();
        this.id = 0;
    }
}
function isNode(node) {
    return node.child.length > 1;
}
class MethodOfCategory {
}
function isLeaf(node) {
    return node.child.length <= 1;
}
function copyInstances(inst) {
    return new Array(...inst);
}
function copyNode(node, inDepth = true) {
    const newNode = new Node();
    newNode.id = node.id;
    newNode.cu = node.cu;
    newNode.instances = copyInstances(node.instances);
    if (inDepth) {
        node.child.forEach(c => {
            newNode.child.push(copyNode(c));
        });
    }
    return newNode;
}
function copyChild(child) {
    const newChild = new Array();
    child.forEach(c => {
        newChild.push(copyNode(c));
    });
    return newChild;
}

// CONCATENATED MODULE: ./src/js/file.ts


function fileLoader(inputFile, callBack) {
    inputFile.onchange = (e) => {
        // startLoader();
        parseFiles(e.target.files).then(() => {
            stopLoader();
        });
    };
    function parseFiles(fileList) {
        return new Promise(resolve => {
            const file = fileList[0];
            const fileReader = new FileReader();
            fileReader.onload = function (e) {
                startLoader();
                callBack(e);
                resolve();
            };
            fileReader.readAsText(file);
        });
    }
}
class file_WekaFile {
    constructor(data) {
        this.parseToWekaFile(data);
    }
    parseToWekaFile(str) {
        const lines = str.split('\n');
        const titleLine = this.findLine(lines, /(title)/i);
        const attributeLines = this.findLine(lines, /(@attribute)/i);
        const dataLines = this.findLine(lines, /^[^%@]/);
        this.setTitle(titleLine[0]);
        this.setAttributes(attributeLines);
        this.setData(dataLines);
    }
    getInfo() {
        return {
            'Title': this.Title,
            ['Number of instances']: this.Number_of_Instances,
            ['Number of attributes']: this.Number_of_Attributes
        };
    }
    findLine(arr, findReg) {
        let result = new Array();
        arr.forEach((item) => {
            if (findReg.test(item)) {
                result.push(item);
            }
        });
        return result;
    }
    setData(arr) {
        this.instances = new Array();
        arr.forEach(line => {
            let lineArr = line.split(',').map(a => {
                return isNaN(+a) ? a.replace(/'/g, '') : (+a);
            });
            const arr = lineArr.map((attrV, index) => {
                return new Attribute(this.attribute[index], attrV);
            });
            this.instances.push(new Instance(arr));
        });
        this.Number_of_Instances = this.instances.length;
    }
    setAttributes(arr) {
        this.attribute = new Array();
        arr.forEach(line => {
            let cleanLine = line.match(/( '.*' )/) || [line.split(/\s/)[1]];
            let cleanLine1 = cleanLine !== null ? cleanLine[0].replace(/[\s']/g, '') : null;
            if (cleanLine1 !== null) {
                this.attribute.push(cleanLine1);
            }
        });
        this.Number_of_Attributes = this.attribute.length;
    }
    setTitle(title) {
        this.Title = title ? title.split(':')[1] : '';
    }
}

// CONCATENATED MODULE: ./src/js/log.ts
function setNumbers(obj, numbersPlace) {
    const keys = Object.keys(obj);
    numbersPlace.innerHTML = '';
    keys.forEach(k => {
        numbersPlace.innerHTML += `<div>${k}: ${obj[k]}</div>`;
    });
}

// CONCATENATED MODULE: ./src/js/cobweb.ts

const log = document.querySelector('#map');
class cobweb_CobWeb {
    static eval(node, obj) {
        if (isLeaf(node)) {
            if (node.instances.length === 0) {
                node.instances.push(obj);
            }
            else { // добавление новых двух Node
                const nodeLast = copyNode(node, false);
                nodeLast.id = getLastNodeId(cobweb_CobWeb.rootNode) + 1;
                const nodeNew = new Node();
                nodeNew.instances.push(obj);
                nodeNew.id = nodeLast.id + 1;
                node.child.push(nodeLast, nodeNew);
                node.instances.push(obj);
            }
        }
        else if (isNode(node)) {
            node.instances.push(obj);
            const cloneNode = copyNode(node), nodeChilds = cloneNode.child, cu = new MethodOfCategory();
            cu.bestCategory = cobweb_CobWeb.S1(nodeChilds, obj);
            cu.newCategory = cobweb_CobWeb.S3(nodeChilds, obj, cloneNode.id);
            cu.mergeCategory = cobweb_CobWeb.S4(nodeChilds, obj);
            cu.splitCategory = cobweb_CobWeb.S5(nodeChilds, obj);
            switch (bestMethodOfCat(cu)) {
                case operations.currentCat: {
                    const selectedNodeId = cu.bestCategory.nodeId;
                    const bestNode = cloneNode.child.filter(c => c.id === selectedNodeId)[0];
                    bestNode.instances.push(obj);
                    bestNode.cu = cu.bestCategory.cu;
                    // CobWeb.eval(<Node>bestNode, obj);
                    break;
                }
                case operations.newCat: {
                    const newNode = new Node(), lastId = getLastNodeId(node);
                    newNode.id = lastId + 1;
                    newNode.instances.push(obj);
                    newNode.cu = cu.newCategory.cu;
                    nodeChilds.push(newNode);
                    break;
                }
                case operations.mergeCat: {
                    const cloneChild2 = copyNode(cloneNode);
                    const newNode = new Node(), fNode = cloneChild2.child.find(c => c.id === cu.mergeCategory.nodeId), sNode = cloneChild2.child.find(c => c.id === cu.mergeCategory.nextNodeId);
                    cloneNode.child = cloneNode.child.filter(c => c.id !== fNode.id && c.id !== sNode.id);
                    ++fNode.id;
                    ++sNode.id;
                    newNode.id = cu.mergeCategory.nodeId;
                    newNode.child.push(fNode, sNode);
                    newNode.instances.push(...fNode.instances, ...sNode.instances);
                    const n = cobweb_CobWeb.eval(newNode, obj);
                    cloneNode.child.push(newNode);
                    break;
                }
                case operations.splitCat: {
                    const cloneChild2 = copyNode(cloneNode);
                    const nodeForSplit = cloneNode.child.find(c => c.id === cu.splitCategory.nodeId);
                    cloneNode.child = cloneNode.child.filter(c => c.id !== cu.splitCategory.nodeId);
                    cloneNode.child.push(...nodeForSplit.child);
                    cobweb_CobWeb.eval(cloneNode, obj);
                    break;
                }
            }
            node = cloneNode;
        }
        return node;
    }
    static calcualteCU(selectedNode, nodes) {
        let sum = 0;
        for (let k = 0; k < nodes.length; k++) {
            const nodeInstances = nodes[k].instances;
            const attributes = nodeInstances[0].attributes;
            for (let j = 0; j < attributes.length; j++) {
                for (let i = 0; i < nodeInstances.length; i++) {
                    const vij = nodeInstances[i].attributes[j];
                    const c = calc(vij, nodes, selectedNode.id);
                    sum += c;
                }
            }
        }
        return sum;
    }
    static S1(nodeChilds, obj, showR = true) {
        const cloneChild = copyChild(nodeChilds), cu = new Array();
        if (obj !== null) {
            for (let i = 0; i < cloneChild.length; i++) { // добавление нового экземпляра для всех Node
                cloneChild[i].instances.push(obj);
            }
        }
        const copyObj = obj;
        for (let i = 0; i < cloneChild.length; i++) { // вычисление полезности веток
            if (copyObj !== null) {
                log.innerHTML += showR ? `<hr> Instance: ${(copyObj.attributes.reduce((c, n, currentIndex, array) => {
                    return c += `${n.name} : ${n.value}${array.length - 1 === currentIndex ? '' : ','} `;
                }, '{') + '}')}</br>` : '';
            }
            const res = cobweb_CobWeb.calcualteCU(cloneChild[i], cloneChild);
            log.innerHTML += showR ? `Result: ${res} </br></br>` : '';
            cu.push(res);
        }
        const maxCu = Math.max(...cu), nodeIdOfMaxCu = cloneChild[cu.indexOf(maxCu)].id;
        return {
            cu: maxCu,
            nodeId: nodeIdOfMaxCu,
            operation: operations.currentCat
        };
    }
    static S3(nodeChilds, obj, nodeId) {
        const cloneChild = copyChild(nodeChilds), newNode = new Node();
        const id = Math.max(...cloneChild.map(c => c.id));
        newNode.id = id + 1;
        newNode.instances = copyInstances(new Array(obj));
        cloneChild.push(newNode);
        const cu = cobweb_CobWeb.S1(cloneChild, null, false);
        if (cu.nodeId !== newNode.id) {
            cu.cu = 0;
        }
        return {
            cu: cu.cu,
            nodeId: cu.nodeId,
            operation: operations.newCat
        };
    }
    static S4(nodeChilds, obj) {
        const cloneChild = copyChild(nodeChilds);
        let max = {
            cu: 0
        }, lastNodeId = 0;
        for (let i = 0; i < cloneChild.length; i++) {
            for (let j = 0; j < cloneChild.length; j++) {
                if (i !== j && i < j) {
                    const cloneChild2 = copyChild(nodeChilds);
                    const mergedNode = new Node();
                    mergedNode.instances.push(...cloneChild2[j].instances, ...cloneChild2[i].instances, obj);
                    mergedNode.id = cloneChild2[i].id;
                    ++cloneChild2[j].id;
                    ++cloneChild2[i].id;
                    mergedNode.child.push(cloneChild2[j], cloneChild2[i]);
                    cloneChild2.splice(j);
                    cloneChild2.splice(i);
                    cloneChild2.push(mergedNode);
                    let cu = cobweb_CobWeb.S1(cloneChild2, null);
                    if (cu.cu > max.cu) {
                        max = cu;
                        lastNodeId = cloneChild[j].id;
                    }
                }
            }
        }
        return {
            cu: 0,
            nodeId: max.nodeId,
            nextNodeId: lastNodeId,
            operation: operations.mergeCat
        };
    }
    static S5(nodeChilds, obj) {
        const cloneChild = copyChild(nodeChilds);
        let max = {
            cu: 0
        }, splitNodeId;
        for (let i = 0; i < cloneChild.length; i++) {
            const child = cloneChild[i];
            if (child.child.length > 1) {
                const c = copyChild(cloneChild).filter(c => c.id !== child.id);
                c.push(...child.child);
                const cu = cobweb_CobWeb.S1(c, obj);
                if (cu.cu > max.cu) {
                    max = cu;
                    splitNodeId = child.id;
                }
            }
        }
        return {
            cu: 0,
            nodeId: splitNodeId,
            operation: operations.splitCat
        };
    }
}
function getLastNodeId(node) {
    let lastNode = node.id;
    node.child.forEach(c => {
        if (isNode(c)) {
            lastNode = getLastNodeId(c);
        }
        else {
            lastNode = c.id;
        }
    });
    return lastNode;
}
function bestMethodOfCat(x) {
    const methods = new Array();
    methods.push([x.bestCategory.operation, x.bestCategory.cu]);
    methods.push([x.newCategory.operation, x.newCategory.cu]);
    methods.push([x.mergeCategory.operation, x.mergeCategory.cu]);
    methods.push([x.splitCategory.operation, x.splitCategory.cu]);
    const maxV = methods.sort((a, b) => {
        return a[1] > b[1] ? 0 : 1;
    });
    return maxV[0][0];
}
function bestMethodOfCatCU(x) {
    const methods = new Array();
    methods.push([x.bestCategory.operation, x.bestCategory.cu]);
    methods.push([x.newCategory.operation, x.newCategory.cu]);
    methods.push([x.mergeCategory.operation, x.mergeCategory.cu]);
    methods.push([x.splitCategory.operation, x.splitCategory.cu]);
    const maxV = methods.sort((a, b) => {
        return a[1] > b[1] ? 0 : 1;
    });
    return maxV[0][1];
}
function calc(searchAttribute, nodes, nodeId) {
    let pAV = 0, pAVC = 0, pCAV = 0;
    let countAV1 = 0, countAV2 = 0;
    let countAVC1 = 0, countAVC2 = nodes.filter((node) => node.id === nodeId)[0].instances.length;
    let countCVA1 = 0, countCVA2 = 0;
    for (let k = 0; k < nodes.length; ++k) {
        const currentNode = nodes[k];
        const nodeInstances = currentNode.instances;
        countAV2 += nodeInstances.length;
        for (let j = 0; j < nodeInstances.length; j++) {
            for (let i = 0; i < nodeInstances[j].attributes.length; i++) {
                const Attribute = nodeInstances[j].attributes[i];
                if (Attribute.value === searchAttribute.value && Attribute.name === searchAttribute.name) {
                    if (currentNode.id === nodeId) {
                        countCVA1++;
                    }
                    countAVC1++;
                    countCVA2++;
                    countAV1++;
                }
            }
        }
    }
    pAV = countAV1 / countAV2;
    pAVC = countAVC1 / countAVC2;
    pCAV = countCVA1 / countCVA2;
    const result = +(pAV * pAVC * pCAV).toFixed(3);
    log.innerHTML += `<b>C${nodeId}; ${searchAttribute.name}; ${searchAttribute.value}</b> </br>`;
    log.innerHTML += `P(A=v) ${pAV.toFixed(3)} </br> P(A=v|C) ${pAVC.toFixed(3)} </br>
 P=(C|A=v) ${pCAV.toFixed(3)} </br>`;
    log.innerHTML += `Sum: <i>${result.toFixed(3)}</i> </br>`;
    return result;
}

// CONCATENATED MODULE: ./src/js/view.ts
class View {
    static setRootNode(root) {
        View.rootNode = root;
    }
    static getHTML(node, nodeWidth) {
        const nodeMargin = 12, nodeChildLength = View.countNodeChild(node);
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
            return pr + View.getHTML(cr, nodeWidth);
        }, '') : ''}
            </div>
        </div>
        `;
        return html;
    }
    static countNodeChild(node) {
        let count = node.child.length;
        node.child.forEach(c => {
            count += View.countNodeChild(c);
        });
        return count;
    }
    static setInstances(selector) {
        const el = document.querySelector(selector);
        View.instancesPlace = el;
    }
    static setInstData(arr) {
        const html = View.instancesPlace;
        let innerHtml = '';
        arr.forEach((item, itemIndex) => {
            innerHtml += `
                ${!itemIndex ? ('<tr><td>№</td>' + item.attributes.reduce((pr, cr) => {
                return pr + `<td>${cr.name}</td>`;
            }, '') + '</tr>') : ''}
                <tr>
                    <td>${itemIndex + 1}</td>
                    ${item.attributes.reduce((pr, cr) => {
                return pr + `<td>${cr.value}</td>`;
            }, '')}
                </tr>
                
            `;
        });
        html.innerHTML = `<table border="1">${innerHtml}</table>`;
        View.instancesPlace = html;
    }
}
View.defNodeWidth = 100;
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
function getInstances(e) {
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
function _getInstances(nodeId, rootNode) {
    let instances;
    if (nodeId !== rootNode.id) {
        rootNode.child.forEach(c => {
            if (typeof instances === "undefined") {
                instances = _getInstances(nodeId, c);
            }
        });
    }
    else {
        instances = rootNode.instances;
    }
    return instances;
}

// CONCATENATED MODULE: ./src/js/main.ts
/* harmony export (immutable) */ __webpack_exports__["startLoader"] = startLoader;
/* harmony export (immutable) */ __webpack_exports__["stopLoader"] = stopLoader;







const input = document.querySelector('input[type="file"]');
const numbersPlace = document.querySelector('#numbers');
const rootNode = document.querySelector('div.root');
const main_loader = document.querySelector('.sk-cube-grid');
let main_data;
stopLoader();
function startLoader() {
    main_loader.classList.remove('hide');
}
function stopLoader() {
    main_loader.classList.add('hide');
}
const f = fileLoader(input, (e) => {
    rootNode.innerHTML = '';
    if (View.instancesPlace) {
        View.instancesPlace.innerHTML = '';
    }
    let data1 = e.target.result;
    main(data1).then(result => { rootNode.innerHTML = result; console.log('\nEnd main\n'); }, error => console.log(error));
});
function main(data) {
    return new Promise(resolve => {
        const wekaFile = new file_WekaFile(data);
        const htmlArr = new Array();
        setNumbers(wekaFile.getInfo(), numbersPlace);
        const allInstances = wekaFile.instances;
        let root = new Node();
        cobweb_CobWeb.rootNode = root;
        for (let i = 0; i < allInstances.length; i++) {
            const instance = allInstances[i];
            root = cobweb_CobWeb.eval(root, instance);
            cobweb_CobWeb.rootNode = root;
            View.setRootNode(root);
            View.setInstances('#instancesPlace');
            htmlArr.push(View.getHTML(root, 100));
        }
        resolve(htmlArr.join(''));
    });
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
],[0]);