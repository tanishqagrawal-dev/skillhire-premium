from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configure your AI API Key
genai.configure(api_key="AIzaSyB-NmKF4ouTaHg-KrndRUwb1Qh6ioqYQD8")

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    file = request.files['resume']
    # 1. Extract Text from PDF
    pdf_reader = PyPDF2.PdfReader(file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()

    # 2. Prompt AI for Skill Analysis
    model = genai.GenerativeModel('gemini-pro')
    prompt = f"Analyze this resume text: {text}. 1. Give an ATS score out of 100. 2. List 3-5 missing skills for a Software Engineer role. 3. Suggest 2 course titles. Format as JSON."
    
    response = model.generate_content(prompt)
    
    # Return JSON to Frontend
    return jsonify(response.text)

if __name__ == '__main__':
    app.run(debug=True)
