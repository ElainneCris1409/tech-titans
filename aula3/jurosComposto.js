/*
tenho 250 euros em uma conta que rende 0.5 % ao mes.

faca um algoritmo que mostre o valor total com o rendimento em 2 anos

*/ 

let montante = 250;
let rendimento = 0.5;
let meses = 24;

let result = 250;

for(let i = 1; i <= meses; i++){
    result = result * (1 + (rendimento /100)); 
    console.log(result);
}

