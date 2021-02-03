let arr = [12,24,42,51,0,72,27,35,44,54,61,42,48,56,66,78]
let arr2 = [
    [0, 12,24,0,42,51,0,72,0],
    [0 ,0,27,35,44,54,61,0,0],
    [0 ,0,0,42,48,56,66,78,0]
]
let finArr = [...arr2[0], ...arr2[1], ...arr2[2]]
console.log(finArr)
// console.log(

// arr2.every(item => {
//     if(item > 0){
//         return arr.includes(item)
//     }
    
// })

// )

function check(arr1, arr2){
    let finArr = arr2
    if(arr2.length === 3){
        finArr = [...arr2[0], ...arr2[1], ...arr2[2]]
    }
    console.log(finArr)
    let result = false
    for(let i=0; i < finArr.length; i++){
        if(finArr[i]>0){
            if(arr1.includes(finArr[i])){
                result = true
            }else{
                result = false
            }
        }
    }

    return result
}

console.log(check(arr, arr2))