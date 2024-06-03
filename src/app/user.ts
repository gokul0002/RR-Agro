export class User{
    constructor(public email:string,public localId:string, private tokenId:string,private expiresDate:Date){}

    get Token(){
        return this.tokenId
    }
}