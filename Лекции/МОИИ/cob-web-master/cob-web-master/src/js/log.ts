export function setNumbers(obj, numbersPlace: HTMLElement) {
    const keys = Object.keys(obj);
    numbersPlace.innerHTML = '';
    keys.forEach(k => {
        numbersPlace.innerHTML += `<div>${k}: ${obj[k]}</div>`
    })
}