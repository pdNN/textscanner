import React, { useRef, useState } from 'react';
import './css/min/global.min.css';
import './css/min/textscanner.min.css';

function App() {
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [wordSelected, setWordSelected] = useState<String>('-');

  const getWord = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount < 1) return true;
    const range = selection.getRangeAt(0);
    const node = selection.anchorNode;
    const word_regexp = /^\w*$/;

    if (!node) {
      return '';
    }
    // Extend the range backward until it matches word beginning
    while (range.startOffset > 0 && range.toString().match(word_regexp)) {
      range.setStart(node, range.startOffset - 1);
    }
    // Restore the valid word match after overshooting
    if (!range.toString().match(word_regexp)) {
      range.setStart(node, range.startOffset + 1);
    }

    // Extend the range forward until it matches word ending
    while (range.toString().match(word_regexp)) {
      range.setEnd(node, range.endOffset + 1);
    }
    // Restore the valid word match after overshooting
    if (!range.toString().match(word_regexp)) {
      range.setEnd(node, range.endOffset - 1);
    }

    const word = range.toString();

    setWordSelected(word);
    return word;
  };

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
          getWord();
        }}
        ref={textContainerRef}
        className="text-container"
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
          euismod, purus sed accumsan iaculis, mauris dolor accumsan risus,
          pretium tincidunt mi arcu sed mi. Integer rhoncus ipsum sed
          scelerisque vehicula. Vestibulum nec risus ut ligula mollis finibus.
          Curabitur et consequat ipsum. Cras vitae feugiat risus. Curabitur sit
          amet nisi eu tortor malesuada maximus. Curabitur sed justo in ex
          ullamcorper condimentum eu nec velit.
        </p>
        <p>
          Aliquam non diam dapibus, lacinia felis in, condimentum lorem.
          Pellentesque erat est, pellentesque eu arcu et, venenatis dignissim
          ex. Mauris vestibulum consectetur risus sit amet pulvinar. Sed pretium
          urna tristique faucibus eleifend. Mauris rhoncus erat felis, non
          condimentum neque egestas in. Ut bibendum tempus justo, id commodo
          ipsum sodales id. Nulla dapibus leo at libero eleifend bibendum id in
          tellus. Nulla sagittis sapien sem, vitae lobortis ligula porta varius.
          Sed gravida et nisl ac euismod. Nulla viverra quam vel augue finibus
          iaculis. Ut facilisis rutrum diam ut laoreet.
        </p>
        <p>
          Nullam metus diam, pretium id mi non, eleifend cursus arcu. Sed
          ultricies, eros bibendum consequat volutpat, mi mi commodo turpis, at
          accumsan nulla velit quis neque. Curabitur interdum justo ut accumsan
          dictum. Etiam ligula neque, rutrum vitae justo non, egestas posuere
          nibh. Ut consectetur ex vitae risus pretium consectetur. Praesent vel
          bibendum libero, in placerat odio. Nullam ornare rhoncus gravida.
          Aliquam posuere nunc eu tincidunt sodales.
        </p>
      </div>
    </div>
  );
}

export default App;
