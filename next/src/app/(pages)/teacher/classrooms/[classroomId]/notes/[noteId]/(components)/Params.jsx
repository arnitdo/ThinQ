"use client"
import { motion } from 'framer-motion';
import React from 'react'

export default function Params() {
    function scrollToDiv(elementId) {
        var element = document.getElementById(elementId);
        element.scrollIntoView({ behavior: 'smooth' });
    }
    function increaseWaves(scale){
      const waveElements = document.getElementsByClassName("waves");
              const waveArray = Array.from(waveElements);
              waveArray.forEach((element)=>{
              element.style.transform = `scaleY(${scale}) scaleX(${scale+0.8})`
              })
    }
    async function getData(){
      
    increaseWaves(1.9)
        console.log('clicked');
        document.getElementById('loading').style.display = 'flex';
        document.getElementById('homework').style.display = 'none';
        document.getElementById('outputContainer').style.display = 'none';
      
            scrollToDiv('loading');
        const promptField = document.getElementById('promptField');
        const level = document.getElementById('level');
        const characters = document.getElementById('characters');
        const mistakes = document.getElementById('mistakes');
        const data = {
          prompt: promptField.innerText,
          level: level.value,
          characters: characters.value,
          mistakes: mistakes.value
        }
    console.log(data);
    
    increaseWaves(3.5)
    try {
    const resd = await fetch('https://nomework-api2.onrender.com/textprompt/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    })
    increaseWaves(5)
    const result = await resd.json();
    console.log(result);
        if(result.result){
          
        document.getElementById('loading').style.display = 'none';
        document.getElementById('homework').style.display = 'block';
        document.getElementById('outputContainer').style.display = 'block';
          scrollToDiv('homework');
          const canv = document.getElementById('note');
          const temp = result.result.replace(/\*\*/g, '');
          canv.innerText = temp;
        }
    promptField.innerText = '';
    level.value = 'kids';
    characters.value = '100';
    mistakes.value = 'no';
    increaseWaves(-2)
    } catch (error) {
    console.log(error);
    }
      }
  return (
    <div id="inputs" style={{minHeight: "100vh",display: "none", flexDirection: "column", justifyContent: "start", alignItems: "center", width: "100%"}}>
              <h2 className=' text-xl font-bold' style={{paddingBottom:"5vh",paddingTop: "7vh"}}>Help us make your answer <i>yours</i></h2>
              <motion.div  initial={{opacity:0, y:0, x:-50}} whileInView={{opacity:1, x:0, y:0}} viewport={{once:true}} transition={{duration:1, ease:"linear", type:"spring"}}   style={{width: "100%", paddingTop: "2vh", paddingBottom: "2vh"}}>
                <label className="block" for="Level"
                  >Level</label>
                <select id="level" style={{width: "100%"}}>
                  <option
                    selected
                    value="kids"
                  >
                    Kids
                  </option>
                  <option value="teenager">Teenager</option>
                  <option
                    value="adults"
                  >
                    Adults
                  </option>
                </select>
              </motion.div>
              <motion.div initial={{opacity:0, y:0, x:-50}} whileInView={{opacity:1, x:0, y:0}} viewport={{once:true}} transition={{duration:1.3, ease:"linear", type:"spring"}}  style={{width: "100%",paddingTop: "2vh", paddingBottom: "2vh"}}>
                <label className="block" for="characters"
                  >Number of characters</label>
                <select id="characters" style={{width: "100%"}}>
                  <option
                    selected
                    value="100"
                  >
                    100
                  </option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="600">600</option>
                  <option value="700">700</option>
                  <option value="800">800</option>
                  <option value="900">900</option>
                  <option value="1000">1000</option>
                </select>
              </motion.div>
              <motion.div initial={{opacity:0, y:0, x:-50}} whileInView={{opacity:1, x:0, y:0}} viewport={{once:true}} transition={{duration:1.6, ease:"linear", type:"spring"}}  style={{width: "100%", paddingTop: "2vh", paddingBottom: "2vh"}}>
                <label className="block" for="vocab"
                  >Mistakes</label>
                <select id="mistakes" style={{width: "100%"}}>
                  <option
                    selected
                    value="no"
                  >
                    None
                  </option>
                  <option value="few">Few</option>
                  <option
                    value="many"
                  >
                    Many
                  </option>
                </select>
              </motion.div>
              <motion.button
              initial={{opacity:0, y:0, x:0}} whileInView={{opacity:1, x:0, y:0}} viewport={{once:true}} transition={{duration:1, ease:"easeIn", type:"spring"}} 
              id="prompt"
              className="button generate-image-button"
              style={{width: "100%", color: "#434343", marginTop: "5vh"}}
              onClick={()=>getData()}
            >
              Generate Text
            </motion.button>
            <div className=' h-full flex flex-col justify-center items-center w-full lg:hidden md:hidden '>
                <motion.img initial={{y:50}}
        animate={{ y:25 }}
        transition={{ repeat: Infinity, repeatType:"reverse", duration: 3 }} src="/params.png" alt="" className=' w-4/5 mt-5' />
            </div>
            </div>
  )
}
