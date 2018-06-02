import '../css/style.sass'
import '../css/loader.sass'
import {fileLoader, WekaFile} from "./file";
import {copyNode, Node} from "./primitives";
import {setNumbers} from "./log";
import CobWeb from "./cobweb";
import {View} from "./view";

const input = <HTMLElement>document.querySelector('input[type="file"]');
const numbersPlace = <HTMLElement>document.querySelector('#numbers');
const rootNode = <HTMLElement>document.querySelector('div.root');
const loader = <HTMLElement>document.querySelector('.sk-cube-grid');
let data;

stopLoader();

export function startLoader() {
    loader.classList.remove('hide');
}

export function stopLoader() {
    loader.classList.add('hide');
}

const f = fileLoader(input, (e) => {
    rootNode.innerHTML = '';
    if (View.instancesPlace){
        View.instancesPlace.innerHTML = '';
    }
    let data1 = e.target.result;
    main(data1).then(
        result => {rootNode.innerHTML = <string>result;     console.log('\nEnd main\n')},
        error => console.log(error)
    )
});

function main(data) {
    return new Promise(resolve => {
        const wekaFile = new WekaFile(data);
        const htmlArr = new Array<any>();
        setNumbers(wekaFile.getInfo(), numbersPlace);

        const allInstances = wekaFile.instances;
        let root = new Node();
        CobWeb.rootNode = root;
        for (let i = 0; i < allInstances.length; i++) {
            const instance = allInstances[i];
            root = CobWeb.eval(root, instance);
            CobWeb.rootNode = root;
            View.setRootNode(root);
            View.setInstances('#instancesPlace');
            htmlArr.push(View.getHTML(root, 100));
        }

        resolve(htmlArr.join(''));
    })
}

