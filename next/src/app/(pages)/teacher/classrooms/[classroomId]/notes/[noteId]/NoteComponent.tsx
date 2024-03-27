//@ts-nocheck
"use client"
import React, { useEffect, useState } from 'react'
import Output from "./(components)/Output"
import Canvas from "./(components)/Canvas"
import html2canvas from 'html2canvas';
import "./notes.css"
import LoadingScreen from '@/components/Loader'
import { Volume2 } from 'lucide-react'


export default function NotesComponent({ noteId, classroomId }) {
  const [loading, setloading] = useState(true)
  const [notes, setNotes] = useState("Lorem ipsum dolor sit amet consectetur adipisicing elit. \nLorem ipsum dolor sit amet consectetur adipisicing elit. \n\nLorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda repellat omnis totam sed blanditiis eos obcaecati impedit? Ipsa a quis consequatur, dignissimos necessitatibus totam, nesciunt eos expedita adipisci accusamus pariatur?")
  const addFunctionality = () => {
    // const localPreference = typeof (window) !== "undefined" ? window.localStorage.getItem('prefers-theme') : 'dark';
    // if (localPreference) {
    //   if (localPreference === 'light') document.body.classList.remove('dark');
    //   else document.body.classList.add('dark');
    // } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    //   document.body.classList.add('dark');
    // }
    // helpers
    try {
      const pageEl = document.querySelector<HTMLElement>('.page-a');
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      const addFontFromFile = (fileObj ) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if(!e.target)return
            if(!e.target.result)return
          const newFont = new FontFace('temp-font', e.target.result);
          newFont.load().then((loadedFace) => {
            document.fonts.add(loadedFace);
            if(!pageEl) return
            if(!pageEl.style) return
            pageEl.style.fontFamily = 'temp-font';
          });
        };
        reader.readAsArrayBuffer(fileObj);
      }

      /**
       * @method createPDF
       * @param imgs array of images (in base64)
       * @description
       * Creates PDF from list of given images
       */
      const  createPDF = (imgs) =>{
        // eslint-disable-next-line new-cap
        const doc = new jsPDF('p', 'pt', 'a4');
        const width = doc.internal.pageSize.width;
        const height = doc.internal.pageSize.height;
        for (const i in imgs) {
          doc.text(10, 20, '');
          doc.addImage(
            imgs[i],
            'JPEG',
            25,
            50,
            width - 50,
            height - 80,
            'image-' + i
          );
          if (i != imgs.length - 1) {
            doc.addPage();
          }
        }
        doc.save("nomework.pdf");
      }

      function formatText(event) {
        event.preventDefault();
        const text = event.clipboardData
          .getData('text/plain')
          .replace(/\n/g, '<br/>');
        document.execCommand('insertHTML', false, text);
      }

      function addPaperFromFile(file) {
        const tmppath = URL.createObjectURL(file);
        pageEl.style.backgroundImage = `url(${tmppath})`;
      }

      //generate-utils
      const paperContentEl = document.querySelector('.page-a .paper-content');
      const overlayEl = document.querySelector('.overlay');

      let paperContentPadding;

      function isFontErrory() {
        // SOme fonts have padding top errors, this functions tells you if the current font has that;
        const currentHandwritingFont = document.body.style.getPropertyValue(
          '--handwriting-font'
        );
        return (
          currentHandwritingFont === '' ||
          currentHandwritingFont.includes('Homemade Apple')
        );
      }

      function applyPaperStyles() {
        pageEl.style.border = 'none';
        pageEl.style.overflowY = 'hidden';

        // Adding class shadows even if effect is scanner
        if (document.querySelector('#page-effects').value === 'scanner') {
          overlayEl.classList.add('shadows');
        } else {
          overlayEl.classList.add(document.querySelector('#page-effects').value);
        }

        if (document.querySelector('#page-effects').value === 'scanner') {
          // For scanner, we need shadow between 50deg to 120deg only
          // Since If the lit part happens to be on margins, the margins get invisible
          overlayEl.style.background = `linear-gradient(${Math.floor(Math.random() * (120 - 50 + 1)) + 50
            }deg, #0008, #0000)`;
        } else if (document.querySelector('#page-effects').value === 'shadows') {
          overlayEl.style.background = `linear-gradient(${Math.random() * 360
            }deg, #0008, #0000)`;
        }

        if (isFontErrory() && document.querySelector('#font-file').files.length < 1) {
          paperContentPadding =
            paperContentEl.style.paddingTop.replace(/px/g, '') || 5;
          const newPadding = Number(paperContentPadding) - 5;
          paperContentEl.style.paddingTop = `${newPadding}px`;
        }
      }

      function removePaperStyles() {
        pageEl.style.overflowY = 'auto';
        pageEl.style.border = '1px solid var(--elevation-background)';

        if (document.querySelector('#page-effects').value === 'scanner') {
          overlayEl.classList.remove('shadows');
        } else {
          overlayEl.classList.remove(document.querySelector('#page-effects').value);
        }

        if (isFontErrory()) {
          paperContentEl.style.paddingTop = `${paperContentPadding}px`;
        }
      }

      function renderOutput(outputImages) {
        if (outputImages.length <= 0) {
          document.querySelector('#output').innerHTML =
            'Click "Generate Image" Button to generate new image.';
          document.querySelector('#download-as-pdf-button').classList.remove('show');
          document.querySelector('#delete-all-button').classList.remove('show');
          return;
        }

        document.querySelector('#download-as-pdf-button').classList.add('show');
        document.querySelector('#delete-all-button').classList.add('show');
        document.querySelector('#output').innerHTML = outputImages
          .map(
            (outputImageCanvas, index) => /* html */ `
    <div 
      class="output-image-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;position: relative;"  
    >
      <button 
        data-index="${index}" 
        class="close-button close-${index}">
        <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
        <path d="M 14.40625 13 L 13 14.40625 L 23.625 25 L 13 35.59375 L 14.40625 37 L 25.0625 26.40625 L 35.6875 37 L 37.09375 35.59375 L 26.46875 25 L 37.09375 14.40625 L 35.6875 13 L 25.0625 23.59375 Z"></path>
        </svg>
      </button>
      <img 
        class="shadow" 
        alt="Output image ${index}" 
        src="${outputImageCanvas.toDataURL('image/jpeg')}"
      />
      <div style={{textAlign: "center"}}>
        <a 
          class="button download-image-button" 
          download 
          href="${outputImageCanvas.toDataURL('image/jpeg')}"
        >Download Image</a>
        <br/>
        <br/>

        <button 
          class="button move-left"
          data-index="${index}"
        >
          Move Left
        </button>
        <button 
          class="button move-right"
          data-index="${index}" 
        >
          Move Right
        </button>
      </div>
    </div>
    `
          )
          .join('');
      }


      //generate-images
      let outputImages = [];

      /**
       * To generate image, we add styles to DIV and converts that HTML Element into Image.
       * This is the function that deals with it.
       */
      async function convertDIVToImage() {
        const options = {
          scrollX: 0,
          scrollY: -window.scrollY,
          scale: document.querySelector('#resolution').value,
          useCORS: true
        };

        /** Function html2canvas comes from a library html2canvas which is included in the index.html */
        const canvas = await html2canvas(pageEl, options);

        /** Send image data for modification if effect is scanner */
        if (document.querySelector('#page-effects').value === 'scanner') {
          const context = canvas.getContext('2d');
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          contrastImage(imageData, 0.55);
          canvas.getContext('2d').putImageData(imageData, 0, 0);
        }

        outputImages.push(canvas);
        // Displaying no. of images on addition
        if (outputImages.length >= 1) {
          document.getElementById('output-header').textContent =
            'Output ' + '( ' + outputImages.length + ' )';
        }
      }

      /**
       * This is the function that gets called on clicking "Generate Image" button.
       */
      async function generateImages() {
        applyPaperStyles();
        pageEl.scroll(0, 0);

        const paperContentEl = document.querySelector('.page-a .paper-content');
        const scrollHeight = paperContentEl.scrollHeight;
        const clientHeight = 514; // height of .paper-content when there is no content

        const totalPages = Math.ceil(scrollHeight / clientHeight);

        if (totalPages > 1) {
          // For multiple pages
          if (paperContentEl.innerHTML.includes('<img')) {
            alert(
              "You're trying to generate more than one page, Images and some formatting may not work correctly with multiple images" // eslint-disable-line max-len
            );
          }
          const initialPaperContent = paperContentEl.innerHTML;
          const splitContent = initialPaperContent.split(/(\s+)/);

          // multiple images
          let wordCount = 0;
          for (let i = 0; i < totalPages; i++) {
            paperContentEl.innerHTML = '';
            const wordArray = [];
            let wordString = '';

            while (
              paperContentEl.scrollHeight <= clientHeight &&
              wordCount <= splitContent.length
            ) {
              wordString = wordArray.join(' ');
              wordArray.push(splitContent[wordCount]);
              paperContentEl.innerHTML = wordArray.join(' ');
              wordCount++;
            }
            paperContentEl.innerHTML = wordString;
            wordCount--;
            pageEl.scrollTo(0, 0);
            await convertDIVToImage();
            paperContentEl.innerHTML = initialPaperContent;
          }
        } else {
          // single image
          await convertDIVToImage();
        }

        removePaperStyles();
        renderOutput(outputImages);
        setRemoveImageListeners();
      }

      /**
       * Delete all generated images
       */

      const deleteAll = () => {
        outputImages.splice(0, outputImages.length);
        renderOutput(outputImages);
        document.getElementById('output-header').textContent =
          'Output' + (outputImages.length ? ' ( ' + outputImages.length + ' )' : '');
      };

      const arrayMove = (arr, oldIndex, newIndex) => {
        if (newIndex >= arr.length) {
          let k = newIndex - arr.length + 1;
          while (k--) {
            arr.push(undefined);
          }
        }
        arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
        return arr; // for testing
      };

      const moveLeft = (index) => {
        if (index === 0) return outputImages;
        outputImages = arrayMove(outputImages, index, index - 1);
        renderOutput(outputImages);
      };

      const moveRight = (index) => {
        if (index + 1 === outputImages.length) return outputImages;
        outputImages = arrayMove(outputImages, index, index + 1);
        renderOutput(outputImages);
      };

      /**
       * Downloads generated images as PDF
       */
      const downloadAsPDF = () => createPDF(outputImages);

      /**
       * Sets event listeners for close button on output images.
       */
      function setRemoveImageListeners() {
        document
          .querySelectorAll('.output-image-container > .close-button')
          .forEach((closeButton) => {
            closeButton.addEventListener('click', (e) => {
              outputImages.splice(Number(e.target.dataset.index), 1);
              // Displaying no. of images on deletion
              if (outputImages.length >= 0) {
                document.getElementById('output-header').textContent =
                  'Output' +
                  (outputImages.length ? ' ( ' + outputImages.length + ' )' : '');
              }
              renderOutput(outputImages);
              // When output changes, we have to set remove listeners again
              setRemoveImageListeners();
            });
          });

        document.querySelectorAll('.move-left').forEach((leftButton) => {
          console.log("leftBtn")
          leftButton.addEventListener('click', (e) => {
            moveLeft(Number(e.target.dataset.index));
            // Displaying no. of images on deletion
            renderOutput(outputImages);
            // When output changes, we have to set remove listeners again
            setRemoveImageListeners();
          });
        });

        document.querySelectorAll('.move-right').forEach((rightButton) => {
          rightButton.addEventListener('click', (e) => {
            moveRight(Number(e.target.dataset.index));
            // Displaying no. of images on deletion
            renderOutput(outputImages);
            // When output changes, we have to set remove listeners again
            setRemoveImageListeners();
          });
        });
      }

      /** Modifies image data to add contrast */

      function contrastImage(imageData, contrast) {
        const data = imageData.data;
        contrast *= 255;
        const factor = (contrast + 255) / (255.01 - contrast);
        for (let i = 0; i < data.length; i += 4) {
          data[i] = factor * (data[i] - 128) + 128;
          data[i + 1] = factor * (data[i + 1] - 128) + 128;
          data[i + 2] = factor * (data[i + 2] - 128) + 128;
        }
        return imageData;
      }

      //draw.js

      /**
       * This file deals with what happens when you click "Draw" button text to handwriting.
       */

      let inkColor = '#000f55';
      const pointSize = isMobile ? 0.5 : 1;
      let lastX;
      let lastY;

      const drawCanvas = document.querySelector('canvas#diagram-canvas');
      const ctx = drawCanvas.getContext('2d');
      ctx.fillStyle = 'transparent';
      ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
      // Set smaller canvas on mobiles
      if (isMobile) {
        drawCanvas.height = 150;
        drawCanvas.width = 300;
      }

      function setInkColor(color) {
        inkColor = color;
      }

      function drawPoint(x, y) {
        const canvasRect = drawCanvas.getBoundingClientRect();

        function fixPositions(eventX, eventY) {
          if (isMobile) {
            return [eventX - canvasRect.left, eventY - canvasRect.top];
          }

          return [eventX - canvasRect.left, eventY - canvasRect.top];
        }

        if (lastX && lastY && (x !== lastX || y !== lastY)) {
          ctx.lineWidth = 2 * pointSize;
          ctx.beginPath();
          ctx.strokeStyle = inkColor;
          ctx.moveTo(...fixPositions(lastX, lastY));
          ctx.lineTo(...fixPositions(x, y));
          ctx.stroke();
        }

        ctx.beginPath(); // Start path
        ctx.fillStyle = inkColor;

        ctx.arc(...fixPositions(x, y), pointSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.

        ctx.fill(); // Close

        lastX = x;
        lastY = y;
      }

      function toggleDrawCanvas() {
        const drawContainer = document.querySelector('.draw-container');
        if (drawContainer.classList.contains('show')) {
          // draw canvas is currently shown
          document.querySelector('main').style.display = 'block';
        } else {
          document.querySelector('main').style.display = 'none';
        }

        drawContainer.classList.toggle('show');
      }

      function clear() {
        ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
      }

      function downloadFile() {
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = drawCanvas.toDataURL('image/png');
        a.download = 'diagram.png';
        document.body.appendChild(a);
        a.click();
      }

      function addToPaper() {
        document.querySelector('#note').innerHTML =
    /* html */ `
    <img style="width: 100%;" src="${drawCanvas.toDataURL('image/png')}" />
  ` + document.querySelector('#note').innerHTML;
        toggleDrawCanvas();
      }

      function addImageToPaper() {
        const imagePath = document.querySelector('#image-to-add-in-canvas');
        const tempImage = new Image();
        imagePath.value = '';
        imagePath.click();
        imagePath.addEventListener('change', function () {
          const file = this.files[0];
          if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', function () {
              tempImage.src = this.result;
              tempImage.onload = function () {
                if (tempImage.width > tempImage.height) {
                  ctx.drawImage(
                    tempImage,
                    0,
                    0,
                    drawCanvas.width,
                    (drawCanvas.height * tempImage.width) / drawCanvas.width
                  );
                } else {
                  const newWidth =
                    (drawCanvas.height * tempImage.width) / tempImage.height;
                  ctx.drawImage(
                    tempImage,
                    drawCanvas.width / 2 - newWidth / 2,
                    0,
                    newWidth,
                    drawCanvas.height
                  );
                }
              };
            });
            reader.readAsDataURL(file);
          }
        });
      }
      let isMouseDown = false;

      const onMouseDown = (e) => {
        isMouseDown = true;
        lastX = e.clientX;
        lastY = e.clientY;
        drawPoint(e.clientX, e.clientY);
      };

      const onMouseUp = (e) => {
        isMouseDown = false;
        lastX = 0;
        lastY = 0;
      };

      const onMouseMove = (e) => {
        if (isMouseDown) {
          drawPoint(e.clientX, e.clientY);
        }
      };

      const onTouchStart = (e) => {
        isMouseDown = true;
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        lastX = touchX;
        lastY = touchY;
        drawPoint(touchX, touchY);
      };

      const onTouchEnd = (e) => {
        isMouseDown = false;
        lastX = 0;
        lastY = 0;
      };

      const onTouchMove = (e) => {
        e.preventDefault();
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;

        drawPoint(touchX, touchY);
      };

      /* Event listeners */
      document.querySelector('#clear-draw-canvas').addEventListener('click', clear);
      document
        .querySelector('#add-to-paper-button')
        .addEventListener('click', addToPaper);
      document
        .querySelector('#draw-download-button')
        .addEventListener('click', downloadFile);

      document
        .querySelector('#add-new-image-button')
        .addEventListener('click', addImageToPaper);

      if (isMobile) {
        drawCanvas.addEventListener('touchstart', onTouchStart, { passive: true });
        drawCanvas.addEventListener('touchend', onTouchEnd, { passive: true });
        drawCanvas.addEventListener('touchmove', onTouchMove, { passive: true });
      } else {
        drawCanvas.addEventListener('mousedown', onMouseDown, { passive: true });
        drawCanvas.addEventListener('mouseup', onMouseUp, { passive: true });
        drawCanvas.addEventListener('mousemove', onMouseMove, { passive: true });
      }



      // app.mjs
      const EVENT_MAP = {
        '#generate-image-form': {
          on: 'submit',
          action: (e) => {
            console.log(e)
            e.preventDefault();
            generateImages();
          }
        },
        '#handwriting-font': {
          on: 'change',
          action: (e) =>
            document.body.style.setProperty('--handwriting-font', e.target.value)

        },
        '#font-size': {
          on: 'change',
          action: (e) => {
            if (e.target.value > 30) {
              alert('Font-size is too big try upto 30');
            } else {
              setTextareaStyle('font-size', e.target.value + 'px');
            }
            e.stopPropagation()
          }
        },
        '#letter-spacing': {
          on: 'change',
          action: (e) => {
            if (e.target.value > 40) {
              alert('Letter Spacing is too big try a number upto 40');
            } else {
              setTextareaStyle('letterSpacing', e.target.value + 'px');
              e.preventDefault();
            }
          }
        },
        '#word-spacing': {
          on: 'change',
          action: (e) => {
            if (e.target.value > 100) {
              alert('Word Spacing is too big try a number upto hundred');
            } else {
              setTextareaStyle('wordSpacing', e.target.value + 'px');
              e.preventDefault();
            }
          }
        },
        '#top-padding': {
          on: 'change',
          action: (e) => {
            document.querySelector('.page-a .paper-content').style.paddingTop =
              e.target.value + 'px';
          }
        },
        '#font-file': {
          on: 'change',
          action: (e) => addFontFromFile(e.target.files[0])
        },
        '#ink-color': {
          on: 'change',
          action: (e) => {
            document.body.style.setProperty('--ink-color', e.target.value);
            setInkColor(e.target.value);
          }
        },
        '#paper-margin-toggle': {
          on: 'change',
          action: () => {
            if (pageEl.classList.contains('margined')) {
              pageEl.classList.remove('margined');
            } else {
              pageEl.classList.add('margined');
            }
          }
        },
        '#paper-line-toggle': {
          on: 'change',
          action: () => {
            if (pageEl.classList.contains('lines')) {
              pageEl.classList.remove('lines');
            } else {
              pageEl.classList.add('lines');
            }
          }
        },
        '#draw-diagram-button': {
          on: 'click',
          action: () => {
            toggleDrawCanvas();
          }
        },
        '.draw-container .close-button': {
          on: 'click',
          action: () => {
            toggleDrawCanvas();
          }
        },
        '#download-as-pdf-button': {
          on: 'click',
          action: () => {
            downloadAsPDF();
          }
        },
        '#delete-all-button': {
          on: 'click',
          action: () => {
            deleteAll();
          }
        },
        '.page-a .paper-content': {
          on: 'paste',
          action: formatText
        },
        '#paper-file': {
          on: 'change',
          action: (e) => addPaperFromFile(e.target.files[0])
        }
      };
      const setTextareaStyle = (attrib, v) => (pageEl.style[attrib] = v);
      for (const eventSelector in EVENT_MAP) {
        if (document.querySelector(eventSelector))
          document
            .querySelector(eventSelector)
            .addEventListener(
              EVENT_MAP[eventSelector].on,
              EVENT_MAP[eventSelector].action
            );
        else console.log(eventSelector)
      }
      document.querySelectorAll('.switch-toggle input').forEach((toggleInput) => {
        toggleInput.addEventListener('change', (e) => {
          if (toggleInput.checked) {
            document.querySelector(
              `label[for="${toggleInput.id}"] .status`
            ).textContent = 'on';
            toggleInput.setAttribute('aria-checked', true);
          } else {
            toggleInput.setAttribute('aria-checked', false);
            document.querySelector(
              `label[for="${toggleInput.id}"] .status`
            ).textContent = 'off';
          }
        });
      });
    } catch (err) {
      console.log(err)
    }
    // await getNotes()
    document.getElementById('homework').style.display = 'block';
    document.getElementById('outputContainer').style.display = 'block';
    setloading(false)
    const result = notes
    const canv = document.getElementById('note');
    canv.innerText = result;
  }

  const textToAudio=()=>{
    let msg = notes;
    
    let speech = new SpeechSynthesisUtterance();
    speech.lang = `en-US`;
    
    speech.text = msg;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    
    window.speechSynthesis.speak(speech);
    // speechSynthesis.cancel();
}
  let ctr = 1
  useEffect(() => {
    if (ctr === 1) {
      addFunctionality()
      ctr = 0;
    }
  }, [])
  return (
    <>
      {loading && <LoadingScreen />}
      <div className=' notesbody flex flex-col relative px-12 min-h-screen' style={{ display: loading ? "none" : "block" }}>
        <button onClick={()=>{textToAudio()}} style={{position:"fixed",bottom:"2rem", right:"2rem", borderRadius:"50%", backgroundColor:"white", padding:"1rem"}}><Volume2/></button>
        <div className=' flex flex-col py-2'>
          <Canvas />
          <Output />
        </div>
      </div>
    </>
  )
}
