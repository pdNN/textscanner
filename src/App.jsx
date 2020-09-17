/* eslint-disable radix */
/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './css/min/global.min.css';
import './css/min/textscanner.min.css';

function App() {
  const textContainerRef = useRef(null);
  const [wordSelected, setWordSelected] = useState('-');
  const [textLine, setTextLine] = useState(null);
  const [paragraphNumber, setParagraphNumber] = useState(null);
  const [allTextLine, setAllTextLine] = useState(null);

  // split paragraph in words inside span
  const splitParagraphs = useCallback(() => {
    const { children } = textContainerRef.current;
    for (let i = 0; i < children.length; i++) {
      const obj = children[i];
      const html = obj.innerHTML.replace(/(\S+\s*)/g, `<span>$1</span>`);
      obj.innerHTML = html;
    }
  }, [textContainerRef]);

  // get clicked span content (word)
  const getWord = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount < 1) return true;

    const node = selection.anchorNode;
    if (!node) return true;

    setWordSelected(node.parentNode.innerHTML);
    return node.parentNode;
  };

  // get clicked span paragraph line
  function getWordLine(el) {
    let position = parseInt(el.offsetTop);
    let paragraphPosition = parseInt(el.parentElement.offsetTop);
    const style = window.getComputedStyle(el.parentElement, null);
    const paragraphLineHeight = parseInt(style.getPropertyValue('line-height'));
    const box_sizing = style.getPropertyValue('box-sizing');

    // remove padding and border from counting
    if (box_sizing === 'border-box') {
      const padding_top = parseInt(style.getPropertyValue('padding-top'));
      const padding_bottom = parseInt(style.getPropertyValue('padding-bottom'));
      const border_top = parseInt(style.getPropertyValue('border-top-width'));
      const border_bottom = parseInt(
        style.getPropertyValue('border-bottom-width'),
      );

      position =
        position - padding_top - padding_bottom - border_top - border_bottom;

      paragraphPosition =
        paragraphPosition -
        padding_top -
        padding_bottom -
        border_top -
        border_bottom;
    }

    const paragraphLine = parseInt(
      (position - paragraphPosition) / paragraphLineHeight + 1,
    );
    setTextLine(paragraphLine);
    return paragraphLine;
  }

  // count all the lines in a paragraph
  function countParagraphLines(paragraph) {
    const style = window.getComputedStyle(paragraph, null);
    let height = parseInt(style.getPropertyValue('height'));
    const font_size = parseInt(style.getPropertyValue('font-size'));
    let line_height = parseInt(style.getPropertyValue('line-height'));
    const box_sizing = style.getPropertyValue('box-sizing');

    if (!line_height) line_height = font_size * 1.2;

    if (box_sizing === 'border-box') {
      const padding_top = parseInt(style.getPropertyValue('padding-top'));
      const padding_bottom = parseInt(style.getPropertyValue('padding-bottom'));
      const border_top = parseInt(style.getPropertyValue('border-top-width'));
      const border_bottom = parseInt(
        style.getPropertyValue('border-bottom-width'),
      );
      height =
        height - padding_top - padding_bottom - border_top - border_bottom;
    }
    const lines = Math.ceil(height / line_height);
    return lines;
  }

  // get clicked hole text word line index
  function getAllLine(word, line, paragraph) {
    const paragraphContainer = word.parentElement.parentElement;
    const { children: paragraphs } = paragraphContainer;

    let lines = line;
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      if (i !== paragraph - 1) {
        lines += countParagraphLines(p);
      } else {
        break;
      }
    }
    setAllTextLine(lines);
  }

  // get the number of the paragraph clicked
  function getParagraph(el) {
    const paragraph = el.parentElement;
    const paragraphHolder = paragraph.parentElement;
    const paragraphs = paragraphHolder.children;

    for (let i = 0; i < paragraphs.length; i++) {
      const obj = paragraphs[i];
      if (obj === paragraph) {
        const paragraphNumberIndex = i + 1;
        setParagraphNumber(paragraphNumberIndex);
        return paragraphNumberIndex;
      }
    }
    return null;
  }

  // action of clicking paragraph
  const onClickParagraph = () => {
    const word = getWord();
    const line = getWordLine(word);
    const paragraph = getParagraph(word);
    getAllLine(word, line, paragraph);
  };

  // on page load, split every paragraph inside textContainerRef div
  useEffect(() => {
    splitParagraphs();
  }, [splitParagraphs]);

  return (
    <div className="App">
      <header>
        <h1>
          Click on any text word and the word will show here:{' '}
          <span>{wordSelected}</span>
        </h1>
      </header>
      <div
        onClick={() => {
          onClickParagraph();
        }}
        ref={textContainerRef}
        className="text-container"
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
          lectus sapien, semper ac mi in, tristique ullamcorper magna. Donec
          posuere justo et congue interdum. Cras dapibus volutpat nulla. Duis
          convallis volutpat nisi, at fringilla diam tempus at. Nunc consectetur
          arcu arcu, vel varius velit tempor at. Aliquam mattis tempus quam quis
          auctor. Ut a risus erat. Sed sodales purus in libero cursus, eget
          dictum lectus posuere. Etiam sollicitudin venenatis sapien
          sollicitudin luctus. Integer lectus erat, facilisis dignissim purus
          sit amet, accumsan ornare nisi. Interdum et malesuada fames ac ante
          ipsum primis in faucibus.
        </p>
        <p>
          Ut scelerisque nunc a massa iaculis, eu vehicula nisi convallis.
          Suspendisse ac viverra enim. Integer condimentum nulla sed nulla
          congue placerat. Duis dapibus et lectus nec consectetur. Etiam
          venenatis ultricies libero. Donec ornare sit amet justo et sodales. In
          placerat lacus eget metus interdum aliquam. Morbi non vulputate nulla.
          Cras lacinia ornare nisl, in tristique sem porta ac. Aliquam a
          vehicula nulla.
        </p>
        <p>
          Donec sed ante ultrices, ornare massa non, viverra tellus. Nulla
          scelerisque lacinia enim, ac sollicitudin massa placerat at. Etiam eu
          dapibus risus. Fusce sed elit mauris. Vivamus sit amet vestibulum leo,
          vitae pulvinar leo. Interdum et malesuada fames ac ante ipsum primis
          in faucibus. Nunc sapien dui, vulputate eu ex a, cursus accumsan arcu.
          Morbi eget eros augue. Suspendisse quis ornare quam, vel aliquam
          tellus. Duis lobortis enim quis leo egestas egestas. Morbi a nisl sit
          amet nisi ultricies condimentum eget et nulla. Cras eget congue
          lectus, non aliquet erat. Maecenas placerat nisl ut magna imperdiet
          bibendum.
        </p>
        <p>
          Donec rhoncus, odio at porta mollis, arcu enim condimentum dui, nec
          aliquet neque sem a urna. Proin hendrerit eleifend enim. Nulla varius,
          purus id congue porttitor, nisi mi ultricies odio, quis tincidunt
          turpis massa et purus. Nam interdum orci ut purus dapibus dapibus.
          Quisque et commodo ex. Vivamus et feugiat risus. Nunc at velit
          pretium, faucibus justo eu, fermentum velit. Phasellus semper
          condimentum quam, et pulvinar nunc semper vitae. Maecenas cursus non
          lacus non accumsan. Mauris nisl erat, interdum vitae massa posuere,
          efficitur ultrices lacus. Proin dapibus felis eu tempor vestibulum.
          Duis nibh lacus, commodo in ullamcorper nec, porttitor id magna.
          Phasellus sed congue ipsum, sit amet vestibulum tellus. Nam nec sapien
          lorem. Praesent quis eleifend nulla. Quisque a ligula molestie,
          aliquet sapien sed, suscipit nulla.
        </p>
      </div>
      <footer>
        <h2>
          Line index: <span>{textLine || 'none'}</span>
        </h2>
        <h2>
          Whole text line index: <span>{allTextLine || 'none'}</span>
        </h2>
        <h2>
          Paragraph index: <span>{paragraphNumber || 'none'}</span>
        </h2>
      </footer>
    </div>
  );
}

export default App;
