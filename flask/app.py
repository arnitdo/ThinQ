from utils import *
from constants import *
from functions import *

app = Flask(__name__) 
CORS(app)

@app.route('/', methods=['GET']) 
def helloworld(): 
	if(request.method == 'GET'): 
		data = {"data": "PICT Hackathon Backend"} 
		return jsonify(data) 

if __name__ == '__main__': 
	app.run(debug=True)