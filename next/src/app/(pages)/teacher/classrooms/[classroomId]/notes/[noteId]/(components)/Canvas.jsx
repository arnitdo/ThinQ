import React from 'react'

export default function Canvas() {
  return (
    <section className="generate-image-section" id="homework">
      {/* <br /><br /> */}
      <form id="generate-image-form" className=''>
        {/* <!-- Generate Image Section --> */}
        <div className="display-flex output-grid responsive-flex">
          <div className="flex-1 page-container-super  flex justify-center">
            <div className="flex-1 page-container w-full flex justify-center">
              <div className="page-a margined lines">
                <div contenteditable="true" className="top-margin"></div>
                <div className="display-flex left-margin-and-content">
                  <div contenteditable="true" className="left-margin"></div>
                  <div className="paper-content" id="note" contenteditable="true" style={{ outline: "none" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Ut rhoncus dui eget tortor feugiat iaculis. Morbi et dolor
                    in felis viverra efficitur. Integer id laoreet arcu.
                    Mauris turpis nibh, scelerisque sed tristique non,
                    hendrerit in erat. Duis interdum nisl risus, ac ultrices
                    ipsum auctor at. Aliquam faucibus iaculis metus sit amet
                    tincidunt. Vestibulum cursus urna vel nunc imperdiet
                    suscipit. Ut eu augue egestas, porta orci lobortis,
                    pharetra orci. Morbi eu tellus quis nisi tempor accumsan
                    nec eu urna. empor, ullamcorper tortor. Mauris quis
                    fermentum augue. Phasellus ac nisl hendrerit, fringilla
                    enim aliquam, placerat odio. Ut tortor nisi, pellentesque
                    sed nisi at, hendrerit imperdiet turpis. Proin interdum
                    porttitor metus at hendrerit. Proin ipsum nisl, lacinia
                    vitae purus ullamcorper, maximus convallis sem. Sed nec
                    lacinia lorem. Duis arcu metus, cursus non odio quis,
                    tincidunt tempor augue. Donec eget vestibulum risus.
                    Nullam blandit quis est vitae feugiat.
                  </div>
                </div>
                <div className="overlay"></div>
              </div>
              <br />
            </div>

            <div>
              <button
                id="draw-diagram-button"
                type="button"
                style={{ fontSize: "0.9rem", marginTop: "5px", display: "none" }}
                className="draw-button"
              >
                Draw <small>(Beta)</small>
              </button>
            </div>
          </div>
          
          <div className="customization-col">
            {/* <!-- Handwriting Font --> */}
            <div style={{ padding: "5px 0px 5px 0px" }}>
              <b>Customizations</b> <small>(Optional)</small>
              {/* <p style={{fontSize: "0.8rem"}}>
                  <em>Note: Few changes may reflect only in the generated image
                    and not in the preview</em>
                </p> */}
            </div>
            <div className='customizationFieldsetGrid | grid'>
              <fieldset>
                <legend>Handwriting Options</legend>

                <div className="handWritingGrid | w-full grid">
                  <div>
                    <label className="block" for="handwriting-font"
                    >Handwriting Font</label>
                    <select id="handwriting-font">
                      <option
                        selected
                        style={{ fontFamily: 'Homemade Apple' }}
                        value="'Homemade Apple', cursive"
                      >
                        Homemade Apple
                      </option>
                      <option value="Hindi_Font">Kruti-dev(Hindi)</option>
                      <option
                        style={{ fontFamily: "'Caveat' ,cursive", fontSize: "13pt" }}
                        value="'Caveat', cursive"
                      >
                        Caveat
                      </option>
                      <option
                        style={{
                          fontFamily: 'Liu Jian Mao Cao',
                          fontSize: "13pt"
                        }}
                        value="'Liu Jian Mao Cao', cursive"
                      >
                        Liu Jian Mao Cao
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block" for="font-file"
                    >Upload your handwriting font <small>(ttf)</small>&nbsp;

                    </label>
                    <input accept=".ttf, .otf" type="file" id="font-file"
                      style={{ fontSize: "0.9rem" }} />
                  </div>
                </div>
              </fieldset>

              {/* <!-- Pen ink color, Font size, Vertical position text, Word Spacing --> */}
              <fieldset>
                <legend>Page & Text Options</legend>

                <div className="category-grid">
                  <div className="postfix-input" data-postfix="pt">
                    <label for="font-size">Font Size</label>
                    <input
                      id="font-size"
                      min="0"
                      step="0.5"
                      defaultValue="10"
                      type="number"
                      style={{ fontSize: "0.9rem" }}
                    />
                  </div>
                  <div>
                    <label className="block" for="ink-color">Ink Color</label>
                    <select id="ink-color">
                      <option default value="#000f55">Blue</option>
                      <option value="black">Black</option>
                      <option value="#ba3807">Red</option>
                    </select>
                  </div>
                  <div>
                    <label className="block" for="page-size">Page Size</label>
                    <select id="page-size">
                      <option default value="a4">A4 &nbsp;</option>
                    </select>
                  </div>
                  <div>
                    <label className="block" for="page-effects">Effects</label>
                    <select id="page-effects">
                      <option default value="shadows">Shadows</option>
                      <option value="scanner">Scanner</option>
                      <option value="no-effect">No Effect</option>
                    </select>
                  </div>
                  <div>
                    <label className="block" for="resolution">Resolution</label>
                    <select id="resolution">
                      <option value="0.8">Very Low</option>
                      <option value="1">Low</option>
                      <option selected value="2">Normal</option>
                      <option value="3">High</option>
                      <option value="4">Very High</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend>Spacing Options</legend>

                <div className="category-grid">
                  <div className="postfix-input" data-postfix="px">
                    <label for="top-padding">Vertical Position</label>
                    <input id="top-padding" min="0" defaultValue="5" type="number" />
                  </div>
                  <div className="postfix-input" data-postfix="px">
                    <label for="word-spacing">Word Spacing</label>
                    <input
                      id="word-spacing"
                      min="0"
                      max="100"
                      defaultValue="0"
                      type="number"
                    />
                  </div>
                  <div className="postfix-input" data-postfix="pt">
                    <label for="letter-spacing">Letter Spacing</label>
                    <input
                      id="letter-spacing"
                      min="-5"
                      max="40"
                      defaultValue="0"
                      type="number"
                    />
                  </div>
                </div>
              </fieldset>

              {/* <!-- Letter spacing, Paper Margin, Paper Lines, Paper Curvature --> */}
              <fieldset>
                <legend>Margin & Line Options</legend>

                <div className="category-grid">
                  <div>
                    <label for="paper-margin-toggle"
                    >Paper Margin:
                      <span aria-label="paper margin status" className="status"
                      > on</span>
                    </label>
                    <label className="switch-toggle outer">
                      <input
                        aria-checked="true"
                        defaultChecked
                        aria-label="Paper Margin Button"
                        id="paper-margin-toggle"
                        type="checkbox"
                      />
                      <div></div>
                    </label>
                  </div>

                  <div>
                    <label for="paper-line-toggle"
                    >Paper Lines:
                      <span aria-label="paper line status" className="status"
                      > on</span>
                    </label>
                    <label className="switch-toggle outer">
                      <input
                        aria-checked="true"
                        defaultChecked
                        aria-label="Paper Line Button"
                        id="paper-line-toggle"
                        type="checkbox"
                      />
                      <div></div>
                    </label>
                  </div>
                  <div className="experimental">
                    {/* <!-- Removed option --> */}
                    <div className="upload-paper-container">
                      <label className="block" for="paper-file"
                      >Upload Paper Image as Background</label  >
                      <input
                        accept=".jpg, .jpeg, .png"
                        type="file"
                        id="paper-file"
                        style={{ fontSize: "0.8rem" }}
                      />
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

            {/* <!-- GENERATE IMAGE BUTTONS --> */}
            <hr style={{
                marginTop: "3vh",
                // border: "0.3px solid var(--elevation-background)",
                width: "100%"
              }}
            />
            <div style={{ textAlign: "center", padding: "30px 0px" }}>
              <button
                type="submit"
                data-testid="generate-image-button"
                className="button generate-image-button"
                style={{ width: "100%", color: "white" }}
              >
                Generate Image
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  )
}
