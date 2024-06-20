/*

*/ 
/*
Json com funcoes
*/ 
let calculationJson = {
    "SUM" : function(x, y){
        let result = x + y;
        return result;
    },
    "DIV": function (x, y){
        let result = x / y;
        return result;
    },
    "MULT": function (x, y){
        let result = x * y;
        return result;
    },
    "SUB": function (x, y){
        let result = x - y;
        return result;
    }
};

function calculation(x, y, op){
    return calculationJson[op](x, y);
}

console.log(calculation(50, 8, "DIV"));

/*
function sum(x, y){
    let result = x + y
    return result;
}

function divide(x, y){
    let result = x / y;
    return result;
}

function multiply(x, y){
    let result = x * y;
    return result;
}

function subtraction(x, y){
    let result = x - y;
    return result;
}*/

/*let resultSum = sum(10, 10)

console.log(resultSum)

let resultDivide = divide(20, 10)

console.log(resultDivide);*/




