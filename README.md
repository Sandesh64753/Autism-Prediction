# 🧠 Autism Prediction System

A modern, professional web application for autism spectrum disorder screening using machine learning and the AQ-10 questionnaire. Built with FastAPI backend and a responsive, healthcare-focused frontend.

![AutismScreen](https://img.shields.io/badge/AutismScreen-Healthcare--Tech-blue?style=for-the-badge&logo=medical)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn-orange?style=for-the-badge&logo=scikit-learn)

## ✨ Features

### 🔬 Advanced Screening
- **AQ-10 Questionnaire**: Standardized autism spectrum assessment
- **Machine Learning Model**: Trained on extensive datasets for accurate predictions
- **Multi-step Form**: User-friendly, progressive disclosure interface

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Healthcare Aesthetics**: Professional medical startup design
- **Glassmorphism Effects**: Modern visual design with subtle shadows
- **Smooth Animations**: Polished transitions and hover effects

### 🔒 Privacy & Security
- **Data Encryption**: Secure data processing
- **No Data Storage**: Assessment data is not retained
- **Medical Disclaimer**: Clear warnings about professional consultation

### 📊 Comprehensive Assessment
- **Personal Information**: Age, gender, ethnicity, location
- **Medical History**: Family history, jaundice, previous screenings
- **AQ-10 Questions**: 10 standardized autism screening questions
- **Real-time Results**: Instant prediction with detailed feedback

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance async web framework
- **Scikit-learn**: Machine learning models and preprocessing
- **Joblib**: Model serialization and loading
- **Pydantic**: Data validation and serialization

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Responsive Design**: Mobile-first approach

### Development
- **Python 3.11+**: Backend runtime
- **Uvicorn**: ASGI server for FastAPI
- **Jinja2**: Template engine
- **Git**: Version control

## 🚀 Installation & Setup

### Prerequisites
- Python 3.11 or higher
- Git
- Modern web browser

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/autism-prediction-system.git
cd autism-prediction-system
```

### 2. Set Up Virtual Environment
```bash
# Create virtual environment
python -m venv env

# Activate virtual environment
# Windows:
env\Scripts\activate
# macOS/Linux:
# source env/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Model Files
Ensure the following model files are present in the `Server/` directory:
- `best_model.pkl` - Trained machine learning model
- `encoders.pkl` - Label encoders for categorical data

### 5. Run the Application
```bash
# Navigate to server directory
cd Server

# Start the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Access the Application
Open your browser and navigate to: `http://localhost:8000`

## 📖 Usage

### For Users
1. **Access the Application**: Visit the homepage
2. **Start Assessment**: Click "Start Assessment" button
3. **Complete Form**: Fill out the 3-step assessment:
   - Personal information
   - Medical history
   - AQ-10 screening questions
4. **Get Results**: View your assessment results instantly

### For Developers
```python
# Example API usage
import requests

payload = {
    "A1_Score": 1, "A2_Score": 0, "A3_Score": 0, "A4_Score": 0, "A5_Score": 0,
    "A6_Score": 1, "A7_Score": 1, "A8_Score": 0, "A9_Score": 1, "A10_Score": 0,
    "age": 25,
    "gender": "m",
    "ethnicity": "White-European",
    "jaundice": "no",
    "austim": "yes",
    "contry_of_res": "United States",
    "used_app_before": "no",
    "result": "6",
    "relation": "Self"
}

response = requests.post("http://localhost:8000/predict", json=payload)
result = response.json()
```

## 🔌 API Endpoints

### POST `/predict`
Predict autism risk based on assessment data.

**Request Body:**
```json
{
  "A1_Score": 1,
  "A2_Score": 0,
  "A3_Score": 0,
  "A4_Score": 0,
  "A5_Score": 0,
  "A6_Score": 1,
  "A7_Score": 1,
  "A8_Score": 0,
  "A9_Score": 1,
  "A10_Score": 0,
  "age": 25,
  "gender": "m",
  "ethnicity": "White-European",
  "jaundice": "no",
  "austim": "yes",
  "contry_of_res": "United States",
  "used_app_before": "no",
  "result": "6",
  "relation": "Self"
}
```

**Response:**
```json
{
  "prediction": 1,
  "result_message": "Autism Detected"
}
```

### GET `/`
Serve the main application interface.

## 📁 Project Structure

```
autism-prediction-system/
│
├── Server/
│   ├── main.py                 # FastAPI application
│   ├── best_model.pkl         # Trained ML model
│   ├── encoders.pkl           # Label encoders
│   ├── static/
│   │   ├── style.css          # Main stylesheet
│   │   └── script.js          # Frontend JavaScript
│   └── templates/
│       └── index.html         # Main HTML template
│
├── env/                       # Virtual environment
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 🔬 AQ-10 Scoring System

The AQ-10 (Autism Spectrum Quotient) uses 10 questions with binary scoring:

- **Score = 1**: Indicates autism-spectrum-associated trait
- **Score = 0**: Does not indicate autism-spectrum-associated trait

**Questions with reverse scoring:**
- Q2, Q3, Q4, Q5, Q8, Q10: "Yes" = 0, "No" = 1

**Interpretation:**
- **0-3**: Low autism traits
- **4-6**: Moderate autism traits
- **7-10**: High autism traits

## ⚠️ Medical Disclaimer

**This application is for screening purposes only and should not be used as a substitute for professional diagnosis.**

- Always consult with qualified healthcare professionals
- This tool provides preliminary screening results
- Professional evaluation is essential for accurate diagnosis
- Results should be interpreted by medical experts only

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines
- Follow PEP 8 for Python code
- Use semantic HTML and accessible design
- Test thoroughly before submitting PRs
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AQ-10 Questionnaire**: Based on research by Simon Baron-Cohen
- **Machine Learning Model**: Trained on autism screening datasets
- **Open Source Community**: For the amazing tools and libraries

## 📞 Support

For questions or support:
- Open an issue on GitHub
- Contact the development team
- Check the FAQ section in the application

---

**Built with ❤️ for better healthcare accessibility**</content>
<parameter name="filePath">README.md