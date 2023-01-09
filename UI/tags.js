class Tag{
    tagName;
    comments;
    constructor(map, position){
        this.map = map;
        this.position = position;
    }

    setName(tagName){
        this.tagName = tagName;
    }

    getName(){
        return this.tagName;
    }

}