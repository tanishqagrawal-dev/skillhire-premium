import os
import json
import PyPDF2
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# YOUR PROVIDED API KEY
genai.configure(api_key="AIzaSyDfgce8f7NAAWHAdAX2k--JXoLV7NOB5fE")

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        # Get data from request
        file = request.files['resume']
        jd_text = request.form.get('jd', 'Software Engineer Role')
        
        # 1. Extract Text from PDF
        pdf_reader = PyPDF2.PdfReader(file)
        resume_text = ""
        for page in pdf_reader.pages:
            resume_text += page.extract_text()

        # 2. AI Prompting (Gemini Pro)
        model = genai.GenerativeModel('gemini-pro')
        prompt = f"""
        Act as an expert ATS (Applicant Tracking System) and Recruiter.
        Target Job Description: {jd_text}
        Candidate Resume: {resume_text}
        
        Provide a detailed analysis in JSON format ONLY:
        {{
          "score": (integer 0-100),
          "gaps": ["Missing Skill 1", "Missing Skill 2"],
          "salary_est": "e.g. 15L - 20L",
          "courses": [
            {{"title": "Course Name", "provider": "Coursera/Udemy/YouTube", "time": "Duration"}},
            {{"title": "Course Name", "provider": "Coursera/Udemy/YouTube", "time": "Duration"}}
          ],
          "market_insight": "One line about demand for this role"
        }}
        """
        
        response = model.generate_content(prompt)
        # Clean the response to ensure it's valid JSON
        clean_json = response.text.replace('```json', '').replace('```', '').strip()
        return jsonify(json.loads(clean_json))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
