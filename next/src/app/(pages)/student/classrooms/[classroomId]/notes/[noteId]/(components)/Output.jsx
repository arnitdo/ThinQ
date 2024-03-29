import React from 'react'

export default function Output() {
  return (
    <div id="outputContainer" style={{display:"none"}}>
        {/* <!-- OUTPUT --> */}
      <section>
        <h2 id="output-header">Output</h2>
        <div id="output" className="output lg:p-[30px] p-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-10 overflow-x-scroll " style={{textAlign: "center"}}>
          Click &quot;Generate Image&quot; Button to generate new image.
        </div>
        <div className=' flex flex-col lg:flex-row gap-10 w-full justify-center items-center' style={{textAlign: "center", padding: "30px"}}>
          <button className="imp-button" id="download-as-pdf-button" style={{backgroundColor: "#434343", color: "aliceblue"}}>
            Download All Images as PDF
          </button>
          <button className="delete-button" id="delete-all-button">
            Clear all images
          </button>
        </div>
      </section>

    {/* <!-- Fixed Elements --> */}
    <section className="draw-container popup-container">
      <button className="close-button">&times;</button>
      <div className="display-flex responsive-flex">
        <canvas
          id="diagram-canvas"
          style={{backgroundColor: "#fff"}}
          height="300px"
          width="600px"
        ></canvas>
        <div className="flex-1 buttons-container padding-around">
          <button
            id="add-to-paper-button"
            style={{marginTop: "5px", marginBottom: "5px"}}
          >
            Add to Paper
          </button>
          <button
            id="draw-download-button"
            style={{marginTop: "5px", marginBottom: "5px"}}
          >
            Download Image
          </button>
          <br /><br />
          <input
            type="file"
            id="image-to-add-in-canvas"
            accept="image/x-png,image/jpeg"
            hidden="hidden"
          />
          <br /><br /><button id="add-new-image-button">Add bg image</button>
          <br /><br />
          <button
            id="clear-draw-canvas"
            className="blue-button"
            style={{backgroundColor: "#f30", color: "#fff"}}
          >
            Clear Canvas
          </button>
        </div>
      </div>
    </section>
    </div>
  )
}
