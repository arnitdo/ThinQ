from utils import *
from constants import *
from functions import *

app = Flask(__name__) 
CORS(app)

@app.route('/attention_detect')
def attention_detect():
    def generate_frames():
        while True:
            success, frame = camera.read()

            if not success:
                break
            else:
                frame = process_frame(frame)
                ret, buffer = cv2.imencode('.jpg', frame)
                frame = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/', methods=['GET']) 
def helloworld(): 
	if(request.method == 'GET'): 
		data = {"data": "PICT Hackathon Backend"} 
		return jsonify(data) 

if __name__ == '__main__': 
	app.run(debug=True)