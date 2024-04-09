class Template {
    constructor(name, author, isPublic, imagePath) {
        this.name = name;
        this.isPublic = isPublic;
        this.author = author;
        this.imagePath = imagePath;
    }
}

module.exports = Template;