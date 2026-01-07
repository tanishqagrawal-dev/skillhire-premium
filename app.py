import os
import json
import PyPDF2
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# YOUR SPECIFIC API KEY INTEGRATED
genai.configure(api_key="AIzaSyDfgce8f7NAAWHAdAX2k--JXoLV7NOB5fE")

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        file = request.files['resume']
        jd_text = request.form.get('jd', 'Software Engineer')
        
        # Accurate Extraction
        pdf_reader = PyPDF2.PdfReader(file)
        resume_text = "".join([page.extract_text() for page in pdf_reader.pages])

        model = genai.GenerativeModel('gemini-pro')
        prompt = f"""
        Analyze this resume for the role: {jd_text}
        Resume Text: {resume_text}
        Return ONLY valid JSON with these fields:
        "score": (0-100),
        "skill_metrics": {{"technical": 0-100, "soft": 0-100, "experience": 0-100, "education": 0-100}},
        "gaps": ["skill1", "skill2"],
        "company_ratio": {{"Google": 15, "Amazon": 10, "Startup": 45, "Others": 30}},
        "roadmap": ["Step 1", "Step 2"]
        """
        
        response = model.generate_content(prompt)
        return jsonify(json.loads(response.text.strip('`json\n ')))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
