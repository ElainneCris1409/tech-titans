let calculationAntonio = {
    "sum":"faz soma",
    "subtraction": "subtrai",
    "divide": function(x, y){
        console.log(x / y)
    }
}

console.log(calculationAntonio);

console.log(calculationAntonio.sum);
console.log(calculationAntonio.subtraction);

calculationAntonio["divide"](10,2);