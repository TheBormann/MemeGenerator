class Meme {
  // Enum for FileType
  static FileType = {
    IMAGE: "image",
    VIDEO: "video",
    GIF: "gif",
  };

  static PublishState = {
    PUBLIC: "public",
    ARCHIVED: "archived",
    PRIVATE: "private",
  };
  constructor(
    title,
    imageURL,
    author,
    description,
    textFields = [],
    pixelSize,
    fileTargetSize = 2_000_000, // 2 MB
    publishState = PublishState.PUBLIC,
    fileType = FileType.IMAGE,
    templateId,
  ) {
    this.title = title;
    this.imageURL = imageURL;
    this.author = author;
    this.description = description;
    this.textFields = textFields;
    this.pixelSize = pixelSize;
    this.fileTargetSize = fileTargetSize;
    this.publishState = publishState;
    this.fileType = fileType;
    this.templateId = templateId;
    this.createdAt = new Date();
    this.comments = [];
    this.likes = [];
    this.views = [];
  }
}

module.exports = Meme;
