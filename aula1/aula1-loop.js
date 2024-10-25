for(let i = 0; i < 10; i++){ // o (i) começa em 0, enquanto (i) for menor que 10, incrementa 1, quando ele for igual a 10 ele sai do loop.
    if(i % 2 == 0){ // se o resto da divisão por dois é zero
        console.log(i);
    }
}
/*
//== igual
//!= diferente


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

*/