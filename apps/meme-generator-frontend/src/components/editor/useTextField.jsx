import { useState, } from 'react';

export function useTextAreas(initialTextAreas) {
    const [textAreas, setTextAreas] = useState(initialTextAreas);

    const addTextArea = (text) => {
      const newTextArea = {
        text:  text ?? '',
        position: { x: 50, y: 50 },
        size: { width: 200, height: 100 },
        font: 'Impact',
        color: '#ffffff',
        secondaryColor: '#000000',
        fontSize: 24,
        textEffect: 'shadow',
        isCapitalized: true,
        isItalic: false,
        isBold: false,
      };
      setTextAreas(currentTextAreas => [...currentTextAreas, newTextArea]);
    };

    const insertTextArea = (textArea) => {
        setTextAreas(currentTextAreas => [...currentTextAreas, textArea]);
    };
  
    const updateTextArea = (index, updatedProperties) => {
      setTextAreas(currentTextAreas =>
        currentTextAreas.map((textArea, i) =>
          i === index ? { ...textArea, ...updatedProperties } : textArea
        )
      );
    };
  
    const handleTextChange = (event, index) => {
      updateTextArea(index, { text: event.target.value });
    };
  
    const handleFontChange = (event, index) => {
      updateTextArea(index, { font: event.target.value });
    };
  
    // Similar pattern for other handlers
    const handleColorChange = (event, index) => {
      updateTextArea(index, { color: event.target.value });
    };
  
    const handleSecondaryColorChange = (event, index) => {
      updateTextArea(index, { secondaryColor: event.target.value });
    };
  
    const handleTextEffectChange = (event, index) => {
      updateTextArea(index, { textEffect: event.target.value });
    };
  
    const handleSizeChange = (event, index) => {
      updateTextArea(index, { fontSize: event.target.value });
    };
  
    const handleItalicChange = (event, index) => {
      updateTextArea(index, { isItalic: event.target.checked });
    };
  
    const handleBoldChange = (event, index) => {
      updateTextArea(index, { isBold: event.target.checked });
    };
  
    const handleCapitalizeChange = (event, index) => {
      updateTextArea(index, { isCapitalized: event.target.checked });
    };

    const removeTextArea = (index) => {
        setTextAreas(currentTextAreas => {
            const updatedTextAreas = [...currentTextAreas];
            updatedTextAreas.splice(index, 1);
            return updatedTextAreas;
        });
    };

    const handleDragAndResize = (index, updatedPosition, updatedSize) => {
    setTextAreas(currentTextAreas => {
        const updatedTextAreas = [...currentTextAreas];
        if (updatedPosition) {
        updatedTextAreas[index].position = updatedPosition;
        }
        if (updatedSize) {
        updatedTextAreas[index].size = updatedSize;
        }
        return updatedTextAreas;
    });
    };

    const clearTextAreas = () => {
    setTextAreas([]);
    };

  
    return {
      textAreas,
      addTextArea,
      insertTextArea,
      updateTextArea,
      handleTextChange,
      handleFontChange,
      handleColorChange,
      handleSecondaryColorChange,
      handleTextEffectChange,
      handleSizeChange,
      handleItalicChange,
      handleBoldChange,
      handleCapitalizeChange,
      removeTextArea,
      handleDragAndResize,
      clearTextAreas
    };
}