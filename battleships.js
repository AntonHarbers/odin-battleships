class Ship{
    constructor(name, length){
        this.name = name,
        this.length = length,
        this.hits = 0,
        this.sunk = false
    }

    hit(){
        this.hits++;
    }

    isSunk(){
        if(this.hits == this.length){
            this.sunk = true;
        }
    }
}

class Gameboard{

}

class Player{

}

console.log("Works!");

export { Ship, Gameboard, Player };