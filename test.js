const arr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

/**
 * 
 * @param {number[]} arr 
 * @param {number} page 
 */

// Job Offers returns 20 items at a time, provide a page value 
function paginate (arr, page){
    const items = 5
    
    
   return arr.slice(page ? page*items : 0, page ? items+ page*items : items)
}


export const chars = ['a','b', 'c', 'd', 'e', 'f', 'n', '1', '2', '3', '5', '6', 'h', 'j', 'l', 'q', 's', 't', 'v', "8", '9',]

let strig = "abcdewsuiyt98654j2fh"
/**
 * 
 * @param {string} str 
 */
function doubleCharCheck(str){
    for(let i = 0; i<str.length -1; i++){
        for(let j=0; j< str.length-i-1; j++){
            if(str[i] === str[j+1]){
                return false
            }
        }
    }

    return true
 }

 //console.log(doubleCharCheck("95fa692he5t6s56afvbh"))
/**
 * 
 * @param {string[]} chars 
 */

export function randStingGen(chars){
    let sum = ""

    for(let i=0 ; i< 20; i++){
        const char = Math.floor(Math.random()* chars.length);
        sum += chars[char]
    }
    
   return sum;
}


//console.log(randStingGen(strig), "test.js") 

//  function factorial (num){
//     if(num === 1){
//         return num
//     }else{
//         return num * factorial(num -1)
//     }
    
//  }

//  console.log(factorial(5))

//

 