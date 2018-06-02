import {Instance, Attribute} from "./primitives";
import {startLoader, stopLoader} from "./main";

export function fileLoader(inputFile: HTMLElement,
                           callBack: any) {

    inputFile.onchange = (e: HTMLInputEvent) => {
        // startLoader();
        parseFiles(<FileList>e.target.files).then(() => {
            stopLoader();
        })
    };

    function parseFiles(fileList: FileList) {
        return new Promise(resolve => {
            const file = fileList[0];
            const fileReader = new FileReader();

            fileReader.onload = function (e) {
                startLoader();

                callBack(e);
                resolve();
            };

            fileReader.readAsText(file);
        })
    }

}


export class WekaFile {
    public attribute: Array<string>;
    public instances: Array<Instance>;
    private Title: string;
    private Number_of_Instances: number;
    private Number_of_Attributes: number;

    constructor(data: string) {
        this.parseToWekaFile(data);
    }

    parseToWekaFile(str: string) {
        const lines = str.split('\n');

        const titleLine = this.findLine(lines, /(title)/i);
        const attributeLines = this.findLine(lines, /(@attribute)/i);
        const dataLines = this.findLine(lines, /^[^%@]/);

        this.setTitle(titleLine[0]);
        this.setAttributes(attributeLines);
        this.setData(dataLines);
    }

    getInfo(): WekaFileInfo {
        return <WekaFileInfo>{
            'Title': this.Title,
            ['Number of instances']: this.Number_of_Instances,
            ['Number of attributes']: this.Number_of_Attributes
        }
    }

    private findLine(arr: Array<string>, findReg: RegExp): Array<string> {
        let result = new Array<string>();
        arr.forEach((item) => {
            if (findReg.test(item)) {
                result.push(item);
            }
        });

        return result;
    }

    private setData(arr: Array<string>) {
        this.instances = new Array<Instance>()
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

    private setAttributes(arr: Array<string>) {
        this.attribute = new Array<string>()
        arr.forEach(line => {
            let cleanLine = <RegExpMatchArray>line.match(/( '.*' )/) || [line.split(/\s/)[1]];
            let cleanLine1 = cleanLine !== null ? cleanLine[0].replace(/[\s']/g, '') : null;
            if (cleanLine1 !== null) {
                this.attribute.push(cleanLine1);
            }
        });

        this.Number_of_Attributes = this.attribute.length;
    }

    private setTitle(title: string) {
        this.Title = title ? title.split(':')[1] : '';
    }

}

interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}

interface WekaFileInfo {
    Title: string;
    ['Number of instances']: number;
    ['Number of attributes']: number
}