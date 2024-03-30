import pypdfium2 as pdfium
import os
import google.generativeai as genai
import PIL

pdf = pdfium.PdfDocument("4_climate.pdf")
genai.configure(api_key="AIzaSyDMbHmcf0uvxfQtUcQb-vGTHjFbMlvaOiI")


for i in range(len(pdf)):
    page = pdf[i]
    image = page.render(scale=4).to_pil()
    save_dir = "compute"
    if not os.path.exists(save_dir):
            os.makedirs(save_dir)
    image.save(f"compute\output_{i:03d}.jpg")
all_extracted_text = ""
model = genai.GenerativeModel('gemini-pro-vision')
res = os.listdir("compute")
# print(res)
for i in res:
    print("****************************************"+i)
    img = PIL.Image.open("compute/"+i)
    result = model.generate_content([img,"Extract all text from the image"],stream=True)
    result.resolve()
    print(result.text)
    all_extracted_text += result.text

print(all_extracted_text)
