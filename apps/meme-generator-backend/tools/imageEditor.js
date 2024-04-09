//Input: An image buffer & Meme configuration, including text, position (x, y), and font size.
//Output: Promise, when the Promise resolves successfully, the modified image buffer is returned.
import Jimp from "jimp";

export default class ImageEditor {
  constructor(buffer) {
    this.buffer = buffer; // image buffer
  }

  static supportedFontSizes = [8, 10, 12, 14, 16, 32, 64, 128]; //check what the minimum and maximum are that melvin implemented

  async addCaptionsToBuffer(memeConfig) {
    return new Promise(async (resolve, _) => {
      Jimp.read(this.buffer)
        .then((img) => {
          let promiseArray = [];
          memeConfig.textAreas.forEach(async (config) => {
            promiseArray.push(
              new Promise((resolve, _) => {
                const fontSize = this.getFontSize(config.fontSize);
                const fontColor = this.hexToRgb(config.color);
                const outlineColor = this.hexToRgb(config.secondaryColor);

                Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then((font) => {
                  // Adjust font size, color, and other properties based on config
                  font = font.clone();
                  font.size = fontSize;
                  font.color = fontColor;
                  font.outline = {
                    size: 1,
                    color: outlineColor,
                  };

                  // Apply text options to the image
                  img.print(font, config.position.x, config.position.y, {
                    text: config.text,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                  });
                  resolve();
                });
              })
            );
          });
          return Promise.all(promiseArray).then(() => {
            return img;
          });
        })
        .then((jimp) => {
          jimp.getBufferAsync(Jimp.MIME_JPEG).then((image) => {
            resolve(image);
          });
        });
    });
  }

  getSupportedFontSize(providedSize) {
    if (ImageEditor.supportedFontSizes.includes(providedSize)) {
      return providedSize;
    } else {
      return 32;
    }
  }

  hexToRgb(hex) {
    // Convert hex color to RGB format
    hex = hex.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }
}
