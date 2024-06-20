for(let i = 0; i < 10; i++){
    if(i % 2 == 0){ // se o resto da divisão por dois é zero
        console.log(i);
    }
}
//== igual
//!= diferente

/*
escreva os numeros de 1 até 30 e a cada 5 números escrevar (===========)
*/ 
let contador = 0;

for(let i = 1; i <= 30; i++){
    console.log(i);
    contador++;
    if(contador === 5){
        console.log("=====================");
        contador = 0;
    }
}

let contadorWhile = 0;

while(contadorWhile < 10){
    console.log("Olá sou while " + contadorWhile);
    contadorWhile++;
}

do {
    console.log("Olá sou DO while " + contadorWhile);
    contadorWhile++;
} while (contadorWhile < 10);


