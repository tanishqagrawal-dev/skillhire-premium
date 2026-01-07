import os
import json
import PyPDF2
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# YOUR API KEY
genai.configure(api_key="AIzaSyDfgce8f7NAAWHAdAX2k--JXoLV7NOB5fE")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        file = request.files['resume']
        jd_text = request.form.get('jd', 'General Role')
        
        # PDF Text Extraction
        pdf_reader = PyPDF2.PdfReader(file)
        resume_text = "".join([page.extract_text() for page in pdf_reader.pages])

        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        Analyze the following resume against the job description.
        Resume: {resume_text}
        JD: {jd_text}
        
        Return ONLY a JSON object with this exact structure:
        {{
          "score": 85,
          "skills": {{
             "labels": ["Technical", "Soft Skills", "Experience", "Leadership", "Education"],
             "data": [80, 70, 90, 60, 85]
          }},
          "ratios": {{
             "labels": ["FAANG", "Startups", "MNCs"],
             "data": [45, 80, 60]
          }},
          "gaps": ["Cloud Architecture", "Team Mentoring"],
          "roadmap": ["Take AWS Certified Solutions Architect", "Lead a small team project"],
          "accuracy": "98.4%"
        }}
        """
        response = model.generate_content(prompt)
        # Clean response string to ensure valid JSON
        res_text = response.text.replace('```json', '').replace('```', '').strip()
        return jsonify(json.loads(res_text))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
